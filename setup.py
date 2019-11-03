import cx_Freeze
import sys

base = "Win32GUI"

# if sys.platform == 'win32':
#     base = "Win32GUI"

executables = [cx_Freeze.Executable("dictionary.py", base=base, icon="vocabulary.ico")]

cx_Freeze.setup(
    name = "Dictionary",
    options = {"build_exe": {"packages":["tkinter","datetime"], "include_files":["vocabulary.ico", "data/"]}},
    version = "2.0.0",
    description = "Ukrainian and russian dictionary",
    executables = executables
    )
