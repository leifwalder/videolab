import * as React from "react";
import App, { IVideo } from "./App";
import Carousel from "./Carousel";
import * as playButton from "./assets/play_inverse.png";

type Props = {
  video: IVideo;
  isCurrent: boolean;
  index: number;
  isFullscreen: Carousel["state"]["isFullscreen"];
  addToHistory: App["state"]["addToHistory"];
  isViewingHistory: App["state"]["isViewingHistory"];
  htmlVideos: HTMLVideoElement[];
  isActive: boolean;
  cookiePrefix: string;
  parsedCookie: number;
};

type State = {
  controls: () => boolean;
  node: HTMLVideoElement | null;
  videoSourceIsLoaded: boolean;
  isPristine: boolean;
  autoPlay: boolean;
};

class SomeVideo extends React.Component<Props, State> {
  public isInit: boolean = false;
  public LEFT_KEY = 37;
  public UP_KEY = 38;
  public RIGHT_KEY = 39;
  public DOWN_KEY = 40;
  public ESCAPE_KEY = 27;
  public ENTER_KEY = 13;
  public SPACE_KEY = 32;
  constructor(props: Props) {
    super(props);
    this.state = {
      controls: () => {
        return this.props.isCurrent && !this.state.isPristine;
      },
      node: null,
      videoSourceIsLoaded: false,
      isPristine: true,
      autoPlay: false
    };
  }

  public componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  public saveNode = (someNode: HTMLVideoElement) => {
    this.props.htmlVideos[this.props.index] = someNode;
    this.props.video.node = someNode;
    this.setState({ node: someNode });
    if (!this.isInit) {
      this.props.video.startAtSecond = this.props.parsedCookie
        ? this.props.parsedCookie
        : 0;
      this.isInit = true;
      this.setupEventListeners(someNode);
    }
  };

  public setupEventListeners = (node: any) => {
    const doWhenLoadedData = () => {
      if (!this.state.videoSourceIsLoaded) {
        this.setState({
          videoSourceIsLoaded: true
        });
      }
    };
    node.addEventListener("loadeddata", doWhenLoadedData, false);

    const doWhenEnded = () => {
      if (this.state.node) {
        this.setState({
          autoPlay: false
        });
      }
      if (this.props.isFullscreen()) {
        this.leaveFullscreen();
      }
    };
    node.addEventListener("ended", doWhenEnded, false);

    const mouseover = (e: any) => {
      if (!this.props.isCurrent) {
        e.preventDefault();
      }
    };
    node.addEventListener("mouseover", mouseover, false);
  };

  public handleClick = () => {
    if (this.props.isCurrent) {
      if (this.state.node) {
        this.state.node.pause();
      }
      this.touchPristineVideo();
    }
  };

  public touchPristineVideo = () => {
    if (this.state.isPristine && this.state.node) {
      this.setState({
        isPristine: false,
        autoPlay: false
      });
      this.props.addToHistory(this.props.video);
    }
  };

  public getVidSrc() {
    if (this.props.video.contents[0] && this.props.video.contents[0].url) {
      const mediaUrl = this.props.video.contents[0].url;
      const time =
        this.state.isPristine &&
        this.state.node &&
        !this.props.isViewingHistory() &&
        !this.props.video.startAtSecond
          ? Math.floor(this.state.node.duration / 2)
          : this.props.video.startAtSecond;

      const src = `${mediaUrl}#t=${time}`;
      return src;
    }
    throw Error("could not find video-url");
  }

  public videoStyle = () => {
    return this.state.videoSourceIsLoaded ? {} : { display: "none" };
  };

  public goFullscreen() {
    if (this.state.node) {
      const genericNode = this.state.node as HTMLElement;
      genericNode.requestFullscreen();
    }
  }
  public leaveFullscreen() {
    try {
      document.exitFullscreen();
    } catch (e) {
      // continue silently...
    }
  }

  public handleKeyDown = (event: any) => {
    if (!this.props.isActive || !this.props.isCurrent) {
      return;
    }
    switch (event.keyCode) {
      case this.UP_KEY:
        this.goFullscreen();
        break;
      case this.ENTER_KEY:
      case this.SPACE_KEY:
        this.touchPristineVideo();
        if (this.state.node) {
          if (this.state.node.paused) {
            this.state.node.play();
          } else {
            this.state.node.pause();
          }
        }
        break;
      case this.DOWN_KEY:
        this.leaveFullscreen();
        break;
      default:
        break;
    }
  };

  public render() {
    return (
      <div>
        {this.state.isPristine && this.props.isCurrent ? (
          <img className="play-button flip-horizontally" src={playButton} />
        ) : (
          <></>
        )}
        <video
          id={`${this.props.video.id} history:${this.props.isViewingHistory()}`}
          width={this.props.isCurrent ? 400 : 300}
          controls={this.state.controls()}
          autoPlay={this.state.autoPlay}
          src={this.getVidSrc()}
          onClick={this.handleClick}
          ref={this.saveNode}
          style={this.videoStyle()}
        />
      </div>
    );
  }

  public componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown.bind(this));
  }
}

export default SomeVideo;
