import akka.actor._
import akka.zeromq._
import scala.collection.mutable.HashMap
import scala.slick.driver.PostgresDriver.simple._
import scala.concurrent.duration._
import java.util.Calendar

/**
 * The actor that caches games in the database to memory, and relays incoming messages to them.
 */
class GameCache(publisher: ActorRef) extends Actor
{
    val finishedGamePrune = 1000*60*60*12
    val unfinishedGamePrune = 1000*60*60*24*3
    
    val db = Database.forURL("jdbc:postgresql://localhost:5432/quizzingbricks_dev", 
                             driver = "org.postgresql.Driver", user = "qb", password = "qb123")
    var hashMap = new HashMap[Int, ActorRef]
    var highestId = 0
    
    override def preStart()
    {
        import context.dispatcher
        context.system.scheduler.scheduleOnce(12 hours, self, ("prune"))
    }
    
    def prune()
    {
        import context.dispatcher
        context.system.scheduler.scheduleOnce(12 hours, self, ("prune"))
        
        db withSession 
        {   implicit session: Session =>
            val curMillis = Calendar.getInstance().getTime().getTime()
            val unfPrune = curMillis - unfinishedGamePrune
            val finPrune = curMillis - finishedGamePrune
            val q = Query(GamesTable).filter(g => g.finished && g.lastAction < finPrune || !g.finished && g.lastAction < unfPrune)
                    .map(p => p.gameId).list
            q.foreach(q => hashMap.remove(q))
            val r = Query(GamesTable).filter(g => g.finished && g.lastAction < finPrune || !g.finished && g.lastAction < unfPrune)
                    .delete
            for(x <- q)
            {
                val r = Query(PlayersGamesTable).filter(g => g.gameId === x).delete
            }
        }
    }
    
    /**
     * Handles a request to create a new game.
     * @param players A list of the user ids of the players in the game.
     */
    def handleCreateGameRequest(players: List[Int]) =
    {
        println("GameCache received creategame")
        var id = 0
        db withSession 
        {   implicit session: Session =>
            val board: String = "0,"*(Game.sideLength*Game.sideLength - 1) + "0"
            id = GamesTable.autoInc.insert(board, Calendar.getInstance().getTime().getTime(), false)
			
            for(p <- players)
                PlayersGamesTable.insert(p, id, 0, 0, 0, "", "", "", "", "", 0, 0, 0)
        }
        val game = context.system.actorOf(Props(classOf[Game], id, players, publisher, Nil, null))
        hashMap.put(id, game)
        sender ! CreateGameResponse (id)
    }
    
    /**
     * Handles every request directed to a specific game.
     * @param x The message to be dealt with.
     */
    def handleGameRequestMessage(x: GameRequestMessage) =
    {
        val game = hashMap.get(x.gameId)
        game match
        {
            // In case the game does not exist in the cache, we need to load it from the database
            case None =>
            	println("Game not found in memory, searching in database...")
                db withSession 
                {  implicit session: Session =>
                    var dbPlayers = (for 
                    { p <- PlayersGamesTable if p.gameId === x.gameId } yield(p)).list
                    if(dbPlayers.isEmpty)
                        sender ! GameError("There exists no such game.", 200)
                    else
                    {
                        // Populate the player list of the game from the database
                        var l: List[Player] = Nil
                        for((playerId, gameId, state, x, y, question, 
                             alt1, alt2, alt3, alt4, correctAnswer, answer, score) <- dbPlayers)
                        {
                            var p: Player = new Player(playerId, state)
                            p.x = x
                            p.y = y
                            p.question = new Question(question, List(alt1, alt2, alt3, alt4), correctAnswer)
                            p.answer = answer
                            p.score = score
                            l = p :: l
                        }
                        // Load the game board
                        val strBoard = (for { p <- GamesTable if p.gameId === x.gameId} yield (p.board)).list.head 
                        val intBoard = strBoard.split(",").map(_.toInt)
                        // Create an actor representing the game
                        val game = context.system.actorOf(Props(classOf[Game], x.gameId, l map (_.userId), 
                                                                publisher, l, intBoard))
                        hashMap.put(x.gameId, game)
                        println("Found! Forwarding...")
                        game forward x
                    }
                }
            // If the game is in the cache there's a lot less that the centralized games cache needs to do
            case Some(g) => g forward x 
        }
    }

    /**
     * Handles incoming messages.
     */
    def receive =
    {
        case "prune" =>
            prune()
            
        case CreateGameRequest (players) =>
            handleCreateGameRequest(players)
            
        case x: GameRequestMessage =>
            handleGameRequestMessage(x)
    }
}