// how do i pause the video on "->, <-"?

import * as React from "react";
import "./App.css";
// import SomeVideo from "./SomeVideo";
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
}

class App extends React.Component<
  {},
  {
    isInitWithData: IEndpointData | false;
    index: number;
    nextStep: () => void;
    prevStep: () => void;
    addToHistory: (video: any) => void;
    videoStore: {
      offered: IVideo[];
      history: IVideo[];
    };
    view: "offered" | "history";
    toggleView: () => void;
    isViewingHistory: () => boolean;
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
        }
      },
      prevStep: () => {
        if (this.state.index !== 0) {
          this.setState({
            index: this.state.index - 1
          });
        }
      },
      addToHistory: (video: any) => {
        console.log("addToHistory()");
        console.log(
          "this.state.videoStore.history.indexOf(video)",
          this.state.videoStore.history.indexOf(video)
        );
        if (this.state.videoStore.history.indexOf(video) === -1) {
          this.setState({
            videoStore: {
              offered: this.state.videoStore.offered,
              history: [video, ...this.state.videoStore.history]
            }
          });
        }
        console.log(
          "this.state.videoStore.history: ",
          this.state.videoStore.history
        );
      },
      view: "offered",
      toggleView: () => {
        const setToView = this.state.view === "offered" ? "history" : "offered";
        if (this.state.view !== setToView) {
          this.setState({
            view: setToView
          });
        }
      },
      isViewingHistory: () => {
        return this.state.view === "history";
      }
    };
  }

  public videos = () => {
    return this.state.isInitWithData && this.state.videoStore[this.state.view]
      ? this.state.videoStore[this.state.view]
      : [];
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
        console.log(someJson);
      });
  }

  public viewOffered = () => {
    this.setState({
      view: "offered",
      index: 0
    });
  };

  public viewHistory = () => {
    this.setState({
      view: "history",
      index: 0
    });
  };

  public render() {
    return (
      <div className="App">
        <div>
          viewing:
          <a href="#" onClick={this.viewOffered}>
            Our offered videos
          </a>
          <br />
          <a href="#" onClick={this.viewHistory}>
            My history
          </a>
        </div>

        <div>index: {this.state.index}</div>
        {this.state.isInitWithData ? (
          <>
            <Carousel
              videos={this.state.videoStore.offered}
              index={this.state.index}
              nextStep={this.state.nextStep}
              prevStep={this.state.prevStep}
              addToHistory={this.state.addToHistory}
              toggleView={this.state.toggleView}
              isViewingHistory={this.state.isViewingHistory}
              isActive={this.state.view === "offered"}
              style={
                this.state.view === "offered"
                  ? { display: "flex" }
                  : { display: "none" }
              }
            />
            <Carousel
              videos={this.state.videoStore.history}
              index={this.state.index}
              nextStep={this.state.nextStep}
              prevStep={this.state.prevStep}
              addToHistory={this.state.addToHistory}
              toggleView={this.state.toggleView}
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
