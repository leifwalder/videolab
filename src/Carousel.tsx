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
  isActive: () => boolean;
  htmlVideos: HTMLVideoElement[];
  cookiePrefix: string;
  parsedCookies: App["state"]["parsedCookies"];
  toggleOfferedHistory: App["toggleOfferedHistory"];
  mutateKeyEventListeners: App["state"]["mutateKeyEventListeners"];
  view: string;
};

class Carousel extends React.Component<
  Props,
  {
    isFullscreen: () => boolean;
  }
> {
  public LEFT_KEY = 37;
  public RIGHT_KEY = 39;
  public UP_KEY = 38;
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
    this.props.mutateKeyEventListeners(this.handleKeyDown, this.props.view);
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
    if (this.state.isFullscreen()) {
      //!this.props.isActive() ||
      return;
    }
    switch (event.keyCode) {
      case this.LEFT_KEY:
        this.handleChangeStep("prev");
        break;
      case this.RIGHT_KEY:
        this.handleChangeStep("next");
        break;
      case this.DOWN_KEY:
        this.props.toggleOfferedHistory();
        break;
      default:
        break;
    }
  };

  public handleChangeStep = (direction: "next" | "prev") => {
    // save video's current time
    this.updateTimeElapsed();

    const indexBeforeChange = Number(this.props.index.toString());

    let toIndex;
    if (direction === "next") {
      toIndex = this.props.nextStep();
    } else if (direction === "prev") {
      toIndex = this.props.prevStep();
    }

    // pause last video if changed step
    const changedStep = toIndex && toIndex !== -1;
    const previousNode = this.props.htmlVideos[indexBeforeChange];
    if (changedStep && previousNode) {
      previousNode.pause();
    }
  };

  public updateTimeElapsed = () => {
    const htmlNodes = this.props.htmlVideos.filter(el => {
      return el != null;
    });

    const valueToStore =
      htmlNodes[this.props.index] && htmlNodes[this.props.index].currentTime
        ? htmlNodes[this.props.index].currentTime
        : 0;

    if (this.props.videos[this.props.index]) {
      this.props.videos[this.props.index].startAtSecond = valueToStore;

      this.saveCookie(this.props.videos[this.props.index]);
    }
  };

  public saveCookie = (video: IVideo) => {
    const cookie = `${this.props.cookiePrefix}${video.id}=${
      video.startAtSecond
    }; max-age=120`;
    document.cookie = cookie;
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
                  isCurrent={
                    index === this.props.index && this.props.isActive()
                  }
                  isFullscreen={this.state.isFullscreen}
                  addToHistory={this.props.addToHistory}
                  isViewingHistory={this.props.isViewingHistory}
                  htmlVideos={this.props.htmlVideos}
                  index={index}
                  isActive={this.props.isActive}
                  cookiePrefix={this.props.cookiePrefix}
                  parsedCookie={this.props.parsedCookies[vid.id]}
                />
                {/*<h2 className="debug">{index}</h2>*/}
              </li>
            );
          })
        ) : (
          <></>
        )}
      </ul>
    );
  };

  public nextStepViaArrow = () => {
    this.handleChangeStep("next");
  };
  public prevStepViaArrow = () => {
    this.handleChangeStep("prev");
  };

  public render() {
    return (
      <>
        <div className="carousel-outer" style={this.props.style}>
          <img
            className="arrow left"
            src={leftArrow}
            alt="left arrow"
            style={{
              opacity: this.props.index === 0 ? 0.1 : 1
            }}
            onClick={this.prevStepViaArrow}
          />

          <div className="carousel-inner">{this.renderVideoList()}</div>

          <img
            className="arrow right"
            src={leftArrow}
            alt="right arrow"
            style={{
              opacity:
                this.props.index === this.props.videos.length - 1 ? 0.1 : 1,
              transform: "scaleX(-1)"
            }}
            onClick={this.nextStepViaArrow}
          />
        </div>
      </>
    );
  }
}
export default Carousel;
