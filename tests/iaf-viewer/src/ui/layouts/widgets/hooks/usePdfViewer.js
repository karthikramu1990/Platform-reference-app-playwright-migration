import { useEffect } from 'react';
import { WidgetIds } from '../../../../common/enums/widgets';
import EvmUtils from '../../../../common/evmUtils';

const usePDFViewer = (iafViewer, widgetModes, updateWidgetProperties) => {
  useEffect(() => {
    const pdfCondition = iafViewer.state.showPDF;

    const pdfWidget = widgetModes.find(widget => widget.evmId === EvmUtils.EVMMode.PdfViewer);
    if (pdfCondition !== pdfWidget?.properties.shouldRender) {
      updateWidgetProperties(EvmUtils.EVMMode.PdfViewer, { shouldRender: pdfCondition, visible: pdfCondition });
    }
  }, [iafViewer.state.showPDF, widgetModes, updateWidgetProperties]);
};

export default usePDFViewer;