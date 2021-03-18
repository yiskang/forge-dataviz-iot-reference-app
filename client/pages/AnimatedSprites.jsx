/**
 * This sample illustrates the usage of dynamic sprite viewable.
 */

import React, { useRef, useState } from "react";
import { Viewer } from "forge-dataviz-iot-react-components";

import fan00 from "../../assets/images/fan-00.svg";
import fan01 from "../../assets/images/fan-01.svg";
import fan02 from "../../assets/images/fan-02.svg";
import fan03 from "../../assets/images/fan-03.svg";
import fan04 from "../../assets/images/fan-04.svg";
import fan05 from "../../assets/images/fan-04.svg";

import motionSvg from "../../assets/images/motion.svg";
import smileySvg from "../../assets/images/smiley.svg";

const fans = [fan00, fan01, fan02, fan03, fan04, fan05];

const sensorPositions = {
    "Exit 2": {
        x: -55.66762924194336,
        y: 88.7755241394043,
        z: -16.919677257537842,
    },
    "Restroom 2": {
        x: -65.71856307983398,
        y: 86.61837005615234,
        z: -16.919677257537842,
    },
    "Consulation Room 2": {
        x: -90.7604751586914,
        y: 87.13715362548828,
        z: -16.919677257537842,
    },
    "Main Entrance": {
        x: -105.57610702514648,
        y: -11.594642639160156,
        z: -16.919677257537842,
    },
    Cafeteria: {
        x: -143.30173110961914,
        y: 87.18759536743164,
        z: -16.919677257537842,
    },
    Lobby: {
        x: -132.45924377441406,
        y: 10.900766372680664,
        z: -10.544355034828186,
    },
    Administration: {
        x: -159.2780303955078,
        y: -1.8119175434112549,
        z: -16.919677257537842,
    },
    "Imaging & Radiology Lab": {
        x: -159.2780303955078,
        y: -50.4998254776001,
        z: -16.919677257537842,
    },
    "Consulation Room 1": {
        x: -126.44904327392578,
        y: -62.24671173095703,
        z: -16.919677257537842,
    },
    "Restroom 1": {
        x: -112.73586654663086,
        y: -66.04428291320801,
        z: -16.919677257537842,
    },
    "Medical Supplies": {
        x: -103.05361557006836,
        y: -66.04428291320801,
        z: -16.919677257537842,
    },
    "Diagnostic Labs": {
        x: -80.95461654663086,
        y: -62.41075134277344,
        z: -16.919677257537842,
    },
    "Lab Sample Storage": {
        x: -52.953880310058594,
        y: -62.41075134277344,
        z: -16.919677257537842,
    },
    "Blood Bank": {
        x: -23.426319122314453,
        y: -62.41075134277344,
        z: -16.919677257537842,
    },
    Pharmacy: {
        x: 6.101234436035156,
        y: -62.41075134277344,
        z: -16.919677257537842,
    },
    "Waiting Room": {
        x: 25.59398651123047,
        y: -62.41075134277344,
        z: -16.919677257537842,
    },
    "Exit 1": {
        x: 40.003883361816406,
        y: -63.63409614562988,
        z: -16.919677257537842,
    },
};

/**
 * @component
 * @param {Object} props
 */
