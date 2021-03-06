# -*- coding: utf-8 -*-
"""
    Copyright (C) Quizzingbricks
"""

import datetime
import bcrypt
import sqlalchemy as sa
from sqlalchemy.orm import synonym, relationship

from quizzingbricks.common.db import Base
from quizzingbricks.services.users.models import User

class Friendship(Base):
    __tablename__ = "friendships"

    user_id = sa.Column(sa.Integer, sa.ForeignKey("users.id"), nullable=False, primary_key=True)

    user = relationship(User, backref="friends",foreign_keys=[user_id] )
    friend_id = sa.Column(sa.Integer, sa.ForeignKey("users.id"), nullable=False, primary_key=True)
    friend = relationship(User, foreign_keys=[friend_id])



    created_at = sa.Column(sa.DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = sa.Column(sa.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow,
                           nullable=False)