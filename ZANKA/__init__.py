from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
app = Flask(__name__)
db = SQLAlchemy(app)
migrate = Migrate(app , db)
salt = os.urandom(32)
from .links.home import home
from .links.api import api

app.config['SECRET_KEY'] = 'df534g53sae1df5d3sr5f15dr341fc532fd1t6rf54152e41489gt65e'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///zanka.db'
app.register_blueprint(home)
app.register_blueprint(api)