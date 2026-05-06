import IafUtils from "../core/IafUtils.js";
export default class IafOperatorUtils {
    static IafOperatorPosition = {
        Navigation: 0,
        Operation: 1
    };

    static IafNavType = {
        NavOrbit: "Orbit",
        NavPan: "Pan",
        NavZoom: "Zoom",
        NavWalk: "Walk",
        NavTurnTable: "TurnTable"
    };

    static logOperatorStack = (viewer) => {
        let operatorStack = [];
        while (viewer.operatorManager.size()) {
        const id = viewer.operatorManager.pop();
        //   operatorStack.push({
        //     id,
        //     object: viewer.operatorManager.getOperator(id)
        //   });
        operatorStack.push(id);
        }
        IafUtils.devToolsIaf && console.log('IafOperatorUtils.logOperatorStack'
                        , '/operatorStack', operatorStack
                    );

        // console.log ('IafOperatorUtils.logOperatorStack'
        //                 , '/viewer.operatorManager.size(before)', viewer.operatorManager.size()
        //             );
        while (operatorStack.length) {
            // viewer.operatorManager.push(operatorStack.pop().id)
            viewer.operatorManager.push(operatorStack.pop())
        }

        // console.log ('IafOperatorUtils.logOperatorStack'
        //                 , '/viewer.operatorManager.size(after)', viewer.operatorManager.size()
        //             );

    }

    static popOperatorStack = (viewer) => {
        let operatorStack = [];
        while (viewer.operatorManager.size()) {
        const id = viewer.operatorManager.pop();
        operatorStack.push(id);
        }
        return operatorStack;
    }

    static pushOperatorStack = (viewer, operatorStack) => {
        while (operatorStack.length) {
        viewer.operatorManager.push(operatorStack.pop());
        }
    }

    static logIafOperators = (iafViewer) => {
        const viewer = iafViewer._viewer;

        const log = () => {
            IafUtils.devToolsIaf && console.log('IafOperatorUtils.logIafOperators'
                            , '/number of active operators', viewer.operatorManager.size()
                            , '/index of Pan', viewer.operatorManager.indexOf(Communicator.OperatorId.Pan)
                            , '/index of Orbit', viewer.operatorManager.indexOf(Communicator.OperatorId.Orbit)
                            , '/index of Zoom', viewer.operatorManager.indexOf(iafViewer.zoomOperatorId)
                            , '/index of Nav', viewer.operatorManager.indexOf(iafViewer.navOperatorId)
                            , '/index of Select', viewer.operatorManager.indexOf(iafViewer.selectOperatorId)
            );
        }
        log();
        setInterval(() => log(), 10000);
    }

    static clearNavigationOperators = (props) => {
        const { viewer } = props;
        let panOp = viewer.operatorManager.getOperator(Communicator.OperatorId.Pan)
        let orbitOp = viewer.operatorManager.getOperator(props.orbitOperatorId)
        let zoomOp = viewer.operatorManager.getOperator(props.zoomOperatorId)
        let navOp = viewer.operatorManager.getOperator(props.navOperatorId)

        viewer.operatorManager.remove(Communicator.OperatorId.Pan);
        viewer.operatorManager.remove(Communicator.OperatorId.Turntable);
        viewer.operatorManager.remove(props.orbitOperatorId);
        viewer.operatorManager.remove(props.zoomOperatorId);
        viewer.operatorManager.remove(props.navOperatorId);
        viewer.operatorManager.remove(props.walkOperatorId);

        panOp.clearMapping();
        zoomOp.clearMapping();
        navOp.clearMapping();
        orbitOp.clearMapping();

        return {
            viewer,
            panOp,
            orbitOp,
            zoomOp,
            navOp
        };
    }

    static setCameraNavigation = (props, navType) => {
        const { viewer } = props;
        
        if (!viewer || !viewer.operatorManager) return;

        IafUtils.devToolsIaf && console.log('IafOperatorUtils.setCameraNavigation'
            , '/panoperatorId', Communicator.OperatorId.Pan
            , '/selectOperatorId', props.selectOperatorId
            , '/navOperatorId', props.navOperatorId
            , '/zoomOperatorId', props.zoomOperatorId
            , '/orbitOperatorId', props.orbitOperatorId
        );

        IafUtils.devToolsIaf && console.log('IafOperatorUtils.setCameraNavigation', '/IafOperatorUtils.logOperatorStack-before');
        IafOperatorUtils.logOperatorStack(viewer);        

        const { navOp, panOp, zoomOp, orbitOp } = IafOperatorUtils.clearNavigationOperators(props);

        let operatorStack = IafOperatorUtils.popOperatorStack(viewer);

        switch (navType) {
            
            case IafOperatorUtils.IafNavType.NavPan:
                IafUtils.devToolsIaf && console.log('IafOperatorUtils.setCameraNavigation.NavPan');
                viewer.operatorManager.push(props.navOperatorId);
                panOp.setMapping(Communicator.Button.Left);
                zoomOp.setMapping(Communicator.Button.Middle);
                orbitOp.setMapping(Communicator.Button.Right)
                break;

            case IafOperatorUtils.IafNavType.NavZoom:
                IafUtils.devToolsIaf && console.log('IafOperatorUtils.setCameraNavigation.NavZoom');
                viewer.operatorManager.push(props.navOperatorId);
                zoomOp.setMapping(Communicator.Button.Left);
                orbitOp.setMapping(Communicator.Button.Middle)
                panOp.setMapping(Communicator.Button.Right);
                break;        

            case IafOperatorUtils.IafNavType.NavOrbit:
                IafUtils.devToolsIaf && console.log('IafOperatorUtils.setCameraNavigation.NavOrbit');
                viewer.operatorManager.push(props.navOperatorId);
                orbitOp.setMapping(Communicator.Button.Left)
                panOp.setMapping(Communicator.Button.Middle);
                zoomOp.setMapping(Communicator.Button.Right);
                break;

            case IafOperatorUtils.IafNavType.NavWalk:
                viewer.operatorManager.push(props.walkOperatorId);
                break;

            case IafOperatorUtils.IafNavType.NavTurnTable:
                viewer.operatorManager.push(Communicator.OperatorId.Turntable);
                break;    
    
            default:
                break;
        }
        
        IafOperatorUtils.pushOperatorStack(viewer, operatorStack);

        IafUtils.devToolsIaf && console.log('IafOperatorUtils.setCameraNavigation'
                        , '/panOperator', panOp
                        , '/navOperator', navOp
                        , '/zoomOperator', zoomOp
                        , '/orbitOperator', orbitOp
                    );
    
        IafUtils.devToolsIaf && console.log('IafOperatorUtils.setCameraNavigation', '/IafOperatorUtils.logOperatorStack-after');
        IafOperatorUtils.logOperatorStack(viewer);

        return {
            viewer,
            panOp,
            orbitOp,
            zoomOp,
            navOp
        };

    }
}
