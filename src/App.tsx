// how do i pause the video on "->, <-"?

/*

  cookie/local save history
  save index what video you looked at when switching history / offerd
  nodejs app to circumvent CORS


*/

import * as React from "react";
import "./App.css";
import Carousel from "./Carousel";
import AboutVideo from "./About";

interface IEndpointData {
  entries: IVideo[];
  totalCount: number;
}

export interface IVideo {
  title: string;
  availableDate: number;
  categories: Array<{
    description: string;
    id: string;
    title: string;
  }>;
  metadata: Array<{
    name: string;
    value: string;
  }>;
  contents: Array<{
    duration: number;
    format: string;
    geolock: boolean;
    height: number;
    id: string;
    languange: string;
    url: string;
    width: number;
  }>;
  credits: Array<{ role: string; name: string }>;
  images: Array<{
    height: number;
    id: string;
    type: string;
    url: string;
    width: string;
  }>;
  description: string;
  id: string;
  startAtSecond: number;
  node: HTMLVideoElement;
}

class App extends React.Component<
  {},
  {
    isInitWithData: IEndpointData | false;
    index: number;
    nextStep: () => number;
    prevStep: () => number;
    addToHistory: (video: any) => void;
    videoStore: {
      offered: IVideo[];
      history: IVideo[];
    };
    view: "offered" | "history";
    isViewingHistory: () => boolean;
    viewOfferedAnchor: HTMLAnchorElement | null;
    viewHistoryAnchor: HTMLAnchorElement | null;
    offeredHtmlVideos: HTMLVideoElement[];
    historyHtmlVideos: HTMLVideoElement[];
    touchedVideos: Array<IVideo["id"]>;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      isInitWithData: false,
      index: 1,
      videoStore: {
        offered: [],
        history: []
      },
      nextStep: () => {
        if (
          this.state.isInitWithData &&
          this.state.index < this.videos().length - 1
        ) {
          this.setState({
            index: this.state.index + 1
          });
          return this.state.index;
        }
        return -1;
      },
      prevStep: () => {
        if (this.state.index !== 0) {
          this.setState({
            index: this.state.index - 1
          });
          return this.state.index;
        }
        return -1;
      },
      addToHistory: (video: IVideo) => {
        if (this.state.touchedVideos.indexOf(video.id) === -1) {
          this.setState({
            touchedVideos: [video.id, ...this.state.touchedVideos]
          });
        }

        /*if (this.state.videoStore.history.indexOf(video) === -1) {
          this.setState({
            videoStore: {
              offered: this.state.videoStore.offered,
              history: [video, ...this.state.videoStore.history]
            }
          });
        }*/
      },
      view: "offered",
      isViewingHistory: () => {
        return this.state.view === "history";
      },
      viewOfferedAnchor: null,
      viewHistoryAnchor: null,
      offeredHtmlVideos: [],
      historyHtmlVideos: [],
      touchedVideos: []
    };
  }

  public videos = () => {
    if (this.state.isInitWithData) {
      if (this.state.view === "offered") {
        return this.state.videoStore[this.state.view];
      } else {
        const historyVideos = this.state.videoStore.offered.filter(
          x => this.state.touchedVideos.indexOf(x.id) !== -1
        );
        console.log("historyVideos", historyVideos);
        return historyVideos;
      }
    }
    return [];

    /*return this.state.isInitWithData && this.state.videoStore[this.state.view]
      ? this.state.videoStore[this.state.view]
      : [];*/
  };
  public currentVideo = () => {
    return this.videos()[this.state.index];
  };

  public componentDidMount() {
    fetch("https://sela-test.herokuapp.com/assets/hkzxv.json")
      .then(response => {
        return response.json();
      })
      .then(someJson => {
        this.setState({
          isInitWithData: someJson,
          videoStore: {
            offered: someJson.entries,
            history: []
          }
        });
        console.log(this, someJson);
      });
  }

  public viewOffered = () => {
    this.setState({
      view: "offered",
      index: 0
    });
    if (this.state.viewOfferedAnchor) {
      this.state.viewOfferedAnchor.blur();
    }
    this.pauseAllVideos();
  };

  public viewHistory = () => {
    this.setState({
      view: "history",
      index: 0
    });
    if (this.state.viewHistoryAnchor) {
      this.state.viewHistoryAnchor.blur();
    }
    this.pauseAllVideos();
  };

  public saveOfferedNode = (someNode: HTMLAnchorElement) => {
    this.setState({
      viewOfferedAnchor: someNode
    });
  };

  public saveHistoryNode = (someNode: HTMLAnchorElement) => {
    this.setState({
      viewHistoryAnchor: someNode
    });
  };

  public pauseAllVideos = () => {
    console.log("trying to pause all videos...");
    const allHtmlFilteredVideos = this.state.offeredHtmlVideos
      .concat(this.state.historyHtmlVideos)
      .filter(el => {
        return el != null;
      });
    console.log("allHtmlFilteredVideos", allHtmlFilteredVideos);
    for (const elem of allHtmlFilteredVideos) {
      if (elem && elem.pause) {
        elem.pause();
      }
    }
  };

  public render() {
    return (
      <div className="App">
        <div>
          viewing:
          <a href="#" onClick={this.viewOffered} ref={this.saveOfferedNode}>
            Our offered videos
          </a>
          <br />
          <a href="#" onClick={this.viewHistory} ref={this.saveHistoryNode}>
            My history
          </a>
        </div>

        <div>index: {this.state.index}</div>
        {this.state.isInitWithData ? (
          <>
            <Carousel
              videos={this.state.videoStore.offered}
              htmlVideos={this.state.offeredHtmlVideos}
              index={this.state.index}
              nextStep={this.state.nextStep}
              prevStep={this.state.prevStep}
              addToHistory={this.state.addToHistory}
              isViewingHistory={this.state.isViewingHistory}
              isActive={this.state.view === "offered"}
              style={
                this.state.view === "offered"
                  ? { display: "flex" }
                  : { display: "none" }
              }
            />
            <Carousel
              videos={this.videos()}
              htmlVideos={this.state.historyHtmlVideos}
              index={this.state.index}
              nextStep={this.state.nextStep}
              prevStep={this.state.prevStep}
              addToHistory={this.state.addToHistory}
              isViewingHistory={this.state.isViewingHistory}
              isActive={this.state.view === "history"}
              style={
                this.state.view === "history"
                  ? { display: "flex" }
                  : { display: "none" }
              }
            />

            {this.currentVideo() ? (
              <AboutVideo {...this.videos()[this.state.index]} />
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    );
  }
}
export default App;
