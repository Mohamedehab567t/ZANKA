from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Length , ValidationError
from ZANKA import db



class Login(FlaskForm):
    n = StringField('رقم المستخدم' , validators=[DataRequired(message="ادخل رقمك الصحيح")])
    password = PasswordField("كلمة المرور" , validators=[DataRequired(message='ادخل كلمة المرور') , Length(min=1 , max=20)])
    submit = SubmitField('تسجيل الدخول')
    def Validate_account(self, n):
        user = db.session.execute("SELECT user_name FROM user WHERE name = :namee" , {"namee" : n.data})
        print(user)
        if not user:
            raise ValidationError('لا يوجد مستخدم')