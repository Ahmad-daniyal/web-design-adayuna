import { Router } from './router.js';
import { App } from './app.js';
import { Auth } from '../services/auth.js';
import { Settings } from '../services/settings.js';
import { Forum } from '../services/forum.js';
import { Matching } from '../services/buddy.js';
import { initTheme } from './theme.js';
import { preloadData } from '../data/index.js';

initTheme();

window.Auth = Auth;
window.Settings = Settings;
window.Forum = Forum;
window.Matching = Matching;
window.App = App;
window.Router = Router;

await preloadData();

Router.init();
App.init();
Auth.init();
