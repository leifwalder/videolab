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
  isViewingHistory: App["state"]["isViewingHistory"];
  style: { display: string };
  isActive: boolean;
};

class Carousel extends React.Component<
  Props,
  {
    isFullscreen: () => boolean;
    //htmlVideos: HTMLVideoElement[]
  }
> {
  public LEFT_KEY = 37;
  public RIGHT_KEY = 39;
  /*public UP_KEY = 38;
  public DOWN_KEY = 40;
  public ESCAPE_KEY = 27;
  public ENTER_KEY = 13;*/
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
      //htmlVideos: []
    };
  }

  public componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
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
        this.handleChangeStep("prev");
        break;
      case this.RIGHT_KEY:
        this.handleChangeStep("next");
        break;
      default:
        break;
    }
  };

  public handleChangeStep = (direction: "next" | "prev") => {
    // save time cursor
    this.updateTimeElapsed();

    //pause inactive video
    if (this.props.videos[this.props.index].node) {
      this.props.videos[this.props.index].node.pause();
    }

    if (direction === "next") {
      const nextIndex = this.props.nextStep();
      console.log("nextIndex", nextIndex);
      //act on nextIndex !== -1
      /*if (nextIndex !== -1 && this.props.videos[nextIndex]) {
        this.props.videos.element
      }*/
    } else if (direction === "prev") {
      this.props.prevStep();
    }
  };

  public updateTimeElapsed = () => {
    const valueToStore =
      this.props.videos[this.props.index] &&
      this.props.videos[this.props.index].node.currentTime
        ? this.props.videos[this.props.index].node.currentTime
        : 0;
    this.props.videos[this.props.index].startAtSecond = valueToStore;
  };

  public renderVideoList = () => {
    return (
      <ul className="video-list">
        {this.props.videos ? (
          this.props.videos.map((vid, index) => {
            return (
              <li
                key={vid.id}
                className={`${this.ListItemCssClass(index)} carousel-item`}
              >
                <SomeVideo
                  video={vid}
                  isCurrent={index === this.props.index && this.props.isActive}
                  isFullscreen={this.state.isFullscreen}
                  addToHistory={this.props.addToHistory}
                  isViewingHistory={this.props.isViewingHistory}
                  //htmlVideos={this.props.videos}
                  index={index}
                  isActive={this.props.isActive}
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
