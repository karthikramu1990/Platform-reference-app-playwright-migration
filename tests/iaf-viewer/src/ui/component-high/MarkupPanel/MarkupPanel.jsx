// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 02-07-24    HSK        PLAT-4840   Develop Markup Edit Panel attached to the Main Vertical Toolbar
// 16-Jun-24   HSK        PLAT-4987   UX & API | Enabled | updateMarkupSelectionEnabled(enable)
// -------------------------------------------------------------------------------------


import React, { useEffect, useState } from "react";
import { IafHeading } from "../../component-low/iafHeading/IafHeading.jsx";
import { IafSubHeader } from "../../component-low/iafSubHeader/IafSubHeader.jsx";
import ColorPicker from "../../component-low/IafColorPicker/ColorPicker.jsx";
import { IafMarkupManager } from "../../../core/IafMarkupManager.js";
import { IafRenderMarkup3DTextbox, IafRenderMarkupTextbox } from "../../../core/markups/IafRenderMarkup.js";
import { IafDropdown } from "../../component-low/iafDropdown/IafDropdown.jsx";
import TooltipStore from "../../../store/tooltipStore.js";
import { IafSlider } from "../../component-low/iafSlider/IafSlider.jsx";
import { IafSwitch } from "../../component-low/iafSwitch/IafSwitch.jsx";
import { IafMathUtils } from "../../../core/IafMathUtils.js";
import { IafObjectUtils } from "../../../core/IafUtils.js";
import { IafRenderMarkupImage } from "../../../core/markups/IafRenderMarkupImage.js";

const FONT_TYPES = [
    { label: "monospace", value: "monospace" },
    { label: "arial", value: "arial" },
]