function AnimatedSprites(props) {
    const { env, docUrn } = props.appData;
    const [dataVizExt, setDataVizExt] = useState(null);

    const dataVizExtRef = useRef(null);
    dataVizExtRef.current = dataVizExt;

    /**
     * Generates simulation data used for this sample app
     *
     * @returns {Object} The resulting simulation data in the following form:
     *
     *  const obj = [
     *      {
     *          id: "Cafeteria",
     *          position: { x: -143.3017, y: 87.1875, z: -16.9196 },
     *          type: "thermometer",
     *          sensorTypes: ["temperature"],
     *      },
     *      ...
     *  ];
     *
     *
     */
    function generateSimulationData() {
        const simulationData = [];
        for (let sensor in sensorPositions) {
            simulationData.push({
                id: sensor,
                position: sensorPositions[sensor],
                type: "thermometer",
                sensorTypes: ["temperature"],
            });
        }

        return simulationData;
    }

    /**
     * Generates viewables to be added to the view. These viewables are sprite-based objects
     * in the 3D viewer canvas, each representing a physical sensor in the real world.
     *
     * @param {Object} dataItems The simulation data generated in 'generateSimulationData'.
     * @returns {ViewableData} The resulting viewable data that carries all viewables.
     */
    async function generateViewableData(dataItems) {
        // Create a visual style shared by all the thermometers since they're the same type.
        const styleColor = 0xffffff;
        const dataVizExtn = Autodesk.DataVisualization.Core

        const ductFanStyle = new dataVizExtn.ViewableStyle(
            dataVizExtn.ViewableType.SPRITE,
            new THREE.Color(styleColor),
            fan00
        );

        
        fans.forEach((fan) => ductFanStyle.preloadSprite(fan));

        const motionStyle = new dataVizExtn.ViewableStyle(
            dataVizExtn.ViewableType.SPRITE,
            new THREE.Color(styleColor),
            motionSvg
        );

        const workerStyle = new dataVizExtn.ViewableStyle(
            dataVizExtn.ViewableType.SPRITE,
            new THREE.Color(styleColor),
            smileySvg
        );

        const viewableData = new dataVizExtn.ViewableData();
        viewableData.spriteSize = 24;

        const devices = [];
        dataItems.forEach((sensor) => {
            devices.push({
                id: sensor.id,
                position: sensor.position,
                type: sensor.type,
            });
        });

        const viewableStyles = [ductFanStyle, motionStyle, workerStyle];

        let viewableDbId = 1;
        devices.forEach((device, index) => {
            const style = viewableStyles[index % 3];
            const viewable = new dataVizExtn.SpriteViewable(device.position, style, viewableDbId);

            viewable.stepSize = 1;
            viewable.stepCount = 0;
            viewable.deltaOffset = { x: Math.random() * 2.0 - 1.0, y: Math.random() * 2.0 - 1.0 };
            viewable.objectTypeIndex = index % 3;
            viewableData.addViewable(viewable);
            viewableDbId++;
        });

        await viewableData.finish();
        return viewableData;
    }

    function getViewableIdsToAnimate(viewables) {
        let indices = viewables.map((v) => v.dbId);
        indices = indices.sort(() => Math.random() - 0.5); // Shuffle the list.
        return indices.slice(0, indices.length / 2); // Return half of list.
    }

    /**
     * Handles `Autodesk.Viewing.GEOMETRY_LOADED_EVENT` event that is sent
     * when a model has been completely loaded in the viewer.
     *
     * @param {Viewer3D} viewer The viewer in which the model is loaded.
     * @param {Object} data Event data that contains the loaded model.
     */
    async function onModelLoaded(viewer, data) {
        
        const dataVizExtension = await viewer.loadExtension("Autodesk.DataVisualization", { useInternal: true });

        const viewerDocument = data.model.getDocumentNode().getDocument();
        const aecModelData = await viewerDocument.downloadAecModelData();

        let levelsExtension = null;
        if (aecModelData) {
            levelsExtension = await viewer.loadExtension("Autodesk.AEC.LevelsExtension", {
                doNotCreateUI: true,
            });
        }

        if (levelsExtension) {
            levelsExtension.floorSelector.selectFloor(0, true);
        }

        const simulationData = generateSimulationData();

        const viewableData = await generateViewableData(simulationData);
        dataVizExtension.addViewables(viewableData);

        setDataVizExt(dataVizExtension);

        // Zoom in to "floor1" for a better view
        viewer.fitToView([1945]);

        // Get a random subset of viewables to animate.
        let globalIndex = 0;
        const animatedViewables = getViewableIdsToAnimate(viewableData.viewables);

        setInterval(() => {
            const i = globalIndex++ % 6;
            dataVizExtension.invalidateViewables(animatedViewables, (viewable) => {
                let updatedProperties = {};

                if (viewable.objectTypeIndex === 0) {
                    updatedProperties.url = fans[i];
                } else if (viewable.objectTypeIndex === 1) {
                    const blinkOn = i < 3 ? 1.0 : 0.0;
                    updatedProperties.color = { r: 1.0, g: blinkOn, b: blinkOn };
                } else {
                    viewable.stepCount += viewable.stepSize;
                    if (viewable.stepCount === 0) {
                        viewable.stepSize = -viewable.stepSize;
                    } else if (viewable.stepCount === 20) {
                        viewable.stepSize = -viewable.stepSize;
                    }

                    let offset_x = viewable.deltaOffset.x * viewable.stepCount;
                    let offset_y = viewable.deltaOffset.y * viewable.stepCount;

                    updatedProperties.position = {
                        x: viewable.position.x + offset_x,
                        y: viewable.position.y + offset_y,
                        z: viewable.position.z,
                    };
                }

                return updatedProperties;
            });
        }, 200); // Animate 5 times per-second.
    }

    return (
        <Viewer
            env={env}
            docUrn={docUrn}
            onModelLoaded={onModelLoaded}
            getToken={async () =>
                await fetch("/api/token")
                    .then((res) => res.json())
                    .then((data) => data.access_token)
            }
        />
    );
}

module.exports = AnimatedSprites;