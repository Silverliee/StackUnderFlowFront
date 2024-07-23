import { useEffect, useState } from "react";
import SearchScripts from "../Search/SearchScripts.jsx";

function MyNewScriptsList({
                           myScripts,
                           scriptsFoundFiltered,
                           display,
                           search,
                           handleDelete,
                           selectedScripts,
                           userId,
                           item,
                           page,
                           rowsPerPage,
                           scriptsFoundPaginated,
                           handleItemSelected,
                           handleChangePage,
                           handleChangeRowsPerPage,
                              handleOnClick,
    handleFavorite,
    handleUnfavorite
                       }) {

    return (
        <>
            <SearchScripts
                item={item}
                myScripts={myScripts}
                display={display}
                search={search}
                scriptsFoundFiltered={scriptsFoundFiltered}
                scriptsFoundPaginated={scriptsFoundPaginated}
                handleItemSelected={handleItemSelected}
                handleDelete={handleDelete}
                userId={userId}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                selectedScripts={selectedScripts}
                handleOnClick={handleOnClick}
                handleFavorite={handleFavorite}
                handleUnfavorite={handleUnfavorite}
            />
        </>
    );
}

export default MyNewScriptsList;
