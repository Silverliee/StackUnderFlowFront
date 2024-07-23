import React from "react";
import "./App.css";

import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import AuthProvider from "./hooks/AuthProvider";
import PrivateRoute from "./router/PrivateRoute";
import ExecutionPage from "./pages/ExecutionPage.jsx";
import ContactsPage from "./pages/ContactsPage";
import ScriptDetails from "./pages/ScriptDetails";
import ScriptVersionPage from "./pages/ScriptVersionPage";
import SearchScriptPage from "./pages/SearchScriptPage.jsx";
import LocalEditor from "./pages/LocalEditor";
import ProfilePage from "./pages/ProfilePage.jsx";
import SharingPage from "./pages/SharingPage.jsx";
import MessagePage from "./pages/MessagePage";
import GroupDetails from "./pages/GroupDetails";
import RelationsProvider from "./hooks/RelationsProvider.jsx";
import ScriptsProvider from "./hooks/ScriptsProvider.jsx";
import PersistentDrawerLeft from "./components/PersistentDrawerLeft.jsx";
import HomePage from "./pages/HomePage.jsx";
import NewScriptListPage from "./pages/NewScriptListPage.jsx";
import ContactDetails from "./pages/ContactDetails.jsx";
import {SnackbarProvider} from "notistack";
import NewLogin from "./pages/NewLogin.jsx";
import PipelineDetails from "./components/Pipeline/PipelineDetails.jsx";
import PipelinesPage from "./pages/PipelinesPage.jsx";

const App = () => {
	return (
		<SnackbarProvider maxSnack={3}>

		<div className="App">
			<Router>
				<AuthProvider>
					<RelationsProvider>
						<ScriptsProvider>
						<Routes>
						<Route exact path="/login" element={<NewLogin />} />
							<Route element={<PersistentDrawerLeft />}>

							<Route element={<PrivateRoute />}>FeedPage
								<Route path="/search" element={<SearchScriptPage />} />
								<Route path="/home" element={<HomePage />} />
								<Route path="/exec" element={<ExecutionPage />} />
								<Route path="/contacts" element={<ContactsPage />} />
								<Route path="/profile" element={<ProfilePage />} />
								<Route path="/share" element={<SharingPage />} />
								<Route exact path="/edit" element={<LocalEditor />} />
								<Route path="/message" element={<MessagePage />} />
								<Route
									path="/script/:scriptId/version"
									element={<ScriptVersionPage />}
								/>
								<Route path="/pipeline" element={<PipelineDetails />} />
								<Route path="/friend/:userId" element={<ContactDetails />} />
								<Route path="/group/:groupId/member/:userId" element={<ContactDetails />} />
								<Route path="/user/:userId" element={<ContactDetails />} />
								<Route path="/script/:scriptId" element={<ScriptDetails />} />
								<Route path="/pipelines/:pipelineId" element={<PipelineDetails />} />
								<Route path="/pipelines" element={<PipelinesPage />} />
								<Route path="/script" element={<NewScriptListPage />} />
								<Route path="/group/:groupId" element={<GroupDetails />} />
							</Route>
						</Route>
						<Route path="*" element={<Navigate to="/login" />} />
					</Routes>
						</ScriptsProvider>
					</RelationsProvider>
				</AuthProvider>
			</Router>
		</div>
		</SnackbarProvider>
	);
};

export default App;
