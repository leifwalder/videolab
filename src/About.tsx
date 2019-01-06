import * as React from "react";
import { IVideo } from "./App";

class AboutVideo extends React.Component<IVideo, {}> {
  public langDict = { en: "English", sv: "Swedish" };
  constructor(props: IVideo) {
    super(props);
    this.state = {};
  }

  public displayGenres = () => {
    const genres: string[] = [];
    for (const key of Object.keys(this.props.categories)) {
      genres.push(this.props.categories[key].title);
    }
    return genres;
  };

  public displayLang = () => {
    const someLang = this.props.metadata.find(x => {
      return x.name === "language";
    });

    return someLang && someLang.value ? (
      <span> {this.langDict[someLang.value]} </span>
    ) : (
      <></>
    );
  };

  public toReadableDate(unixEpochTime: number): string {
    return new Date(unixEpochTime).toLocaleDateString();
  }

  public render() {
    return (
      <div className="about">
        <h3>{this.props.title}</h3>

        {this.displayGenres().map(x => (
          <span key={x}> {x} </span>
        ))}
        <br />

        {this.displayLang()}

        <p>{this.props.description}</p>

        <p> available {this.toReadableDate(this.props.availableDate)} </p>
      </div>
    );
  }
}
export default AboutVideo;
