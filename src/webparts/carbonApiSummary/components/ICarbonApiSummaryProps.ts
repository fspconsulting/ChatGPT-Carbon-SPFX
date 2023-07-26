import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ICarbonApiSummaryProps {
  hasTeamsContext: boolean;

  context: WebPartContext;
  apiUrl: string;
  chatGPTKey: string;
  chatGPTOrg: string;
  mainQuestion: string;
  mainSystem: string;
  colourQuestion: string;
  colourSystem: string;
  emojiQuestion: string;
  emojiSystem: string;
}
