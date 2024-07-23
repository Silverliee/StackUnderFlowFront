import Pagination from "../Custom/UnstyledPaginationIntroduction.jsx";
import ScriptItem from "../Script/ScriptItem.jsx";

function SearchScripts({
	display,
	search,
	scriptsFoundFiltered,
	scriptsFoundPaginated,
	handleItemSelected,
	handleDelete,
	userId,
	page,
	rowsPerPage,
	handleChangePage,
	handleChangeRowsPerPage,
	selectedScripts,
	item,
	numberOfScripts,
	handleOnClick,
	handleUnfavorite,
	handleFavorite
}) {
	return (
		<>
			<div id="search-results" style={{ display: display }}>
				Results for: {search} {scriptsFoundFiltered?.length ?? 0} result(s)
				<div>
					{scriptsFoundPaginated?.map((script) => (
						<ScriptItem
							key={item + "-" + script.scriptId}
							script={script}
							handleItemSelected={handleItemSelected}
							handleDelete={handleDelete}
							userId={userId}
							handleOnClick={handleOnClick}
							check={
								selectedScripts
									? selectedScripts?.includes(script.scriptId.toString())
									: false
							}
							handleUnfavorite={handleUnfavorite}
							handleFavorite={handleFavorite}
						/>
					))}
				</div>
				<Pagination
					numberOfResults={numberOfScripts ? numberOfScripts : scriptsFoundFiltered.length}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
					page={page}
					rowsPerPage={rowsPerPage}
				/>
			</div>
		</>
	);
}

export default SearchScripts;
