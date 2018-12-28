import * as React from "react";
import App, { IVideo } from "./App";
import Carousel from "./Carousel";

type Props = {
  video: IVideo;
  isCurrent: boolean;
  isFullscreen: Carousel["state"]["isFullscreen"];
  addToHistory: App["state"]["addToHistory"];
  isViewingHistory: App["state"]["isViewingHistory"];
};

type State = {
  controls: boolean;
  node: HTMLVideoElement | null;
  customSrcIsSet: boolean;
  src: null | string;
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
      controls: false,
      node: null,
      customSrcIsSet: false,
      src: null,
      isPristine: true,
      autoPlay: false
    };
  }

  public componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  public saveNode = (someNode: HTMLVideoElement) => {
    this.setState({ node: someNode });
    if (!this.isInit) {
      this.isInit = true;
      if (this.props.isViewingHistory()) {
        this.setState({
          isPristine: false
        });
      }
      this.setupEventListeners(someNode);
    }
  };

  public setupEventListeners = (node: any) => {
    const doWhenLoadedData = () => {
      console.log("doWhenLoadedData()");
      console.log("this.state.customSrcIsSet", this.state.customSrcIsSet);
      if (!this.state.customSrcIsSet) {
        this.setState({
          src: this.srcForwarded(),
          customSrcIsSet: true
        });
      }
    };
    const doWhenEnded = () => {
      if (this.state.node) {
        this.state.node.setAttribute("src", this.getVidSrc());
        this.setState({
          autoPlay: false
        });
      }
      if (this.props.isFullscreen()) {
        this.leaveFullscreen();
      }
    };
    node.addEventListener("loadeddata", doWhenLoadedData, false);
    node.addEventListener("ended", doWhenEnded, false);
    node.addEventListener(
      "mouseover",
      (e: any) => {
        if (!this.props.isCurrent) {
          e.preventDefault();
        }
      },
      false
    );
  };

  public handleClick = () => {
    this.setState({ controls: !this.state.controls });
    if (this.state.node) {
      this.state.node.pause();
    }
    this.updateTimeElapsed();
    this.touchPristineVideo();
  };

  public touchPristineVideo = () => {
    if (this.state.isPristine && this.state.node) {
      this.state.node.setAttribute("src", this.getVidSrc());
      this.setState({
        isPristine: false,
        autoPlay: true
      });
      this.props.video.startAtSecond = Math.floor(this.state.node.currentTime);

      console.log("this.state.node.currentTime", this.state.node.currentTime);
      console.log(
        "typeof this.state.node.currentTime",
        typeof this.state.node.currentTime
      );
      console.log(
        "Math.floor(this.state.node.currentTime)",
        Math.floor(this.state.node.currentTime)
      );
      this.props.addToHistory(this.props.video);
    }
  };

  public getVidSrc() {
    if (this.props.video.contents[0] && this.props.video.contents[0].url) {
      return this.props.video.contents[0].url;
    }
    throw Error("could not find src");
  }

  public srcForwarded = () => {
    console.log(
      "srcForwarded(), this.props.isViewingHistory()",
      this.props.isViewingHistory()
    );
    console.log("this.state.node", this.state.node);
    if (this.state.node) {
      const second = this.props.video.startAtSecond
        ? this.props.video.startAtSecond
        : Math.floor(this.state.node.duration / 2);

      return this.state.node.duration
        ? `${this.getVidSrc()}#t=${second}`
        : this.getVidSrc();
    }
    return this.getVidSrc();
  };

  public videoStyle = () => {
    return this.state.customSrcIsSet ? {} : { display: "none" };
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
      //continue silently...
    }
  }

  public handleKeyDown = (event: any) => {
    if (!this.props.isCurrent) {
      return;
    }

    this.updateTimeElapsed();

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

  public updateTimeElapsed = () => {
    this.props.video.startAtSecond =
      this.state.node && this.state.node.currentTime
        ? this.state.node.currentTime
        : 0;
  };

  public render() {
    return (
      <div>
        <video
          id="video"
          width={this.props.isCurrent ? 400 : 300}
          controls={this.state.controls}
          autoPlay={this.state.autoPlay}
          src={this.state.src || this.getVidSrc()}
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
