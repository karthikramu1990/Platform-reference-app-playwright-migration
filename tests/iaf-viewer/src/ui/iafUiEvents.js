// gisEvents.js
import mitt from 'mitt';

export const iafUiEventBus = mitt();

export const IafUiEvent = {
    IafEventDisciplineEnable: 'IafEventDisciplineEnable',
}
