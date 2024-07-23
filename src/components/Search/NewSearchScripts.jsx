import Pagination from "../Custom/UnstyledPaginationIntroduction.jsx";
import ScriptItem from "../Script/ScriptItem.jsx";

function NewSearchScripts({
                           display,
                           search,
                           scriptsFound,
                           handleDelete,
                           userId,
                           page,
                           rowsPerPage,
                           handleChangePage,
                           handleChangeRowsPerPage,
                           selectedScripts,
                           item,
                           numberOfScripts,
                           handleItemSelected
                       }) {
    return (
        <>
            <div id="search-results" style={{ display: display }}>
                Results for: {search} {numberOfScripts} result(s)
                <div>
                    {scriptsFound?.map((script) => (
                        <ScriptItem
                            key={item + "-" + script.scriptId}
                            script={script}
                            handleItemSelected={handleItemSelected}
                            handleDelete={handleDelete}
                            userId={userId}
                            check={
                                selectedScripts
                                    ? selectedScripts?.includes(script.scriptId.toString())
                                    : false
                            }
                        />
                    ))}
                </div>
                <Pagination
                    numberOfResults={numberOfScripts}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    page={page}
                    rowsPerPage={rowsPerPage}
                />
            </div>
        </>
    );
}

export default NewSearchScripts;
