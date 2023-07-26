import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'CarbonApiSummaryWebPartStrings';
import CarbonApiSummary from './components/CarbonApiSummary';
import { ICarbonApiSummaryProps } from './components/ICarbonApiSummaryProps';

export interface ICarbonApiSummaryWebPartProps {
  description: string;
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

export default class CarbonApiSummaryWebPart extends BaseClientSideWebPart<ICarbonApiSummaryWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ICarbonApiSummaryProps> = React.createElement(
      CarbonApiSummary,
      {
        chatGPTKey: this.properties.chatGPTKey,
        chatGPTOrg: this.properties.chatGPTOrg,
        apiUrl: this.properties.apiUrl,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        context: this.context,
        mainQuestion: this.properties.mainQuestion,
        mainSystem: this.properties.mainSystem,
        colourQuestion: this.properties.colourQuestion,
        colourSystem: this.properties.colourSystem,
        emojiQuestion: this.properties.emojiQuestion,
        emojiSystem: this.properties.emojiSystem
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected onAfterPropertyPaneChangesApplied(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
    this.render();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.ConfigGroupName,
              groupFields: [
                PropertyPaneTextField('apiUrl', {
                  label: "Url of API"
                }),
                PropertyPaneTextField('chatGPTKey', {
                  label: "chat gpt key"
                }),
                PropertyPaneTextField('chatGPTOrg', {
                  label: "chat gpt org ID"
                })
              ]
            },
            {
              groupName: strings.MainQuestionGroupName,
              groupFields: [
                PropertyPaneTextField('mainQuestion', {
                  label: "Main question to query data",
                  multiline: true,
                  rows: 3                  
                }),
                PropertyPaneTextField('mainSystem', {
                  label: "system message to use when running question",
                  multiline: true,
                  rows: 3   
                })
              ]
            },
            {
              groupName: strings.ColourQuestionGroupName,
              groupFields: [
                PropertyPaneTextField('colourQuestion', {
                  label: "Question to query data which should return a hex colour",
                  multiline: true,
                  rows: 3   
                }),
                PropertyPaneTextField('colourSystem', {
                  label: "system message to use when running question",
                  multiline: true,
                  rows: 3   
                })
              ]
            },
            {
              groupName: strings.EmojiQuestionGroupName,
              groupFields: [
                PropertyPaneTextField('emojiQuestion', {
                  label: "Question to query data which should return an emoji",
                  multiline: true,
                  rows: 3   
                }),
                PropertyPaneTextField('emojiSystem', {
                  label: "system message to use when running question",
                  multiline: true,
                  rows: 3   
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
