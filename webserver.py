from flask import request, render_template, abort
import flask

#from stream import stream_app
import stream
from server_config import config
from models.models_list import models_dict


app = flask.Flask(__name__)
app.register_blueprint(stream.stream_app, url_prefix='/stream')
app.config['DEBUG']=True

@app.route("/")
def index():
    return "index"


@app.route("/<nn_type>")
def client(nn_type):
    if nn_type not in models_dict:
        abort(404)
    connection=stream.create_connection(models_dict[nn_type])
    camera_size=(config["IMAGE"]["size_x"], config["IMAGE"]["size_y"])
    return render_template("client.html",nn_type=nn_type, camera_size=camera_size, cid=connection.cid, c2s_jpeg=config["IMAGE"]["c2s_jpeg"])



def start_flask():
    print("\n".join(map(str,app.url_map.iter_rules())))
    app.run(host= '0.0.0.0',threaded=True,port=8081, ssl_context=('cert.pem', 'key.pem'))
    #app.run(host= '0.0.0.0',processes=4,port=8080)
