import { aliasData } from "../../http"
import Sidebar from "./Sidebar"
import { useEffect, useContext, useState } from "react";
import { CartContext } from "../../CartContext";
import Loader from "../Loader";
import Map from "../Map";
import MapLine from "../MapLine";
import axios from "axios";
import { getCodes } from "../../http";

const Line = () => {
    const { auth, setTargetpoint, setCoordinates, handlePoint, handleMapLine } = useContext(CartContext);
    const [data, setData] = useState(null);
    const [load, setLoad] = useState(true);

    const [selectedButton, setSelectedButton] = useState([]);
    const [mappingCodes, setMappingCodes] = useState({});

    const handleButtonClick = async (buttonName, file_id) => {
        const newData = file_id + ',' + buttonName;
        const updatedSelectedButton = selectedButton.filter(item => !item.startsWith(file_id));
        setSelectedButton([...updatedSelectedButton, newData]);
        console.log(newData);

        if (mappingCodes[file_id]) {
            console.log(mappingCodes[file_id][0]["as_code_100km"])
            console.log("Data already exists for file_id:", file_id);
            return; // Do nothing if data already exists
        }

        try {
            // Call the API to fetch data
            const { data } = await getCodes({ file_id: file_id });
            console.log(data);
            if (data && data.length > 0) {
                setMappingCodes(prevMappingData => ({
                    ...prevMappingData,
                    [file_id]: data
                }));
                console.log("Data fetched and stored for file_id:", file_id);
            } else {
                console.log("No data found for file_id:", file_id);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }

    };

    const [mapLine, setMapLine] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await aliasData({ alias: auth.user.alias, filetype: "line snap" });

                const selectedData = data.rows.map(element => element.file_id + ',gps');
                setSelectedButton(selectedData);

                setData(data.rows);
                setLoad(false);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const handleClick = (e, index) => {
        if (e.target.innerHTML === "Details") {
            document.querySelector(`.control${index}`).style.display = "block";
            e.target.innerHTML = "Hide";
        } else {
            document.querySelector(`.control${index}`).style.display = "none";
            e.target.innerHTML = "Details";
        }
    }

    const handleHoverClick = (element, latitude, longitude) => {
        setTargetpoint({ latitude, longitude });
        setMapLine(false);
        // console.log(element, latitude, longitude);
    }

    const handleLine = (latitude, longitude) => {
        let prevLat = '';
        let prevLng = '';
        const newCoordinates = latitude.map((lat, index) => {
            if (lat === '' || lat === prevLat || longitude[index] === prevLng) {
                return null;
            }
            prevLat = lat;
            prevLng = longitude[index];
            return {
                lat: lat,
                lng: longitude[index],
            };
        }).filter((coord) => coord !== null);
        setCoordinates(newCoordinates);
        setMapLine(true);
    }



    return (
        <div>
            <div className="mapDiv">
                <div className="container container2">
                    <Sidebar />
                    {(load) ? <Loader />
                        :
                        <div className="main-sec" style={{ display: "inline-block", width: "100%", overflowY: "scroll" }}>

                            {
                                (data !== null) &&
                                data.map((element, index) => {
                                    return (
                                        <div key={index}>
                                            <div className="minmized-p">
                                                <img src="/images/line.jpeg" alt="preview" />
                                                <span>{element.filename}</span>
                                                <span>{element.date}</span>
                                                <button onClick={(e) => { handleClick(e, index) }}>Details</button>
                                            </div>
                                            <div className={`card control${index}`}>
                                                <div className="preview-box">
                                                    <div className="cardInfo">
                                                        <p><span className="bold">Filename : </span>{element.filename}</p>
                                                        <p><span className="bold">Timestamp : </span>[ Date : {element.date} , Time : {element.time} ]</p>
                                                        <p><span className="bold">IP : </span>[ Address : {element.ip} , Type : {element.iptype} ]</p>
                                                        <p><span className="bold">Device : </span>[ Brand : {element.devicename} , Name : {element.devicetype} ]</p>
                                                    </div>
                                                </div>
                                                <div className="data-btns">
                                                    <button
                                                        className={selectedButton.includes(element.file_id + ',gps') ? 'selected' : ''}
                                                        onClick={() => handleButtonClick('gps', element.file_id)}
                                                    >
                                                        gps
                                                    </button>
                                                    <button
                                                        className={selectedButton.includes(element.file_id + ',100km') ? 'selected' : ''}
                                                        onClick={() => handleButtonClick('100km', element.file_id)}
                                                    >
                                                        100km
                                                    </button>
                                                    <button
                                                        className={selectedButton.includes(element.file_id + ',10km') ? 'selected' : ''}
                                                        onClick={() => handleButtonClick('10km', element.file_id)}
                                                    >
                                                        10km
                                                    </button>
                                                    <button
                                                        className={selectedButton.includes(element.file_id + ',1km') ? 'selected' : ''}
                                                        onClick={() => handleButtonClick('1km', element.file_id)}
                                                    >
                                                        1km
                                                    </button>
                                                    <button
                                                        className={selectedButton.includes(element.file_id + ',100m') ? 'selected' : ''}
                                                        onClick={() => handleButtonClick('100m', element.file_id)}
                                                    >
                                                        100m
                                                    </button>
                                                    <button
                                                        className={selectedButton.includes(element.file_id + ',10m') ? 'selected' : ''}
                                                        onClick={() => handleButtonClick('10m', element.file_id)}
                                                    >
                                                        10m
                                                    </button>
                                                    <button
                                                        className={selectedButton.includes(element.file_id + ',1m') ? 'selected' : ''}
                                                        onClick={() => handleButtonClick('1m', element.file_id)}
                                                    >
                                                        1m
                                                    </button>
                                                    <button
                                                        className={selectedButton.includes(element.file_id + ',100mm') ? 'selected' : ''}
                                                        onClick={() => handleButtonClick('100mm', element.file_id)}
                                                    >
                                                        100mm
                                                    </button>
                                                </div>
                                                {selectedButton.includes(element.file_id + ',gps') ?

                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>Latitude</th>
                                                                <th>Longitude</th>
                                                                <th>Timestamp</th>
                                                                <th className="iconp">
                                                                    Altitude(in Meter)
                                                                    <div>
                                                                        <img src="/images/compass.png" alt="map-icon" className="icon" onClick={() => { handleLine(element.latitude, element.longitude) }} />
                                                                        <img src="/images/map.png" alt="map-icon" className="icon" onClick={() => { handleMapLine(element.latitude, element.longitude) }} />
                                                                    </div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        {
                                                            (element.latitude) &&
                                                            element.latitude.map((item, index) => {
                                                                if (item !== '')
                                                                    return (
                                                                        <tbody key={index}>
                                                                            <tr>
                                                                                <td>{item}</td>
                                                                                <td>{element.longitude[index]}</td>
                                                                                <td>{element.timestamp[index]}</td>
                                                                                <td className="iconp">
                                                                                    {
                                                                                        (element.altitude) ?
                                                                                            element.altitude[index]
                                                                                            :
                                                                                            "no data"
                                                                                    }
                                                                                    <div>
                                                                                        <img src="/images/compass.png" alt="map-icon" className="icon" onClick={(e) => { handleHoverClick(e.target, item, element.longitude[index]) }} />
                                                                                        <img src="/images/map.png" alt="map-icon" className="icon" onClick={() => { handlePoint(item, element.longitude[index]) }} />
                                                                                    </div>
                                                                                </td>

                                                                            </tr>
                                                                        </tbody>
                                                                    )
                                                            })
                                                        }
                                                    </table>
                                                    :
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>Code</th>
                                                                <th className="iconp">
                                                                    Timestamp
                                                                    <div>
                                                                        <img src="/images/compass.png" alt="map-icon" className="icon" onClick={() => { handleLine(element.latitude, element.longitude) }} />
                                                                        <img src="/images/map.png" alt="map-icon" className="icon" onClick={() => { handleMapLine(element.latitude, element.longitude) }} />
                                                                    </div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        {/* {selectedButton.find(button => button.startsWith(element.file_id + ',')).split(',')[1]} */}
                                                        <tbody>
                                                            {
                                                                (mappingCodes[element.file_id]) &&
                                                                mappingCodes[element.file_id].map((item, index) => (
                                                                    <tr key={index}>
                                                                        <td>{item[`as_code_${selectedButton.find(button => button.startsWith(element.file_id + ',')).split(',')[1]}`]}</td>
                                                                        <td className="iconp">
                                                                            {item.timestamp}
                                                                            <div>
                                                                                <img src="/images/compass.png" alt="map-icon" className="icon" onClick={(e) => { handleHoverClick(e.target, item.latitude, item.longitude) }} />
                                                                                <img src="/images/map.png" alt="map-icon" className="icon" onClick={() => { handlePoint(item.latitude, item.longitude) }} />
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
                {
                    mapLine ?
                        <MapLine />
                        :
                        <Map />
                }
            </div>
            <footer>
                © 2022 THE GREEN BRIDGE Ingenieurgesellschaft mbH
            </footer>
        </div>
    )
}

export default Line