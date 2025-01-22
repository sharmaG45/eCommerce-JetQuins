const notFound = () => {
    return (
        <div className="wd-page-content main-page-wrapper">
            <main
                className="wd-content-layout content-layout-wrapper container"
                role="main"
            >
                <div className="wd-content-area site-content">
                    <header className="page-header">
                        <h3 className="title">Not Found</h3>
                    </header>
                    <div className="page-content">
                        <h1>This is somewhat embarrassing, isn’t it?</h1>
                        <p>
                            It looks like nothing was found at this location. Maybe try a search?
                        </p>
                        <div className="wd-search-form">
                            <form
                                role="search"
                                method="get"
                                className="searchform  wd-cat-style-bordered"
                                action="https://woodmart.xtemos.com/mega-electronics/"
                            >
                                <input
                                    type="text"
                                    className="s"
                                    placeholder="Search for posts"
                                    defaultValue=""
                                    name="s"
                                    aria-label="Search"
                                    title="Search for posts"
                                    required=""
                                />
                                <input type="hidden" name="post_type" defaultValue="post" />
                                <button type="submit" className="searchsubmit">
                                    <span>Search </span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
export default notFound;