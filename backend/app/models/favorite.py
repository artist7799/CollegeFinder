from datetime import datetime
from app.extensions import db

class Favorite(db.Model):
    __tablename__ = 'favorites'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    college_id = db.Column(db.Integer, db.ForeignKey('colleges.id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'college_id', name='unique_user_college_favorite'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'college_id': self.college_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<Favorite User #{self.user_id} -> College #{self.college_id}>"
