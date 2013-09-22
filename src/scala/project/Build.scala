import sbt._
import Keys._
 
object QuizzingBricksBuild extends Build {
 

  lazy val standardSettings = Defaults.defaultSettings ++ Seq(
    version         := "0.1-beta",
    scalaVersion    := "2.10.2",
    organization    := "com.quizzingbricks"
  )

  //val appDependencies = Nil
 
  lazy val nuncius = Project(
    id          = "nuncius",
    base        = file("nuncius"),
    settings    = standardSettings ++ Seq(
    libraryDependencies ++= Seq(
      "com.typesafe.akka" %% "akka-actor" % "2.2.1", 
      "com.typesafe.akka" %% "akka-zeromq" % "2.2.1"),
      resolvers += "Typesafe Repository" at "http://repo.typesafe.com/typesafe/releases/"
    )
  )

  //lazy val common = Project(...)
}

// TODO: improve this to handle dependencies better