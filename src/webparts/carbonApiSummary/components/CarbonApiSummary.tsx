import * as React from 'react';
import styles from './CarbonApiSummary.module.scss';
import { ICarbonApiSummaryProps } from './ICarbonApiSummaryProps';
import { HttpClient, HttpClientResponse, IHttpClientOptions } from '@microsoft/sp-http';
import { Configuration, OpenAIApi } from 'openai';
import hexRgb from 'hex-rgb';

export interface ICarbonApiSummaryState {
  carbonAPIResonse: string;
  canUnderStandData: string;
  mainAnswer: string;
  colourAnswer: string;
  emojiAnswer: string;
}

export default class CarbonApiSummary extends React.Component<ICarbonApiSummaryProps, ICarbonApiSummaryState> {

  private openai: OpenAIApi;

  public constructor(props: ICarbonApiSummaryProps) {
    super(props);
    this.state = {
      canUnderStandData: "",
      colourAnswer: "",
      emojiAnswer: "",
      mainAnswer: "",
      carbonAPIResonse: ""
    }
    const key = new Configuration({
      organization: this.props.chatGPTOrg,
      apiKey: this.props.chatGPTKey,
    });
    this.openai = new OpenAIApi(key);
  }

  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  public async componentDidMount() {

    await this.callCarbonAPI();
    //note the following call quite often replies 'no' which I think is wrong, if you allow a full reponse it appears that chatGPT is perfectly happy with the data!
    await this.askQuestion("Just answer yes or no", "can you understand this data:", this.state.carbonAPIResonse,500, "canUnderStandData");
    //TODO - the following calls should cache the replies in a central list to avoid making lots of calls to chatgpt
    await this.askQuestion(this.props.mainSystem, this.props.mainQuestion, this.state.carbonAPIResonse,500, "mainAnswer");
    await this.askQuestion(this.props.colourSystem, this.props.colourQuestion, this.state.carbonAPIResonse,500, "colourAnswer");
    await this.askQuestion(this.props.emojiSystem, this.props.emojiQuestion, this.state.carbonAPIResonse,500, "emojiAnswer");

  }
  /* eslint-enable @typescript-eslint/explicit-function-return-type */

  private askQuestion = async(systemMessage:string, question:string, data: string, maxTokens: number, stateName: string): Promise<void> => {

    //TODO - put maxTokens back into call, make this a webpart property
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "user",
            "content": data
          },
          {
            "role": "system",
            "content": systemMessage
          },
          {
            "role": "user",
            "content": question
          }
        ]
      }); 
      
      const responseFromChatGPT:string | undefined= response.data.choices[0].message?.content?.toString().trim();
      console.log(responseFromChatGPT);

      if (responseFromChatGPT !== undefined)
      {
        this.setState({ ...this.state, [stateName]: responseFromChatGPT});
      }
      else
      {
        this.setState({ ...this.state, [stateName]: "chatGPT couldn't respond to this"});
      }
      console.log("askQuestion done")
    }
    catch(e)
    {
      const ex:Error = e as Error
      console.log(ex.message);
      console.log(ex.stack);      
    }

  }

  private getTextColour():string {
    try
    {
      const colours:{[key: string]: string} = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
        "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
        "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
        "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
        "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
        "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
        "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
        "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
        "honeydew":"#f0fff0","hotpink":"#ff69b4",
        "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
        "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
        "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
        "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
        "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
        "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
        "navajowhite":"#ffdead","navy":"#000080",
        "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
        "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
        "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
        "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
        "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
        "violet":"#ee82ee",
        "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
        "yellow":"#ffff00","yellowgreen":"#9acd32"};

      let colourfromState:string = this.state.colourAnswer
      
      if (typeof colours[colourfromState.toLowerCase()] !== 'undefined')
          colourfromState =  colours[colourfromState.toLowerCase()];

      const backgroundColour: {red:number, green:number, blue:number, alpha: number} = hexRgb(colourfromState);
      const weightedDistance = Math.sqrt((Math.pow(backgroundColour.red,2) * 0.241) + (Math.pow(backgroundColour.green,2) * 0.691) + (Math.pow(backgroundColour.blue,2) * 0.068))
      return weightedDistance<130? "#eeeeee" : "#111111";
    }
    catch
    {
      return "#111111";
    }
  }

  private callCarbonAPI = async (): Promise<void> => {

    //TODO - make the requestHeaders configurable via web part property
    const requestHeaders: Headers = new Headers();
    requestHeaders.append('Accept', 'application/json')

    const httpClientOptions: IHttpClientOptions = {
      headers: requestHeaders
    };

    try {
      await this.props.context.httpClient
        .get(this.props.apiUrl, HttpClient.configurations.v1, httpClientOptions)
        .then((res: HttpClientResponse): Promise<unknown> => {
          return res.json();
        })
        .then((response: unknown): void => {
          console.log(response);
          this.setState({"carbonAPIResonse": JSON.stringify(response)})
        });
    }
    catch
    {
      console.log("An Error has occurred")
    }
  }

  public render(): React.ReactElement<ICarbonApiSummaryProps> {
    const {
      hasTeamsContext
    } = this.props;

    return (
      <section className={`${styles.carbonApiSummary} ${hasTeamsContext ? styles.teams : ''}`}>
        {this.state.canUnderStandData !== null ? (
          this.state.mainAnswer!=="" && this.state.colourAnswer!=="" && this.state.emojiAnswer!=="" ? (
            <div>
              <div className={styles.carboninfo} style={{backgroundColor: this.state.colourAnswer, color: this.getTextColour()}}>
                <div className={styles.carbonemojidiv}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><text font-family="Arial" font-size="150" x="-10" y="150">{this.state.emojiAnswer}</text></svg>
                </div>
                <div className={styles.carbontextdiv}>
                  <div className={styles.carbonanswerdiv}>
                    {this.state.mainAnswer}
                  </div>
                </div>
              </div>
              <div className={styles.carbonstatusdiv}>data processed from {this.props.apiUrl}</div>
            </div>
            ):
            (
            <div>
              <div className={styles.carboninfo} style={{backgroundColor: '#3474eb'}}>
                <div className={styles.carbonemojidiv}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><text font-family="Arial" font-size="150" x="-10" y="150">&#129300;</text></svg>
                </div>
                <div className={styles.carbontextdiv}>&nbsp;
                </div>
              </div>
              <div className={styles.carbonstatusdiv}>having a think about it...</div>
            </div>
            )
        ):(
          <div>
            <div className={styles.carboninfo} style={{backgroundColor: '#3474eb'}}>
              <div className={styles.carbonemojidiv}>
                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><text font-family="Arial" font-size="150" x="-10" y="150">&#129300;</text></svg>
              </div>
              <div className={styles.carbontextdiv}>&nbsp;
              </div>
            </div>
            <div className={styles.carbonstatusdiv}>still trying to figure this all out...</div>
          </div>
        )}
      </section>
    );
  }
}
