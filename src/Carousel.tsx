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
  htmlVideos: HTMLVideoElement[];
};

class Carousel extends React.Component<
  Props,
  {
    isFullscreen: () => boolean;
    //htmlVideos: HTMLVideoElement[];
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
    console.log("this.props.isActive", this.props.isActive);
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
    console.log("handleChangeStep()");

    // save node's current time
    this.updateTimeElapsed();

    const indexBeforeChange = Number(this.props.index.toString());
    console.log("from index", indexBeforeChange);

    let toIndex;
    if (direction === "next") {
      toIndex = this.props.nextStep();
    } else if (direction === "prev") {
      toIndex = this.props.prevStep();
    }
    console.log("toIndex", toIndex);

    // pause last video if changed step
    const changedStep = toIndex && toIndex !== -1;
    const previousNode = this.props.htmlVideos[indexBeforeChange];
    if (changedStep && previousNode) {
      previousNode.pause();
    }

    //forward video if hasStartAtSecond
    /*const toNode = toIndex && this.state.htmlVideos[toIndex];
    const toVideo = toIndex && this.props.videos[toIndex];
    console.log("changedStep", changedStep);
    console.log("toNode", toNode);
    console.log("toVideo", toVideo);
    console.log(
      "(changedStep && toNode && toVideo)",
      changedStep && toNode && toVideo
    );
    if (changedStep && toNode && toVideo) {
      console.log("toVideo.startAtSecond", toVideo.startAtSecond);
      const newSrc = `${toVideo.contents[0].url}#t=${toVideo.startAtSecond}`;
      console.log("newSrc", newSrc);
      toNode.setAttribute("src", newSrc);
    }*/
  };

  public updateTimeElapsed = () => {
    const valueToStore =
      this.props.htmlVideos[this.props.index] &&
      this.props.htmlVideos[this.props.index].currentTime
        ? this.props.htmlVideos[this.props.index].currentTime
        : 0;

    console.log(
      `const valueToStore =
    this.props.htmlVideos[this.props.index] &&
    this.props.htmlVideos[this.props.index].currentTime
      ? this.props.htmlVideos[this.props.index].currentTime
      : 0;`,
      valueToStore
    );

    if (this.props.videos[this.props.index]) {
      this.props.videos[this.props.index].startAtSecond = valueToStore;
      console.log("valueToStore", valueToStore);
    }
  };

  public renderVideoList = () => {
    return (
      <ul className="video-list">
        {this.props.videos ? (
          this.props.videos.map((vid, index) => {
            return (
              <li
                key={`${vid.id} history:${this.props.isViewingHistory}`}
                className={`${this.ListItemCssClass(index)} carousel-item`}
              >
                <SomeVideo
                  video={vid}
                  isCurrent={index === this.props.index && this.props.isActive}
                  isFullscreen={this.state.isFullscreen}
                  addToHistory={this.props.addToHistory}
                  isViewingHistory={this.props.isViewingHistory}
                  htmlVideos={this.props.htmlVideos}
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
