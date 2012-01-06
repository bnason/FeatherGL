# Standard things
.SUFFIXES:
.SUFFIXES:  .c .o .so

# Defaults
SRC_DIR        = Source
BUILD_DIR      = Build
PREFIX         = .
DIST_DIR       = $(PREFIX)/Dist
OUT_NAME       = FeatherGL

# Sources
SOURCE_NAMES   = FeatherGL Constants Enhancements Matrix Color Mesh Point Vector
SOURCE_NAMES  += Framebuffer WebGL Shaders Camera Light Scene View

# Variables
JS_ENGINE     ?= `which node nodejs 2>/dev/null`
COMPILER       = $(JS_ENGINE) $(BUILD_DIR)/uglify.js --unsafe
COMPILE_POST   = $(JS_ENGINE) $(BUILD_DIR)/compile-post.js
COMPILE_SHADER = $(JS_ENGINE) $(BUILD_DIR)/compile-shaders.js

OUT            = $(DIST_DIR)/$(OUT_NAME).js
OUT_MIN        = $(DIST_DIR)/$(OUT_NAME).min.js

VERSION        = sed "s/@VERSION/$(shell cat version.txt)/"
#DATE           = $(shell git log -1 --pretty=format:%ad)

SOURCE_FILES   = $(addsuffix .js, $(addprefix $(SRC_DIR)/, $(SOURCE_NAMES)))

SIZE           = $(shell stat --printf="%s" $(OUT))
SIZE_MIN       = $(shell stat --printf="%s" $(OUT_MIN))
SIZE_GZIP      = $(shell stat --printf="%s" $(OUT_MIN).gz)

MIN_PERCENT    = `echo "scale=2;" $(SIZE_MIN) / $(SIZE) \* 100 | bc`
GZIP_PERCENT   = `echo "scale=2;" $(SIZE_GZIP) / $(SIZE) \* 100 | bc`

# Rules
all: clean feathergl min size

feathergl: $(OUT)
	@@echo "FeatherGL build complete."

$(OUT): $(SOURCE_FILES) | $(DIST_DIR)
	@@echo "Building" $(OUT)
	@@tail --lines=+9 -q $(SOURCE_FILES) > $(OUT);

$(SRC_DIR)/Shaders.js:
	@@$(COMPILE_SHADER)

min: feathergl $(OUT_MIN)

$(OUT_MIN): $(OUT)
	@@if test ! -z $(JS_ENGINE); then \
		echo "Minifying FeatherGL" $(OUT_MIN); \
		$(COMPILER) $(OUT) > $(OUT_MIN).tmp; \
		$(COMPILE_POST) $(OUT_MIN).tmp > $(OUT_MIN); \
		rm -f $(OUT_MIN).tmp; \
	else \
		echo "You must have NodeJS installed in order to minify feather."; \
	fi

$(DIST_DIR):
	@@mkdir -p $(DIST_DIR)

lint: feathergl

size: feathergl min
ifdef JS_ENGINE
	@gzip -c $(OUT_MIN) > $(OUT_MIN).gz
	@echo "Original   : " $(SIZE) "bytes"
	@echo "Minified   : " $(SIZE_MIN) "bytes " $(MIN_PERCENT) "%"
	@echo "Compressed : " $(SIZE_GZIP) "bytes " $(GZIP_PERCENT) "%"
#	@rm $(OUT_MIN).gz
else
	@echo "You must have NodeJS installed in order to size FeatherGL.";
endif

docs:
	@cd $(DOCDIR)
	@doxygen doxygen.config

clean:
	@@echo "Removing Distribution directory:" $(DIST_DIR)
	@@rm -rf $(DIST_DIR)
	@@rm -f $(SRC_DIR)/Shaders.js

distclean: clean

.PHONY: all feathergl lint min clean distclean core