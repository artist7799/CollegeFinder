from app.extensions import db

class Course(db.Model):
    __tablename__ = 'courses'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    college_id = db.Column(db.Integer, db.ForeignKey('colleges.id', ondelete='CASCADE'), nullable=False)
    course_name = db.Column(db.String(150), nullable=False)
    degree = db.Column(db.String(50), nullable=False)
    duration = db.Column(db.String(50), nullable=False)
    fees = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'college_id': self.college_id,
            'course_name': self.course_name,
            'degree': self.degree,
            'duration': self.duration,
            'fees': float(self.fees) if self.fees is not None else 0.0
        }

    def __repr__(self):
        return f"<Course {self.course_name} ({self.degree})>"
