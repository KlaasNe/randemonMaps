import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.css';


const App: React.FC = () => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [activeChat, setActiveChat] = useState<number>(null);
    const [activeUsername, setActiveUsername] = useState<String>('');
    const [chatType, setChatType] = useState<"dm" | "group">("dm");

    return (
        <>
            <header>
            </header>
            <main>
                <div data-bs-theme="dark" className="container text-body bg-body">
                    <div className="navbar-brand text-center p-2 mb-1">
                        <h1 className="m-0"><span className="text-danger"><strong>Rand</strong></span><span
                            className="text-light"><strong>emon</strong></span></h1>
                    </div>

                    <div className="row">
                        <div className="col-12 col-lg-8 pe-lg-2 mb-4 mb-lg-0">

                            {/*main image*/}
                            <div className="mb-4">
                                <img onClick={open_in_new_tab()} className="img-fluid mb-2"
                                     alt="Latest generated randemon map"
                                     id="latest"/>
                                <div className="d-flex justify-content-center">
                                    <div className="spinner-border mb-2" id="loading-img" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                                <div id="latest-buttons">
                                    <div className="d-grid mb-2">
                                        <a className="btn btn-primary" id="downloadBtn" download="randemonMap.png">
                                            <img src="assets/bootstrap-icons/download.svg" alt="Bootstrap"
                                                 width="16" height="16"/>
                                            Save
                                        </a>
                                    </div>
                                    <div className="row g-2">
                                        <div className="col-6 col-sm-3">
                                            <div className="d-grid h-100">
                                                <button onClick="keep_latest_map()" className="btn btn-outline-primary"
                                                        id="keepMap">
                                                    {/*<img src="assets/bootstrap-icons/plus-square.svg" style="color: white;" alt="Bootstrap"-->*/}
                                                    {/*width="12" height="12"/>*/}
                                                    Keep
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-6 col-sm-3">
                                            <div className="d-grid h-100">
                                                <button onClick="copy_seed_to_clipboard()"
                                                        className="btn btn-outline-secondary"
                                                        id="copySeed">
                                                    Copy seed
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-6 col-sm-3">
                                            <div className="d-grid h-100">
                                                <button onClick="open_in_new_tab()"
                                                        className="btn btn-outline-secondary"
                                                        id="openInNewTab">
                                                    Open in new tab
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-6 col-sm-3">
                                            <div className="d-grid h-100">
                                                <button onClick="reload_map(0)" className="btn btn-outline-warning"
                                                        id="reload">
                                                    Restore settings
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*main image*/}

                            {/*user input*/}
                            <div className="pt-3 border-top">
                                <div className="inputs">
                                    <div className="row mb-3">
                                        <div className="col-md-8 col-12">
                                            <label for="seed" className="form-label">Seed</label>
                                            <div className="input-group mb-2">
                                                <input type="number" className="form-control text-body bg-body"
                                                       id="seed"
                                                       min="0"
                                                       max="9223372036854775807"
                                                       aria-describedby="The seed used for randomization"
                                                       autocomplete="false"/>
                                                <button onClick="clear_seed_input()"
                                                        className="btn btn-outline-secondary">clear
                                                </button>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col-6">
                                                    <div className="form-check">
                                                        <input type="checkbox" className="form-check-input bg-body"
                                                               id="heightMap"/>
                                                        <label className="form-check-label text-body" for="heightMap">Render
                                                            height map
                                                            only</label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input type="checkbox" className="form-check-input bg-body"
                                                               id="islandMode" checked/>
                                                        <label className="form-check-label text-body"
                                                               for="islandMode">Island</label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input type="checkbox" className="form-check-input bg-body"
                                                               id="themedTowns" checked/>
                                                        <label className="form-check-label text-body" for="themedTowns">Themed
                                                            towns</label>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <label for="maxBuildings" className="form-label">Max
                                                        buildings</label>
                                                    <input type="number" className="form-control text-body bg-body"
                                                           id="maxBuildings" value="16"
                                                           min="0"
                                                           aria-describedby="The maximal amount of buildings in a single
                                                        chunk"
                                                           autocomplete="false"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-12 mb-2">
                                            <div className="p-2 border rounded">
                                                <label for="chunkSize" className="form-label">Chunk size</label>
                                                <input type="number" className="form-control text-body bg-body"
                                                       id="chunkSize" value="50"
                                                       min="1" max="256"
                                                       aria-describedby="The number of tiles a side of a chunk consists of"
                                                       autocomplete="false"/>
                                                <div className="col-12">
                                                    <div className="row g-2">
                                                        <div className="col-lg-6 col-12">
                                                            <label for="nbChunksHorizontal"
                                                                   className="form-label">#Horizontal</label>
                                                            <input type="number"
                                                                   className="form-control text-body bg-body"
                                                                   id="nbChunksHorizontal"
                                                                   value="4" min="1"
                                                                   aria-describedby="The number of chunks horizontally
                                                                    the map should consist of"
                                                                   autocomplete="false"/>
                                                        </div>
                                                        <div className="col-lg-6 col-12">
                                                            <label for="nbChunksVertical"
                                                                   className="form-label">#Vertical</label>
                                                            <input type="number"
                                                                   className="form-control text-body bg-body"
                                                                   id="nbChunksVertical"
                                                                   value="4" min="1"
                                                                   aria-describedby="The number of chunks vertically
                                                                    the map should consist of"
                                                                   autocomplete="false"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-12">
                                            <div className="border rounded p-2">
                                                <div className="form-check form-switch pb-2 mb-1 border-bottom"
                                                     onChange={update_townmap_availability()}>
                                                    <input type="checkbox" role="switch"
                                                           className="form-check-input bg-body" id="townMap"/>
                                                    <label className="form-check-label" for="townMap">Town map
                                                        overlay</label>
                                                </div>
                                                <div className="form-check">
                                                    <input type="radio" className="form-check-input bg-body"
                                                           id="topLeft"
                                                           name="townMap" value="TOPLEFT" checked disabled/>
                                                    <label className="form-check-label" for="topLeft">Top left</label>
                                                </div>
                                                <div className="form-check">
                                                    <input type="radio" className="form-check-input bg-body"
                                                           id="topRight"
                                                           name="townMap" value="TOPRIGHT" disabled/>
                                                    <label className="form-check-label" for="topRight">Top right</label>
                                                </div>
                                                <div className="form-check">
                                                    <input type="radio" className="form-check-input bg-body"
                                                           id="bottomLeft"
                                                           name="townMap" value="BOTTOMLEFT" disabled/>
                                                    <label className="form-check-label" for="bottomLeft">Bottom
                                                        left</label>
                                                </div>
                                                <div className="form-check">
                                                    <input type="radio" className="form-check-input bg-body"
                                                           id="bottomRight" name="townMap" value="BOTTOMRIGHT"
                                                           disabled/>
                                                    <label className="form-check-label" for="bottomRight">Bottom
                                                        right</label>
                                                </div>
                                                <label for="scaleSlider">Scale:
                                                    <span id="scale">x8</span>
                                                </label>
                                                <input type="range" className="form-range bg-body" id="scaleSlider"
                                                       min={0}
                                                       value={3} max={5} step={1} onInput={update_scale_value(value)}
                                                       disabled/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-grid">
                                    <button onClick={create_new_map()} className="btn btn-primary">
                                        <img src="assets/bootstrap-icons/terminal.svg" alt="Bootstrap"
                                             width="16" height="16"/>
                                        Generate
                                    </button>
                                </div>
                            </div>
                            {/*user input*/}

                        </div>

                        {/*Column with last 5 generated images*/}
                        <div className="col-12 col-lg-4 mt-lg-0 mt-2">
                            <div className="pt-lg-2 sticky-lg-top">
                                <div className="text-center"><h3 className="m-0">Previous maps</h3></div>
                                <div className="mt-3 border rounded center-text">
                                    <div className="navbar-nav navbar-nav-scroll"
                                      style={{
                                          '--bs-scroll-height': '100%',
                                          'maxHeight': '88vh',
                                        }}>
                                        <div
                                            className="d-lg-block d-flex flex-lg-column flex-row flex-nowrap pb-2 px-lg-2 ps-2"
                                            id="previous-maps"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="position-relative">
                            <button className="btn btn-secondary rounded-circle border border-light position-fixed"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#offcanvas-keep" aria-controls="offcanvas-keep"
                                    style={"width: 48px; height: 48px; bottom: 24px; right: 24px; box-shadow: 0 0.5rem 1rem rgba(0, 0, 0,.3)!important;"}>
                                <img src="assets/bootstrap-icons/list.svg" alt="Bootstrap"
                                     width="24" height="24"/>
                            </button>
                        </div>

                        {/*offcanvas*/}
                        <div className="container-fluid">
                            <div className="offcanvas offcanvas-start" tabindex="-1" id="offcanvas-keep">
                                <div className="offcanvas-header">
                                    <h5 className="offcanvas-title">Your collection</h5>
                                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"
                                            aria-label="Close"></button>
                                </div>
                                <div className="offcanvas-body">
                                    <small>
                                        This is where all maps are displayed that you want to keep temporarily.
                                    </small>
                                    <div className="row pt-2 gy-2" id="keep-maps"></div>
                                </div>
                            </div>
                        </div>
                        {/*offcanvas*/}

                    </div>
                </div>
            </main>
        </>
    )
}

export default App;
