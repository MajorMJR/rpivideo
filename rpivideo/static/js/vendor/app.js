var VideoForm = React.createClass({
    getInitialState: function() {
        return {url: '', output: 'hdmi'};
    },
    handleUrlChange: function(e) {
        this.setState({url: e.target.value});
    },
    handleOutputChange: function(e) {
        console.log(e)
        this.setState({output: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var urlSubmit = this.state.url.trim();
        var outputSubmit = this.state.output.trim();
        var dataSubmitted = {url: urlSubmit, output: outputSubmit}

        if (!urlSubmit || !outputSubmit) {
            return;
        }

        $.ajax({
            url: '/',
            type: 'POST',
            data: dataSubmitted,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(xhr, status, err.toString());
            }.bind(this)
        });

        this.setState({url: '', output: 'hdmi'})
    },
    render: function() {
        return (
        <form method="POST" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="url">Video URL:</label>
            <input type="text" className="form-control" id="urlinput" placeholder="URL" name="url" value={this.state.url} onChange={this.handleUrlChange}/>
          </div>
          <div className="form-group">
            <select className="form-control" ref="menu" name="output" value={this.state.output} onChange={this.handleOutputChange}>
              <option value="hdmi">HDMI</option>
              <option value="local">Local</option>
              <option value="both">Both</option>
            </select>
          </div>
          <button type="submit" className="btn btn-default">Submit</button>
        </form>
        );
    }
});


var VideoControls = React.createClass({
    getInitialState: function() {
        return {progress: 0 + '%',
                position: 0.0,
                playing: false,
                duration: this.setDuration()}
    },
    getProgress: function() {
        $.ajax({
            url: '/video/position',
            dataType: 'json',
            success: function(data) {
                this.setState({position: data.position})
            }.bind(this)
        });
    },
    setDuration: function(e) {
        $.ajax({
            url: '/video/position',
            dataType: 'json',
            success: function(data) {
                this.setState({duration: data.duration / 1000000})
            }.bind(this)
        });
    },
    componentDidMount: function() {

    },
    playButton: function(e) {
        e.preventDefault();
        $.ajax({
            url: '/video/play',
            success: function(data) {
                this.setState({playing: true});
                console.log(data);
            }.bind(this)
        });
        if (!this.progressTimer) {
            this.progressTimer = setInterval(this.getProgress, 1500);
        }
    },
    stopButton: function(e) {
        e.preventDefault();
        $.ajax({
            url: '/video/stop',
            success: function(data) {
                this.setState({playing: false});
                console.log(data);
            }.bind(this)
        });
        clearInterval(this.progressTimer);
        this.progressTimer = false;
    },
    stepBackButton: function(e) {
        e.preventDefault();
        $.ajax({
            url: '/video/rw30',
            success: function(data) {
                console.log(data);
            }.bind(this)
        })
    },
    stepForwardButton: function(e) {
        e.preventDefault();
        $.ajax({
            url: '/video/ff30',
            success: function(data) {
                console.log(data);
            }.bind(this)
        })
    },
    rewindButton: function(e) {
        e.preventDefault();
        $.ajax({
            url: '/video/rw',
            success: function(data) {
                console.log(data);
            }.bind(this)
        })
    },
    forwardButton: function(e) {
        e.preventDefault();
        $.ajax({
            url: '/video/ff',
            success: function(data) {
                console.log(data);
            }.bind(this)
        })
    },
    render: function() {


        var percentComplete = this.state.position / this.state.duration * 100

        return (
            <div>
                <p>{this.state.position}</p>
                <p>{this.state.duration}</p>
                <div className="form-group">
                    <div className="btn-group" role="group" aria-label="...">
                        <button type="button" className="btn btn-default" onClick={this.playButton}>
                            <span className="glyphicon glyphicon-play"></span>
                            <span className="glyphicon glyphicon-pause"></span>
                        </button>
                        <button type="button" className="btn btn-default" onClick={this.stopButton}>
                            <span className="glyphicon glyphicon-stop"></span>
                        </button>
                        <button type="button" className="btn btn-default" onClick={this.stepBackButton}>
                            <span className="glyphicon glyphicon-step-backward"></span>
                        </button>
                        <button type="button" className="btn btn-default" onClick={this.rewindButton}>
                            <span className="glyphicon glyphicon-backward"></span>
                        </button>
                        <button type="button" className="btn btn-default" onClick={this.forwardButton}>
                            <span className="glyphicon glyphicon-forward"></span>
                        </button>
                        <button type="button" className="btn btn-default" onClick={this.stepForwardButton}>
                            <span className="glyphicon glyphicon-step-forward"></span>
                        </button>
                    </div>
                </div>
                <div className="progress">
                  <div className="progress-bar"
                       role="progressbar"
                       aria-valuenow={this.state.position}
                       aria-valuemin="0"
                       aria-valuemax={this.state.duration}
                       style={{width: percentComplete + '%'}}>
                  </div>
                </div>
            </div>
        );
    }
})

var VideoApp = React.createClass({
    render: function() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <VideoForm />
                </div>
                <div className="col-md-4">
                    <VideoControls />
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <VideoApp />,
    document.getElementById('video-app')
);