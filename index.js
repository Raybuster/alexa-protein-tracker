'use strict';

const Alexa = require('alexa-sdk');
const ProteinTracker = require('protein-tracker')

const APP_ID = 'amzn1.ask.skill.7bd8bda5-fed1-4d46-8d80-a62ca31e086c';
const TABLE_NAME = 'ProteinTracker';

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.resources = LANGUAGE_STRINGS;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AddGramsOfProtein': function () {
        const userId = this.event.session.user.userId;
        const gramsOfProtein = this.event.request.intent.slots.GramsOfProtein.value;
        const date = this.event.request.intent.slots.Date.value || this.event.request.timestamp.slice(0, 10);

        readGramsOfProtein(userId, date, function(err, result) {
            const currentGramsOfProtein = result.Item.gramsOfProtein.N;

            const cardTitle = this.t("ADD_PROTEIN_CARD_TITLE", this.t("SKILL_NAME"), gramsOfProtein);
            const speechOutput = this.t('ADD_PROTEIN_MESSAGE', gramsOfProtein) + currentGramsOfProtein;

            this.emit(':tellWithCard', speechOutput, cardTitle, null);
        });
    },
    'HowMuchProtein': function () {
        const userId = this.event.session.user.userId;
        const date = this.event.request.intent.slots.Date.value || this.event.request.timestamp.slice(0, 10);

        const gramsOfProtein = 20;

        const cardTitle = this.t("HOW_MUCH_PROTEIN_TODAY_CARD_TITLE", this.t("SKILL_NAME"), gramsOfProtein);
        const speechOutput = this.t('HOW_MUCH_PROTEIN_TODAY_MESSAGE', gramsOfProtein);

        this.emit(':tellWithCard', speechOutput, cardTitle, null);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};