export default function MarkupPanel({title, panelCount, showContent, showContentMethod, onClose, color, markupManager, markupUuid, markupItem, setMarkupManagerState}) {
    const [colorProperties, setColorProperties] = useState({
        strokeColor: {r: 0, g: 0, b: 0, a: 1},
        fillColor: {r: 255, g: 255, b: 255, a: 1},
        boundaryColor: {r: 255, g: 0, b: 0, a: 1},
        boundaryFillColor: {r: 255, g: 255, b: 255, a: 1},
        fillColorOpacity: 0,
    })

    const [displayUnits, setDisplayUnits] = useState(IafMathUtils.getDisplayUnits(markupManager.iafViewer));
    const [strokeWidth, setStrokeWidth] = useState(1);
    // const [sizeInDisplayUnits, setSizeInDisplayUnits] = useState(markupManager.getDefaultMarkupSizeInDisplayUnits().toFixed(1));

    const [markupState, setMarkupState] = useState({
        visibility: false,
        isSelectable: false,
        isStickyCameraOn: false,
    })

    const [textProperties, setTextProperties] = useState({
        style: { label: "monospace", value: "monospace" },
        fontSize: 12,
        fontColor: {r: 0, g: 0, b: 0},
        leaderVisibility: true,
        leaderThickness: 2,
        borderThickness: 2,
        leaderColor: {r: 0, g: 0, b: 0},
        borderColor: {r: 0, g: 0, b: 0},
        showRectangleBorder: false,
        sizeInDisplayUnits: markupManager.getDefaultMarkupSizeInDisplayUnits().toFixed(1),
        imageAlignment: { label: IafMathUtils.ImageAlignment.Center, value: IafMathUtils.ImageAlignment.Center }
    });

    function handleColorChange(entityName, color) {
        setColorProperties(prev => {
            return {
                ...prev,
                [entityName]: color
            }
        })
        
        switch (title) {
            case IafMarkupManager.MarkupType.LINE:
                markupManager.updateMarkupLineColor(markupUuid, color);
                break;
            case IafMarkupManager.MarkupType.CIRCLE:
                markupManager.updateMarkupCircleColor(markupUuid, color);
                break;
            case IafMarkupManager.MarkupType.POLYLINE:
                markupManager.updateMarkupPolylineColor(markupUuid, color);
                break;
            case IafMarkupManager.MarkupType.FREEHAND:
                markupManager.updateMarkupFreehandColor(markupUuid, color);
                break;
            case IafMarkupManager.MarkupType.POLYGON:
                markupManager.updateMarkupPolygonColor(markupUuid, color);
                break;
            case IafMarkupManager.MarkupType.SPRITE:
                markupManager.updateMarkupImageLineColor(markupUuid, color);
                break;
            case IafMarkupManager.MarkupType.LEADENOTE:
            case IafMarkupManager.MarkupType.TEXT:{
                markupManager.updateMarkupTextRectangleColor(markupUuid, color);
                markupManager.updateMarkupTextLineColor(markupUuid, color);
                break;
            }
            case IafMarkupManager.MarkupType.RECTANGLE:
                markupManager.updateMarkupRectangleColor(markupUuid, color);
                break;
        }
    }

    function handleFillColorChange(entityName, color) {
        setColorProperties(prev => {
            return {
                ...prev,
                [entityName]: color
            }
        })
        
        switch (title) {
            case IafMarkupManager.MarkupType.CIRCLE:
                markupManager.updateMarkupCircleFillColor(markupUuid, color);
                break;
            case IafMarkupManager.MarkupType.SPRITE:
                markupManager.updateMarkupImageBackgroundColor(markupUuid, color);
                break;
            case IafMarkupManager.MarkupType.LEADERNOTE:
            case IafMarkupManager.MarkupType.TEXT:
                markupManager.updateMarkupTextBackgroundColor(markupUuid, color);
                break;
            case IafMarkupManager.MarkupType.RECTANGLE:
                markupManager.updateMarkupRectangleFillColor(markupUuid, color);
                break;
        }
    }

    function handleSubmenuTitle(title) {
        return IafMarkupManager.MarkupTypeTitle[title]
        .toLowerCase()
        .replace(/(^\w|\s\w)/g, match => match.toUpperCase());
    }

    function handleSelectedFont(event) {
        setTextProperties(prev => {
            return {
                ...prev,
                style: { label: event.target.value, value: event.target.value }
            }
        })
        markupManager.updateMarkupTextFontName(markupUuid, event.target.value);
    }

    function handleSelectedImageAlignment(event) {
        setTextProperties(prev => {
            return {
                ...prev,
                imageAlignment: { label: event.target.value, value: event.target.value }
            }
        })
        markupManager.updateMarkupImageAlignment(markupUuid, event.target.value);
    }    

    function handleTextColorProperties(name, color) {
        setTextProperties(prev => {
            return {
                ...prev,
                [name]: color
            }
        })
        switch (name) {
            case "borderColor":
                markupManager.updateMarkupTextRectangleColor(markupUuid, color);
                break;
            case "fontColor":
                markupManager.updateMarkupTextFontColor(markupUuid, color);
                break;
            default:
                break;
        }
    }
    
    function handleToggleRectangleBorder(event) {
        const sw =  event.target.checked ? parseFloat(((textProperties.borderThickness+10)/11).toFixed(2)) : 0
        
        setTextProperties(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.checked
            }
        })
        switch (event.target.name) {
            case "showRectangleBorder":
                markupManager.updateMarkupTextToggleRectangle(markupUuid, event.target.checked);
                markupManager.updateMarkupTextRectangleThickness(markupUuid, sw);
                break;
            default:
                break;
        }
    }

    function handleSliderInputChange(event, newValue, targetName) {
        setTextProperties(prev => {
            return {
                ...prev,
                [targetName]: newValue
            }
        })

        switch (targetName) {
            case "fontSize":
                markupManager.updateMarkupTextFontSize(markupUuid, newValue);
                break;
            case "borderThickness":
                const strokeWidth = parseFloat(((newValue+10)/11).toFixed(2))
                markupManager.updateMarkupTextRectangleThickness(markupUuid, strokeWidth);
                break;
            case "sizeInDisplayUnits":
                const sizeInDisplayUnits = newValue;
                markupManager.updateMarkupImageSizeInModelUnits(markupUuid, IafMathUtils.displayUnits2modelUnits(markupManager.iafViewer, markupManager.viewer, sizeInDisplayUnits));
                break;
            default:
                break;
        }
    }

    function handleFillOpacity(event, newValue, targetName) {
        const opacity = parseFloat(newValue/100);

        setColorProperties(prev => {
            return {
                ...prev,
                fillColorOpacity: newValue
            }
        })

        switch (title) {
            case IafMarkupManager.MarkupType.CIRCLE:
                markupManager.updateMarkupCircleFillOpacity(markupUuid, opacity);
                break;
            case IafMarkupManager.MarkupType.RECTANGLE:
                markupManager.updateMarkupRectangleFillOpacity(markupUuid, opacity);
                break;
            case IafMarkupManager.MarkupType.SPRITE:
                markupManager.updateMarkupImageBackgroundTransparency(markupUuid, opacity);
                break;
            case IafMarkupManager.MarkupType.LEADERNOTE:
            case IafMarkupManager.MarkupType.TEXT:
                markupManager.updateMarkupTextBackgroundTransparency(markupUuid, opacity);
            default:
                break;
        }
    }

    function handleFillOpacity(event, newValue, targetName) {
        const opacity = parseFloat(newValue/100);

        setColorProperties(prev => {
            return {
                ...prev,
                fillColorOpacity: newValue
            }
        })

        switch (title) {
            case IafMarkupManager.MarkupType.CIRCLE:
                markupManager.updateMarkupCircleFillOpacity(markupUuid, opacity);
                break;
            case IafMarkupManager.MarkupType.RECTANGLE:
                markupManager.updateMarkupRectangleFillOpacity(markupUuid, opacity);
                break;
            case IafMarkupManager.MarkupType.SPRITE:
                markupManager.updateMarkupImageBackgroundTransparency(markupUuid, opacity);
                break;
            case IafMarkupManager.MarkupType.LEADERNOTE:
            case IafMarkupManager.MarkupType.TEXT:
                markupManager.updateMarkupTextBackgroundTransparency(markupUuid, opacity);
            default:
                break;
        }
    }

    function handleStrokeWidth(event, newValue, targetName) {
        const strokeWidth = parseFloat(((newValue+10)/11).toFixed(2))
        setStrokeWidth(newValue)
        switch (title) {
            case IafMarkupManager.MarkupType.LINE:
                markupManager.updateMarkupLineThickness(markupUuid, strokeWidth);
                break;
            case IafMarkupManager.MarkupType.CIRCLE:
                markupManager.updateMarkupCircleThickness(markupUuid, strokeWidth);
                break;
            case IafMarkupManager.MarkupType.POLYLINE:
                markupManager.updateMarkupPolylineThickness(markupUuid, strokeWidth);
                break;
            case IafMarkupManager.MarkupType.FREEHAND:
                markupManager.updateMarkupFreehandThickness(markupUuid, strokeWidth);
                break;
            case IafMarkupManager.MarkupType.POLYGON:
                markupManager.updateMarkupPolygonThickness(markupUuid, strokeWidth);
                break;
            case IafMarkupManager.MarkupType.SPRITE:
                markupManager.updateMarkupImageRectangleThickness(markupUuid, strokeWidth);
                break;
            case IafMarkupManager.MarkupType.LEADERNOTE:
            case IafMarkupManager.MarkupType.TEXT:
                markupManager.updateMarkupTextRectangleThickness(markupUuid, strokeWidth);
                break;
            case IafMarkupManager.MarkupType.RECTANGLE:
                markupManager.updateMarkupRectangleThickness(markupUuid, strokeWidth);
                break;
        }
    }

    // function handleSizeInModelUnits(event, newValue, targetName) {
    //     const sizeInDisplayUnits = parseFloat(newValue).toFixed(1)
    //     setSizeInDisplayUnits(sizeInDisplayUnits)
    //     switch (title) {
    //         case IafMarkupManager.MarkupType.SPRITE:
    //             markupManager.updateMarkupImageSizeInModelUnits(markupUuid, IafMathUtils.displayUnits2modelUnits(markupManager.iafViewer, markupManager.viewer, sizeInDisplayUnits));
    //             break;
    //         default:
    //             break;
    //     }
    // }    

    function handleMarkupState(event) {
        setMarkupState(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.checked,
            }
        })

        switch (event.target.name) {
            case "visibility":
                markupManager.toggleMarkup(markupUuid, event.target.checked);
                setMarkupManagerState(prev => {
                    return {
                        ...prev,
                        showAllMarkup: markupManager.showAllMarkup
                    }
                })
                break;
            case "isSelectable":
                markupManager.updateMarkupSelectionEnabled(markupUuid, event.target.checked);
                setMarkupManagerState(prev => {
                    return {
                        ...prev,
                        enabledAllMarkup: markupManager.enabledAllMarkup
                    }
                })
                break;
            case "isStickyCameraOn":
                markupManager.toggleStickyCamera(markupUuid, event.target.checked);
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        if (!markupItem) return;
        setColorProperties(prev => {
            return {
                strokeColor: markupItem._styleConfig.strokeColor ? markupItem._styleConfig.strokeColor : prev.strokeColor,
                fillColor: markupItem._styleConfig.fillColor ? markupItem._styleConfig.fillColor : prev.fillColor,
                boundaryColor: markupItem._styleConfig.endCircleStrokeColor ? markupItem._styleConfig.endCircleStrokeColor : prev.boundaryColor,
                boundaryFillColor: markupItem._styleConfig.endCircleFillColor ? markupItem._styleConfig.endCircleFillColor : prev.boundaryFillColor,
                fillColorOpacity: markupItem._styleConfig.fillOpacity ? parseInt(markupItem._styleConfig.fillOpacity*100) : parseInt(prev.fillColorOpacity*100)
            }
        })

        setMarkupState({
            visibility: !markupItem.isHidden(),
            isSelectable: markupItem.getIsSelectable(),
            isStickyCameraOn: markupItem._isStickyCameraOn,
        });
        // PLAT-5035 Annotation icon should update to active annotation only if Repeat Last mode is ON | IafMarkupManager.enableRepeatMode(enable)
        setMarkupManagerState({
            showAllMarkup: markupManager.showAllMarkup,
            enabledAllMarkup: markupManager.enabledAllMarkup,
            repeatLastMode: markupManager.repeatLastMode
        })

        setStrokeWidth(prev => parseInt(((markupItem._styleConfig.strokeWidth || 3)*11)-10));

        if (markupItem instanceof IafRenderMarkup3DTextbox) {
            let textSettings = markupItem.getCurrentMarkupItem().textSettings;
            setTextProperties(prev => {
                return {
                    ...prev,
                    style: { label: textSettings.textFont, value: textSettings.textFont },
                    fontSize: textSettings.textFontDisplaySize,
                    showRectangleBorder: markupItem._styleConfig.showRectangleBorder,
                    borderColor: markupItem._styleConfig.strokeColor,
                    borderThickness: parseInt(((markupItem._styleConfig.strokeWidth || 3)*11)-10)
                }
            })
        } else if (markupItem instanceof IafRenderMarkupTextbox) {
            setTextProperties(prev => {
                return {
                    ...prev,
                    style: { label: markupItem._styleConfig.font, value: markupItem._styleConfig.font },
                    fontSize: parseInt(markupItem._styleConfig.fontSize.slice(0, -2)),
                    fontColor: markupItem._styleConfig.fontColor,
                }
            })
        } else if (markupItem instanceof IafRenderMarkupImage) {
            let textSettings = markupItem.getCurrentMarkupItem().textSettings;
            let sizeInDisplayUnits = IafMathUtils.modelUnits2displayUnits(markupManager.iafViewer, markupManager.viewer, textSettings.sizeInModelUnits).toFixed(1);
            setTextProperties(prev => {
                return {
                    ...prev,
                    sizeInDisplayUnits,
                    imageAlignment: { label: textSettings.imageAlignment, value: textSettings.imageAlignment }
                    // style: { label: textSettings.textFont, value: textSettings.textFont },
                    // fontSize: textSettings.textFontDisplaySize,
                    // showRectangleBorder: markupItem._styleConfig.showRectangleBorder,
                    // borderColor: markupItem._styleConfig.strokeColor,
                    // borderThickness: parseInt(((markupItem._styleConfig.strokeWidth || 3)*11)-10)
                }
            })
        }

        return () => {
            setColorProperties({
                strokeColor: {r: 252, g: 220, b: 0, a: 1},
                fillColor: {r: 252, g: 220, b: 0, a: 1},
                boundaryColor: {r: 252, g: 220, b: 0, a: 1},
                boundaryFillColor: {r: 252, g: 220, b: 0, a: 1},
                fillColorOpacity: 1
            })
            setTextProperties(prev => {
                return {
                    ...prev,
                    style: { label: "monospace", value: "monospace" },
                    fontSize: 12,
                }
            })
            setStrokeWidth(1);
            setMarkupState({
                visibility: false,
                isSelectable: false,
                isStickyCameraOn: false,
            });
            setMarkupManagerState({
                showAllMarkup: false,
                enabledAllMarkup: false
                // repeatLastMode: false
            })
        }
    }, [markupUuid])

    return (
        <>
            <IafHeading title={`${handleSubmenuTitle(title)}`} showContent={showContent} showContentMethod={showContentMethod} onClose={onClose} color={color} panelCount={panelCount}>
                <div>
                    <IafSubHeader title = {"Stroke"} minimized={false}>
                        <ColorPicker
                            name="strokeColor"
                            title="Color"
                            currentColor={colorProperties.strokeColor}
                            handleColorChange={(name, color) => handleColorChange(name, color)}
                        />
                        <IafSlider
                            title="Thickness"
                            min={1}
                            max={100}
                            id="markupThickness"
                            value={strokeWidth}
                            label={strokeWidth}
                            name="markupThickness"
                            onChange={handleStrokeWidth}
                            step={1}
                            showValue={true}
                            tooltipText = {TooltipStore.MarkupThickness}
                        ></IafSlider>
                        {[IafMarkupManager.MarkupType.SPRITE].includes(title) && <IafSlider
                            title={`Size in Display Units (${displayUnits})`}
                            min={1.0}
                            max={100.0}
                            id="sizeInDisplayUnits"
                            value={textProperties.sizeInDisplayUnits}
                            label={textProperties.sizeInDisplayUnits}
                            name="sizeInDisplayUnits"
                            onChange={handleSliderInputChange}
                            // onChange={handleSizeInModelUnits}
                            step={0.1}
                            showValue={true}
                            tooltipText = {TooltipStore.SizeInModelUnits}
                        ></IafSlider>}
                        {[IafMarkupManager.MarkupType.SPRITE].includes(title) && <IafDropdown
                            // disabled={true}
                            showTitle={true}
                            title="Alignment"
                            value={textProperties.imageAlignment.value}
                            label={textProperties.imageAlignment.label}
                            onChange={handleSelectedImageAlignment}
                            data={IafObjectUtils.dropdownData(IafMathUtils.ImageAlignment)}
                        ></IafDropdown> }                        
                        {/* <IafSlider
                            disabled={true}
                            title="Overlapping Order"
                            min={1}
                            max={100}
                            id="markupOrder"
                            value={1}
                            label={1}
                            name="markupOrder"
                            // onChange={handleMarkupOrder}
                            step={1}
                            showValue={true}
                            tooltipText = {TooltipStore.Empty}
                        ></IafSlider>                         */}
                    </IafSubHeader>
                    {[IafMarkupManager.MarkupType.RECTANGLE, IafMarkupManager.MarkupType.CIRCLE, IafMarkupManager.MarkupType.LEADERNOTE, IafMarkupManager.MarkupType.TEXT].includes(title) && <IafSubHeader title = {"Fill"} minimized={false}>
                        {[IafMarkupManager.MarkupType.RECTANGLE, IafMarkupManager.MarkupType.CIRCLE, IafMarkupManager.MarkupType.LEADERNOTE, IafMarkupManager.MarkupType.TEXT].includes(title) && <ColorPicker
                            name="fillColor"
                            title="Color"
                            currentColor={colorProperties.fillColor}
                            handleColorChange={(name, color) => handleFillColorChange(name, color)}
                        />}
                        {[IafMarkupManager.MarkupType.RECTANGLE, IafMarkupManager.MarkupType.CIRCLE, IafMarkupManager.MarkupType.LEADERNOTE, IafMarkupManager.MarkupType.TEXT].includes(title) && <IafSlider
                            title="Opacity"
                            min={1}
                            max={100}
                            id="fillColorOpacity"
                            value={colorProperties.fillColorOpacity}
                            label={colorProperties.fillColorOpacity}
                            name="fillColorOpacity"
                            onChange={handleFillOpacity}
                            step={1}
                            showValue={true}
                            tooltipText = {TooltipStore.MarkupOpacity}
                        ></IafSlider>}
                    </IafSubHeader> }
                    {[IafMarkupManager.MarkupType.LEADERNOTE, IafMarkupManager.MarkupType.TEXT].includes(title) && <IafSubHeader title = {"Font"} minimized={false}>
                        {[IafMarkupManager.MarkupType.LEADERNOTE, IafMarkupManager.MarkupType.TEXT].includes(title) && <IafDropdown
                            showTitle={true}
                            title="Style"
                            value={textProperties.style.value}
                            label={textProperties.style.label}
                            onChange={handleSelectedFont}
                            data={FONT_TYPES}
                        ></IafDropdown> }
                        {[IafMarkupManager.MarkupType.LEADERNOTE, IafMarkupManager.MarkupType.TEXT].includes(title) && <IafSlider
                            title="Size"
                            min={1}
                            max={26}
                            id="fontSize"
                            value={textProperties.fontSize}
                            label={textProperties.fontSize}
                            name="fontSize"
                            onChange={handleSliderInputChange}
                            step={1}
                            showValue={true}
                            tooltipText = {TooltipStore.FontSize}
                        ></IafSlider> }
                        {[IafMarkupManager.MarkupType.LEADERNOTE, IafMarkupManager.MarkupType.TEXT].includes(title) && <ColorPicker
                            name="fontColor"
                            title="Color"
                            currentColor={textProperties.fontColor}
                            handleColorChange={(name, color) => handleTextColorProperties(name, color)}
                        /> }
                    </IafSubHeader> }
                    <IafSubHeader title = {"Enablers"} minimized={false}>
                        <IafSwitch
                            title={"Show"}
                            tooltipTitle={TooltipStore.Empty}
                            isChecked={markupState.visibility}
                            width='100%' 
                            onChange={handleMarkupState}
                            name="visibility"
                        ></IafSwitch>
                        <IafSwitch
                            title={"Enabled"}
                            tooltipTitle={TooltipStore.Empty}
                            isChecked={markupState.isSelectable}
                            width='100%' 
                            onChange={handleMarkupState}
                            name="isSelectable"
                        ></IafSwitch>
                        <IafSwitch
                            title={"Sticky Camera"}
                            tooltipTitle={TooltipStore.Empty}
                            isChecked={markupState.isStickyCameraOn}
                            width='100%' 
                            onChange={handleMarkupState}
                            name="isStickyCameraOn"
                        ></IafSwitch>
                    </IafSubHeader>
                    {/* <IafSubHeader title = {"Advanced"} minimized={true}>
                        <IafSwitch
                            title={"Automatic"}
                            tooltipTitle={TooltipStore.Empty}
                            isChecked={true}
                            width='100%' 
                        ></IafSwitch>                                 
                        {[IafMarkupManager.MarkupType.LEADERNOTE, IafMarkupManager.MarkupType.TEXT].includes(title) && <ColorPicker
                            disabled={true}
                            name="leaderColor"
                            title="Leader Color"
                            currentColor={textProperties.leaderColor}
                            handleColorChange={(name, color) => handleTextColorProperties(name, color)}
                        /> }
                        {[IafMarkupManager.MarkupType.LEADERNOTE, IafMarkupManager.MarkupType.TEXT].includes(title) && <ColorPicker
                            disabled={true}
                            name="borderColor"
                            title="Border Color"
                            currentColor={textProperties.borderColor}
                            handleColorChange={(name, color) => handleTextColorProperties(name, color)}
                        /> }
                        {[IafMarkupManager.MarkupType.LEADERNOTE, IafMarkupManager.MarkupType.TEXT].includes(title) && <IafSlider
                            disabled={true}
                            title="Leader Thickness"
                            min={1}
                            max={100}
                            id="leaderThickness"
                            value={textProperties.leaderThickness}
                            label={textProperties.leaderThickness}
                            name="leaderThickness"
                            onChange={handleSliderInputChange}
                            step={1}
                            showValue={true}
                            tooltipText = {TooltipStore.FontSize}
                        ></IafSlider> }
                        {[IafMarkupManager.MarkupType.LEADERNOTE, IafMarkupManager.MarkupType.TEXT].includes(title) && <IafSlider
                            disabled={!textProperties.showRectangleBorder}
                            title="Border Thickness"
                            min={1}
                            max={100}
                            id="borderThickness"
                            value={textProperties.borderThickness}
                            label={textProperties.borderThickness}
                            name="borderThickness"
                            onChange={handleSliderInputChange}
                            step={1}
                            showValue={true}
                            tooltipText = {TooltipStore.FontSize}
                        ></IafSlider> }
                         <IafSwitch
                            title={"Show Border"}
                            tooltipTitle={TooltipStore.Empty}
                            isChecked={textProperties.showRectangleBorder}
                            onChange={handleToggleRectangleBorder}
                            width='100%' 
                            name="showRectangleBorder"
                        ></IafSwitch>        
                        {/* {["LINE", "CIRCLE", "RECTANGLE", "POLYLINE"].includes(title) && false && <ColorPicker
                            name="boundaryColor"
                            title="Boundary Color"
                            currentColor={colorProperties.boundaryColor}
                            handleColorChange={(name, color) => handleColorChange(name, color)}
                        />}
                        {["LINE", "CIRCLE", "RECTANGLE", "POLYLINE"].includes(title) && false && <ColorPicker
                            name="boundaryFillColor"
                            title="Boundary Fill Color"
                            currentColor={colorProperties.boundaryFillColor}
                            handleColorChange={(name, color) => handleColorChange(name, color)}
                        />} }                        
                    </IafSubHeader>*/}
                </div>
            </IafHeading>
        </>
    );
}
