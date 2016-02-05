/**

Jupyter notebook extension which automatically saves a 'ClassName.py' file when
a cell declaring a 'class ClassName' runs. It does this by extracting the class
name and re-running the cell contents with a %%writefile magic command.

Install by downloading it to a local "nbextensions" folder:

* $HOME/.local/share/jupyter/nbextensions
* $(ipython locate)/nbextensions

Activate by adding the following to a code cell of your notebook:

%%javascript
require(['base/js/utils'], function(utils) {
	utils.load_extensions('autosaveclasses');
});

 */

define(
	['base/js/namespace'],
	function(Jupyter) {
		return {
			load_ipython_extension: function() {
				Jupyter.notebook.kernel.events.on(
					'execution_request.Kernel',
					function(event, data) {
						var content = data.content;
						var code = data.content.code;

						if ((content.silent) ||
							(code.indexOf('%%writefile') == 0)) {
							return;
						}

						var re = /^class\s*(\w+)[^:]*:/m;
						var match_result = re.exec(code);

						if (match_result == null) {
							return;
						}

						var class_name = match_result[1];
						var magic = '%%writefile ' + class_name + '.py';

						Jupyter.notebook.kernel.execute(
							magic + '\n' + code,
							undefined, { silent: true });
					}
				);
			}
		};
	}
);