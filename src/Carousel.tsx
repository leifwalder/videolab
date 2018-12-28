import * as React from "react";
import App, { IVideo } from "./App";
import SomeVideo from "./SomeVideo";
import * as leftArrow from "./assets/left_arrow2.png";

type Props = {
  videos: IVideo[];
  index: number;
  nextStep: App["state"]["nextStep"];
  prevStep: App["state"]["prevStep"];
  addToHistory: App["state"]["addToHistory"];
  toggleView: App["state"]["toggleView"];
  isViewingHistory: App["state"]["isViewingHistory"];
  style: { display: string };
  isActive: boolean;
};

class Carousel extends React.Component<Props, { isFullscreen: () => boolean }> {
  public LEFT_KEY = 37;
  public UP_KEY = 38;
  public RIGHT_KEY = 39;
  public DOWN_KEY = 40;
  public ESCAPE_KEY = 27;
  public ENTER_KEY = 13;
  constructor(props: Props) {
    super(props);
    this.state = {
      isFullscreen: () => {
        /* tslint:disable:no-string-literal */
        return (
          document["fullScreen"] ||
          document["mozFullScreen"] ||
          document["webkitIsFullScreen"]
        );
        /* tslint:enable:no-string-literal */
      }
    };
  }

  public componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }
  public componentDidMount() {
    console.log(
      "Carousel, componentDidMount(), this.props.videos: ",
      this.props.videos
    );
  }

  public ListItemCssClass = (index: number) => {
    let className = "";
    switch (index) {
      case this.props.index:
        className = "active current";
        break;
      case this.props.index - 1:
        className = "active previous";
        break;
      case this.props.index + 1:
        className = "active next";
        break;
      default:
    }
    return className;
  };

  public handleKeyDown = (event: any) => {
    if (!this.props.isActive || this.state.isFullscreen()) {
      return;
    }
    switch (event.keyCode) {
      case this.LEFT_KEY:
        this.props.prevStep();
        break;
      case this.RIGHT_KEY:
        this.props.nextStep();
        break;
      default:
        break;
    }
  };

  public renderVideoList = () => {
    return (
      <ul className="video-list">
        {this.props.videos ? (
          this.props.videos.map((vid, index) => {
            return (
              <li
                key={index}
                className={`${this.ListItemCssClass(index)} carousel-item`}
              >
                <SomeVideo
                  video={vid}
                  isCurrent={index === this.props.index && this.props.isActive}
                  isFullscreen={this.state.isFullscreen}
                  addToHistory={this.props.addToHistory}
                  isViewingHistory={this.props.isViewingHistory}
                />
                <h2>{index}</h2>
              </li>
            );
          })
        ) : (
          <></>
        )}
      </ul>
    );
  };

  public render() {
    return (
      <div className="carousel" style={this.props.style}>
        <img
          className="arrow left"
          src={leftArrow}
          alt="left arrow"
          style={{
            opacity: this.props.index === 0 ? 0.1 : 1
          }}
          onClick={this.props.prevStep}
        />

        {this.renderVideoList()}

        <img
          className="arrow right"
          src={leftArrow}
          alt="right arrow"
          style={{
            opacity:
              this.props.index === this.props.videos.length - 1 ? 0.1 : 1,
            transform: "scaleX(-1)"
          }}
          onClick={this.props.nextStep}
        />
      </div>
    );
  }

  public componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown.bind(this));
  }
}
export default Carousel;
