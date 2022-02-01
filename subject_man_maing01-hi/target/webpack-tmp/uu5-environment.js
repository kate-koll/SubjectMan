
var devConfig = require("C:\\Users\\kolle\\Documents\\Unicorn University\\2. rocnik\\uun_project_team_repo_BPMI21WPT17\\SubjectMan\\subject_man_maing01-hi\\env\\development.json").uu5Environment;
var config = require("C:\\Users\\kolle\\Documents\\Unicorn University\\2. rocnik\\uun_project_team_repo_BPMI21WPT17\\SubjectMan\\subject_man_maing01-hi\\env\\production.json").uu5Environment || {};
if (devConfig) for (var k in devConfig) config[k] = devConfig[k];
window.UU5 = { Environment: config };
