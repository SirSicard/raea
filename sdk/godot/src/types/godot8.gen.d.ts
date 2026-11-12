// AUTO-GENERATED
declare module "godot" {
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTextLine extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTextLine extends __NameMapRefCounted {
    }
    /** Holds a line of text.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_textline.html  
     */
    class TextLine extends RefCounted {
        constructor(identifier?: any)
        /** Clears text line (removes text and inline objects). */
        clear(): void
        
        /** Duplicates this [TextLine]. */
        duplicate(): null | TextLine
        
        /** Returns the text writing direction inferred by the BiDi algorithm. */
        get_inferred_direction(): TextServer.Direction
        
        /** Overrides BiDi for the structured text.  
         *  Override ranges should cover full source text without overlaps. BiDi algorithm will be used on each range separately.  
         */
        set_bidi_override(override: GArray): void
        
        /** Adds text span and font to draw it. */
        add_string(text: string, font: Font, font_size: int64, language?: string /* = '' */, meta?: any /* = {} */): boolean
        
        /** Adds inline object to the text buffer, [param key] must be unique. In the text, object is represented as [param length] object replacement characters. */
        add_object(key: any, size: Vector2, inline_align?: InlineAlignment /* = 5 */, length?: int64 /* = 1 */, baseline?: float64 /* = 0 */): boolean
        
        /** Sets new size and alignment of embedded object. */
        resize_object(key: any, size: Vector2, inline_align?: InlineAlignment /* = 5 */, baseline?: float64 /* = 0 */): boolean
        
        /** Returns `true` if an object with [param key] is embedded in this line. */
        has_object(key: any): boolean
        
        /** Aligns text to the given tab-stops. */
        tab_align(tab_stops: PackedFloat32Array | float32[]): void
        
        /** Returns array of inline objects. */
        get_objects(): GArray
        
        /** Returns bounding rectangle of the inline object. */
        get_object_rect(key: any): Rect2
        
        /** Returns size of the bounding box of the text. */
        get_size(): Vector2
        
        /** Returns TextServer buffer RID. */
        get_rid(): RID
        
        /** Returns the text ascent (number of pixels above the baseline for horizontal layout or to the left of baseline for vertical). */
        get_line_ascent(): float64
        
        /** Returns the text descent (number of pixels below the baseline for horizontal layout or to the right of baseline for vertical). */
        get_line_descent(): float64
        
        /** Returns width (for horizontal layout) or height (for vertical) of the text. */
        get_line_width(): float64
        
        /** Returns pixel offset of the underline below the baseline. */
        get_line_underline_position(): float64
        
        /** Returns thickness of the underline. */
        get_line_underline_thickness(): float64
        
        /** Draw text into a canvas item at a given position, with [param color]. [param pos] specifies the top left corner of the bounding box. If [param oversampling] is greater than zero, it is used as font oversampling factor, otherwise viewport oversampling settings are used. */
        draw(canvas: RID, pos: Vector2, color?: Color /* = new Color(1, 1, 1, 1) */, oversampling?: float64 /* = 0 */): void
        
        /** Draw text into a canvas item at a given position, with [param color]. [param pos] specifies the top left corner of the bounding box. If [param oversampling] is greater than zero, it is used as font oversampling factor, otherwise viewport oversampling settings are used. */
        draw_outline(canvas: RID, pos: Vector2, outline_size?: int64 /* = 1 */, color?: Color /* = new Color(1, 1, 1, 1) */, oversampling?: float64 /* = 0 */): void
        
        /** Returns caret character offset at the specified pixel offset at the baseline. This function always returns a valid position. */
        hit_test(coords: float64): int64
        
        /** Text writing direction. */
        get direction(): int64
        set direction(value: int64)
        
        /** Text orientation. */
        get orientation(): int64
        set orientation(value: int64)
        
        /** If set to `true` text will display invalid characters. */
        get preserve_invalid(): boolean
        set preserve_invalid(value: boolean)
        
        /** If set to `true` text will display control characters. */
        get preserve_control(): boolean
        set preserve_control(value: boolean)
        
        /** Text line width. */
        get width(): float64
        set width(value: float64)
        
        /** Sets text alignment within the line as if the line was horizontal. */
        get alignment(): int64
        set alignment(value: int64)
        
        /** Line alignment rules. For more info see [TextServer]. */
        get flags(): int64
        set flags(value: int64)
        
        /** The clipping behavior when the text exceeds the text line's set width. */
        get text_overrun_behavior(): int64
        set text_overrun_behavior(value: int64)
        
        /** Ellipsis character used for text clipping. */
        get ellipsis_char(): string
        set ellipsis_char(value: string)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTextLine;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTextLine;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTextMesh extends __RPCMapPrimitiveMesh {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTextMesh extends __NameMapPrimitiveMesh {
    }
    /** Generate a [PrimitiveMesh] from the text.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_textmesh.html  
     */
    class TextMesh extends PrimitiveMesh {
        constructor(identifier?: any)
        /** The text to generate mesh from.  
         *      
         *  **Note:** Due to being a [Resource], it doesn't follow the rules of [member Node.auto_translate_mode]. If disabling translation is desired, it should be done manually with [method Object.set_message_translation].  
         */
        get text(): string
        set text(value: string)
        
        /** Font configuration used to display text. */
        get font(): null | Font
        set font(value: null | Font)
        
        /** Font size of the [TextMesh]'s text. This property works in tandem with [member pixel_size]. Higher values will result in a more detailed font, regardless of [member curve_step] and [member pixel_size]. Consider keeping this value below 63 (inclusive) for good performance, and adjust [member pixel_size] as needed to enlarge text.  
         *      
         *  **Note:** Changing this property will regenerate the mesh, which is a slow operation, especially with large font sizes and long texts. To change the text's size in real-time efficiently, change the node's [member Node3D.scale] instead.  
         */
        get font_size(): int64
        set font_size(value: int64)
        
        /** Controls the text's horizontal alignment. Supports left, center, right, and fill (also known as justify). */
        get horizontal_alignment(): int64
        set horizontal_alignment(value: int64)
        
        /** Controls the text's vertical alignment. Supports top, center, and bottom. */
        get vertical_alignment(): int64
        set vertical_alignment(value: int64)
        
        /** If `true`, all the text displays as UPPERCASE. */
        get uppercase(): boolean
        set uppercase(value: boolean)
        
        /** Additional vertical spacing between lines (in pixels), spacing is added to line descent. This value can be negative. */
        get line_spacing(): float64
        set line_spacing(value: float64)
        
        /** If set to something other than [constant TextServer.AUTOWRAP_OFF], the text gets wrapped inside the node's bounding rectangle. If you resize the node, it will change its height automatically to show all the text. */
        get autowrap_mode(): int64
        set autowrap_mode(value: int64)
        
        /** Line fill alignment rules. */
        get justification_flags(): int64
        set justification_flags(value: int64)
        
        /** The size of one pixel's width on the text to scale it in 3D. This property works in tandem with [member font_size].  
         *      
         *  **Note:** Changing this property will regenerate the mesh, which is a slow operation, especially with large font sizes and long texts. To change the text's size in real-time efficiently, change the node's [member Node3D.scale] instead.  
         */
        get pixel_size(): float64
        set pixel_size(value: float64)
        
        /** Step (in pixels) used to approximate Bézier curves. Lower values result in smoother curves, but is slower to generate and render. Consider adjusting this according to the font size and the typical viewing distance.  
         *      
         *  **Note:** Changing this property will regenerate the mesh, which is a slow operation, especially with large font sizes and long texts.  
         */
        get curve_step(): float64
        set curve_step(value: float64)
        
        /** Depths of the mesh, if set to `0.0` only front surface, is generated, and UV layout is changed to use full texture for the front face only. */
        get depth(): float64
        set depth(value: float64)
        
        /** Text width (in pixels), used for fill alignment. */
        get width(): float64
        set width(value: float64)
        
        /** The text drawing offset (in pixels).  
         *      
         *  **Note:** Changing this property will regenerate the mesh, which is a slow operation. To change the text's position in real-time efficiently, change the node's [member Node3D.position] instead.  
         */
        get offset(): Vector2
        set offset(value: Vector2)
        
        /** Base text writing direction. */
        get text_direction(): int64
        set text_direction(value: int64)
        
        /** Language code used for line-breaking and text shaping algorithms. If left empty, the current locale is used instead. */
        get language(): string
        set language(value: string)
        
        /** Set BiDi algorithm override for the structured text. */
        get structured_text_bidi_override(): int64
        set structured_text_bidi_override(value: int64)
        
        /** Set additional options for BiDi override. */
        get structured_text_bidi_override_options(): GArray
        set structured_text_bidi_override_options(value: GArray)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTextMesh;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTextMesh;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTextParagraph extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTextParagraph extends __NameMapRefCounted {
    }
    /** Holds a paragraph of text.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_textparagraph.html  
     */
    class TextParagraph extends RefCounted {
        constructor(identifier?: any)
        /** Clears text paragraph (removes text and inline objects). */
        clear(): void
        
        /** Duplicates this [TextParagraph]. */
        duplicate(): null | TextParagraph
        
        /** Returns the text writing direction inferred by the BiDi algorithm. */
        get_inferred_direction(): TextServer.Direction
        
        /** Overrides BiDi for the structured text.  
         *  Override ranges should cover full source text without overlaps. BiDi algorithm will be used on each range separately.  
         */
        set_bidi_override(override: GArray): void
        
        /** Sets drop cap, overrides previously set drop cap. Drop cap (dropped capital) is a decorative element at the beginning of a paragraph that is larger than the rest of the text. */
        set_dropcap(text: string, font: Font, font_size: int64, dropcap_margins?: Rect2 /* = new Rect2(0, 0, 0, 0) */, language?: string /* = '' */): boolean
        
        /** Removes dropcap. */
        clear_dropcap(): void
        
        /** Adds text span and font to draw it. */
        add_string(text: string, font: Font, font_size: int64, language?: string /* = '' */, meta?: any /* = {} */): boolean
        
        /** Adds inline object to the text buffer, [param key] must be unique. In the text, object is represented as [param length] object replacement characters. */
        add_object(key: any, size: Vector2, inline_align?: InlineAlignment /* = 5 */, length?: int64 /* = 1 */, baseline?: float64 /* = 0 */): boolean
        
        /** Sets new size and alignment of embedded object. */
        resize_object(key: any, size: Vector2, inline_align?: InlineAlignment /* = 5 */, baseline?: float64 /* = 0 */): boolean
        
        /** Returns `true` if an object with [param key] is embedded in this shaped text buffer. */
        has_object(key: any): boolean
        
        /** Aligns paragraph to the given tab-stops. */
        tab_align(tab_stops: PackedFloat32Array | float32[]): void
        
        /** Returns the size of the bounding box of the paragraph, without line breaks. */
        get_non_wrapped_size(): Vector2
        
        /** Returns the size of the bounding box of the paragraph. */
        get_size(): Vector2
        
        /** Returns TextServer full string buffer RID. */
        get_rid(): RID
        
        /** Returns TextServer line buffer RID. */
        get_line_rid(line: int64): RID
        
        /** Returns drop cap text buffer RID. */
        get_dropcap_rid(): RID
        
        /** Returns the character range of the paragraph. */
        get_range(): Vector2i
        
        /** Returns number of lines in the paragraph. */
        get_line_count(): int64
        
        /** Returns array of inline objects in the line. */
        get_line_objects(line: int64): GArray
        
        /** Returns bounding rectangle of the inline object. */
        get_line_object_rect(line: int64, key: any): Rect2
        
        /** Returns size of the bounding box of the line of text. Returned size is rounded up. */
        get_line_size(line: int64): Vector2
        
        /** Returns character range of the line. */
        get_line_range(line: int64): Vector2i
        
        /** Returns the text line ascent (number of pixels above the baseline for horizontal layout or to the left of baseline for vertical). */
        get_line_ascent(line: int64): float64
        
        /** Returns the text line descent (number of pixels below the baseline for horizontal layout or to the right of baseline for vertical). */
        get_line_descent(line: int64): float64
        
        /** Returns width (for horizontal layout) or height (for vertical) of the line of text. */
        get_line_width(line: int64): float64
        
        /** Returns pixel offset of the underline below the baseline. */
        get_line_underline_position(line: int64): float64
        
        /** Returns thickness of the underline. */
        get_line_underline_thickness(line: int64): float64
        
        /** Returns drop cap bounding box size. */
        get_dropcap_size(): Vector2
        
        /** Returns number of lines used by dropcap. */
        get_dropcap_lines(): int64
        
        /** Draw all lines of the text and drop cap into a canvas item at a given position, with [param color]. [param pos] specifies the top left corner of the bounding box. If [param oversampling] is greater than zero, it is used as font oversampling factor, otherwise viewport oversampling settings are used. */
        draw(canvas: RID, pos: Vector2, color?: Color /* = new Color(1, 1, 1, 1) */, dc_color?: Color /* = new Color(1, 1, 1, 1) */, oversampling?: float64 /* = 0 */): void
        
        /** Draw outlines of all lines of the text and drop cap into a canvas item at a given position, with [param color]. [param pos] specifies the top left corner of the bounding box. If [param oversampling] is greater than zero, it is used as font oversampling factor, otherwise viewport oversampling settings are used. */
        draw_outline(canvas: RID, pos: Vector2, outline_size?: int64 /* = 1 */, color?: Color /* = new Color(1, 1, 1, 1) */, dc_color?: Color /* = new Color(1, 1, 1, 1) */, oversampling?: float64 /* = 0 */): void
        
        /** Draw single line of text into a canvas item at a given position, with [param color]. [param pos] specifies the top left corner of the bounding box. If [param oversampling] is greater than zero, it is used as font oversampling factor, otherwise viewport oversampling settings are used. */
        draw_line(canvas: RID, pos: Vector2, line: int64, color?: Color /* = new Color(1, 1, 1, 1) */, oversampling?: float64 /* = 0 */): void
        
        /** Draw outline of the single line of text into a canvas item at a given position, with [param color]. [param pos] specifies the top left corner of the bounding box. If [param oversampling] is greater than zero, it is used as font oversampling factor, otherwise viewport oversampling settings are used. */
        draw_line_outline(canvas: RID, pos: Vector2, line: int64, outline_size?: int64 /* = 1 */, color?: Color /* = new Color(1, 1, 1, 1) */, oversampling?: float64 /* = 0 */): void
        
        /** Draw drop cap into a canvas item at a given position, with [param color]. [param pos] specifies the top left corner of the bounding box. If [param oversampling] is greater than zero, it is used as font oversampling factor, otherwise viewport oversampling settings are used. */
        draw_dropcap(canvas: RID, pos: Vector2, color?: Color /* = new Color(1, 1, 1, 1) */, oversampling?: float64 /* = 0 */): void
        
        /** Draw drop cap outline into a canvas item at a given position, with [param color]. [param pos] specifies the top left corner of the bounding box. If [param oversampling] is greater than zero, it is used as font oversampling factor, otherwise viewport oversampling settings are used. */
        draw_dropcap_outline(canvas: RID, pos: Vector2, outline_size?: int64 /* = 1 */, color?: Color /* = new Color(1, 1, 1, 1) */, oversampling?: float64 /* = 0 */): void
        
        /** Returns caret character offset at the specified coordinates. This function always returns a valid position. */
        hit_test(coords: Vector2): int64
        
        /** Text writing direction. */
        get direction(): int64
        set direction(value: int64)
        
        /** Custom punctuation character list, used for word breaking. If set to empty string, server defaults are used. */
        get custom_punctuation(): string
        set custom_punctuation(value: string)
        
        /** Text orientation. */
        get orientation(): int64
        set orientation(value: int64)
        
        /** If set to `true` text will display invalid characters. */
        get preserve_invalid(): boolean
        set preserve_invalid(value: boolean)
        
        /** If set to `true` text will display control characters. */
        get preserve_control(): boolean
        set preserve_control(value: boolean)
        
        /** Paragraph horizontal alignment. */
        get alignment(): int64
        set alignment(value: int64)
        
        /** Line breaking rules. For more info see [TextServer]. */
        get break_flags(): int64
        set break_flags(value: int64)
        
        /** Line fill alignment rules. */
        get justification_flags(): int64
        set justification_flags(value: int64)
        
        /** The clipping behavior when the text exceeds the paragraph's set width. */
        get text_overrun_behavior(): int64
        set text_overrun_behavior(value: int64)
        
        /** Ellipsis character used for text clipping. */
        get ellipsis_char(): string
        set ellipsis_char(value: string)
        
        /** Paragraph width. */
        get width(): float64
        set width(value: float64)
        
        /** Limits the lines of text shown. */
        get max_lines_visible(): int64
        set max_lines_visible(value: int64)
        
        /** Additional vertical spacing between lines (in pixels), spacing is added to line descent. This value can be negative. */
        get line_spacing(): float64
        set line_spacing(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTextParagraph;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTextParagraph;
    }
    namespace TextServer {
        enum FontAntialiasing {
            /** Font glyphs are rasterized as 1-bit bitmaps. */
            FONT_ANTIALIASING_NONE = 0,
            
            /** Font glyphs are rasterized as 8-bit grayscale anti-aliased bitmaps. */
            FONT_ANTIALIASING_GRAY = 1,
            
            /** Font glyphs are rasterized for LCD screens.  
             *  LCD subpixel layout is determined by the value of the [member ProjectSettings.gui/theme/lcd_subpixel_layout] setting.  
             *  LCD subpixel anti-aliasing mode is suitable only for rendering horizontal, unscaled text in 2D.  
             */
            FONT_ANTIALIASING_LCD = 2,
        }
        enum FontLCDSubpixelLayout {
            /** Unknown or unsupported subpixel layout, LCD subpixel antialiasing is disabled. */
            FONT_LCD_SUBPIXEL_LAYOUT_NONE = 0,
            
            /** Horizontal RGB subpixel layout. */
            FONT_LCD_SUBPIXEL_LAYOUT_HRGB = 1,
            
            /** Horizontal BGR subpixel layout. */
            FONT_LCD_SUBPIXEL_LAYOUT_HBGR = 2,
            
            /** Vertical RGB subpixel layout. */
            FONT_LCD_SUBPIXEL_LAYOUT_VRGB = 3,
            
            /** Vertical BGR subpixel layout. */
            FONT_LCD_SUBPIXEL_LAYOUT_VBGR = 4,
            
            /** Represents the size of the [enum FontLCDSubpixelLayout] enum. */
            FONT_LCD_SUBPIXEL_LAYOUT_MAX = 5,
        }
        enum Direction {
            /** Text direction is determined based on contents and current locale. */
            DIRECTION_AUTO = 0,
            
            /** Text is written from left to right. */
            DIRECTION_LTR = 1,
            
            /** Text is written from right to left. */
            DIRECTION_RTL = 2,
            
            /** Text writing direction is the same as base string writing direction. Used for BiDi override only. */
            DIRECTION_INHERITED = 3,
        }
        enum Orientation {
            /** Text is written horizontally. */
            ORIENTATION_HORIZONTAL = 0,
            
            /** Left to right text is written vertically from top to bottom.  
             *  Right to left text is written vertically from bottom to top.  
             */
            ORIENTATION_VERTICAL = 1,
        }
        enum JustificationFlag {
            /** Do not justify text. */
            JUSTIFICATION_NONE = 0,
            
            /** Justify text by adding and removing kashidas. */
            JUSTIFICATION_KASHIDA = 1,
            
            /** Justify text by changing width of the spaces between the words. */
            JUSTIFICATION_WORD_BOUND = 2,
            
            /** Remove trailing and leading spaces from the justified text. */
            JUSTIFICATION_TRIM_EDGE_SPACES = 4,
            
            /** Only apply justification to the part of the text after the last tab. */
            JUSTIFICATION_AFTER_LAST_TAB = 8,
            
            /** Apply justification to the trimmed line with ellipsis. */
            JUSTIFICATION_CONSTRAIN_ELLIPSIS = 16,
            
            /** Do not apply justification to the last line of the paragraph. */
            JUSTIFICATION_SKIP_LAST_LINE = 32,
            
            /** Do not apply justification to the last line of the paragraph with visible characters (takes precedence over [constant JUSTIFICATION_SKIP_LAST_LINE]). */
            JUSTIFICATION_SKIP_LAST_LINE_WITH_VISIBLE_CHARS = 64,
            
            /** Always apply justification to the paragraphs with a single line ([constant JUSTIFICATION_SKIP_LAST_LINE] and [constant JUSTIFICATION_SKIP_LAST_LINE_WITH_VISIBLE_CHARS] are ignored). */
            JUSTIFICATION_DO_NOT_SKIP_SINGLE_LINE = 128,
        }
        enum AutowrapMode {
            /** Autowrap is disabled. */
            AUTOWRAP_OFF = 0,
            
            /** Wraps the text inside the node's bounding rectangle by allowing to break lines at arbitrary positions, which is useful when very limited space is available. */
            AUTOWRAP_ARBITRARY = 1,
            
            /** Wraps the text inside the node's bounding rectangle by soft-breaking between words. */
            AUTOWRAP_WORD = 2,
            
            /** Behaves similarly to [constant AUTOWRAP_WORD], but force-breaks a word if that single word does not fit in one line. */
            AUTOWRAP_WORD_SMART = 3,
        }
        enum LineBreakFlag {
            /** Do not break the line. */
            BREAK_NONE = 0,
            
            /** Break the line at the line mandatory break characters (e.g. `"\n"`). */
            BREAK_MANDATORY = 1,
            
            /** Break the line between the words. */
            BREAK_WORD_BOUND = 2,
            
            /** Break the line between any unconnected graphemes. */
            BREAK_GRAPHEME_BOUND = 4,
            
            /** Should be used only in conjunction with [constant BREAK_WORD_BOUND], break the line between any unconnected graphemes, if it's impossible to break it between the words. */
            BREAK_ADAPTIVE = 8,
            
            /** Remove edge spaces from the broken line segments. */
            BREAK_TRIM_EDGE_SPACES = 16,
            
            /** Subtract first line indentation width from all lines after the first one. */
            BREAK_TRIM_INDENT = 32,
            
            /** Remove spaces and line break characters from the start of broken line segments.  
             *  E.g, after line breaking, the second segment of the following text `test  \n  next`, is `next` if the flag is set, and `  next` if it is not.  
             */
            BREAK_TRIM_START_EDGE_SPACES = 64,
            
            /** Remove spaces and line break characters from the end of broken line segments.  
             *  E.g, after line breaking, the first segment of the following text `test  \n  next`, is `test` if the flag is set, and `test  \n` if it is not.  
             */
            BREAK_TRIM_END_EDGE_SPACES = 128,
        }
        enum VisibleCharactersBehavior {
            /** Trims text before the shaping. e.g, increasing [member Label.visible_characters] or [member RichTextLabel.visible_characters] value is visually identical to typing the text.  
             *      
             *  **Note:** In this mode, trimmed text is not processed at all. It is not accounted for in line breaking and size calculations.  
             */
            VC_CHARS_BEFORE_SHAPING = 0,
            
            /** Displays glyphs that are mapped to the first [member Label.visible_characters] or [member RichTextLabel.visible_characters] characters from the beginning of the text. */
            VC_CHARS_AFTER_SHAPING = 1,
            
            /** Displays [member Label.visible_ratio] or [member RichTextLabel.visible_ratio] glyphs, starting from the left or from the right, depending on [member Control.layout_direction] value. */
            VC_GLYPHS_AUTO = 2,
            
            /** Displays [member Label.visible_ratio] or [member RichTextLabel.visible_ratio] glyphs, starting from the left. */
            VC_GLYPHS_LTR = 3,
            
            /** Displays [member Label.visible_ratio] or [member RichTextLabel.visible_ratio] glyphs, starting from the right. */
            VC_GLYPHS_RTL = 4,
        }
        enum OverrunBehavior {
            /** No text trimming is performed. */
            OVERRUN_NO_TRIMMING = 0,
            
            /** Trims the text per character. */
            OVERRUN_TRIM_CHAR = 1,
            
            /** Trims the text per word. */
            OVERRUN_TRIM_WORD = 2,
            
            /** Trims the text per character and adds an ellipsis to indicate that parts are hidden if trimmed text is 6 characters or longer. */
            OVERRUN_TRIM_ELLIPSIS = 3,
            
            /** Trims the text per word and adds an ellipsis to indicate that parts are hidden if trimmed text is 6 characters or longer. */
            OVERRUN_TRIM_WORD_ELLIPSIS = 4,
            
            /** Trims the text per character and adds an ellipsis to indicate that parts are hidden regardless of trimmed text length. */
            OVERRUN_TRIM_ELLIPSIS_FORCE = 5,
            
            /** Trims the text per word and adds an ellipsis to indicate that parts are hidden regardless of trimmed text length. */
            OVERRUN_TRIM_WORD_ELLIPSIS_FORCE = 6,
        }
        enum TextOverrunFlag {
            /** No trimming is performed. */
            OVERRUN_NO_TRIM = 0,
            
            /** Trims the text when it exceeds the given width. */
            OVERRUN_TRIM = 1,
            
            /** Trims the text per word instead of per grapheme. */
            OVERRUN_TRIM_WORD_ONLY = 2,
            
            /** Determines whether an ellipsis should be added at the end of the text. */
            OVERRUN_ADD_ELLIPSIS = 4,
            
            /** Determines whether the ellipsis at the end of the text is enforced and may not be hidden. */
            OVERRUN_ENFORCE_ELLIPSIS = 8,
            
            /** Accounts for the text being justified before attempting to trim it (see [enum JustificationFlag]). */
            OVERRUN_JUSTIFICATION_AWARE = 16,
            
            /** Determines whether the ellipsis should be added regardless of the string length, otherwise it is added only if the string is 6 characters or longer. */
            OVERRUN_SHORT_STRING_ELLIPSIS = 32,
        }
        enum GraphemeFlag {
            /** Grapheme is supported by the font, and can be drawn. */
            GRAPHEME_IS_VALID = 1,
            
            /** Grapheme is part of right-to-left or bottom-to-top run. */
            GRAPHEME_IS_RTL = 2,
            
            /** Grapheme is not part of source text, it was added by justification process. */
            GRAPHEME_IS_VIRTUAL = 4,
            
            /** Grapheme is whitespace. */
            GRAPHEME_IS_SPACE = 8,
            
            /** Grapheme is mandatory break point (e.g. `"\n"`). */
            GRAPHEME_IS_BREAK_HARD = 16,
            
            /** Grapheme is optional break point (e.g. space). */
            GRAPHEME_IS_BREAK_SOFT = 32,
            
            /** Grapheme is the tabulation character. */
            GRAPHEME_IS_TAB = 64,
            
            /** Grapheme is kashida. */
            GRAPHEME_IS_ELONGATION = 128,
            
            /** Grapheme is punctuation character. */
            GRAPHEME_IS_PUNCTUATION = 256,
            
            /** Grapheme is underscore character. */
            GRAPHEME_IS_UNDERSCORE = 512,
            
            /** Grapheme is connected to the previous grapheme. Breaking line before this grapheme is not safe. */
            GRAPHEME_IS_CONNECTED = 1024,
            
            /** It is safe to insert a U+0640 before this grapheme for elongation. */
            GRAPHEME_IS_SAFE_TO_INSERT_TATWEEL = 2048,
            
            /** Grapheme is an object replacement character for the embedded object. */
            GRAPHEME_IS_EMBEDDED_OBJECT = 4096,
            
            /** Grapheme is a soft hyphen. */
            GRAPHEME_IS_SOFT_HYPHEN = 8192,
        }
        enum Hinting {
            /** Disables font hinting (smoother but less crisp). */
            HINTING_NONE = 0,
            
            /** Use the light font hinting mode. */
            HINTING_LIGHT = 1,
            
            /** Use the default font hinting mode (crisper but less smooth).  
             *      
             *  **Note:** This hinting mode changes both horizontal and vertical glyph metrics. If applied to monospace font, some glyphs might have different width.  
             */
            HINTING_NORMAL = 2,
        }
        enum SubpixelPositioning {
            /** Glyph horizontal position is rounded to the whole pixel size, each glyph is rasterized once. */
            SUBPIXEL_POSITIONING_DISABLED = 0,
            
            /** Glyph horizontal position is rounded based on font size.  
             *  - To one quarter of the pixel size if font size is smaller or equal to [constant SUBPIXEL_POSITIONING_ONE_QUARTER_MAX_SIZE].  
             *  - To one half of the pixel size if font size is smaller or equal to [constant SUBPIXEL_POSITIONING_ONE_HALF_MAX_SIZE].  
             *  - To the whole pixel size for larger fonts.  
             */
            SUBPIXEL_POSITIONING_AUTO = 1,
            
            /** Glyph horizontal position is rounded to one half of the pixel size, each glyph is rasterized up to two times. */
            SUBPIXEL_POSITIONING_ONE_HALF = 2,
            
            /** Glyph horizontal position is rounded to one quarter of the pixel size, each glyph is rasterized up to four times. */
            SUBPIXEL_POSITIONING_ONE_QUARTER = 3,
            
            /** Maximum font size which will use "one half of the pixel" subpixel positioning in [constant SUBPIXEL_POSITIONING_AUTO] mode. */
            SUBPIXEL_POSITIONING_ONE_HALF_MAX_SIZE = 20,
            
            /** Maximum font size which will use "one quarter of the pixel" subpixel positioning in [constant SUBPIXEL_POSITIONING_AUTO] mode. */
            SUBPIXEL_POSITIONING_ONE_QUARTER_MAX_SIZE = 16,
        }
        enum Feature {
            /** TextServer supports simple text layouts. */
            FEATURE_SIMPLE_LAYOUT = 1,
            
            /** TextServer supports bidirectional text layouts. */
            FEATURE_BIDI_LAYOUT = 2,
            
            /** TextServer supports vertical layouts. */
            FEATURE_VERTICAL_LAYOUT = 4,
            
            /** TextServer supports complex text shaping. */
            FEATURE_SHAPING = 8,
            
            /** TextServer supports justification using kashidas. */
            FEATURE_KASHIDA_JUSTIFICATION = 16,
            
            /** TextServer supports complex line/word breaking rules (e.g. dictionary based). */
            FEATURE_BREAK_ITERATORS = 32,
            
            /** TextServer supports loading bitmap fonts. */
            FEATURE_FONT_BITMAP = 64,
            
            /** TextServer supports loading dynamic (TrueType, OpeType, etc.) fonts. */
            FEATURE_FONT_DYNAMIC = 128,
            
            /** TextServer supports multichannel signed distance field dynamic font rendering. */
            FEATURE_FONT_MSDF = 256,
            
            /** TextServer supports loading system fonts. */
            FEATURE_FONT_SYSTEM = 512,
            
            /** TextServer supports variable fonts. */
            FEATURE_FONT_VARIABLE = 1024,
            
            /** TextServer supports locale dependent and context sensitive case conversion. */
            FEATURE_CONTEXT_SENSITIVE_CASE_CONVERSION = 2048,
            
            /** TextServer require external data file for some features, see [method load_support_data]. */
            FEATURE_USE_SUPPORT_DATA = 4096,
            
            /** TextServer supports UAX #31 identifier validation, see [method is_valid_identifier]. */
            FEATURE_UNICODE_IDENTIFIERS = 8192,
            
            /** TextServer supports [url=https://unicode.org/reports/tr36/]Unicode Technical Report #36[/url] and [url=https://unicode.org/reports/tr39/]Unicode Technical Standard #39[/url] based spoof detection features. */
            FEATURE_UNICODE_SECURITY = 16384,
        }
        enum ContourPointTag {
            /** Contour point is on the curve. */
            CONTOUR_CURVE_TAG_ON = 1,
            
            /** Contour point isn't on the curve, but serves as a control point for a conic (quadratic) Bézier arc. */
            CONTOUR_CURVE_TAG_OFF_CONIC = 0,
            
            /** Contour point isn't on the curve, but serves as a control point for a cubic Bézier arc. */
            CONTOUR_CURVE_TAG_OFF_CUBIC = 2,
        }
        enum SpacingType {
            /** Spacing for each glyph. */
            SPACING_GLYPH = 0,
            
            /** Spacing for the space character. */
            SPACING_SPACE = 1,
            
            /** Spacing at the top of the line. */
            SPACING_TOP = 2,
            
            /** Spacing at the bottom of the line. */
            SPACING_BOTTOM = 3,
            
            /** Represents the size of the [enum SpacingType] enum. */
            SPACING_MAX = 4,
        }
        enum FontStyle {
            /** Font is bold. */
            FONT_BOLD = 1,
            
            /** Font is italic or oblique. */
            FONT_ITALIC = 2,
            
            /** Font has fixed-width characters (also known as monospace). */
            FONT_FIXED_WIDTH = 4,
        }
        enum StructuredTextParser {
            /** Use default Unicode BiDi algorithm. */
            STRUCTURED_TEXT_DEFAULT = 0,
            
            /** BiDi override for URI. */
            STRUCTURED_TEXT_URI = 1,
            
            /** BiDi override for file path. */
            STRUCTURED_TEXT_FILE = 2,
            
            /** BiDi override for email. */
            STRUCTURED_TEXT_EMAIL = 3,
            
            /** BiDi override for lists. Structured text options: list separator [String]. */
            STRUCTURED_TEXT_LIST = 4,
            
            /** BiDi override for GDScript. */
            STRUCTURED_TEXT_GDSCRIPT = 5,
            
            /** User defined structured text BiDi override function. */
            STRUCTURED_TEXT_CUSTOM = 6,
        }
        enum FixedSizeScaleMode {
            /** Bitmap font is not scaled. */
            FIXED_SIZE_SCALE_DISABLE = 0,
            
            /** Bitmap font is scaled to the closest integer multiple of the font's fixed size. This is the recommended option for pixel art fonts. */
            FIXED_SIZE_SCALE_INTEGER_ONLY = 1,
            
            /** Bitmap font is scaled to an arbitrary (fractional) size. This is the recommended option for non-pixel art fonts. */
            FIXED_SIZE_SCALE_ENABLED = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTextServer extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTextServer extends __NameMapRefCounted {
    }
    /** A server interface for font management and text rendering.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_textserver.html  
     */
    class TextServer extends RefCounted {
        constructor(identifier?: any)
        /** Returns `true` if the server supports a feature. */
        has_feature(feature: TextServer.Feature): boolean
        
        /** Returns the name of the server interface. */
        get_name(): string
        
        /** Returns text server features, see [enum Feature]. */
        get_features(): int64
        
        /** Loads optional TextServer database (e.g. ICU break iterators and dictionaries).  
         *      
         *  **Note:** This function should be called before any other TextServer functions used, otherwise it won't have any effect.  
         */
        load_support_data(filename: string): boolean
        
        /** Returns default TextServer database (e.g. ICU break iterators and dictionaries) filename. */
        get_support_data_filename(): string
        
        /** Returns TextServer database (e.g. ICU break iterators and dictionaries) description. */
        get_support_data_info(): string
        
        /** Saves optional TextServer database (e.g. ICU break iterators and dictionaries) to the file.  
         *      
         *  **Note:** This function is used by during project export, to include TextServer database.  
         */
        save_support_data(filename: string): boolean
        
        /** Returns default TextServer database (e.g. ICU break iterators and dictionaries). */
        get_support_data(): PackedByteArray
        
        /** Returns `true` if the locale requires text server support data for line/word breaking. */
        is_locale_using_support_data(locale: string): boolean
        
        /** Returns `true` if locale is right-to-left. */
        is_locale_right_to_left(locale: string): boolean
        
        /** Converts the given readable name of a feature, variation, script, or language to an OpenType tag. */
        name_to_tag(name: string): int64
        
        /** Converts the given OpenType tag to the readable name of a feature, variation, script, or language. */
        tag_to_name(tag: int64): string
        
        /** Returns `true` if [param rid] is valid resource owned by this text server. */
        has(rid: RID): boolean
        
        /** Frees an object created by this [TextServer]. */
        free_rid(rid: RID): void
        
        /** Creates a new, empty font cache entry resource. To free the resulting resource, use the [method free_rid] method. */
        create_font(): RID
        
        /** Creates a new variation existing font which is reusing the same glyph cache and font data. To free the resulting resource, use the [method free_rid] method. */
        create_font_linked_variation(font_rid: RID): RID
        
        /** Sets font source data, e.g contents of the dynamic font source file. */
        font_set_data(font_rid: RID, data: PackedByteArray | byte[] | ArrayBuffer): void
        
        /** Sets an active face index in the TrueType / OpenType collection. */
        font_set_face_index(font_rid: RID, face_index: int64): void
        
        /** Returns an active face index in the TrueType / OpenType collection. */
        font_get_face_index(font_rid: RID): int64
        
        /** Returns number of faces in the TrueType / OpenType collection. */
        font_get_face_count(font_rid: RID): int64
        
        /** Sets the font style flags.  
         *      
         *  **Note:** This value is used for font matching only and will not affect font rendering. Use [method font_set_face_index], [method font_set_variation_coordinates], [method font_set_embolden], or [method font_set_transform] instead.  
         */
        font_set_style(font_rid: RID, style: TextServer.FontStyle): void
        
        /** Returns font style flags. */
        font_get_style(font_rid: RID): TextServer.FontStyle
        
        /** Sets the font family name. */
        font_set_name(font_rid: RID, name: string): void
        
        /** Returns font family name. */
        font_get_name(font_rid: RID): string
        
        /** Returns [Dictionary] with OpenType font name strings (localized font names, version, description, license information, sample text, etc.). */
        font_get_ot_name_strings(font_rid: RID): GDictionary
        
        /** Sets the font style name. */
        font_set_style_name(font_rid: RID, name: string): void
        
        /** Returns font style name. */
        font_get_style_name(font_rid: RID): string
        
        /** Sets weight (boldness) of the font. A value in the `100...999` range, normal font weight is `400`, bold font weight is `700`.  
         *      
         *  **Note:** This value is used for font matching only and will not affect font rendering. Use [method font_set_face_index], [method font_set_variation_coordinates], or [method font_set_embolden] instead.  
         */
        font_set_weight(font_rid: RID, weight: int64): void
        
        /** Returns weight (boldness) of the font. A value in the `100...999` range, normal font weight is `400`, bold font weight is `700`. */
        font_get_weight(font_rid: RID): int64
        
        /** Sets font stretch amount, compared to a normal width. A percentage value between `50%` and `200%`.  
         *      
         *  **Note:** This value is used for font matching only and will not affect font rendering. Use [method font_set_face_index], [method font_set_variation_coordinates], or [method font_set_transform] instead.  
         */
        font_set_stretch(font_rid: RID, weight: int64): void
        
        /** Returns font stretch amount, compared to a normal width. A percentage value between `50%` and `200%`. */
        font_get_stretch(font_rid: RID): int64
        
        /** Sets font anti-aliasing mode. */
        font_set_antialiasing(font_rid: RID, antialiasing: TextServer.FontAntialiasing): void
        
        /** Returns font anti-aliasing mode. */
        font_get_antialiasing(font_rid: RID): TextServer.FontAntialiasing
        
        /** If set to `true`, embedded font bitmap loading is disabled (bitmap-only and color fonts ignore this property). */
        font_set_disable_embedded_bitmaps(font_rid: RID, disable_embedded_bitmaps: boolean): void
        
        /** Returns whether the font's embedded bitmap loading is disabled. */
        font_get_disable_embedded_bitmaps(font_rid: RID): boolean
        
        /** If set to `true` font texture mipmap generation is enabled. */
        font_set_generate_mipmaps(font_rid: RID, generate_mipmaps: boolean): void
        
        /** Returns `true` if font texture mipmap generation is enabled. */
        font_get_generate_mipmaps(font_rid: RID): boolean
        
        /** If set to `true`, glyphs of all sizes are rendered using single multichannel signed distance field generated from the dynamic font vector data. MSDF rendering allows displaying the font at any scaling factor without blurriness, and without incurring a CPU cost when the font size changes (since the font no longer needs to be rasterized on the CPU). As a downside, font hinting is not available with MSDF. The lack of font hinting may result in less crisp and less readable fonts at small sizes.  
         *      
         *  **Note:** MSDF font rendering does not render glyphs with overlapping shapes correctly. Overlapping shapes are not valid per the OpenType standard, but are still commonly found in many font files, especially those converted by Google Fonts. To avoid issues with overlapping glyphs, consider downloading the font file directly from the type foundry instead of relying on Google Fonts.  
         */
        font_set_multichannel_signed_distance_field(font_rid: RID, msdf: boolean): void
        
        /** Returns `true` if glyphs of all sizes are rendered using single multichannel signed distance field generated from the dynamic font vector data. */
        font_is_multichannel_signed_distance_field(font_rid: RID): boolean
        
        /** Sets the width of the range around the shape between the minimum and maximum representable signed distance. */
        font_set_msdf_pixel_range(font_rid: RID, msdf_pixel_range: int64): void
        
        /** Returns the width of the range around the shape between the minimum and maximum representable signed distance. */
        font_get_msdf_pixel_range(font_rid: RID): int64
        
        /** Sets source font size used to generate MSDF textures. */
        font_set_msdf_size(font_rid: RID, msdf_size: int64): void
        
        /** Returns source font size used to generate MSDF textures. */
        font_get_msdf_size(font_rid: RID): int64
        
        /** Sets bitmap font fixed size. If set to value greater than zero, same cache entry will be used for all font sizes. */
        font_set_fixed_size(font_rid: RID, fixed_size: int64): void
        
        /** Returns bitmap font fixed size. */
        font_get_fixed_size(font_rid: RID): int64
        
        /** Sets bitmap font scaling mode. This property is used only if `fixed_size` is greater than zero. */
        font_set_fixed_size_scale_mode(font_rid: RID, fixed_size_scale_mode: TextServer.FixedSizeScaleMode): void
        
        /** Returns bitmap font scaling mode. */
        font_get_fixed_size_scale_mode(font_rid: RID): TextServer.FixedSizeScaleMode
        
        /** If set to `true`, system fonts can be automatically used as fallbacks. */
        font_set_allow_system_fallback(font_rid: RID, allow_system_fallback: boolean): void
        
        /** Returns `true` if system fonts can be automatically used as fallbacks. */
        font_is_allow_system_fallback(font_rid: RID): boolean
        
        /** Frees all automatically loaded system fonts. */
        font_clear_system_fallback_cache(): void
        
        /** If set to `true` auto-hinting is preferred over font built-in hinting. */
        font_set_force_autohinter(font_rid: RID, force_autohinter: boolean): void
        
        /** Returns `true` if auto-hinting is supported and preferred over font built-in hinting. Used by dynamic fonts only. */
        font_is_force_autohinter(font_rid: RID): boolean
        
        /** If set to `true`, color modulation is applied when drawing colored glyphs, otherwise it's applied to the monochrome glyphs only. */
        font_set_modulate_color_glyphs(font_rid: RID, force_autohinter: boolean): void
        
        /** Returns `true` if color modulation is applied when drawing the font's colored glyphs. */
        font_is_modulate_color_glyphs(font_rid: RID): boolean
        
        /** Sets font hinting mode. Used by dynamic fonts only. */
        font_set_hinting(font_rid: RID, hinting: TextServer.Hinting): void
        
        /** Returns the font hinting mode. Used by dynamic fonts only. */
        font_get_hinting(font_rid: RID): TextServer.Hinting
        
        /** Sets font subpixel glyph positioning mode. */
        font_set_subpixel_positioning(font_rid: RID, subpixel_positioning: TextServer.SubpixelPositioning): void
        
        /** Returns font subpixel glyph positioning mode. */
        font_get_subpixel_positioning(font_rid: RID): TextServer.SubpixelPositioning
        
        /** Sets glyph position rounding behavior. If set to `true`, when aligning glyphs to the pixel boundaries rounding remainders are accumulated to ensure more uniform glyph distribution. This setting has no effect if subpixel positioning is enabled. */
        font_set_keep_rounding_remainders(font_rid: RID, keep_rounding_remainders: boolean): void
        
        /** Returns glyph position rounding behavior. If set to `true`, when aligning glyphs to the pixel boundaries rounding remainders are accumulated to ensure more uniform glyph distribution. This setting has no effect if subpixel positioning is enabled. */
        font_get_keep_rounding_remainders(font_rid: RID): boolean
        
        /** Sets font embolden strength. If [param strength] is not equal to zero, emboldens the font outlines. Negative values reduce the outline thickness. */
        font_set_embolden(font_rid: RID, strength: float64): void
        
        /** Returns font embolden strength. */
        font_get_embolden(font_rid: RID): float64
        
        /** Sets the spacing for [param spacing] to [param value] in pixels (not relative to the font size). */
        font_set_spacing(font_rid: RID, spacing: TextServer.SpacingType, value: int64): void
        
        /** Returns the spacing for [param spacing] in pixels (not relative to the font size). */
        font_get_spacing(font_rid: RID, spacing: TextServer.SpacingType): int64
        
        /** Sets extra baseline offset (as a fraction of font height). */
        font_set_baseline_offset(font_rid: RID, baseline_offset: float64): void
        
        /** Returns extra baseline offset (as a fraction of font height). */
        font_get_baseline_offset(font_rid: RID): float64
        
        /** Sets 2D transform, applied to the font outlines, can be used for slanting, flipping, and rotating glyphs.  
         *  For example, to simulate italic typeface by slanting, apply the following transform `Transform2D(1.0, slant, 0.0, 1.0, 0.0, 0.0)`.  
         */
        font_set_transform(font_rid: RID, transform: Transform2D): void
        
        /** Returns 2D transform applied to the font outlines. */
        font_get_transform(font_rid: RID): Transform2D
        
        /** Sets variation coordinates for the specified font cache entry. See [method font_supported_variation_list] for more info. */
        font_set_variation_coordinates(font_rid: RID, variation_coordinates: GDictionary): void
        
        /** Returns variation coordinates for the specified font cache entry. See [method font_supported_variation_list] for more info. */
        font_get_variation_coordinates(font_rid: RID): GDictionary
        
        /** If set to a positive value, overrides the oversampling factor of the viewport this font is used in. See [member Viewport.oversampling]. This value doesn't override the [code skip-lint]oversampling` parameter of [code skip-lint]draw_*` methods. Used by dynamic fonts only. */
        font_set_oversampling(font_rid: RID, oversampling: float64): void
        
        /** Returns oversampling factor override. If set to a positive value, overrides the oversampling factor of the viewport this font is used in. See [member Viewport.oversampling]. This value doesn't override the [code skip-lint]oversampling` parameter of [code skip-lint]draw_*` methods. Used by dynamic fonts only. */
        font_get_oversampling(font_rid: RID): float64
        
        /** Returns list of the font sizes in the cache. Each size is [Vector2i] with font size and outline size. */
        font_get_size_cache_list(font_rid: RID): GArray<Vector2i>
        
        /** Removes all font sizes from the cache entry. */
        font_clear_size_cache(font_rid: RID): void
        
        /** Removes specified font size from the cache entry. */
        font_remove_size_cache(font_rid: RID, size: Vector2i): void
        
        /** Returns font cache information, each entry contains the following fields: `Vector2i size_px` - font size in pixels, `float viewport_oversampling` - viewport oversampling factor, `int glyphs` - number of rendered glyphs, `int textures` - number of used textures, `int textures_size` - size of texture data in bytes. */
        font_get_size_cache_info(font_rid: RID): GArray<GDictionary>
        
        /** Sets the font ascent (number of pixels above the baseline). */
        font_set_ascent(font_rid: RID, size: int64, ascent: float64): void
        
        /** Returns the font ascent (number of pixels above the baseline). */
        font_get_ascent(font_rid: RID, size: int64): float64
        
        /** Sets the font descent (number of pixels below the baseline). */
        font_set_descent(font_rid: RID, size: int64, descent: float64): void
        
        /** Returns the font descent (number of pixels below the baseline). */
        font_get_descent(font_rid: RID, size: int64): float64
        
        /** Sets pixel offset of the underline below the baseline. */
        font_set_underline_position(font_rid: RID, size: int64, underline_position: float64): void
        
        /** Returns pixel offset of the underline below the baseline. */
        font_get_underline_position(font_rid: RID, size: int64): float64
        
        /** Sets thickness of the underline in pixels. */
        font_set_underline_thickness(font_rid: RID, size: int64, underline_thickness: float64): void
        
        /** Returns thickness of the underline in pixels. */
        font_get_underline_thickness(font_rid: RID, size: int64): float64
        
        /** Sets scaling factor of the color bitmap font. */
        font_set_scale(font_rid: RID, size: int64, scale: float64): void
        
        /** Returns scaling factor of the color bitmap font. */
        font_get_scale(font_rid: RID, size: int64): float64
        
        /** Returns number of textures used by font cache entry. */
        font_get_texture_count(font_rid: RID, size: Vector2i): int64
        
        /** Removes all textures from font cache entry.  
         *      
         *  **Note:** This function will not remove glyphs associated with the texture, use [method font_remove_glyph] to remove them manually.  
         */
        font_clear_textures(font_rid: RID, size: Vector2i): void
        
        /** Removes specified texture from the cache entry.  
         *      
         *  **Note:** This function will not remove glyphs associated with the texture, remove them manually, using [method font_remove_glyph].  
         */
        font_remove_texture(font_rid: RID, size: Vector2i, texture_index: int64): void
        
        /** Sets font cache texture image data. */
        font_set_texture_image(font_rid: RID, size: Vector2i, texture_index: int64, image: Image): void
        
        /** Returns font cache texture image data. */
        font_get_texture_image(font_rid: RID, size: Vector2i, texture_index: int64): null | Image
        
        /** Sets array containing glyph packing data. */
        font_set_texture_offsets(font_rid: RID, size: Vector2i, texture_index: int64, offset: PackedInt32Array | int32[]): void
        
        /** Returns array containing glyph packing data. */
        font_get_texture_offsets(font_rid: RID, size: Vector2i, texture_index: int64): PackedInt32Array
        
        /** Returns list of rendered glyphs in the cache entry. */
        font_get_glyph_list(font_rid: RID, size: Vector2i): PackedInt32Array
        
        /** Removes all rendered glyph information from the cache entry.  
         *      
         *  **Note:** This function will not remove textures associated with the glyphs, use [method font_remove_texture] to remove them manually.  
         */
        font_clear_glyphs(font_rid: RID, size: Vector2i): void
        
        /** Removes specified rendered glyph information from the cache entry.  
         *      
         *  **Note:** This function will not remove textures associated with the glyphs, use [method font_remove_texture] to remove them manually.  
         */
        font_remove_glyph(font_rid: RID, size: Vector2i, glyph: int64): void
        
        /** Returns glyph advance (offset of the next glyph).  
         *      
         *  **Note:** Advance for glyphs outlines is the same as the base glyph advance and is not saved.  
         */
        font_get_glyph_advance(font_rid: RID, size: int64, glyph: int64): Vector2
        
        /** Sets glyph advance (offset of the next glyph).  
         *      
         *  **Note:** Advance for glyphs outlines is the same as the base glyph advance and is not saved.  
         */
        font_set_glyph_advance(font_rid: RID, size: int64, glyph: int64, advance: Vector2): void
        
        /** Returns glyph offset from the baseline. */
        font_get_glyph_offset(font_rid: RID, size: Vector2i, glyph: int64): Vector2
        
        /** Sets glyph offset from the baseline. */
        font_set_glyph_offset(font_rid: RID, size: Vector2i, glyph: int64, offset: Vector2): void
        
        /** Returns size of the glyph. */
        font_get_glyph_size(font_rid: RID, size: Vector2i, glyph: int64): Vector2
        
        /** Sets size of the glyph. */
        font_set_glyph_size(font_rid: RID, size: Vector2i, glyph: int64, gl_size: Vector2): void
        
        /** Returns rectangle in the cache texture containing the glyph. */
        font_get_glyph_uv_rect(font_rid: RID, size: Vector2i, glyph: int64): Rect2
        
        /** Sets rectangle in the cache texture containing the glyph. */
        font_set_glyph_uv_rect(font_rid: RID, size: Vector2i, glyph: int64, uv_rect: Rect2): void
        
        /** Returns index of the cache texture containing the glyph. */
        font_get_glyph_texture_idx(font_rid: RID, size: Vector2i, glyph: int64): int64
        
        /** Sets index of the cache texture containing the glyph. */
        font_set_glyph_texture_idx(font_rid: RID, size: Vector2i, glyph: int64, texture_idx: int64): void
        
        /** Returns resource ID of the cache texture containing the glyph.  
         *      
         *  **Note:** If there are pending glyphs to render, calling this function might trigger the texture cache update.  
         */
        font_get_glyph_texture_rid(font_rid: RID, size: Vector2i, glyph: int64): RID
        
        /** Returns size of the cache texture containing the glyph.  
         *      
         *  **Note:** If there are pending glyphs to render, calling this function might trigger the texture cache update.  
         */
        font_get_glyph_texture_size(font_rid: RID, size: Vector2i, glyph: int64): Vector2
        
        /** Returns outline contours of the glyph as a [Dictionary] with the following contents:  
         *  `points`         - [PackedVector3Array], containing outline points. `x` and `y` are point coordinates. `z` is the type of the point, using the [enum ContourPointTag] values.  
         *  `contours`       - [PackedInt32Array], containing indices the end points of each contour.  
         *  `orientation`    - [bool], contour orientation. If `true`, clockwise contours must be filled.  
         *  - Two successive [constant CONTOUR_CURVE_TAG_ON] points indicate a line segment.  
         *  - One [constant CONTOUR_CURVE_TAG_OFF_CONIC] point between two [constant CONTOUR_CURVE_TAG_ON] points indicates a single conic (quadratic) Bézier arc.  
         *  - Two [constant CONTOUR_CURVE_TAG_OFF_CUBIC] points between two [constant CONTOUR_CURVE_TAG_ON] points indicate a single cubic Bézier arc.  
         *  - Two successive [constant CONTOUR_CURVE_TAG_OFF_CONIC] points indicate two successive conic (quadratic) Bézier arcs with a virtual [constant CONTOUR_CURVE_TAG_ON] point at their middle.  
         *  - Each contour is closed. The last point of a contour uses the first point of a contour as its next point, and vice versa. The first point can be [constant CONTOUR_CURVE_TAG_OFF_CONIC] point.  
         */
        font_get_glyph_contours(font: RID, size: int64, index: int64): GDictionary
        
        /** Returns list of the kerning overrides. */
        font_get_kerning_list(font_rid: RID, size: int64): GArray<Vector2i>
        
        /** Removes all kerning overrides. */
        font_clear_kerning_map(font_rid: RID, size: int64): void
        
        /** Removes kerning override for the pair of glyphs. */
        font_remove_kerning(font_rid: RID, size: int64, glyph_pair: Vector2i): void
        
        /** Sets kerning for the pair of glyphs. */
        font_set_kerning(font_rid: RID, size: int64, glyph_pair: Vector2i, kerning: Vector2): void
        
        /** Returns kerning for the pair of glyphs. */
        font_get_kerning(font_rid: RID, size: int64, glyph_pair: Vector2i): Vector2
        
        /** Returns the glyph index of a [param char], optionally modified by the [param variation_selector]. See [method font_get_char_from_glyph_index]. */
        font_get_glyph_index(font_rid: RID, size: int64, char: int64, variation_selector: int64): int64
        
        /** Returns character code associated with [param glyph_index], or `0` if [param glyph_index] is invalid. See [method font_get_glyph_index]. */
        font_get_char_from_glyph_index(font_rid: RID, size: int64, glyph_index: int64): int64
        
        /** Returns `true` if a Unicode [param char] is available in the font. */
        font_has_char(font_rid: RID, char: int64): boolean
        
        /** Returns a string containing all the characters available in the font. */
        font_get_supported_chars(font_rid: RID): string
        
        /** Returns an array containing all glyph indices in the font. */
        font_get_supported_glyphs(font_rid: RID): PackedInt32Array
        
        /** Renders the range of characters to the font cache texture. */
        font_render_range(font_rid: RID, size: Vector2i, start: int64, end: int64): void
        
        /** Renders specified glyph to the font cache texture. */
        font_render_glyph(font_rid: RID, size: Vector2i, index: int64): void
        
        /** Draws single glyph into a canvas item at the position, using [param font_rid] at the size [param size]. If [param oversampling] is greater than zero, it is used as font oversampling factor, otherwise viewport oversampling settings are used.  
         *      
         *  **Note:** Glyph index is specific to the font, use glyphs indices returned by [method shaped_text_get_glyphs] or [method font_get_glyph_index].  
         *      
         *  **Note:** If there are pending glyphs to render, calling this function might trigger the texture cache update.  
         */
        font_draw_glyph(font_rid: RID, canvas: RID, size: int64, pos: Vector2, index: int64, color?: Color /* = new Color(1, 1, 1, 1) */, oversampling?: float64 /* = 0 */): void
        
        /** Draws single glyph outline of size [param outline_size] into a canvas item at the position, using [param font_rid] at the size [param size]. If [param oversampling] is greater than zero, it is used as font oversampling factor, otherwise viewport oversampling settings are used.  
         *      
         *  **Note:** Glyph index is specific to the font, use glyphs indices returned by [method shaped_text_get_glyphs] or [method font_get_glyph_index].  
         *      
         *  **Note:** If there are pending glyphs to render, calling this function might trigger the texture cache update.  
         */
        font_draw_glyph_outline(font_rid: RID, canvas: RID, size: int64, outline_size: int64, pos: Vector2, index: int64, color?: Color /* = new Color(1, 1, 1, 1) */, oversampling?: float64 /* = 0 */): void
        
        /** Returns `true` if the font supports the given language (as a [url=https://en.wikipedia.org/wiki/ISO_639-1]ISO 639[/url] code). */
        font_is_language_supported(font_rid: RID, language: string): boolean
        
        /** Adds override for [method font_is_language_supported]. */
        font_set_language_support_override(font_rid: RID, language: string, supported: boolean): void
        
        /** Returns `true` if support override is enabled for the [param language]. */
        font_get_language_support_override(font_rid: RID, language: string): boolean
        
        /** Remove language support override. */
        font_remove_language_support_override(font_rid: RID, language: string): void
        
        /** Returns list of language support overrides. */
        font_get_language_support_overrides(font_rid: RID): PackedStringArray
        
        /** Returns `true` if the font supports the given script (as a [url=https://en.wikipedia.org/wiki/ISO_15924]ISO 15924[/url] code). */
        font_is_script_supported(font_rid: RID, script: string): boolean
        
        /** Adds override for [method font_is_script_supported]. */
        font_set_script_support_override(font_rid: RID, script: string, supported: boolean): void
        
        /** Returns `true` if support override is enabled for the [param script]. */
        font_get_script_support_override(font_rid: RID, script: string): boolean
        
        /** Removes script support override. */
        font_remove_script_support_override(font_rid: RID, script: string): void
        
        /** Returns list of script support overrides. */
        font_get_script_support_overrides(font_rid: RID): PackedStringArray
        
        /** Sets font OpenType feature set override. */
        font_set_opentype_feature_overrides(font_rid: RID, overrides: GDictionary): void
        
        /** Returns font OpenType feature set override. */
        font_get_opentype_feature_overrides(font_rid: RID): GDictionary
        
        /** Returns the dictionary of the supported OpenType features. */
        font_supported_feature_list(font_rid: RID): GDictionary
        
        /** Returns the dictionary of the supported OpenType variation coordinates. */
        font_supported_variation_list(font_rid: RID): GDictionary
        
        /** This method does nothing and always returns `1.0`. */
        font_get_global_oversampling(): float64
        
        /** This method does nothing. */
        font_set_global_oversampling(oversampling: float64): void
        
        /** Returns size of the replacement character (box with character hexadecimal code that is drawn in place of invalid characters). */
        get_hex_code_box_size(size: int64, index: int64): Vector2
        
        /** Draws box displaying character hexadecimal code. Used for replacing missing characters. */
        draw_hex_code_box(canvas: RID, size: int64, pos: Vector2, index: int64, color: Color): void
        
        /** Creates a new buffer for complex text layout, with the given [param direction] and [param orientation]. To free the resulting buffer, use [method free_rid] method.  
         *      
         *  **Note:** Direction is ignored if server does not support [constant FEATURE_BIDI_LAYOUT] feature (supported by [TextServerAdvanced]).  
         *      
         *  **Note:** Orientation is ignored if server does not support [constant FEATURE_VERTICAL_LAYOUT] feature (supported by [TextServerAdvanced]).  
         */
        create_shaped_text(direction?: TextServer.Direction /* = 0 */, orientation?: TextServer.Orientation /* = 0 */): RID
        
        /** Clears text buffer (removes text and inline objects). */
        shaped_text_clear(rid: RID): void
        
        /** Duplicates shaped text buffer. */
        shaped_text_duplicate(rid: RID): RID
        
        /** Sets desired text direction. If set to [constant DIRECTION_AUTO], direction will be detected based on the buffer contents and current locale.  
         *      
         *  **Note:** Direction is ignored if server does not support [constant FEATURE_BIDI_LAYOUT] feature (supported by [TextServerAdvanced]).  
         */
        shaped_text_set_direction(shaped: RID, direction?: TextServer.Direction /* = 0 */): void
        
        /** Returns direction of the text. */
        shaped_text_get_direction(shaped: RID): TextServer.Direction
        
        /** Returns direction of the text, inferred by the BiDi algorithm. */
        shaped_text_get_inferred_direction(shaped: RID): TextServer.Direction
        
        /** Overrides BiDi for the structured text.  
         *  Override ranges should cover full source text without overlaps. BiDi algorithm will be used on each range separately.  
         */
        shaped_text_set_bidi_override(shaped: RID, override: GArray): void
        
        /** Sets custom punctuation character list, used for word breaking. If set to empty string, server defaults are used. */
        shaped_text_set_custom_punctuation(shaped: RID, punct: string): void
        
        /** Returns custom punctuation character list, used for word breaking. If set to empty string, server defaults are used. */
        shaped_text_get_custom_punctuation(shaped: RID): string
        
        /** Sets ellipsis character used for text clipping. */
        shaped_text_set_custom_ellipsis(shaped: RID, char: int64): void
        
        /** Returns ellipsis character used for text clipping. */
        shaped_text_get_custom_ellipsis(shaped: RID): int64
        
        /** Sets desired text orientation.  
         *      
         *  **Note:** Orientation is ignored if server does not support [constant FEATURE_VERTICAL_LAYOUT] feature (supported by [TextServerAdvanced]).  
         */
        shaped_text_set_orientation(shaped: RID, orientation?: TextServer.Orientation /* = 0 */): void
        
        /** Returns text orientation. */
        shaped_text_get_orientation(shaped: RID): TextServer.Orientation
        
        /** If set to `true` text buffer will display invalid characters as hexadecimal codes, otherwise nothing is displayed. */
        shaped_text_set_preserve_invalid(shaped: RID, enabled: boolean): void
        
        /** Returns `true` if text buffer is configured to display hexadecimal codes in place of invalid characters.  
         *      
         *  **Note:** If set to `false`, nothing is displayed in place of invalid characters.  
         */
        shaped_text_get_preserve_invalid(shaped: RID): boolean
        
        /** If set to `true` text buffer will display control characters. */
        shaped_text_set_preserve_control(shaped: RID, enabled: boolean): void
        
        /** Returns `true` if text buffer is configured to display control characters. */
        shaped_text_get_preserve_control(shaped: RID): boolean
        
        /** Sets extra spacing added between glyphs or lines in pixels. */
        shaped_text_set_spacing(shaped: RID, spacing: TextServer.SpacingType, value: int64): void
        
        /** Returns extra spacing added between glyphs or lines in pixels. */
        shaped_text_get_spacing(shaped: RID, spacing: TextServer.SpacingType): int64
        
        /** Adds text span and font to draw it to the text buffer. */
        shaped_text_add_string(shaped: RID, text: string, fonts: GArray<RID>, size: int64, opentype_features?: GDictionary /* = new GDictionary() */, language?: string /* = '' */, meta?: any /* = {} */): boolean
        
        /** Adds inline object to the text buffer, [param key] must be unique. In the text, object is represented as [param length] object replacement characters. */
        shaped_text_add_object(shaped: RID, key: any, size: Vector2, inline_align?: InlineAlignment /* = 5 */, length?: int64 /* = 1 */, baseline?: float64 /* = 0 */): boolean
        
        /** Sets new size and alignment of embedded object. */
        shaped_text_resize_object(shaped: RID, key: any, size: Vector2, inline_align?: InlineAlignment /* = 5 */, baseline?: float64 /* = 0 */): boolean
        
        /** Returns `true` if an object with [param key] is embedded in this shaped text buffer. */
        shaped_text_has_object(shaped: RID, key: any): boolean
        
        /** Returns the text buffer source text, including object replacement characters. */
        shaped_get_text(shaped: RID): string
        
        /** Returns number of text spans added using [method shaped_text_add_string] or [method shaped_text_add_object]. */
        shaped_get_span_count(shaped: RID): int64
        
        /** Returns text span metadata. */
        shaped_get_span_meta(shaped: RID, index: int64): any
        
        /** Returns text embedded object key. */
        shaped_get_span_embedded_object(shaped: RID, index: int64): any
        
        /** Returns the text span source text. */
        shaped_get_span_text(shaped: RID, index: int64): string
        
        /** Returns the text span embedded object key. */
        shaped_get_span_object(shaped: RID, index: int64): any
        
        /** Changes text span font, font size, and OpenType features, without changing the text. */
        shaped_set_span_update_font(shaped: RID, index: int64, fonts: GArray<RID>, size: int64, opentype_features?: GDictionary /* = new GDictionary() */): void
        
        /** Returns the number of uniform text runs in the buffer. */
        shaped_get_run_count(shaped: RID): int64
        
        /** Returns the source text of the [param index] text run (in visual order). */
        shaped_get_run_text(shaped: RID, index: int64): string
        
        /** Returns the source text range of the [param index] text run (in visual order). */
        shaped_get_run_range(shaped: RID, index: int64): Vector2i
        
        /** Returns the font RID of the [param index] text run (in visual order). */
        shaped_get_run_font_rid(shaped: RID, index: int64): RID
        
        /** Returns the font size of the [param index] text run (in visual order). */
        shaped_get_run_font_size(shaped: RID, index: int64): int64
        
        /** Returns the language of the [param index] text run (in visual order). */
        shaped_get_run_language(shaped: RID, index: int64): string
        
        /** Returns the direction of the [param index] text run (in visual order). */
        shaped_get_run_direction(shaped: RID, index: int64): TextServer.Direction
        
        /** Returns the embedded object of the [param index] text run (in visual order). */
        shaped_get_run_object(shaped: RID, index: int64): any
        
        /** Returns text buffer for the substring of the text in the [param shaped] text buffer (including inline objects). */
        shaped_text_substr(shaped: RID, start: int64, length: int64): RID
        
        /** Returns the parent buffer from which the substring originates. */
        shaped_text_get_parent(shaped: RID): RID
        
        /** Adjusts text width to fit to specified width, returns new text width. */
        shaped_text_fit_to_width(shaped: RID, width: float64, justification_flags?: TextServer.JustificationFlag /* = 3 */): float64
        
        /** Aligns shaped text to the given tab-stops. */
        shaped_text_tab_align(shaped: RID, tab_stops: PackedFloat32Array | float32[]): float64
        
        /** Shapes buffer if it's not shaped. Returns `true` if the string is shaped successfully.  
         *      
         *  **Note:** It is not necessary to call this function manually, buffer will be shaped automatically as soon as any of its output data is requested.  
         */
        shaped_text_shape(shaped: RID): boolean
        
        /** Returns `true` if buffer is successfully shaped. */
        shaped_text_is_ready(shaped: RID): boolean
        
        /** Returns `true` if text buffer contains any visible characters. */
        shaped_text_has_visible_chars(shaped: RID): boolean
        
        /** Returns an array of glyphs in the visual order. */
        shaped_text_get_glyphs(shaped: RID): GArray<GDictionary>
        
        /** Returns text glyphs in the logical order. */
        shaped_text_sort_logical(shaped: RID): GArray<GDictionary>
        
        /** Returns number of glyphs in the buffer. */
        shaped_text_get_glyph_count(shaped: RID): int64
        
        /** Returns substring buffer character range in the parent buffer. */
        shaped_text_get_range(shaped: RID): Vector2i
        
        /** Breaks text to the lines and columns. Returns character ranges for each segment. */
        shaped_text_get_line_breaks_adv(shaped: RID, width: PackedFloat32Array | float32[], start?: int64 /* = 0 */, once?: boolean /* = true */, break_flags?: TextServer.LineBreakFlag /* = 3 */): PackedInt32Array
        
        /** Breaks text to the lines and returns character ranges for each line. */
        shaped_text_get_line_breaks(shaped: RID, width: float64, start?: int64 /* = 0 */, break_flags?: TextServer.LineBreakFlag /* = 3 */): PackedInt32Array
        
        /** Breaks text into words and returns array of character ranges. Use [param grapheme_flags] to set what characters are used for breaking. */
        shaped_text_get_word_breaks(shaped: RID, grapheme_flags?: TextServer.GraphemeFlag /* = 264 */, skip_grapheme_flags?: TextServer.GraphemeFlag /* = 4 */): PackedInt32Array
        
        /** Returns the position of the overrun trim. */
        shaped_text_get_trim_pos(shaped: RID): int64
        
        /** Returns position of the ellipsis. */
        shaped_text_get_ellipsis_pos(shaped: RID): int64
        
        /** Returns array of the glyphs in the ellipsis. */
        shaped_text_get_ellipsis_glyphs(shaped: RID): GArray<GDictionary>
        
        /** Returns number of glyphs in the ellipsis. */
        shaped_text_get_ellipsis_glyph_count(shaped: RID): int64
        
        /** Trims text if it exceeds the given width. */
        shaped_text_overrun_trim_to_width(shaped: RID, width?: float64 /* = 0 */, overrun_trim_flags?: TextServer.TextOverrunFlag /* = 0 */): void
        
        /** Returns array of inline objects. */
        shaped_text_get_objects(shaped: RID): GArray
        
        /** Returns bounding rectangle of the inline object. */
        shaped_text_get_object_rect(shaped: RID, key: any): Rect2
        
        /** Returns the character range of the inline object. */
        shaped_text_get_object_range(shaped: RID, key: any): Vector2i
        
        /** Returns the glyph index of the inline object. */
        shaped_text_get_object_glyph(shaped: RID, key: any): int64
        
        /** Returns size of the text. */
        shaped_text_get_size(shaped: RID): Vector2
        
        /** Returns the text ascent (number of pixels above the baseline for horizontal layout or to the left of baseline for vertical).  
         *      
         *  **Note:** Overall ascent can be higher than font ascent, if some glyphs are displaced from the baseline.  
         */
        shaped_text_get_ascent(shaped: RID): float64
        
        /** Returns the text descent (number of pixels below the baseline for horizontal layout or to the right of baseline for vertical).  
         *      
         *  **Note:** Overall descent can be higher than font descent, if some glyphs are displaced from the baseline.  
         */
        shaped_text_get_descent(shaped: RID): float64
        
        /** Returns width (for horizontal layout) or height (for vertical) of the text. */
        shaped_text_get_width(shaped: RID): float64
        
        /** Returns pixel offset of the underline below the baseline. */
        shaped_text_get_underline_position(shaped: RID): float64
        
        /** Returns thickness of the underline. */
        shaped_text_get_underline_thickness(shaped: RID): float64
        
        /** Returns shapes of the carets corresponding to the character offset [param position] in the text. Returned caret shape is 1 pixel wide rectangle. */
        shaped_text_get_carets(shaped: RID, position: int64): GDictionary
        
        /** Returns selection rectangles for the specified character range. */
        shaped_text_get_selection(shaped: RID, start: int64, end: int64): PackedVector2Array
        
        /** Returns grapheme index at the specified pixel offset at the baseline, or `-1` if none is found. */
        shaped_text_hit_test_grapheme(shaped: RID, coords: float64): int64
        
        /** Returns caret character offset at the specified pixel offset at the baseline. This function always returns a valid position. */
        shaped_text_hit_test_position(shaped: RID, coords: float64): int64
        
        /** Returns composite character's bounds as offsets from the start of the line. */
        shaped_text_get_grapheme_bounds(shaped: RID, pos: int64): Vector2
        
        /** Returns grapheme end position closest to the [param pos]. */
        shaped_text_next_grapheme_pos(shaped: RID, pos: int64): int64
        
        /** Returns grapheme start position closest to the [param pos]. */
        shaped_text_prev_grapheme_pos(shaped: RID, pos: int64): int64
        
        /** Returns array of the composite character boundaries. */
        shaped_text_get_character_breaks(shaped: RID): PackedInt32Array
        
        /** Returns composite character end position closest to the [param pos]. */
        shaped_text_next_character_pos(shaped: RID, pos: int64): int64
        
        /** Returns composite character start position closest to the [param pos]. */
        shaped_text_prev_character_pos(shaped: RID, pos: int64): int64
        
        /** Returns composite character position closest to the [param pos]. */
        shaped_text_closest_character_pos(shaped: RID, pos: int64): int64
        
        /** Draw shaped text into a canvas item at a given position, with [param color]. [param pos] specifies the leftmost point of the baseline (for horizontal layout) or topmost point of the baseline (for vertical layout). If [param oversampling] is greater than zero, it is used as font oversampling factor, otherwise viewport oversampling settings are used.  
         *  [param clip_l] and [param clip_r] are offsets relative to [param pos], going to the right in horizontal layout and downward in vertical layout. If [param clip_l] is not negative, glyphs starting before the offset are clipped. If [param clip_r] is not negative, glyphs ending after the offset are clipped.  
         */
        shaped_text_draw(shaped: RID, canvas: RID, pos: Vector2, clip_l?: float64 /* = -1 */, clip_r?: float64 /* = -1 */, color?: Color /* = new Color(1, 1, 1, 1) */, oversampling?: float64 /* = 0 */): void
        
        /** Draw the outline of the shaped text into a canvas item at a given position, with [param color]. [param pos] specifies the leftmost point of the baseline (for horizontal layout) or topmost point of the baseline (for vertical layout). If [param oversampling] is greater than zero, it is used as font oversampling factor, otherwise viewport oversampling settings are used.  
         *  [param clip_l] and [param clip_r] are offsets relative to [param pos], going to the right in horizontal layout and downward in vertical layout. If [param clip_l] is not negative, glyphs starting before the offset are clipped. If [param clip_r] is not negative, glyphs ending after the offset are clipped.  
         */
        shaped_text_draw_outline(shaped: RID, canvas: RID, pos: Vector2, clip_l?: float64 /* = -1 */, clip_r?: float64 /* = -1 */, outline_size?: int64 /* = 1 */, color?: Color /* = new Color(1, 1, 1, 1) */, oversampling?: float64 /* = 0 */): void
        
        /** Returns dominant direction of in the range of text. */
        shaped_text_get_dominant_direction_in_range(shaped: RID, start: int64, end: int64): TextServer.Direction
        
        /** Converts a number from Western Arabic (0..9) to the numeral system used in the given [param language].  
         *  If [param language] is an empty string, the active locale will be used.  
         */
        format_number(number: string, language?: string /* = '' */): string
        
        /** Converts [param number] from the numeral system used in the given [param language] to Western Arabic (0..9).  
         *  If [param language] is an empty string, the active locale will be used.  
         */
        parse_number(number: string, language?: string /* = '' */): string
        
        /** Returns the percent sign used in the given [param language].  
         *  If [param language] is an empty string, the active locale will be used.  
         */
        percent_sign(language?: string /* = '' */): string
        
        /** Returns an array of the word break boundaries. Elements in the returned array are the offsets of the start and end of words. Therefore the length of the array is always even.  
         *  When [param chars_per_line] is greater than zero, line break boundaries are returned instead.  
         *    
         */
        string_get_word_breaks(string_: string, language?: string /* = '' */, chars_per_line?: int64 /* = 0 */): PackedInt32Array
        
        /** Returns array of the composite character boundaries.  
         *    
         */
        string_get_character_breaks(string_: string, language?: string /* = '' */): PackedInt32Array
        
        /** Returns index of the first string in [param dict] which is visually confusable with the [param string], or `-1` if none is found.  
         *      
         *  **Note:** This method doesn't detect invisible characters, for spoof detection use it in combination with [method spoof_check].  
         *      
         *  **Note:** Always returns `-1` if the server does not support the [constant FEATURE_UNICODE_SECURITY] feature.  
         */
        is_confusable(string_: string, dict: PackedStringArray | string[]): int64
        
        /** Returns `true` if [param string] is likely to be an attempt at confusing the reader.  
         *      
         *  **Note:** Always returns `false` if the server does not support the [constant FEATURE_UNICODE_SECURITY] feature.  
         */
        spoof_check(string_: string): boolean
        
        /** Strips diacritics from the string.  
         *      
         *  **Note:** The result may be longer or shorter than the original.  
         */
        strip_diacritics(string_: string): string
        
        /** Returns `true` if [param string] is a valid identifier.  
         *  If the text server supports the [constant FEATURE_UNICODE_IDENTIFIERS] feature, a valid identifier must:  
         *  - Conform to normalization form C.  
         *  - Begin with a Unicode character of class XID_Start or `"_"`.  
         *  - May contain Unicode characters of class XID_Continue in the other positions.  
         *  - Use UAX #31 recommended scripts only (mixed scripts are allowed).  
         *  If the [constant FEATURE_UNICODE_IDENTIFIERS] feature is not supported, a valid identifier must:  
         *  - Begin with a Unicode character of class XID_Start or `"_"`.  
         *  - May contain Unicode characters of class XID_Continue in the other positions.  
         */
        is_valid_identifier(string_: string): boolean
        
        /** Returns `true` if the given code point is a valid letter, i.e. it belongs to the Unicode category "L". */
        is_valid_letter(unicode: int64): boolean
        
        /** Returns the string converted to `UPPERCASE`.  
         *      
         *  **Note:** Casing is locale dependent and context sensitive if server support [constant FEATURE_CONTEXT_SENSITIVE_CASE_CONVERSION] feature (supported by [TextServerAdvanced]).  
         *      
         *  **Note:** The result may be longer or shorter than the original.  
         */
        string_to_upper(string_: string, language?: string /* = '' */): string
        
        /** Returns the string converted to `lowercase`.  
         *      
         *  **Note:** Casing is locale dependent and context sensitive if server support [constant FEATURE_CONTEXT_SENSITIVE_CASE_CONVERSION] feature (supported by [TextServerAdvanced]).  
         *      
         *  **Note:** The result may be longer or shorter than the original.  
         */
        string_to_lower(string_: string, language?: string /* = '' */): string
        
        /** Returns the string converted to `Title Case`.  
         *      
         *  **Note:** Casing is locale dependent and context sensitive if server support [constant FEATURE_CONTEXT_SENSITIVE_CASE_CONVERSION] feature (supported by [TextServerAdvanced]).  
         *      
         *  **Note:** The result may be longer or shorter than the original.  
         */
        string_to_title(string_: string, language?: string /* = '' */): string
        
        /** Default implementation of the BiDi algorithm override function. */
        parse_structured_text(parser_type: TextServer.StructuredTextParser, args: GArray, text: string): GArray<Vector3i>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTextServer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTextServer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTextServerAdvanced extends __RPCMapTextServerExtension {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTextServerAdvanced extends __NameMapTextServerExtension {
    }
    /** An advanced text server with support for BiDi, complex text layout, and contextual OpenType features. Used in Godot by default.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_textserveradvanced.html  
     */
    class TextServerAdvanced extends TextServerExtension {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTextServerAdvanced;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTextServerAdvanced;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTextServerDummy extends __RPCMapTextServerExtension {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTextServerDummy extends __NameMapTextServerExtension {
    }
    /** A dummy text server that can't render text or manage fonts.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_textserverdummy.html  
     */
    class TextServerDummy extends TextServerExtension {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTextServerDummy;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTextServerDummy;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTextServerExtension extends __RPCMapTextServer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTextServerExtension extends __NameMapTextServer {
    }
    /** Base class for custom [TextServer] implementations (plugins).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_textserverextension.html  
     */
    class TextServerExtension extends TextServer {
        constructor(identifier?: any)
        /** Returns `true` if the server supports a feature. */
        /* gdvirtual */ _has_feature(feature: TextServer.Feature): boolean
        
        /** Returns the name of the server interface. */
        /* gdvirtual */ _get_name(): string
        
        /** Returns text server features, see [enum TextServer.Feature]. */
        /* gdvirtual */ _get_features(): int64
        
        /** Frees an object created by this [TextServer]. */
        /* gdvirtual */ _free_rid(rid: RID): void
        
        /** Returns `true` if [param rid] is valid resource owned by this text server. */
        /* gdvirtual */ _has(rid: RID): boolean
        
        /** Loads optional TextServer database (e.g. ICU break iterators and dictionaries). */
        /* gdvirtual */ _load_support_data(filename: string): boolean
        
        /** Returns default TextServer database (e.g. ICU break iterators and dictionaries) filename. */
        /* gdvirtual */ _get_support_data_filename(): string
        
        /** Returns TextServer database (e.g. ICU break iterators and dictionaries) description. */
        /* gdvirtual */ _get_support_data_info(): string
        
        /** Saves optional TextServer database (e.g. ICU break iterators and dictionaries) to the file. */
        /* gdvirtual */ _save_support_data(filename: string): boolean
        
        /** Returns default TextServer database (e.g. ICU break iterators and dictionaries). */
        /* gdvirtual */ _get_support_data(): PackedByteArray
        
        /** Returns `true` if the locale requires text server support data for line/word breaking. */
        /* gdvirtual */ _is_locale_using_support_data(locale: string): boolean
        
        /** Returns `true` if locale is right-to-left. */
        /* gdvirtual */ _is_locale_right_to_left(locale: string): boolean
        
        /** Converts the given readable name of a feature, variation, script, or language to an OpenType tag. */
        /* gdvirtual */ _name_to_tag(name: string): int64
        
        /** Converts the given OpenType tag to the readable name of a feature, variation, script, or language. */
        /* gdvirtual */ _tag_to_name(tag: int64): string
        
        /** Creates a new, empty font cache entry resource. */
        /* gdvirtual */ _create_font(): RID
        
        /** Optional, implement if font supports extra spacing or baseline offset.  
         *  Creates a new variation existing font which is reusing the same glyph cache and font data.  
         */
        /* gdvirtual */ _create_font_linked_variation(font_rid: RID): RID
        
        /** Sets font source data, e.g contents of the dynamic font source file. */
        /* gdvirtual */ _font_set_data(font_rid: RID, data: PackedByteArray | byte[] | ArrayBuffer): void
        
        /** Sets pointer to the font source data, e.g contents of the dynamic font source file. */
        /* gdvirtual */ _font_set_data_ptr(font_rid: RID, data_ptr: int64, data_size: int64): void
        
        /** Sets an active face index in the TrueType / OpenType collection. */
        /* gdvirtual */ _font_set_face_index(font_rid: RID, face_index: int64): void
        
        /** Returns an active face index in the TrueType / OpenType collection. */
        /* gdvirtual */ _font_get_face_index(font_rid: RID): int64
        
        /** Returns number of faces in the TrueType / OpenType collection. */
        /* gdvirtual */ _font_get_face_count(font_rid: RID): int64
        
        /** Sets the font style flags. */
        /* gdvirtual */ _font_set_style(font_rid: RID, style: TextServer.FontStyle): void
        
        /** Returns font style flags. */
        /* gdvirtual */ _font_get_style(font_rid: RID): TextServer.FontStyle
        
        /** Sets the font family name. */
        /* gdvirtual */ _font_set_name(font_rid: RID, name: string): void
        
        /** Returns font family name. */
        /* gdvirtual */ _font_get_name(font_rid: RID): string
        
        /** Returns [Dictionary] with OpenType font name strings (localized font names, version, description, license information, sample text, etc.). */
        /* gdvirtual */ _font_get_ot_name_strings(font_rid: RID): GDictionary
        
        /** Sets the font style name. */
        /* gdvirtual */ _font_set_style_name(font_rid: RID, name_style: string): void
        
        /** Returns font style name. */
        /* gdvirtual */ _font_get_style_name(font_rid: RID): string
        
        /** Sets weight (boldness) of the font. A value in the `100...999` range, normal font weight is `400`, bold font weight is `700`. */
        /* gdvirtual */ _font_set_weight(font_rid: RID, weight: int64): void
        
        /** Returns weight (boldness) of the font. A value in the `100...999` range, normal font weight is `400`, bold font weight is `700`. */
        /* gdvirtual */ _font_get_weight(font_rid: RID): int64
        
        /** Sets font stretch amount, compared to a normal width. A percentage value between `50%` and `200%`. */
        /* gdvirtual */ _font_set_stretch(font_rid: RID, stretch: int64): void
        
        /** Returns font stretch amount, compared to a normal width. A percentage value between `50%` and `200%`. */
        /* gdvirtual */ _font_get_stretch(font_rid: RID): int64
        
        /** Sets font anti-aliasing mode. */
        /* gdvirtual */ _font_set_antialiasing(font_rid: RID, antialiasing: TextServer.FontAntialiasing): void
        
        /** Returns font anti-aliasing mode. */
        /* gdvirtual */ _font_get_antialiasing(font_rid: RID): TextServer.FontAntialiasing
        
        /** If set to `true`, embedded font bitmap loading is disabled. */
        /* gdvirtual */ _font_set_disable_embedded_bitmaps(font_rid: RID, disable_embedded_bitmaps: boolean): void
        
        /** Returns whether the font's embedded bitmap loading is disabled. */
        /* gdvirtual */ _font_get_disable_embedded_bitmaps(font_rid: RID): boolean
        
        /** If set to `true` font texture mipmap generation is enabled. */
        /* gdvirtual */ _font_set_generate_mipmaps(font_rid: RID, generate_mipmaps: boolean): void
        
        /** Returns `true` if font texture mipmap generation is enabled. */
        /* gdvirtual */ _font_get_generate_mipmaps(font_rid: RID): boolean
        
        /** If set to `true`, glyphs of all sizes are rendered using single multichannel signed distance field generated from the dynamic font vector data. MSDF rendering allows displaying the font at any scaling factor without blurriness, and without incurring a CPU cost when the font size changes (since the font no longer needs to be rasterized on the CPU). As a downside, font hinting is not available with MSDF. The lack of font hinting may result in less crisp and less readable fonts at small sizes. */
        /* gdvirtual */ _font_set_multichannel_signed_distance_field(font_rid: RID, msdf: boolean): void
        
        /** Returns `true` if glyphs of all sizes are rendered using single multichannel signed distance field generated from the dynamic font vector data. */
        /* gdvirtual */ _font_is_multichannel_signed_distance_field(font_rid: RID): boolean
        
        /** Sets the width of the range around the shape between the minimum and maximum representable signed distance. */
        /* gdvirtual */ _font_set_msdf_pixel_range(font_rid: RID, msdf_pixel_range: int64): void
        
        /** Returns the width of the range around the shape between the minimum and maximum representable signed distance. */
        /* gdvirtual */ _font_get_msdf_pixel_range(font_rid: RID): int64
        
        /** Sets source font size used to generate MSDF textures. */
        /* gdvirtual */ _font_set_msdf_size(font_rid: RID, msdf_size: int64): void
        
        /** Returns source font size used to generate MSDF textures. */
        /* gdvirtual */ _font_get_msdf_size(font_rid: RID): int64
        
        /** Sets bitmap font fixed size. If set to value greater than zero, same cache entry will be used for all font sizes. */
        /* gdvirtual */ _font_set_fixed_size(font_rid: RID, fixed_size: int64): void
        
        /** Returns bitmap font fixed size. */
        /* gdvirtual */ _font_get_fixed_size(font_rid: RID): int64
        
        /** Sets bitmap font scaling mode. This property is used only if `fixed_size` is greater than zero. */
        /* gdvirtual */ _font_set_fixed_size_scale_mode(font_rid: RID, fixed_size_scale_mode: TextServer.FixedSizeScaleMode): void
        
        /** Returns bitmap font scaling mode. */
        /* gdvirtual */ _font_get_fixed_size_scale_mode(font_rid: RID): TextServer.FixedSizeScaleMode
        
        /** If set to `true`, system fonts can be automatically used as fallbacks. */
        /* gdvirtual */ _font_set_allow_system_fallback(font_rid: RID, allow_system_fallback: boolean): void
        
        /** Returns `true` if system fonts can be automatically used as fallbacks. */
        /* gdvirtual */ _font_is_allow_system_fallback(font_rid: RID): boolean
        
        /** Frees all automatically loaded system fonts. */
        /* gdvirtual */ _font_clear_system_fallback_cache(): void
        
        /** If set to `true` auto-hinting is preferred over font built-in hinting. */
        /* gdvirtual */ _font_set_force_autohinter(font_rid: RID, force_autohinter: boolean): void
        
        /** Returns `true` if auto-hinting is supported and preferred over font built-in hinting. */
        /* gdvirtual */ _font_is_force_autohinter(font_rid: RID): boolean
        
        /** If set to `true`, color modulation is applied when drawing colored glyphs, otherwise it's applied to the monochrome glyphs only. */
        /* gdvirtual */ _font_set_modulate_color_glyphs(font_rid: RID, modulate: boolean): void
        
        /** Returns `true` if color modulation is applied when drawing the font's colored glyphs. */
        /* gdvirtual */ _font_is_modulate_color_glyphs(font_rid: RID): boolean
        
        /** Sets font hinting mode. Used by dynamic fonts only. */
        /* gdvirtual */ _font_set_hinting(font_rid: RID, hinting: TextServer.Hinting): void
        
        /** Returns the font hinting mode. Used by dynamic fonts only. */
        /* gdvirtual */ _font_get_hinting(font_rid: RID): TextServer.Hinting
        
        /** Sets font subpixel glyph positioning mode. */
        /* gdvirtual */ _font_set_subpixel_positioning(font_rid: RID, subpixel_positioning: TextServer.SubpixelPositioning): void
        
        /** Returns font subpixel glyph positioning mode. */
        /* gdvirtual */ _font_get_subpixel_positioning(font_rid: RID): TextServer.SubpixelPositioning
        
        /** Sets glyph position rounding behavior. If set to `true`, when aligning glyphs to the pixel boundaries rounding remainders are accumulated to ensure more uniform glyph distribution. This setting has no effect if subpixel positioning is enabled. */
        /* gdvirtual */ _font_set_keep_rounding_remainders(font_rid: RID, keep_rounding_remainders: boolean): void
        
        /** Returns glyph position rounding behavior. If set to `true`, when aligning glyphs to the pixel boundaries rounding remainders are accumulated to ensure more uniform glyph distribution. This setting has no effect if subpixel positioning is enabled. */
        /* gdvirtual */ _font_get_keep_rounding_remainders(font_rid: RID): boolean
        
        /** Sets font embolden strength. If [param strength] is not equal to zero, emboldens the font outlines. Negative values reduce the outline thickness. */
        /* gdvirtual */ _font_set_embolden(font_rid: RID, strength: float64): void
        
        /** Returns font embolden strength. */
        /* gdvirtual */ _font_get_embolden(font_rid: RID): float64
        
        /** Sets the spacing for [param spacing] to [param value] in pixels (not relative to the font size). */
        /* gdvirtual */ _font_set_spacing(font_rid: RID, spacing: TextServer.SpacingType, value: int64): void
        
        /** Returns the spacing for [param spacing] in pixels (not relative to the font size). */
        /* gdvirtual */ _font_get_spacing(font_rid: RID, spacing: TextServer.SpacingType): int64
        
        /** Sets extra baseline offset (as a fraction of font height). */
        /* gdvirtual */ _font_set_baseline_offset(font_rid: RID, baseline_offset: float64): void
        
        /** Returns extra baseline offset (as a fraction of font height). */
        /* gdvirtual */ _font_get_baseline_offset(font_rid: RID): float64
        
        /** Sets 2D transform, applied to the font outlines, can be used for slanting, flipping, and rotating glyphs. */
        /* gdvirtual */ _font_set_transform(font_rid: RID, transform: Transform2D): void
        
        /** Returns 2D transform applied to the font outlines. */
        /* gdvirtual */ _font_get_transform(font_rid: RID): Transform2D
        
        /** Sets variation coordinates for the specified font cache entry. */
        /* gdvirtual */ _font_set_variation_coordinates(font_rid: RID, variation_coordinates: GDictionary): void
        
        /** Returns variation coordinates for the specified font cache entry. */
        /* gdvirtual */ _font_get_variation_coordinates(font_rid: RID): GDictionary
        
        /** If set to a positive value, overrides the oversampling factor of the viewport this font is used in. See [member Viewport.oversampling]. This value doesn't override the [code skip-lint]oversampling` parameter of [code skip-lint]draw_*` methods. Used by dynamic fonts only. */
        /* gdvirtual */ _font_set_oversampling(font_rid: RID, oversampling: float64): void
        
        /** Returns oversampling factor override. If set to a positive value, overrides the oversampling factor of the viewport this font is used in. See [member Viewport.oversampling]. This value doesn't override the [code skip-lint]oversampling` parameter of [code skip-lint]draw_*` methods. Used by dynamic fonts only. */
        /* gdvirtual */ _font_get_oversampling(font_rid: RID): float64
        
        /** Returns list of the font sizes in the cache. Each size is [Vector2i] with font size and outline size. */
        /* gdvirtual */ _font_get_size_cache_list(font_rid: RID): GArray<Vector2i>
        
        /** Removes all font sizes from the cache entry. */
        /* gdvirtual */ _font_clear_size_cache(font_rid: RID): void
        
        /** Removes specified font size from the cache entry. */
        /* gdvirtual */ _font_remove_size_cache(font_rid: RID, size: Vector2i): void
        
        /** Returns font cache information, each entry contains the following fields: `Vector2i size_px` - font size in pixels, `float viewport_oversampling` - viewport oversampling factor, `int glyphs` - number of rendered glyphs, `int textures` - number of used textures, `int textures_size` - size of texture data in bytes. */
        /* gdvirtual */ _font_get_size_cache_info(font_rid: RID): GArray<GDictionary>
        
        /** Sets the font ascent (number of pixels above the baseline). */
        /* gdvirtual */ _font_set_ascent(font_rid: RID, size: int64, ascent: float64): void
        
        /** Returns the font ascent (number of pixels above the baseline). */
        /* gdvirtual */ _font_get_ascent(font_rid: RID, size: int64): float64
        
        /** Sets the font descent (number of pixels below the baseline). */
        /* gdvirtual */ _font_set_descent(font_rid: RID, size: int64, descent: float64): void
        
        /** Returns the font descent (number of pixels below the baseline). */
        /* gdvirtual */ _font_get_descent(font_rid: RID, size: int64): float64
        
        /** Sets pixel offset of the underline below the baseline. */
        /* gdvirtual */ _font_set_underline_position(font_rid: RID, size: int64, underline_position: float64): void
        
        /** Returns pixel offset of the underline below the baseline. */
        /* gdvirtual */ _font_get_underline_position(font_rid: RID, size: int64): float64
        
        /** Sets thickness of the underline in pixels. */
        /* gdvirtual */ _font_set_underline_thickness(font_rid: RID, size: int64, underline_thickness: float64): void
        
        /** Returns thickness of the underline in pixels. */
        /* gdvirtual */ _font_get_underline_thickness(font_rid: RID, size: int64): float64
        
        /** Sets scaling factor of the color bitmap font. */
        /* gdvirtual */ _font_set_scale(font_rid: RID, size: int64, scale: float64): void
        
        /** Returns scaling factor of the color bitmap font. */
        /* gdvirtual */ _font_get_scale(font_rid: RID, size: int64): float64
        
        /** Returns number of textures used by font cache entry. */
        /* gdvirtual */ _font_get_texture_count(font_rid: RID, size: Vector2i): int64
        
        /** Removes all textures from font cache entry. */
        /* gdvirtual */ _font_clear_textures(font_rid: RID, size: Vector2i): void
        
        /** Removes specified texture from the cache entry. */
        /* gdvirtual */ _font_remove_texture(font_rid: RID, size: Vector2i, texture_index: int64): void
        
        /** Sets font cache texture image data. */
        /* gdvirtual */ _font_set_texture_image(font_rid: RID, size: Vector2i, texture_index: int64, image: Image): void
        
        /** Returns font cache texture image data. */
        /* gdvirtual */ _font_get_texture_image(font_rid: RID, size: Vector2i, texture_index: int64): null | Image
        
        /** Sets array containing glyph packing data. */
        /* gdvirtual */ _font_set_texture_offsets(font_rid: RID, size: Vector2i, texture_index: int64, offset: PackedInt32Array | int32[]): void
        
        /** Returns array containing glyph packing data. */
        /* gdvirtual */ _font_get_texture_offsets(font_rid: RID, size: Vector2i, texture_index: int64): PackedInt32Array
        
        /** Returns list of rendered glyphs in the cache entry. */
        /* gdvirtual */ _font_get_glyph_list(font_rid: RID, size: Vector2i): PackedInt32Array
        
        /** Removes all rendered glyph information from the cache entry. */
        /* gdvirtual */ _font_clear_glyphs(font_rid: RID, size: Vector2i): void
        
        /** Removes specified rendered glyph information from the cache entry. */
        /* gdvirtual */ _font_remove_glyph(font_rid: RID, size: Vector2i, glyph: int64): void
        
        /** Returns glyph advance (offset of the next glyph). */
        /* gdvirtual */ _font_get_glyph_advance(font_rid: RID, size: int64, glyph: int64): Vector2
        
        /** Sets glyph advance (offset of the next glyph). */
        /* gdvirtual */ _font_set_glyph_advance(font_rid: RID, size: int64, glyph: int64, advance: Vector2): void
        
        /** Returns glyph offset from the baseline. */
        /* gdvirtual */ _font_get_glyph_offset(font_rid: RID, size: Vector2i, glyph: int64): Vector2
        
        /** Sets glyph offset from the baseline. */
        /* gdvirtual */ _font_set_glyph_offset(font_rid: RID, size: Vector2i, glyph: int64, offset: Vector2): void
        
        /** Returns size of the glyph. */
        /* gdvirtual */ _font_get_glyph_size(font_rid: RID, size: Vector2i, glyph: int64): Vector2
        
        /** Sets size of the glyph. */
        /* gdvirtual */ _font_set_glyph_size(font_rid: RID, size: Vector2i, glyph: int64, gl_size: Vector2): void
        
        /** Returns rectangle in the cache texture containing the glyph. */
        /* gdvirtual */ _font_get_glyph_uv_rect(font_rid: RID, size: Vector2i, glyph: int64): Rect2
        
        /** Sets rectangle in the cache texture containing the glyph. */
        /* gdvirtual */ _font_set_glyph_uv_rect(font_rid: RID, size: Vector2i, glyph: int64, uv_rect: Rect2): void
        
        /** Returns index of the cache texture containing the glyph. */
        /* gdvirtual */ _font_get_glyph_texture_idx(font_rid: RID, size: Vector2i, glyph: int64): int64
        
        /** Sets index of the cache texture containing the glyph. */
        /* gdvirtual */ _font_set_glyph_texture_idx(font_rid: RID, size: Vector2i, glyph: int64, texture_idx: int64): void
        
        /** Returns resource ID of the cache texture containing the glyph. */
        /* gdvirtual */ _font_get_glyph_texture_rid(font_rid: RID, size: Vector2i, glyph: int64): RID
        
        /** Returns size of the cache texture containing the glyph. */
        /* gdvirtual */ _font_get_glyph_texture_size(font_rid: RID, size: Vector2i, glyph: int64): Vector2
        
        /** Returns outline contours of the glyph. */
        /* gdvirtual */ _font_get_glyph_contours(font_rid: RID, size: int64, index: int64): GDictionary
        
        /** Returns list of the kerning overrides. */
        /* gdvirtual */ _font_get_kerning_list(font_rid: RID, size: int64): GArray<Vector2i>
        
        /** Removes all kerning overrides. */
        /* gdvirtual */ _font_clear_kerning_map(font_rid: RID, size: int64): void
        
        /** Removes kerning override for the pair of glyphs. */
        /* gdvirtual */ _font_remove_kerning(font_rid: RID, size: int64, glyph_pair: Vector2i): void
        
        /** Sets kerning for the pair of glyphs. */
        /* gdvirtual */ _font_set_kerning(font_rid: RID, size: int64, glyph_pair: Vector2i, kerning: Vector2): void
        
        /** Returns kerning for the pair of glyphs. */
        /* gdvirtual */ _font_get_kerning(font_rid: RID, size: int64, glyph_pair: Vector2i): Vector2
        
        /** Returns the glyph index of a [param char], optionally modified by the [param variation_selector]. */
        /* gdvirtual */ _font_get_glyph_index(font_rid: RID, size: int64, char: int64, variation_selector: int64): int64
        
        /** Returns character code associated with [param glyph_index], or `0` if [param glyph_index] is invalid. */
        /* gdvirtual */ _font_get_char_from_glyph_index(font_rid: RID, size: int64, glyph_index: int64): int64
        
        /** Returns `true` if a Unicode [param char] is available in the font. */
        /* gdvirtual */ _font_has_char(font_rid: RID, char: int64): boolean
        
        /** Returns a string containing all the characters available in the font. */
        /* gdvirtual */ _font_get_supported_chars(font_rid: RID): string
        
        /** Returns an array containing all glyph indices in the font. */
        /* gdvirtual */ _font_get_supported_glyphs(font_rid: RID): PackedInt32Array
        
        /** Renders the range of characters to the font cache texture. */
        /* gdvirtual */ _font_render_range(font_rid: RID, size: Vector2i, start: int64, end: int64): void
        
        /** Renders specified glyph to the font cache texture. */
        /* gdvirtual */ _font_render_glyph(font_rid: RID, size: Vector2i, index: int64): void
        
        /** Draws single glyph into a canvas item at the position, using [param font_rid] at the size [param size]. If [param oversampling] is greater than zero, it is used as font oversampling factor, otherwise viewport oversampling settings are used. */
        /* gdvirtual */ _font_draw_glyph(font_rid: RID, canvas: RID, size: int64, pos: Vector2, index: int64, color: Color, oversampling: float64): void
        
        /** Draws single glyph outline of size [param outline_size] into a canvas item at the position, using [param font_rid] at the size [param size]. If [param oversampling] is greater than zero, it is used as font oversampling factor, otherwise viewport oversampling settings are used. */
        /* gdvirtual */ _font_draw_glyph_outline(font_rid: RID, canvas: RID, size: int64, outline_size: int64, pos: Vector2, index: int64, color: Color, oversampling: float64): void
        
        /** Returns `true` if the font supports the given language (as a [url=https://en.wikipedia.org/wiki/ISO_639-1]ISO 639[/url] code). */
        /* gdvirtual */ _font_is_language_supported(font_rid: RID, language: string): boolean
        
        /** Adds override for [method _font_is_language_supported]. */
        /* gdvirtual */ _font_set_language_support_override(font_rid: RID, language: string, supported: boolean): void
        
        /** Returns `true` if support override is enabled for the [param language]. */
        /* gdvirtual */ _font_get_language_support_override(font_rid: RID, language: string): boolean
        
        /** Remove language support override. */
        /* gdvirtual */ _font_remove_language_support_override(font_rid: RID, language: string): void
        
        /** Returns list of language support overrides. */
        /* gdvirtual */ _font_get_language_support_overrides(font_rid: RID): PackedStringArray
        
        /** Returns `true` if the font supports the given script (as a [url=https://en.wikipedia.org/wiki/ISO_15924]ISO 15924[/url] code). */
        /* gdvirtual */ _font_is_script_supported(font_rid: RID, script: string): boolean
        
        /** Adds override for [method _font_is_script_supported]. */
        /* gdvirtual */ _font_set_script_support_override(font_rid: RID, script: string, supported: boolean): void
        
        /** Returns `true` if support override is enabled for the [param script]. */
        /* gdvirtual */ _font_get_script_support_override(font_rid: RID, script: string): boolean
        
        /** Removes script support override. */
        /* gdvirtual */ _font_remove_script_support_override(font_rid: RID, script: string): void
        
        /** Returns list of script support overrides. */
        /* gdvirtual */ _font_get_script_support_overrides(font_rid: RID): PackedStringArray
        
        /** Sets font OpenType feature set override. */
        /* gdvirtual */ _font_set_opentype_feature_overrides(font_rid: RID, overrides: GDictionary): void
        
        /** Returns font OpenType feature set override. */
        /* gdvirtual */ _font_get_opentype_feature_overrides(font_rid: RID): GDictionary
        
        /** Returns the dictionary of the supported OpenType features. */
        /* gdvirtual */ _font_supported_feature_list(font_rid: RID): GDictionary
        
        /** Returns the dictionary of the supported OpenType variation coordinates. */
        /* gdvirtual */ _font_supported_variation_list(font_rid: RID): GDictionary
        
        /** Returns the font oversampling factor, shared by all fonts in the TextServer. */
        /* gdvirtual */ _font_get_global_oversampling(): float64
        
        /** Sets oversampling factor, shared by all font in the TextServer. */
        /* gdvirtual */ _font_set_global_oversampling(oversampling: float64): void
        
        /** Increases the reference count of the specified oversampling level. This method is called by [Viewport], and should not be used directly. */
        /* gdvirtual */ _reference_oversampling_level(oversampling: float64): void
        
        /** Decreases the reference count of the specified oversampling level, and frees the font cache for oversampling level when the reference count reaches zero. This method is called by [Viewport], and should not be used directly. */
        /* gdvirtual */ _unreference_oversampling_level(oversampling: float64): void
        
        /** Returns size of the replacement character (box with character hexadecimal code that is drawn in place of invalid characters). */
        /* gdvirtual */ _get_hex_code_box_size(size: int64, index: int64): Vector2
        
        /** Draws box displaying character hexadecimal code. */
        /* gdvirtual */ _draw_hex_code_box(canvas: RID, size: int64, pos: Vector2, index: int64, color: Color): void
        
        /** Creates a new buffer for complex text layout, with the given [param direction] and [param orientation]. */
        /* gdvirtual */ _create_shaped_text(direction: TextServer.Direction, orientation: TextServer.Orientation): RID
        
        /** Clears text buffer (removes text and inline objects). */
        /* gdvirtual */ _shaped_text_clear(shaped: RID): void
        
        /** Duplicates shaped text buffer. */
        /* gdvirtual */ _shaped_text_duplicate(shaped: RID): RID
        
        /** Sets desired text direction. If set to [constant TextServer.DIRECTION_AUTO], direction will be detected based on the buffer contents and current locale. */
        /* gdvirtual */ _shaped_text_set_direction(shaped: RID, direction: TextServer.Direction): void
        
        /** Returns direction of the text. */
        /* gdvirtual */ _shaped_text_get_direction(shaped: RID): TextServer.Direction
        
        /** Returns direction of the text, inferred by the BiDi algorithm. */
        /* gdvirtual */ _shaped_text_get_inferred_direction(shaped: RID): TextServer.Direction
        
        /** Overrides BiDi for the structured text. */
        /* gdvirtual */ _shaped_text_set_bidi_override(shaped: RID, override: GArray): void
        
        /** Sets custom punctuation character list, used for word breaking. If set to empty string, server defaults are used. */
        /* gdvirtual */ _shaped_text_set_custom_punctuation(shaped: RID, punct: string): void
        
        /** Returns custom punctuation character list, used for word breaking. If set to empty string, server defaults are used. */
        /* gdvirtual */ _shaped_text_get_custom_punctuation(shaped: RID): string
        
        /** Sets ellipsis character used for text clipping. */
        /* gdvirtual */ _shaped_text_set_custom_ellipsis(shaped: RID, char: int64): void
        
        /** Returns ellipsis character used for text clipping. */
        /* gdvirtual */ _shaped_text_get_custom_ellipsis(shaped: RID): int64
        
        /** Sets desired text orientation. */
        /* gdvirtual */ _shaped_text_set_orientation(shaped: RID, orientation: TextServer.Orientation): void
        
        /** Returns text orientation. */
        /* gdvirtual */ _shaped_text_get_orientation(shaped: RID): TextServer.Orientation
        
        /** If set to `true` text buffer will display invalid characters as hexadecimal codes, otherwise nothing is displayed. */
        /* gdvirtual */ _shaped_text_set_preserve_invalid(shaped: RID, enabled: boolean): void
        
        /** Returns `true` if text buffer is configured to display hexadecimal codes in place of invalid characters. */
        /* gdvirtual */ _shaped_text_get_preserve_invalid(shaped: RID): boolean
        
        /** If set to `true` text buffer will display control characters. */
        /* gdvirtual */ _shaped_text_set_preserve_control(shaped: RID, enabled: boolean): void
        
        /** Returns `true` if text buffer is configured to display control characters. */
        /* gdvirtual */ _shaped_text_get_preserve_control(shaped: RID): boolean
        
        /** Sets extra spacing added between glyphs or lines in pixels. */
        /* gdvirtual */ _shaped_text_set_spacing(shaped: RID, spacing: TextServer.SpacingType, value: int64): void
        
        /** Returns extra spacing added between glyphs or lines in pixels. */
        /* gdvirtual */ _shaped_text_get_spacing(shaped: RID, spacing: TextServer.SpacingType): int64
        
        /** Adds text span and font to draw it to the text buffer. */
        /* gdvirtual */ _shaped_text_add_string(shaped: RID, text: string, fonts: GArray<RID>, size: int64, opentype_features: GDictionary, language: string, meta: any): boolean
        
        /** Adds inline object to the text buffer, [param key] must be unique. In the text, object is represented as [param length] object replacement characters. */
        /* gdvirtual */ _shaped_text_add_object(shaped: RID, key: any, size: Vector2, inline_align: InlineAlignment, length: int64, baseline: float64): boolean
        
        /** Sets new size and alignment of embedded object. */
        /* gdvirtual */ _shaped_text_resize_object(shaped: RID, key: any, size: Vector2, inline_align: InlineAlignment, baseline: float64): boolean
        
        /** Returns `true` if an object with [param key] is embedded in this shaped text buffer. */
        /* gdvirtual */ _shaped_text_has_object(shaped: RID, key: any): boolean
        
        /** Returns the text buffer source text, including object replacement characters. */
        /* gdvirtual */ _shaped_get_text(shaped: RID): string
        
        /** Returns number of text spans added using [method _shaped_text_add_string] or [method _shaped_text_add_object]. */
        /* gdvirtual */ _shaped_get_span_count(shaped: RID): int64
        
        /** Returns text span metadata. */
        /* gdvirtual */ _shaped_get_span_meta(shaped: RID, index: int64): any
        
        /** Returns text embedded object key. */
        /* gdvirtual */ _shaped_get_span_embedded_object(shaped: RID, index: int64): any
        
        /** Returns the text span source text. */
        /* gdvirtual */ _shaped_get_span_text(shaped: RID, index: int64): string
        
        /** Returns the text span embedded object key. */
        /* gdvirtual */ _shaped_get_span_object(shaped: RID, index: int64): any
        
        /** Changes text span font, font size, and OpenType features, without changing the text. */
        /* gdvirtual */ _shaped_set_span_update_font(shaped: RID, index: int64, fonts: GArray<RID>, size: int64, opentype_features: GDictionary): void
        
        /** Returns the number of uniform text runs in the buffer. */
        /* gdvirtual */ _shaped_get_run_count(shaped: RID): int64
        
        /** Returns the source text of the [param index] text run (in visual order). */
        /* gdvirtual */ _shaped_get_run_text(shaped: RID, index: int64): string
        
        /** Returns the source text range of the [param index] text run (in visual order). */
        /* gdvirtual */ _shaped_get_run_range(shaped: RID, index: int64): Vector2i
        
        /** Returns the font RID of the [param index] text run (in visual order). */
        /* gdvirtual */ _shaped_get_run_font_rid(shaped: RID, index: int64): RID
        
        /** Returns the font size of the [param index] text run (in visual order). */
        /* gdvirtual */ _shaped_get_run_font_size(shaped: RID, index: int64): int64
        
        /** Returns the language of the [param index] text run (in visual order). */
        /* gdvirtual */ _shaped_get_run_language(shaped: RID, index: int64): string
        
        /** Returns the direction of the [param index] text run (in visual order). */
        /* gdvirtual */ _shaped_get_run_direction(shaped: RID, index: int64): TextServer.Direction
        
        /** Returns the embedded object of the [param index] text run (in visual order). */
        /* gdvirtual */ _shaped_get_run_object(shaped: RID, index: int64): any
        
        /** Returns text buffer for the substring of the text in the [param shaped] text buffer (including inline objects). */
        /* gdvirtual */ _shaped_text_substr(shaped: RID, start: int64, length: int64): RID
        
        /** Returns the parent buffer from which the substring originates. */
        /* gdvirtual */ _shaped_text_get_parent(shaped: RID): RID
        
        /** Adjusts text width to fit to specified width, returns new text width. */
        /* gdvirtual */ _shaped_text_fit_to_width(shaped: RID, width: float64, justification_flags: TextServer.JustificationFlag): float64
        
        /** Aligns shaped text to the given tab-stops. */
        /* gdvirtual */ _shaped_text_tab_align(shaped: RID, tab_stops: PackedFloat32Array | float32[]): float64
        
        /** Shapes buffer if it's not shaped. Returns `true` if the string is shaped successfully. */
        /* gdvirtual */ _shaped_text_shape(shaped: RID): boolean
        
        /** Updates break points in the shaped text. This method is called by default implementation of text breaking functions. */
        /* gdvirtual */ _shaped_text_update_breaks(shaped: RID): boolean
        
        /** Updates justification points in the shaped text. This method is called by default implementation of text justification functions. */
        /* gdvirtual */ _shaped_text_update_justification_ops(shaped: RID): boolean
        
        /** Returns `true` if buffer is successfully shaped. */
        /* gdvirtual */ _shaped_text_is_ready(shaped: RID): boolean
        
        /** Returns an array of glyphs in the visual order. */
        /* gdvirtual */ _shaped_text_get_glyphs(shaped: RID): int64
        
        /** Returns text glyphs in the logical order. */
        /* gdvirtual */ _shaped_text_sort_logical(shaped: RID): int64
        
        /** Returns number of glyphs in the buffer. */
        /* gdvirtual */ _shaped_text_get_glyph_count(shaped: RID): int64
        
        /** Returns substring buffer character range in the parent buffer. */
        /* gdvirtual */ _shaped_text_get_range(shaped: RID): Vector2i
        
        /** Breaks text to the lines and columns. Returns character ranges for each segment. */
        /* gdvirtual */ _shaped_text_get_line_breaks_adv(shaped: RID, width: PackedFloat32Array | float32[], start: int64, once: boolean, break_flags: TextServer.LineBreakFlag): PackedInt32Array
        
        /** Breaks text to the lines and returns character ranges for each line. */
        /* gdvirtual */ _shaped_text_get_line_breaks(shaped: RID, width: float64, start: int64, break_flags: TextServer.LineBreakFlag): PackedInt32Array
        
        /** Breaks text into words and returns array of character ranges. Use [param grapheme_flags] to set what characters are used for breaking. */
        /* gdvirtual */ _shaped_text_get_word_breaks(shaped: RID, grapheme_flags: TextServer.GraphemeFlag, skip_grapheme_flags: TextServer.GraphemeFlag): PackedInt32Array
        
        /** Returns the position of the overrun trim. */
        /* gdvirtual */ _shaped_text_get_trim_pos(shaped: RID): int64
        
        /** Returns position of the ellipsis. */
        /* gdvirtual */ _shaped_text_get_ellipsis_pos(shaped: RID): int64
        
        /** Returns number of glyphs in the ellipsis. */
        /* gdvirtual */ _shaped_text_get_ellipsis_glyph_count(shaped: RID): int64
        
        /** Returns array of the glyphs in the ellipsis. */
        /* gdvirtual */ _shaped_text_get_ellipsis_glyphs(shaped: RID): int64
        
        /** Trims text if it exceeds the given width. */
        /* gdvirtual */ _shaped_text_overrun_trim_to_width(shaped: RID, width: float64, trim_flags: TextServer.TextOverrunFlag): void
        
        /** Returns array of inline objects. */
        /* gdvirtual */ _shaped_text_get_objects(shaped: RID): GArray
        
        /** Returns bounding rectangle of the inline object. */
        /* gdvirtual */ _shaped_text_get_object_rect(shaped: RID, key: any): Rect2
        
        /** Returns the character range of the inline object. */
        /* gdvirtual */ _shaped_text_get_object_range(shaped: RID, key: any): Vector2i
        
        /** Returns the glyph index of the inline object. */
        /* gdvirtual */ _shaped_text_get_object_glyph(shaped: RID, key: any): int64
        
        /** Returns size of the text. */
        /* gdvirtual */ _shaped_text_get_size(shaped: RID): Vector2
        
        /** Returns the text ascent (number of pixels above the baseline for horizontal layout or to the left of baseline for vertical). */
        /* gdvirtual */ _shaped_text_get_ascent(shaped: RID): float64
        
        /** Returns the text descent (number of pixels below the baseline for horizontal layout or to the right of baseline for vertical). */
        /* gdvirtual */ _shaped_text_get_descent(shaped: RID): float64
        
        /** Returns width (for horizontal layout) or height (for vertical) of the text. */
        /* gdvirtual */ _shaped_text_get_width(shaped: RID): float64
        
        /** Returns pixel offset of the underline below the baseline. */
        /* gdvirtual */ _shaped_text_get_underline_position(shaped: RID): float64
        
        /** Returns thickness of the underline. */
        /* gdvirtual */ _shaped_text_get_underline_thickness(shaped: RID): float64
        
        /** Returns dominant direction of in the range of text. */
        /* gdvirtual */ _shaped_text_get_dominant_direction_in_range(shaped: RID, start: int64, end: int64): int64
        
        /** Returns shapes of the carets corresponding to the character offset [param position] in the text. Returned caret shape is 1 pixel wide rectangle. */
        /* gdvirtual */ _shaped_text_get_carets(shaped: RID, position: int64, caret: int64): void
        
        /** Returns selection rectangles for the specified character range. */
        /* gdvirtual */ _shaped_text_get_selection(shaped: RID, start: int64, end: int64): PackedVector2Array
        
        /** Returns grapheme index at the specified pixel offset at the baseline, or `-1` if none is found. */
        /* gdvirtual */ _shaped_text_hit_test_grapheme(shaped: RID, coord: float64): int64
        
        /** Returns caret character offset at the specified pixel offset at the baseline. This function always returns a valid position. */
        /* gdvirtual */ _shaped_text_hit_test_position(shaped: RID, coord: float64): int64
        
        /** Draw shaped text into a canvas item at a given position, with [param color]. [param pos] specifies the leftmost point of the baseline (for horizontal layout) or topmost point of the baseline (for vertical layout). If [param oversampling] is greater than zero, it is used as font oversampling factor, otherwise viewport oversampling settings are used. */
        /* gdvirtual */ _shaped_text_draw(shaped: RID, canvas: RID, pos: Vector2, clip_l: float64, clip_r: float64, color: Color, oversampling: float64): void
        
        /** Draw the outline of the shaped text into a canvas item at a given position, with [param color]. [param pos] specifies the leftmost point of the baseline (for horizontal layout) or topmost point of the baseline (for vertical layout). If [param oversampling] is greater than zero, it is used as font oversampling factor, otherwise viewport oversampling settings are used. */
        /* gdvirtual */ _shaped_text_draw_outline(shaped: RID, canvas: RID, pos: Vector2, clip_l: float64, clip_r: float64, outline_size: int64, color: Color, oversampling: float64): void
        
        /** Returns composite character's bounds as offsets from the start of the line. */
        /* gdvirtual */ _shaped_text_get_grapheme_bounds(shaped: RID, pos: int64): Vector2
        
        /** Returns grapheme end position closest to the [param pos]. */
        /* gdvirtual */ _shaped_text_next_grapheme_pos(shaped: RID, pos: int64): int64
        
        /** Returns grapheme start position closest to the [param pos]. */
        /* gdvirtual */ _shaped_text_prev_grapheme_pos(shaped: RID, pos: int64): int64
        
        /** Returns array of the composite character boundaries. */
        /* gdvirtual */ _shaped_text_get_character_breaks(shaped: RID): PackedInt32Array
        
        /** Returns composite character end position closest to the [param pos]. */
        /* gdvirtual */ _shaped_text_next_character_pos(shaped: RID, pos: int64): int64
        
        /** Returns composite character start position closest to the [param pos]. */
        /* gdvirtual */ _shaped_text_prev_character_pos(shaped: RID, pos: int64): int64
        
        /** Returns composite character position closest to the [param pos]. */
        /* gdvirtual */ _shaped_text_closest_character_pos(shaped: RID, pos: int64): int64
        
        /** Converts a number from Western Arabic (0..9) to the numeral system used in the given [param language].  
         *  If [param language] is an empty string, the active locale will be used.  
         */
        /* gdvirtual */ _format_number(number: string, language: string): string
        
        /** Converts [param number] from the numeral system used in the given [param language] to Western Arabic (0..9).  
         *  If [param language] is an empty string, the active locale will be used.  
         */
        /* gdvirtual */ _parse_number(number: string, language: string): string
        
        /** Returns percent sign used in the given [param language]. */
        /* gdvirtual */ _percent_sign(language: string): string
        
        /** Strips diacritics from the string. */
        /* gdvirtual */ _strip_diacritics(string_: string): string
        
        /** Returns `true` if [param string] is a valid identifier. */
        /* gdvirtual */ _is_valid_identifier(string_: string): boolean
        /* gdvirtual */ _is_valid_letter(unicode: int64): boolean
        
        /** Returns an array of the word break boundaries. Elements in the returned array are the offsets of the start and end of words. Therefore the length of the array is always even. */
        /* gdvirtual */ _string_get_word_breaks(string_: string, language: string, chars_per_line: int64): PackedInt32Array
        
        /** Returns array of the composite character boundaries. */
        /* gdvirtual */ _string_get_character_breaks(string_: string, language: string): PackedInt32Array
        
        /** Returns index of the first string in [param dict] which is visually confusable with the [param string], or `-1` if none is found. */
        /* gdvirtual */ _is_confusable(string_: string, dict: PackedStringArray | string[]): int64
        
        /** Returns `true` if [param string] is likely to be an attempt at confusing the reader. */
        /* gdvirtual */ _spoof_check(string_: string): boolean
        
        /** Returns the string converted to `UPPERCASE`. */
        /* gdvirtual */ _string_to_upper(string_: string, language: string): string
        
        /** Returns the string converted to `lowercase`. */
        /* gdvirtual */ _string_to_lower(string_: string, language: string): string
        
        /** Returns the string converted to `Title Case`. */
        /* gdvirtual */ _string_to_title(string_: string, language: string): string
        
        /** Default implementation of the BiDi algorithm override function. */
        /* gdvirtual */ _parse_structured_text(parser_type: TextServer.StructuredTextParser, args: GArray, text: string): GArray<Vector3i>
        
        /** This method is called before text server is unregistered. */
        /* gdvirtual */ _cleanup(): void
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTextServerExtension;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTextServerExtension;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTextServerFallback extends __RPCMapTextServerExtension {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTextServerFallback extends __NameMapTextServerExtension {
    }
    /** A fallback implementation of Godot's text server, without support for BiDi and complex text layout.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_textserverfallback.html  
     */
    class TextServerFallback extends TextServerExtension {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTextServerFallback;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTextServerFallback;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTexture extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTexture extends __NameMapResource {
    }
    /** Base class for all texture types.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_texture.html  
     */
    class Texture extends Resource {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTexture;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTexture;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTexture2D extends __RPCMapTexture {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTexture2D extends __NameMapTexture {
    }
    /** Texture for 2D and 3D.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_texture2d.html  
     */
    class Texture2D extends Texture {
        constructor(identifier?: any)
        /** Called when the [Texture2D]'s width is queried. */
        /* gdvirtual */ _get_width(): int64
        
        /** Called when the [Texture2D]'s height is queried. */
        /* gdvirtual */ _get_height(): int64
        
        /** Called when a pixel's opaque state in the [Texture2D] is queried at the specified `(x, y)` position. */
        /* gdvirtual */ _is_pixel_opaque(x: int64, y: int64): boolean
        
        /** Called when the presence of an alpha channel in the [Texture2D] is queried. */
        /* gdvirtual */ _has_alpha(): boolean
        
        /** Called when the entire [Texture2D] is requested to be drawn over a [CanvasItem], with the top-left offset specified in [param pos]. [param modulate] specifies a multiplier for the colors being drawn, while [param transpose] specifies whether drawing should be performed in column-major order instead of row-major order (resulting in 90-degree clockwise rotation).  
         *      
         *  **Note:** This is only used in 2D rendering, not 3D.  
         */
        /* gdvirtual */ _draw(to_canvas_item: RID, pos: Vector2, modulate: Color, transpose: boolean): void
        
        /** Called when the [Texture2D] is requested to be drawn onto [CanvasItem]'s specified [param rect]. [param modulate] specifies a multiplier for the colors being drawn, while [param transpose] specifies whether drawing should be performed in column-major order instead of row-major order (resulting in 90-degree clockwise rotation).  
         *      
         *  **Note:** This is only used in 2D rendering, not 3D.  
         */
        /* gdvirtual */ _draw_rect(to_canvas_item: RID, rect: Rect2, tile: boolean, modulate: Color, transpose: boolean): void
        
        /** Called when a part of the [Texture2D] specified by [param src_rect]'s coordinates is requested to be drawn onto [CanvasItem]'s specified [param rect]. [param modulate] specifies a multiplier for the colors being drawn, while [param transpose] specifies whether drawing should be performed in column-major order instead of row-major order (resulting in 90-degree clockwise rotation).  
         *      
         *  **Note:** This is only used in 2D rendering, not 3D.  
         */
        /* gdvirtual */ _draw_rect_region(to_canvas_item: RID, rect: Rect2, src_rect: Rect2, modulate: Color, transpose: boolean, clip_uv: boolean): void
        
        /** Returns the texture width in pixels. */
        get_width(): int64
        
        /** Returns the texture height in pixels. */
        get_height(): int64
        
        /** Returns the texture size in pixels. */
        get_size(): Vector2
        
        /** Returns `true` if this [Texture2D] has an alpha channel. */
        has_alpha(): boolean
        
        /** Draws the texture using a [CanvasItem] with the [RenderingServer] API at the specified [param position]. */
        draw(canvas_item: RID, position: Vector2, modulate?: Color /* = new Color(1, 1, 1, 1) */, transpose?: boolean /* = false */): void
        
        /** Draws the texture using a [CanvasItem] with the [RenderingServer] API. */
        draw_rect(canvas_item: RID, rect: Rect2, tile: boolean, modulate?: Color /* = new Color(1, 1, 1, 1) */, transpose?: boolean /* = false */): void
        
        /** Draws a part of the texture using a [CanvasItem] with the [RenderingServer] API. */
        draw_rect_region(canvas_item: RID, rect: Rect2, src_rect: Rect2, modulate?: Color /* = new Color(1, 1, 1, 1) */, transpose?: boolean /* = false */, clip_uv?: boolean /* = true */): void
        
        /** Returns an [Image] that is a copy of data from this [Texture2D] (a new [Image] is created each time). [Image]s can be accessed and manipulated directly.  
         *      
         *  **Note:** This will return `null` if this [Texture2D] is invalid.  
         *      
         *  **Note:** This will fetch the texture data from the GPU, which might cause performance problems when overused. Avoid calling [method get_image] every frame, especially on large textures.  
         */
        get_image(): null | Image
        
        /** Creates a placeholder version of this resource ([PlaceholderTexture2D]). */
        create_placeholder(): Resource
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTexture2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTexture2D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTexture2DArray extends __RPCMapImageTextureLayered {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTexture2DArray extends __NameMapImageTextureLayered {
    }
    /** A single texture resource which consists of multiple, separate images. Each image has the same dimensions and number of mipmap levels.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_texture2darray.html  
     */
    class Texture2DArray extends ImageTextureLayered {
        constructor(identifier?: any)
        /** Creates a placeholder version of this resource ([PlaceholderTexture2DArray]). */
        create_placeholder(): Resource
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTexture2DArray;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTexture2DArray;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTexture2DArrayRD extends __RPCMapTextureLayeredRD {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTexture2DArrayRD extends __NameMapTextureLayeredRD {
    }
    /** Texture Array for 2D that is bound to a texture created on the [RenderingDevice].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_texture2darrayrd.html  
     */
    class Texture2DArrayRD extends TextureLayeredRD {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTexture2DArrayRD;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTexture2DArrayRD;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTexture2DRD extends __RPCMapTexture2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTexture2DRD extends __NameMapTexture2D {
    }
    /** Texture for 2D that is bound to a texture created on the [RenderingDevice].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_texture2drd.html  
     */
    class Texture2DRD extends Texture2D {
        constructor(identifier?: any)
        /** The RID of the texture object created on the [RenderingDevice]. */
        get texture_rd_rid(): RID
        set texture_rd_rid(value: RID)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTexture2DRD;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTexture2DRD;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTexture3D extends __RPCMapTexture {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTexture3D extends __NameMapTexture {
    }
    /** Base class for 3-dimensional textures.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_texture3d.html  
     */
    class Texture3D extends Texture {
        constructor(identifier?: any)
        /** Called when the [Texture3D]'s format is queried. */
        /* gdvirtual */ _get_format(): Image.Format
        
        /** Called when the [Texture3D]'s width is queried. */
        /* gdvirtual */ _get_width(): int64
        
        /** Called when the [Texture3D]'s height is queried. */
        /* gdvirtual */ _get_height(): int64
        
        /** Called when the [Texture3D]'s depth is queried. */
        /* gdvirtual */ _get_depth(): int64
        
        /** Called when the presence of mipmaps in the [Texture3D] is queried. */
        /* gdvirtual */ _has_mipmaps(): boolean
        
        /** Called when the [Texture3D]'s data is queried. */
        /* gdvirtual */ _get_data(): GArray<Image>
        
        /** Returns the current format being used by this texture. */
        get_format(): Image.Format
        
        /** Returns the [Texture3D]'s width in pixels. Width is typically represented by the X axis. */
        get_width(): int64
        
        /** Returns the [Texture3D]'s height in pixels. Width is typically represented by the Y axis. */
        get_height(): int64
        
        /** Returns the [Texture3D]'s depth in pixels. Depth is typically represented by the Z axis (a dimension not present in [Texture2D]). */
        get_depth(): int64
        
        /** Returns `true` if the [Texture3D] has generated mipmaps. */
        has_mipmaps(): boolean
        
        /** Returns the [Texture3D]'s data as an array of [Image]s. Each [Image] represents a  *slice*  of the [Texture3D], with different slices mapping to different depth (Z axis) levels. */
        get_data(): GArray<Image>
        
        /** Creates a placeholder version of this resource ([PlaceholderTexture3D]). */
        create_placeholder(): Resource
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTexture3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTexture3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTexture3DRD extends __RPCMapTexture3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTexture3DRD extends __NameMapTexture3D {
    }
    /** Texture for 3D that is bound to a texture created on the [RenderingDevice].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_texture3drd.html  
     */
    class Texture3DRD extends Texture3D {
        constructor(identifier?: any)
        /** The RID of the texture object created on the [RenderingDevice]. */
        get texture_rd_rid(): RID
        set texture_rd_rid(value: RID)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTexture3DRD;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTexture3DRD;
    }
    namespace TextureButton {
        enum StretchMode {
            /** Scale to fit the node's bounding rectangle. */
            STRETCH_SCALE = 0,
            
            /** Tile inside the node's bounding rectangle. */
            STRETCH_TILE = 1,
            
            /** The texture keeps its original size and stays in the bounding rectangle's top-left corner. */
            STRETCH_KEEP = 2,
            
            /** The texture keeps its original size and stays centered in the node's bounding rectangle. */
            STRETCH_KEEP_CENTERED = 3,
            
            /** Scale the texture to fit the node's bounding rectangle, but maintain the texture's aspect ratio. */
            STRETCH_KEEP_ASPECT = 4,
            
            /** Scale the texture to fit the node's bounding rectangle, center it, and maintain its aspect ratio. */
            STRETCH_KEEP_ASPECT_CENTERED = 5,
            
            /** Scale the texture so that the shorter side fits the bounding rectangle. The other side clips to the node's limits. */
            STRETCH_KEEP_ASPECT_COVERED = 6,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTextureButton extends __RPCMapBaseButton {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTextureButton extends __NameMapBaseButton {
    }
    /** Texture-based button. Supports Pressed, Hover, Disabled and Focused states.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_texturebutton.html  
     */
    class TextureButton<Map extends NodePathMap = any> extends BaseButton<Map> {
        constructor(identifier?: any)
        /** Texture to display by default, when the node is **not** in the disabled, hover or pressed state. This texture is still displayed in the focused state, with [member texture_focused] drawn on top. */
        get texture_normal(): null | Texture2D
        set texture_normal(value: null | Texture2D)
        
        /** Texture to display on mouse down over the node, if the node has keyboard focus and the player presses the Enter key or if the player presses the [member BaseButton.shortcut] key. If not assigned, the [TextureButton] displays [member texture_hover] instead when pressed. */
        get texture_pressed(): null | Texture2D
        set texture_pressed(value: null | Texture2D)
        
        /** Texture to display when the mouse hovers over the node. If not assigned, the [TextureButton] displays [member texture_normal] instead when hovered over. */
        get texture_hover(): null | Texture2D
        set texture_hover(value: null | Texture2D)
        
        /** Texture to display when the node is disabled. See [member BaseButton.disabled]. If not assigned, the [TextureButton] displays [member texture_normal] instead. */
        get texture_disabled(): null | Texture2D
        set texture_disabled(value: null | Texture2D)
        
        /** Texture to  *overlay on the base texture*  when the node has mouse or keyboard focus. Because [member texture_focused] is displayed on top of the base texture, a partially transparent texture should be used to ensure the base texture remains visible. A texture that represents an outline or an underline works well for this purpose. To disable the focus visual effect, assign a fully transparent texture of any size. Note that disabling the focus visual effect will harm keyboard/controller navigation usability, so this is not recommended for accessibility reasons. */
        get texture_focused(): null | Texture2D
        set texture_focused(value: null | Texture2D)
        
        /** Pure black and white [BitMap] image to use for click detection. On the mask, white pixels represent the button's clickable area. Use it to create buttons with curved shapes. */
        get texture_click_mask(): null | BitMap
        set texture_click_mask(value: null | BitMap)
        
        /** If `true`, the size of the texture won't be considered for minimum size calculation, so the [TextureButton] can be shrunk down past the texture size. */
        get ignore_texture_size(): boolean
        set ignore_texture_size(value: boolean)
        
        /** Controls the texture's behavior when you resize the node's bounding rectangle. See the [enum StretchMode] constants for available options. */
        get stretch_mode(): int64
        set stretch_mode(value: int64)
        
        /** If `true`, texture is flipped horizontally. */
        get flip_h(): boolean
        set flip_h(value: boolean)
        
        /** If `true`, texture is flipped vertically. */
        get flip_v(): boolean
        set flip_v(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTextureButton;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTextureButton;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTextureCubemapArrayRD extends __RPCMapTextureLayeredRD {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTextureCubemapArrayRD extends __NameMapTextureLayeredRD {
    }
    /** Texture Array for Cubemaps that is bound to a texture created on the [RenderingDevice].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_texturecubemaparrayrd.html  
     */
    class TextureCubemapArrayRD extends TextureLayeredRD {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTextureCubemapArrayRD;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTextureCubemapArrayRD;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTextureCubemapRD extends __RPCMapTextureLayeredRD {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTextureCubemapRD extends __NameMapTextureLayeredRD {
    }
    /** Texture for Cubemap that is bound to a texture created on the [RenderingDevice].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_texturecubemaprd.html  
     */
    class TextureCubemapRD extends TextureLayeredRD {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTextureCubemapRD;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTextureCubemapRD;
    }
    namespace TextureLayered {
        enum LayeredType {
            /** Texture is a generic [Texture2DArray]. */
            LAYERED_TYPE_2D_ARRAY = 0,
            
            /** Texture is a [Cubemap], with each side in its own layer (6 in total). */
            LAYERED_TYPE_CUBEMAP = 1,
            
            /** Texture is a [CubemapArray], with each cubemap being made of 6 layers. */
            LAYERED_TYPE_CUBEMAP_ARRAY = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTextureLayered extends __RPCMapTexture {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTextureLayered extends __NameMapTexture {
    }
    /** Base class for texture types which contain the data of multiple [Image]s. Each image is of the same size and format.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_texturelayered.html  
     */
    class TextureLayered extends Texture {
        constructor(identifier?: any)
        /** Called when the [TextureLayered]'s format is queried. */
        /* gdvirtual */ _get_format(): Image.Format
        
        /** Called when the layers' type in the [TextureLayered] is queried. */
        /* gdvirtual */ _get_layered_type(): int64
        
        /** Called when the [TextureLayered]'s width queried. */
        /* gdvirtual */ _get_width(): int64
        
        /** Called when the [TextureLayered]'s height is queried. */
        /* gdvirtual */ _get_height(): int64
        
        /** Called when the number of layers in the [TextureLayered] is queried. */
        /* gdvirtual */ _get_layers(): int64
        
        /** Called when the presence of mipmaps in the [TextureLayered] is queried. */
        /* gdvirtual */ _has_mipmaps(): boolean
        
        /** Called when the data for a layer in the [TextureLayered] is queried. */
        /* gdvirtual */ _get_layer_data(layer_index: int64): null | Image
        
        /** Returns the current format being used by this texture. */
        get_format(): Image.Format
        
        /** Returns the [TextureLayered]'s type. The type determines how the data is accessed, with cubemaps having special types. */
        get_layered_type(): TextureLayered.LayeredType
        
        /** Returns the width of the texture in pixels. Width is typically represented by the X axis. */
        get_width(): int64
        
        /** Returns the height of the texture in pixels. Height is typically represented by the Y axis. */
        get_height(): int64
        
        /** Returns the number of referenced [Image]s. */
        get_layers(): int64
        
        /** Returns `true` if the layers have generated mipmaps. */
        has_mipmaps(): boolean
        
        /** Returns an [Image] resource with the data from specified [param layer]. */
        get_layer_data(layer: int64): null | Image
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTextureLayered;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTextureLayered;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTextureLayeredRD extends __RPCMapTextureLayered {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTextureLayeredRD extends __NameMapTextureLayered {
    }
    /** Abstract base class for layered texture RD types.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_texturelayeredrd.html  
     */
    class TextureLayeredRD extends TextureLayered {
        constructor(identifier?: any)
        /** The RID of the texture object created on the [RenderingDevice]. */
        get texture_rd_rid(): RID
        set texture_rd_rid(value: RID)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTextureLayeredRD;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTextureLayeredRD;
    }
    namespace TextureProgressBar {
        enum FillMode {
            /** The [member texture_progress] fills from left to right. */
            FILL_LEFT_TO_RIGHT = 0,
            
            /** The [member texture_progress] fills from right to left. */
            FILL_RIGHT_TO_LEFT = 1,
            
            /** The [member texture_progress] fills from top to bottom. */
            FILL_TOP_TO_BOTTOM = 2,
            
            /** The [member texture_progress] fills from bottom to top. */
            FILL_BOTTOM_TO_TOP = 3,
            
            /** Turns the node into a radial bar. The [member texture_progress] fills clockwise. See [member radial_center_offset], [member radial_initial_angle] and [member radial_fill_degrees] to control the way the bar fills up. */
            FILL_CLOCKWISE = 4,
            
            /** Turns the node into a radial bar. The [member texture_progress] fills counterclockwise. See [member radial_center_offset], [member radial_initial_angle] and [member radial_fill_degrees] to control the way the bar fills up. */
            FILL_COUNTER_CLOCKWISE = 5,
            
            /** The [member texture_progress] fills from the center, expanding both towards the left and the right. */
            FILL_BILINEAR_LEFT_AND_RIGHT = 6,
            
            /** The [member texture_progress] fills from the center, expanding both towards the top and the bottom. */
            FILL_BILINEAR_TOP_AND_BOTTOM = 7,
            
            /** Turns the node into a radial bar. The [member texture_progress] fills radially from the center, expanding both clockwise and counterclockwise. See [member radial_center_offset], [member radial_initial_angle] and [member radial_fill_degrees] to control the way the bar fills up. */
            FILL_CLOCKWISE_AND_COUNTER_CLOCKWISE = 8,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTextureProgressBar extends __RPCMapRange {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTextureProgressBar extends __NameMapRange {
    }
    /** Texture-based progress bar. Useful for loading screens and life or stamina bars.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_textureprogressbar.html  
     */
    class TextureProgressBar<Map extends NodePathMap = any> extends Range<Map> {
        constructor(identifier?: any)
        /** Sets the stretch margin with the specified index. See [member stretch_margin_bottom] and related properties. */
        set_stretch_margin(margin: Side, value: int64): void
        
        /** Returns the stretch margin with the specified index. See [member stretch_margin_bottom] and related properties. */
        get_stretch_margin(margin: Side): int64
        
        /** The fill direction. See [enum FillMode] for possible values. */
        get fill_mode(): int64
        set fill_mode(value: int64)
        
        /** Starting angle for the fill of [member texture_progress] if [member fill_mode] is [constant FILL_CLOCKWISE], [constant FILL_COUNTER_CLOCKWISE], or [constant FILL_CLOCKWISE_AND_COUNTER_CLOCKWISE]. When the node's `value` is equal to its `min_value`, the texture doesn't show up at all. When the `value` increases, the texture fills and tends towards [member radial_fill_degrees].  
         *      
         *  **Note:** [member radial_initial_angle] is wrapped between `0` and `360` degrees (inclusive).  
         */
        get radial_initial_angle(): float64
        set radial_initial_angle(value: float64)
        
        /** Upper limit for the fill of [member texture_progress] if [member fill_mode] is [constant FILL_CLOCKWISE], [constant FILL_COUNTER_CLOCKWISE], or [constant FILL_CLOCKWISE_AND_COUNTER_CLOCKWISE]. When the node's `value` is equal to its `max_value`, the texture fills up to this angle.  
         *  See [member Range.value], [member Range.max_value].  
         */
        get radial_fill_degrees(): float64
        set radial_fill_degrees(value: float64)
        
        /** Offsets [member texture_progress] if [member fill_mode] is [constant FILL_CLOCKWISE], [constant FILL_COUNTER_CLOCKWISE], or [constant FILL_CLOCKWISE_AND_COUNTER_CLOCKWISE].  
         *      
         *  **Note:** The effective radial center always stays within the [member texture_progress] bounds. If you need to move it outside the texture's bounds, modify the [member texture_progress] to contain additional empty space where needed.  
         */
        get radial_center_offset(): Vector2
        set radial_center_offset(value: Vector2)
        
        /** If `true`, Godot treats the bar's textures like in [NinePatchRect]. Use the `stretch_margin_*` properties like [member stretch_margin_bottom] to set up the nine patch's 3×3 grid. When using a radial [member fill_mode], this setting will only enable stretching for [member texture_progress], while [member texture_under] and [member texture_over] will be treated like in [NinePatchRect]. */
        get nine_patch_stretch(): boolean
        set nine_patch_stretch(value: boolean)
        
        /** The width of the 9-patch's left column. Only effective if [member nine_patch_stretch] is `true`. */
        get stretch_margin_left(): int64
        set stretch_margin_left(value: int64)
        
        /** The height of the 9-patch's top row. Only effective if [member nine_patch_stretch] is `true`. */
        get stretch_margin_top(): int64
        set stretch_margin_top(value: int64)
        
        /** The width of the 9-patch's right column. Only effective if [member nine_patch_stretch] is `true`. */
        get stretch_margin_right(): int64
        set stretch_margin_right(value: int64)
        
        /** The height of the 9-patch's bottom row. A margin of 16 means the 9-slice's bottom corners and side will have a height of 16 pixels. You can set all 4 margin values individually to create panels with non-uniform borders. Only effective if [member nine_patch_stretch] is `true`. */
        get stretch_margin_bottom(): int64
        set stretch_margin_bottom(value: int64)
        
        /** [Texture2D] that draws under the progress bar. The bar's background. */
        get texture_under(): null | Texture2D
        set texture_under(value: null | Texture2D)
        
        /** [Texture2D] that draws over the progress bar. Use it to add highlights or an upper-frame that hides part of [member texture_progress]. */
        get texture_over(): null | Texture2D
        set texture_over(value: null | Texture2D)
        
        /** [Texture2D] that clips based on the node's `value` and [member fill_mode]. As `value` increased, the texture fills up. It shows entirely when `value` reaches `max_value`. It doesn't show at all if `value` is equal to `min_value`.  
         *  The `value` property comes from [Range]. See [member Range.value], [member Range.min_value], [member Range.max_value].  
         */
        get texture_progress(): null | Texture2D
        set texture_progress(value: null | Texture2D)
        
        /** The offset of [member texture_progress]. Useful for [member texture_over] and [member texture_under] with fancy borders, to avoid transparent margins in your progress texture. */
        get texture_progress_offset(): Vector2
        set texture_progress_offset(value: Vector2)
        
        /** Multiplies the color of the bar's [member texture_under] texture. */
        get tint_under(): Color
        set tint_under(value: Color)
        
        /** Multiplies the color of the bar's [member texture_over] texture. The effect is similar to [member CanvasItem.modulate], except it only affects this specific texture instead of the entire node. */
        get tint_over(): Color
        set tint_over(value: Color)
        
        /** Multiplies the color of the bar's [member texture_progress] texture. */
        get tint_progress(): Color
        set tint_progress(value: Color)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTextureProgressBar;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTextureProgressBar;
    }
    namespace TextureRect {
        enum ExpandMode {
            /** The minimum size will be equal to texture size, i.e. [TextureRect] can't be smaller than the texture. */
            EXPAND_KEEP_SIZE = 0,
            
            /** The size of the texture won't be considered for minimum size calculation, so the [TextureRect] can be shrunk down past the texture size. */
            EXPAND_IGNORE_SIZE = 1,
            
            /** The height of the texture will be ignored. Minimum width will be equal to the current height. Useful for horizontal layouts, e.g. inside [HBoxContainer]. */
            EXPAND_FIT_WIDTH = 2,
            
            /** Same as [constant EXPAND_FIT_WIDTH], but keeps texture's aspect ratio. */
            EXPAND_FIT_WIDTH_PROPORTIONAL = 3,
            
            /** The width of the texture will be ignored. Minimum height will be equal to the current width. Useful for vertical layouts, e.g. inside [VBoxContainer]. */
            EXPAND_FIT_HEIGHT = 4,
            
            /** Same as [constant EXPAND_FIT_HEIGHT], but keeps texture's aspect ratio. */
            EXPAND_FIT_HEIGHT_PROPORTIONAL = 5,
        }
        enum StretchMode {
            /** Scale to fit the node's bounding rectangle. */
            STRETCH_SCALE = 0,
            
            /** Tile inside the node's bounding rectangle. */
            STRETCH_TILE = 1,
            
            /** The texture keeps its original size and stays in the bounding rectangle's top-left corner. */
            STRETCH_KEEP = 2,
            
            /** The texture keeps its original size and stays centered in the node's bounding rectangle. */
            STRETCH_KEEP_CENTERED = 3,
            
            /** Scale the texture to fit the node's bounding rectangle, but maintain the texture's aspect ratio. */
            STRETCH_KEEP_ASPECT = 4,
            
            /** Scale the texture to fit the node's bounding rectangle, center it and maintain its aspect ratio. */
            STRETCH_KEEP_ASPECT_CENTERED = 5,
            
            /** Scale the texture so that the shorter side fits the bounding rectangle. The other side clips to the node's limits. */
            STRETCH_KEEP_ASPECT_COVERED = 6,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTextureRect extends __RPCMapControl {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTextureRect extends __NameMapControl {
    }
    /** A control that displays a texture.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_texturerect.html  
     */
    class TextureRect<Map extends NodePathMap = any> extends Control<Map> {
        constructor(identifier?: any)
        /** The node's [Texture2D] resource. */
        get texture(): null | Texture2D
        set texture(value: null | Texture2D)
        
        /** Defines how minimum size is determined based on the texture's size. */
        get expand_mode(): int64
        set expand_mode(value: int64)
        
        /** Controls the texture's behavior when resizing the node's bounding rectangle. */
        get stretch_mode(): int64
        set stretch_mode(value: int64)
        
        /** If `true`, texture is flipped horizontally. */
        get flip_h(): boolean
        set flip_h(value: boolean)
        
        /** If `true`, texture is flipped vertically. */
        get flip_v(): boolean
        set flip_v(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTextureRect;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTextureRect;
    }
    namespace Theme {
        enum DataType {
            /** Theme's [Color] item type. */
            DATA_TYPE_COLOR = 0,
            
            /** Theme's constant item type. */
            DATA_TYPE_CONSTANT = 1,
            
            /** Theme's [Font] item type. */
            DATA_TYPE_FONT = 2,
            
            /** Theme's font size item type. */
            DATA_TYPE_FONT_SIZE = 3,
            
            /** Theme's icon [Texture2D] item type. */
            DATA_TYPE_ICON = 4,
            
            /** Theme's [StyleBox] item type. */
            DATA_TYPE_STYLEBOX = 5,
            
            /** Maximum value for the DataType enum. */
            DATA_TYPE_MAX = 6,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTheme extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTheme extends __NameMapResource {
    }
    /** A resource used for styling/skinning [Control]s and [Window]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_theme.html  
     */
    class Theme extends Resource {
        constructor(identifier?: any)
        /** Creates or changes the value of the icon property defined by [param name] and [param theme_type]. Use [method clear_icon] to remove the property. */
        set_icon(name: StringName, theme_type: StringName, texture: Texture2D): void
        
        /** Returns the icon property defined by [param name] and [param theme_type], if it exists.  
         *  Returns the engine fallback icon value if the property doesn't exist (see [member ThemeDB.fallback_icon]). Use [method has_icon] to check for existence.  
         */
        get_icon(name: StringName, theme_type: StringName): null | Texture2D
        
        /** Returns `true` if the icon property defined by [param name] and [param theme_type] exists.  
         *  Returns `false` if it doesn't exist. Use [method set_icon] to define it.  
         */
        has_icon(name: StringName, theme_type: StringName): boolean
        
        /** Renames the icon property defined by [param old_name] and [param theme_type] to [param name], if it exists.  
         *  Fails if it doesn't exist, or if a similar property with the new name already exists. Use [method has_icon] to check for existence, and [method clear_icon] to remove the existing property.  
         */
        rename_icon(old_name: StringName, name: StringName, theme_type: StringName): void
        
        /** Removes the icon property defined by [param name] and [param theme_type], if it exists.  
         *  Fails if it doesn't exist. Use [method has_icon] to check for existence.  
         */
        clear_icon(name: StringName, theme_type: StringName): void
        
        /** Returns a list of names for icon properties defined with [param theme_type]. Use [method get_icon_type_list] to get a list of possible theme type names. */
        get_icon_list(theme_type: string): PackedStringArray
        
        /** Returns a list of all unique theme type names for icon properties. Use [method get_type_list] to get a list of all unique theme types. */
        get_icon_type_list(): PackedStringArray
        
        /** Creates or changes the value of the [StyleBox] property defined by [param name] and [param theme_type]. Use [method clear_stylebox] to remove the property. */
        set_stylebox(name: StringName, theme_type: StringName, texture: StyleBox): void
        
        /** Returns the [StyleBox] property defined by [param name] and [param theme_type], if it exists.  
         *  Returns the engine fallback stylebox value if the property doesn't exist (see [member ThemeDB.fallback_stylebox]). Use [method has_stylebox] to check for existence.  
         */
        get_stylebox(name: StringName, theme_type: StringName): null | StyleBox
        
        /** Returns `true` if the [StyleBox] property defined by [param name] and [param theme_type] exists.  
         *  Returns `false` if it doesn't exist. Use [method set_stylebox] to define it.  
         */
        has_stylebox(name: StringName, theme_type: StringName): boolean
        
        /** Renames the [StyleBox] property defined by [param old_name] and [param theme_type] to [param name], if it exists.  
         *  Fails if it doesn't exist, or if a similar property with the new name already exists. Use [method has_stylebox] to check for existence, and [method clear_stylebox] to remove the existing property.  
         */
        rename_stylebox(old_name: StringName, name: StringName, theme_type: StringName): void
        
        /** Removes the [StyleBox] property defined by [param name] and [param theme_type], if it exists.  
         *  Fails if it doesn't exist. Use [method has_stylebox] to check for existence.  
         */
        clear_stylebox(name: StringName, theme_type: StringName): void
        
        /** Returns a list of names for [StyleBox] properties defined with [param theme_type]. Use [method get_stylebox_type_list] to get a list of possible theme type names. */
        get_stylebox_list(theme_type: string): PackedStringArray
        
        /** Returns a list of all unique theme type names for [StyleBox] properties. Use [method get_type_list] to get a list of all unique theme types. */
        get_stylebox_type_list(): PackedStringArray
        
        /** Creates or changes the value of the [Font] property defined by [param name] and [param theme_type]. Use [method clear_font] to remove the property. */
        set_font(name: StringName, theme_type: StringName, font: Font): void
        
        /** Returns the [Font] property defined by [param name] and [param theme_type], if it exists.  
         *  Returns the default theme font if the property doesn't exist and the default theme font is set up (see [member default_font]). Use [method has_font] to check for existence of the property and [method has_default_font] to check for existence of the default theme font.  
         *  Returns the engine fallback font value, if neither exist (see [member ThemeDB.fallback_font]).  
         */
        get_font(name: StringName, theme_type: StringName): null | Font
        
        /** Returns `true` if the [Font] property defined by [param name] and [param theme_type] exists, or if the default theme font is set up (see [method has_default_font]).  
         *  Returns `false` if neither exist. Use [method set_font] to define the property.  
         */
        has_font(name: StringName, theme_type: StringName): boolean
        
        /** Renames the [Font] property defined by [param old_name] and [param theme_type] to [param name], if it exists.  
         *  Fails if it doesn't exist, or if a similar property with the new name already exists. Use [method has_font] to check for existence, and [method clear_font] to remove the existing property.  
         */
        rename_font(old_name: StringName, name: StringName, theme_type: StringName): void
        
        /** Removes the [Font] property defined by [param name] and [param theme_type], if it exists.  
         *  Fails if it doesn't exist. Use [method has_font] to check for existence.  
         */
        clear_font(name: StringName, theme_type: StringName): void
        
        /** Returns a list of names for [Font] properties defined with [param theme_type]. Use [method get_font_type_list] to get a list of possible theme type names. */
        get_font_list(theme_type: string): PackedStringArray
        
        /** Returns a list of all unique theme type names for [Font] properties. Use [method get_type_list] to get a list of all unique theme types. */
        get_font_type_list(): PackedStringArray
        
        /** Creates or changes the value of the font size property defined by [param name] and [param theme_type]. Use [method clear_font_size] to remove the property. */
        set_font_size(name: StringName, theme_type: StringName, font_size: int64): void
        
        /** Returns the font size property defined by [param name] and [param theme_type], if it exists.  
         *  Returns the default theme font size if the property doesn't exist and the default theme font size is set up (see [member default_font_size]). Use [method has_font_size] to check for existence of the property and [method has_default_font_size] to check for existence of the default theme font.  
         *  Returns the engine fallback font size value, if neither exist (see [member ThemeDB.fallback_font_size]).  
         */
        get_font_size(name: StringName, theme_type: StringName): int64
        
        /** Returns `true` if the font size property defined by [param name] and [param theme_type] exists, or if the default theme font size is set up (see [method has_default_font_size]).  
         *  Returns `false` if neither exist. Use [method set_font_size] to define the property.  
         */
        has_font_size(name: StringName, theme_type: StringName): boolean
        
        /** Renames the font size property defined by [param old_name] and [param theme_type] to [param name], if it exists.  
         *  Fails if it doesn't exist, or if a similar property with the new name already exists. Use [method has_font_size] to check for existence, and [method clear_font_size] to remove the existing property.  
         */
        rename_font_size(old_name: StringName, name: StringName, theme_type: StringName): void
        
        /** Removes the font size property defined by [param name] and [param theme_type], if it exists.  
         *  Fails if it doesn't exist. Use [method has_font_size] to check for existence.  
         */
        clear_font_size(name: StringName, theme_type: StringName): void
        
        /** Returns a list of names for font size properties defined with [param theme_type]. Use [method get_font_size_type_list] to get a list of possible theme type names. */
        get_font_size_list(theme_type: string): PackedStringArray
        
        /** Returns a list of all unique theme type names for font size properties. Use [method get_type_list] to get a list of all unique theme types. */
        get_font_size_type_list(): PackedStringArray
        
        /** Creates or changes the value of the [Color] property defined by [param name] and [param theme_type]. Use [method clear_color] to remove the property. */
        set_color(name: StringName, theme_type: StringName, color: Color): void
        
        /** Returns the [Color] property defined by [param name] and [param theme_type], if it exists.  
         *  Returns the default color value if the property doesn't exist. Use [method has_color] to check for existence.  
         */
        get_color(name: StringName, theme_type: StringName): Color
        
        /** Returns `true` if the [Color] property defined by [param name] and [param theme_type] exists.  
         *  Returns `false` if it doesn't exist. Use [method set_color] to define it.  
         */
        has_color(name: StringName, theme_type: StringName): boolean
        
        /** Renames the [Color] property defined by [param old_name] and [param theme_type] to [param name], if it exists.  
         *  Fails if it doesn't exist, or if a similar property with the new name already exists. Use [method has_color] to check for existence, and [method clear_color] to remove the existing property.  
         */
        rename_color(old_name: StringName, name: StringName, theme_type: StringName): void
        
        /** Removes the [Color] property defined by [param name] and [param theme_type], if it exists.  
         *  Fails if it doesn't exist. Use [method has_color] to check for existence.  
         */
        clear_color(name: StringName, theme_type: StringName): void
        
        /** Returns a list of names for [Color] properties defined with [param theme_type]. Use [method get_color_type_list] to get a list of possible theme type names. */
        get_color_list(theme_type: string): PackedStringArray
        
        /** Returns a list of all unique theme type names for [Color] properties. Use [method get_type_list] to get a list of all unique theme types. */
        get_color_type_list(): PackedStringArray
        
        /** Creates or changes the value of the constant property defined by [param name] and [param theme_type]. Use [method clear_constant] to remove the property. */
        set_constant(name: StringName, theme_type: StringName, constant: int64): void
        
        /** Returns the constant property defined by [param name] and [param theme_type], if it exists.  
         *  Returns `0` if the property doesn't exist. Use [method has_constant] to check for existence.  
         */
        get_constant(name: StringName, theme_type: StringName): int64
        
        /** Returns `true` if the constant property defined by [param name] and [param theme_type] exists.  
         *  Returns `false` if it doesn't exist. Use [method set_constant] to define it.  
         */
        has_constant(name: StringName, theme_type: StringName): boolean
        
        /** Renames the constant property defined by [param old_name] and [param theme_type] to [param name], if it exists.  
         *  Fails if it doesn't exist, or if a similar property with the new name already exists. Use [method has_constant] to check for existence, and [method clear_constant] to remove the existing property.  
         */
        rename_constant(old_name: StringName, name: StringName, theme_type: StringName): void
        
        /** Removes the constant property defined by [param name] and [param theme_type], if it exists.  
         *  Fails if it doesn't exist. Use [method has_constant] to check for existence.  
         */
        clear_constant(name: StringName, theme_type: StringName): void
        
        /** Returns a list of names for constant properties defined with [param theme_type]. Use [method get_constant_type_list] to get a list of possible theme type names. */
        get_constant_list(theme_type: string): PackedStringArray
        
        /** Returns a list of all unique theme type names for constant properties. Use [method get_type_list] to get a list of all unique theme types. */
        get_constant_type_list(): PackedStringArray
        
        /** Returns `true` if [member default_base_scale] has a valid value.  
         *  Returns `false` if it doesn't. The value must be greater than `0.0` to be considered valid.  
         */
        has_default_base_scale(): boolean
        
        /** Returns `true` if [member default_font] has a valid value.  
         *  Returns `false` if it doesn't.  
         */
        has_default_font(): boolean
        
        /** Returns `true` if [member default_font_size] has a valid value.  
         *  Returns `false` if it doesn't. The value must be greater than `0` to be considered valid.  
         */
        has_default_font_size(): boolean
        
        /** Creates or changes the value of the theme property of [param data_type] defined by [param name] and [param theme_type]. Use [method clear_theme_item] to remove the property.  
         *  Fails if the [param value] type is not accepted by [param data_type].  
         *      
         *  **Note:** This method is analogous to calling the corresponding data type specific method, but can be used for more generalized logic.  
         */
        set_theme_item(data_type: Theme.DataType, name: StringName, theme_type: StringName, value: any): void
        
        /** Returns the theme property of [param data_type] defined by [param name] and [param theme_type], if it exists.  
         *  Returns the engine fallback value if the property doesn't exist (see [ThemeDB]). Use [method has_theme_item] to check for existence.  
         *      
         *  **Note:** This method is analogous to calling the corresponding data type specific method, but can be used for more generalized logic.  
         */
        get_theme_item(data_type: Theme.DataType, name: StringName, theme_type: StringName): any
        
        /** Returns `true` if the theme property of [param data_type] defined by [param name] and [param theme_type] exists.  
         *  Returns `false` if it doesn't exist. Use [method set_theme_item] to define it.  
         *      
         *  **Note:** This method is analogous to calling the corresponding data type specific method, but can be used for more generalized logic.  
         */
        has_theme_item(data_type: Theme.DataType, name: StringName, theme_type: StringName): boolean
        
        /** Renames the theme property of [param data_type] defined by [param old_name] and [param theme_type] to [param name], if it exists.  
         *  Fails if it doesn't exist, or if a similar property with the new name already exists. Use [method has_theme_item] to check for existence, and [method clear_theme_item] to remove the existing property.  
         *      
         *  **Note:** This method is analogous to calling the corresponding data type specific method, but can be used for more generalized logic.  
         */
        rename_theme_item(data_type: Theme.DataType, old_name: StringName, name: StringName, theme_type: StringName): void
        
        /** Removes the theme property of [param data_type] defined by [param name] and [param theme_type], if it exists.  
         *  Fails if it doesn't exist. Use [method has_theme_item] to check for existence.  
         *      
         *  **Note:** This method is analogous to calling the corresponding data type specific method, but can be used for more generalized logic.  
         */
        clear_theme_item(data_type: Theme.DataType, name: StringName, theme_type: StringName): void
        
        /** Returns a list of names for properties of [param data_type] defined with [param theme_type]. Use [method get_theme_item_type_list] to get a list of possible theme type names.  
         *      
         *  **Note:** This method is analogous to calling the corresponding data type specific method, but can be used for more generalized logic.  
         */
        get_theme_item_list(data_type: Theme.DataType, theme_type: string): PackedStringArray
        
        /** Returns a list of all unique theme type names for [param data_type] properties. Use [method get_type_list] to get a list of all unique theme types.  
         *      
         *  **Note:** This method is analogous to calling the corresponding data type specific method, but can be used for more generalized logic.  
         */
        get_theme_item_type_list(data_type: Theme.DataType): PackedStringArray
        
        /** Marks [param theme_type] as a variation of [param base_type].  
         *  This adds [param theme_type] as a suggested option for [member Control.theme_type_variation] on a [Control] that is of the [param base_type] class.  
         *  Variations can also be nested, i.e. [param base_type] can be another variation. If a chain of variations ends with a [param base_type] matching the class of the [Control], the whole chain is going to be suggested as options.  
         *      
         *  **Note:** Suggestions only show up if this theme resource is set as the project default theme. See [member ProjectSettings.gui/theme/custom].  
         */
        set_type_variation(theme_type: StringName, base_type: StringName): void
        
        /** Returns `true` if [param theme_type] is marked as a variation of [param base_type]. */
        is_type_variation(theme_type: StringName, base_type: StringName): boolean
        
        /** Unmarks [param theme_type] as being a variation of another theme type. See [method set_type_variation]. */
        clear_type_variation(theme_type: StringName): void
        
        /** Returns the name of the base theme type if [param theme_type] is a valid variation type. Returns an empty string otherwise. */
        get_type_variation_base(theme_type: StringName): StringName
        
        /** Returns a list of all type variations for the given [param base_type]. */
        get_type_variation_list(base_type: StringName): PackedStringArray
        
        /** Adds an empty theme type for every valid data type.  
         *      
         *  **Note:** Empty types are not saved with the theme. This method only exists to perform in-memory changes to the resource. Use available `set_*` methods to add theme items.  
         */
        add_type(theme_type: StringName): void
        
        /** Removes the theme type, gracefully discarding defined theme items. If the type is a variation, this information is also erased. If the type is a base for type variations, those variations lose their base. */
        remove_type(theme_type: StringName): void
        
        /** Renames the theme type [param old_theme_type] to [param theme_type], if the old type exists and the new one doesn't exist.  
         *      
         *  **Note:** Renaming a theme type to an empty name or a variation to a type associated with a built-in class removes type variation connections in a way that cannot be undone by reversing the rename alone.  
         */
        rename_type(old_theme_type: StringName, theme_type: StringName): void
        
        /** Returns a list of all unique theme type names. Use the appropriate `get_*_type_list` method to get a list of unique theme types for a single data type. */
        get_type_list(): PackedStringArray
        
        /** Adds missing and overrides existing definitions with values from the [param other] theme resource.  
         *      
         *  **Note:** This modifies the current theme. If you want to merge two themes together without modifying either one, create a new empty theme and merge the other two into it one after another.  
         */
        merge_with(other: Theme): void
        
        /** Removes all the theme properties defined on the theme resource. */
        clear(): void
        
        /** The default base scale factor of this theme resource. Used by some controls to scale their visual properties based on the global scale factor. If this value is set to `0.0`, the global scale factor is used (see [member ThemeDB.fallback_base_scale]).  
         *  Use [method has_default_base_scale] to check if this value is valid.  
         */
        get default_base_scale(): float64
        set default_base_scale(value: float64)
        
        /** The default font of this theme resource. Used as the default value when trying to fetch a font resource that doesn't exist in this theme or is in invalid state. If the default font is also missing or invalid, the engine fallback value is used (see [member ThemeDB.fallback_font]).  
         *  Use [method has_default_font] to check if this value is valid.  
         */
        get default_font(): null | Font
        set default_font(value: null | Font)
        
        /** The default font size of this theme resource. Used as the default value when trying to fetch a font size value that doesn't exist in this theme or is in invalid state. If the default font size is also missing or invalid, the engine fallback value is used (see [member ThemeDB.fallback_font_size]).  
         *  Values below `1` are invalid and can be used to unset the property. Use [method has_default_font_size] to check if this value is valid.  
         */
        get default_font_size(): int64
        set default_font_size(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTheme;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTheme;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTileData extends __RPCMapObject {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTileData extends __NameMapObject {
    }
    /** Settings for a single tile in a [TileSet].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_tiledata.html  
     */
    class TileData extends Object {
        constructor(identifier?: any)
        /** Sets the occluder polygon count in the TileSet occlusion layer with index [param layer_id]. */
        set_occluder_polygons_count(layer_id: int64, polygons_count: int64): void
        
        /** Returns the number of occluder polygons of the tile in the TileSet occlusion layer with index [param layer_id]. */
        get_occluder_polygons_count(layer_id: int64): int64
        
        /** Adds an occlusion polygon to the tile on the TileSet occlusion layer with index [param layer_id]. */
        add_occluder_polygon(layer_id: int64): void
        
        /** Removes the polygon at index [param polygon_index] for TileSet occlusion layer with index [param layer_id]. */
        remove_occluder_polygon(layer_id: int64, polygon_index: int64): void
        
        /** Sets the occluder for polygon with index [param polygon_index] in the TileSet occlusion layer with index [param layer_id]. */
        set_occluder_polygon(layer_id: int64, polygon_index: int64, polygon: OccluderPolygon2D): void
        
        /** Returns the occluder polygon at index [param polygon_index] from the TileSet occlusion layer with index [param layer_id].  
         *  The [param flip_h], [param flip_v], and [param transpose] parameters can be `true` to transform the returned polygon.  
         */
        get_occluder_polygon(layer_id: int64, polygon_index: int64, flip_h?: boolean /* = false */, flip_v?: boolean /* = false */, transpose?: boolean /* = false */): null | OccluderPolygon2D
        
        /** Sets the occluder for the TileSet occlusion layer with index [param layer_id]. */
        set_occluder(layer_id: int64, occluder_polygon: OccluderPolygon2D): void
        
        /** Returns the occluder polygon of the tile for the TileSet occlusion layer with index [param layer_id].  
         *  [param flip_h], [param flip_v], and [param transpose] allow transforming the returned polygon.  
         */
        get_occluder(layer_id: int64, flip_h?: boolean /* = false */, flip_v?: boolean /* = false */, transpose?: boolean /* = false */): null | OccluderPolygon2D
        
        /** Sets the constant linear velocity. This does not move the tile. This linear velocity is applied to objects colliding with this tile. This is useful to create conveyor belts. */
        set_constant_linear_velocity(layer_id: int64, velocity: Vector2): void
        
        /** Returns the constant linear velocity applied to objects colliding with this tile. */
        get_constant_linear_velocity(layer_id: int64): Vector2
        
        /** Sets the constant angular velocity. This does not rotate the tile. This angular velocity is applied to objects colliding with this tile. */
        set_constant_angular_velocity(layer_id: int64, velocity: float64): void
        
        /** Returns the constant angular velocity applied to objects colliding with this tile. */
        get_constant_angular_velocity(layer_id: int64): float64
        
        /** Sets the polygons count for TileSet physics layer with index [param layer_id]. */
        set_collision_polygons_count(layer_id: int64, polygons_count: int64): void
        
        /** Returns how many polygons the tile has for TileSet physics layer with index [param layer_id]. */
        get_collision_polygons_count(layer_id: int64): int64
        
        /** Adds a collision polygon to the tile on the given TileSet physics layer. */
        add_collision_polygon(layer_id: int64): void
        
        /** Removes the polygon at index [param polygon_index] for TileSet physics layer with index [param layer_id]. */
        remove_collision_polygon(layer_id: int64, polygon_index: int64): void
        
        /** Sets the points of the polygon at index [param polygon_index] for TileSet physics layer with index [param layer_id]. */
        set_collision_polygon_points(layer_id: int64, polygon_index: int64, polygon: PackedVector2Array | Vector2[]): void
        
        /** Returns the points of the polygon at index [param polygon_index] for TileSet physics layer with index [param layer_id]. */
        get_collision_polygon_points(layer_id: int64, polygon_index: int64): PackedVector2Array
        
        /** Enables/disables one-way collisions on the polygon at index [param polygon_index] for TileSet physics layer with index [param layer_id]. */
        set_collision_polygon_one_way(layer_id: int64, polygon_index: int64, one_way: boolean): void
        
        /** Returns whether one-way collisions are enabled for the polygon at index [param polygon_index] for TileSet physics layer with index [param layer_id]. */
        is_collision_polygon_one_way(layer_id: int64, polygon_index: int64): boolean
        
        /** Sets the one-way margin (for one-way platforms) of the polygon at index [param polygon_index] for TileSet physics layer with index [param layer_id]. */
        set_collision_polygon_one_way_margin(layer_id: int64, polygon_index: int64, one_way_margin: float64): void
        
        /** Returns the one-way margin (for one-way platforms) of the polygon at index [param polygon_index] for TileSet physics layer with index [param layer_id]. */
        get_collision_polygon_one_way_margin(layer_id: int64, polygon_index: int64): float64
        
        /** Sets the tile's terrain bit for the given [param peering_bit] direction. To check that a direction is valid, use [method is_valid_terrain_peering_bit]. */
        set_terrain_peering_bit(peering_bit: TileSet.CellNeighbor, terrain: int64): void
        
        /** Returns the tile's terrain bit for the given [param peering_bit] direction. To check that a direction is valid, use [method is_valid_terrain_peering_bit]. */
        get_terrain_peering_bit(peering_bit: TileSet.CellNeighbor): int64
        
        /** Returns whether the given [param peering_bit] direction is valid for this tile. */
        is_valid_terrain_peering_bit(peering_bit: TileSet.CellNeighbor): boolean
        
        /** Sets the navigation polygon for the TileSet navigation layer with index [param layer_id]. */
        set_navigation_polygon(layer_id: int64, navigation_polygon: NavigationPolygon): void
        
        /** Returns the navigation polygon of the tile for the TileSet navigation layer with index [param layer_id].  
         *  [param flip_h], [param flip_v], and [param transpose] allow transforming the returned polygon.  
         */
        get_navigation_polygon(layer_id: int64, flip_h?: boolean /* = false */, flip_v?: boolean /* = false */, transpose?: boolean /* = false */): null | NavigationPolygon
        
        /** Sets the tile's custom data value for the TileSet custom data layer with name [param layer_name]. */
        set_custom_data(layer_name: string, value: any): void
        
        /** Returns the custom data value for custom data layer named [param layer_name]. To check if a custom data layer exists, use [method has_custom_data]. */
        get_custom_data(layer_name: string): any
        
        /** Returns whether there exists a custom data layer named [param layer_name]. */
        has_custom_data(layer_name: string): boolean
        
        /** Sets the tile's custom data value for the TileSet custom data layer with index [param layer_id]. */
        set_custom_data_by_layer_id(layer_id: int64, value: any): void
        
        /** Returns the custom data value for custom data layer with index [param layer_id]. */
        get_custom_data_by_layer_id(layer_id: int64): any
        
        /** If `true`, the tile will have its texture flipped horizontally. */
        get flip_h(): boolean
        set flip_h(value: boolean)
        
        /** If `true`, the tile will have its texture flipped vertically. */
        get flip_v(): boolean
        set flip_v(value: boolean)
        
        /** If `true`, the tile will display transposed, i.e. with horizontal and vertical texture UVs swapped. */
        get transpose(): boolean
        set transpose(value: boolean)
        
        /** Offsets the position of where the tile is drawn. */
        get texture_origin(): Vector2i
        set texture_origin(value: Vector2i)
        
        /** Color modulation of the tile. */
        get modulate(): Color
        set modulate(value: Color)
        
        /** The [Material] to use for this [TileData]. This can be a [CanvasItemMaterial] to use the default shader, or a [ShaderMaterial] to use a custom shader. */
        get material(): null | CanvasItemMaterial | ShaderMaterial
        set material(value: null | CanvasItemMaterial | ShaderMaterial)
        
        /** Ordering index of this tile, relative to [TileMapLayer]. */
        get z_index(): int64
        set z_index(value: int64)
        
        /** Vertical point of the tile used for determining y-sorted order. */
        get y_sort_origin(): int64
        set y_sort_origin(value: int64)
        
        /** ID of the terrain set that the tile uses. */
        get terrain_set(): int64
        set terrain_set(value: int64)
        
        /** ID of the terrain from the terrain set that the tile uses. */
        get terrain(): int64
        set terrain(value: int64)
        
        /** Relative probability of this tile being selected when drawing a pattern of random tiles. */
        get probability(): float64
        set probability(value: float64)
        
        /** Emitted when any of the properties are changed. */
        readonly changed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTileData;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTileData;
    }
    namespace TileMap {
        enum VisibilityMode {
            /** Use the debug settings to determine visibility. */
            VISIBILITY_MODE_DEFAULT = 0,
            
            /** Always hide. */
            VISIBILITY_MODE_FORCE_HIDE = 2,
            
            /** Always show. */
            VISIBILITY_MODE_FORCE_SHOW = 1,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTileMap extends __RPCMapNode2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTileMap extends __NameMapNode2D {
    }
    /** Node for 2D tile-based maps.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_tilemap.html  
     */
    class TileMap<Map extends NodePathMap = any> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Should return `true` if the tile at coordinates [param coords] on layer [param layer] requires a runtime update.  
         *  **Warning:** Make sure this function only return `true` when needed. Any tile processed at runtime without a need for it will imply a significant performance penalty.  
         *      
         *  **Note:** If the result of this function should changed, use [method notify_runtime_tile_data_update] to notify the TileMap it needs an update.  
         */
        /* gdvirtual */ _use_tile_data_runtime_update(layer: int64, coords: Vector2i): boolean
        
        /** Called with a TileData object about to be used internally by the TileMap, allowing its modification at runtime.  
         *  This method is only called if [method _use_tile_data_runtime_update] is implemented and returns `true` for the given tile [param coords] and [param layer].  
         *  **Warning:** The [param tile_data] object's sub-resources are the same as the one in the TileSet. Modifying them might impact the whole TileSet. Instead, make sure to duplicate those resources.  
         *      
         *  **Note:** If the properties of [param tile_data] object should change over time, use [method notify_runtime_tile_data_update] to notify the TileMap it needs an update.  
         */
        /* gdvirtual */ _tile_data_runtime_update(layer: int64, coords: Vector2i, tile_data: TileData): void
        
        /** Assigns [param map] as a [NavigationServer2D] navigation map for the specified TileMap layer [param layer]. */
        set_navigation_map(layer: int64, map: RID): void
        
        /** Returns the [RID] of the [NavigationServer2D] navigation map assigned to the specified TileMap layer [param layer]. */
        get_navigation_map(layer: int64): RID
        
        /** Forces the TileMap and the layer [param layer] to update. */
        force_update(layer?: int64 /* = -1 */): void
        
        /** Returns the number of layers in the TileMap. */
        get_layers_count(): int64
        
        /** Adds a layer at the given position [param to_position] in the array. If [param to_position] is negative, the position is counted from the end, with `-1` adding the layer at the end of the array. */
        add_layer(to_position: int64): void
        
        /** Moves the layer at index [param layer] to the given position [param to_position] in the array. */
        move_layer(layer: int64, to_position: int64): void
        
        /** Removes the layer at index [param layer]. */
        remove_layer(layer: int64): void
        
        /** Sets a layer's name. This is mostly useful in the editor.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        set_layer_name(layer: int64, name: string): void
        
        /** Returns a TileMap layer's name.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        get_layer_name(layer: int64): string
        
        /** Enables or disables the layer [param layer]. A disabled layer is not processed at all (no rendering, no physics, etc.).  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        set_layer_enabled(layer: int64, enabled: boolean): void
        
        /** Returns if a layer is enabled.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        is_layer_enabled(layer: int64): boolean
        
        /** Sets a layer's color. It will be multiplied by tile's color and TileMap's modulate.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        set_layer_modulate(layer: int64, modulate: Color): void
        
        /** Returns a TileMap layer's modulate.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        get_layer_modulate(layer: int64): Color
        
        /** Enables or disables a layer's Y-sorting. If a layer is Y-sorted, the layer will behave as a CanvasItem node where each of its tile gets Y-sorted.  
         *  Y-sorted layers should usually be on different Z-index values than not Y-sorted layers, otherwise, each of those layer will be Y-sorted as whole with the Y-sorted one. This is usually an undesired behavior.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        set_layer_y_sort_enabled(layer: int64, y_sort_enabled: boolean): void
        
        /** Returns if a layer Y-sorts its tiles.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        is_layer_y_sort_enabled(layer: int64): boolean
        
        /** Sets a layer's Y-sort origin value. This Y-sort origin value is added to each tile's Y-sort origin value.  
         *  This allows, for example, to fake a different height level on each layer. This can be useful for top-down view games.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        set_layer_y_sort_origin(layer: int64, y_sort_origin: int64): void
        
        /** Returns a TileMap layer's Y sort origin.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        get_layer_y_sort_origin(layer: int64): int64
        
        /** Sets a layers Z-index value. This Z-index is added to each tile's Z-index value.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        set_layer_z_index(layer: int64, z_index: int64): void
        
        /** Returns a TileMap layer's Z-index value.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        get_layer_z_index(layer: int64): int64
        
        /** Enables or disables a layer's built-in navigation regions generation. Disable this if you need to bake navigation regions from a TileMap using a [NavigationRegion2D] node. */
        set_layer_navigation_enabled(layer: int64, enabled: boolean): void
        
        /** Returns if a layer's built-in navigation regions generation is enabled. */
        is_layer_navigation_enabled(layer: int64): boolean
        
        /** Assigns [param map] as a [NavigationServer2D] navigation map for the specified TileMap layer [param layer].  
         *  By default the TileMap uses the default [World2D] navigation map for the first TileMap layer. For each additional TileMap layer a new navigation map is created for the additional layer.  
         *  In order to make [NavigationAgent2D] switch between TileMap layer navigation maps use [method NavigationAgent2D.set_navigation_map] with the navigation map received from [method get_layer_navigation_map].  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        set_layer_navigation_map(layer: int64, map: RID): void
        
        /** Returns the [RID] of the [NavigationServer2D] navigation map assigned to the specified TileMap layer [param layer].  
         *  By default the TileMap uses the default [World2D] navigation map for the first TileMap layer. For each additional TileMap layer a new navigation map is created for the additional layer.  
         *  In order to make [NavigationAgent2D] switch between TileMap layer navigation maps use [method NavigationAgent2D.set_navigation_map] with the navigation map received from [method get_layer_navigation_map].  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        get_layer_navigation_map(layer: int64): RID
        
        /** Sets the tile identifiers for the cell on layer [param layer] at coordinates [param coords]. Each tile of the [TileSet] is identified using three parts:  
         *  - The source identifier [param source_id] identifies a [TileSetSource] identifier. See [method TileSet.set_source_id],  
         *  - The atlas coordinates identifier [param atlas_coords] identifies a tile coordinates in the atlas (if the source is a [TileSetAtlasSource]). For [TileSetScenesCollectionSource] it should always be `Vector2i(0, 0)`),  
         *  - The alternative tile identifier [param alternative_tile] identifies a tile alternative in the atlas (if the source is a [TileSetAtlasSource]), and the scene for a [TileSetScenesCollectionSource].  
         *  If [param source_id] is set to `-1`, [param atlas_coords] to `Vector2i(-1, -1)` or [param alternative_tile] to `-1`, the cell will be erased. An erased cell gets **all** its identifiers automatically set to their respective invalid values, namely `-1`, `Vector2i(-1, -1)` and `-1`.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        set_cell(layer: int64, coords: Vector2i, source_id?: int64 /* = -1 */, atlas_coords?: Vector2i /* = new Vector2i(-1, -1) */, alternative_tile?: int64 /* = 0 */): void
        
        /** Erases the cell on layer [param layer] at coordinates [param coords].  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        erase_cell(layer: int64, coords: Vector2i): void
        
        /** Returns the tile source ID of the cell on layer [param layer] at coordinates [param coords]. Returns `-1` if the cell does not exist.  
         *  If [param use_proxies] is `false`, ignores the [TileSet]'s tile proxies, returning the raw source identifier. See [method TileSet.map_tile_proxy].  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        get_cell_source_id(layer: int64, coords: Vector2i, use_proxies?: boolean /* = false */): int64
        
        /** Returns the tile atlas coordinates ID of the cell on layer [param layer] at coordinates [param coords]. Returns `Vector2i(-1, -1)` if the cell does not exist.  
         *  If [param use_proxies] is `false`, ignores the [TileSet]'s tile proxies, returning the raw atlas coordinate identifier. See [method TileSet.map_tile_proxy].  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        get_cell_atlas_coords(layer: int64, coords: Vector2i, use_proxies?: boolean /* = false */): Vector2i
        
        /** Returns the tile alternative ID of the cell on layer [param layer] at [param coords].  
         *  If [param use_proxies] is `false`, ignores the [TileSet]'s tile proxies, returning the raw alternative identifier. See [method TileSet.map_tile_proxy].  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        get_cell_alternative_tile(layer: int64, coords: Vector2i, use_proxies?: boolean /* = false */): int64
        
        /** Returns the [TileData] object associated with the given cell, or `null` if the cell does not exist or is not a [TileSetAtlasSource].  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         *    
         *  If [param use_proxies] is `false`, ignores the [TileSet]'s tile proxies. See [method TileSet.map_tile_proxy].  
         */
        get_cell_tile_data(layer: int64, coords: Vector2i, use_proxies?: boolean /* = false */): null | TileData
        
        /** Returns `true` if the cell on layer [param layer] at coordinates [param coords] is flipped horizontally. The result is valid only for atlas sources. */
        is_cell_flipped_h(layer: int64, coords: Vector2i, use_proxies?: boolean /* = false */): boolean
        
        /** Returns `true` if the cell on layer [param layer] at coordinates [param coords] is flipped vertically. The result is valid only for atlas sources. */
        is_cell_flipped_v(layer: int64, coords: Vector2i, use_proxies?: boolean /* = false */): boolean
        
        /** Returns `true` if the cell on layer [param layer] at coordinates [param coords] is transposed. The result is valid only for atlas sources. */
        is_cell_transposed(layer: int64, coords: Vector2i, use_proxies?: boolean /* = false */): boolean
        
        /** Returns the coordinates of the tile for given physics body RID. Such RID can be retrieved from [method KinematicCollision2D.get_collider_rid], when colliding with a tile. */
        get_coords_for_body_rid(body: RID): Vector2i
        
        /** Returns the tilemap layer of the tile for given physics body RID. Such RID can be retrieved from [method KinematicCollision2D.get_collider_rid], when colliding with a tile. */
        get_layer_for_body_rid(body: RID): int64
        
        /** Creates a new [TileMapPattern] from the given layer and set of cells.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        get_pattern(layer: int64, coords_array: GArray<Vector2i>): null | TileMapPattern
        
        /** Returns for the given coordinate [param coords_in_pattern] in a [TileMapPattern] the corresponding cell coordinates if the pattern was pasted at the [param position_in_tilemap] coordinates (see [method set_pattern]). This mapping is required as in half-offset tile shapes, the mapping might not work by calculating `position_in_tile_map + coords_in_pattern`. */
        map_pattern(position_in_tilemap: Vector2i, coords_in_pattern: Vector2i, pattern: TileMapPattern): Vector2i
        
        /** Paste the given [TileMapPattern] at the given [param position] and [param layer] in the tile map.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        set_pattern(layer: int64, position: Vector2i, pattern: TileMapPattern): void
        
        /** Update all the cells in the [param cells] coordinates array so that they use the given [param terrain] for the given [param terrain_set]. If an updated cell has the same terrain as one of its neighboring cells, this function tries to join the two. This function might update neighboring tiles if needed to create correct terrain transitions.  
         *  If [param ignore_empty_terrains] is `true`, empty terrains will be ignored when trying to find the best fitting tile for the given terrain constraints.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         *      
         *  **Note:** To work correctly, this method requires the TileMap's TileSet to have terrains set up with all required terrain combinations. Otherwise, it may produce unexpected results.  
         */
        set_cells_terrain_connect(layer: int64, cells: GArray<Vector2i>, terrain_set: int64, terrain: int64, ignore_empty_terrains?: boolean /* = true */): void
        
        /** Update all the cells in the [param path] coordinates array so that they use the given [param terrain] for the given [param terrain_set]. The function will also connect two successive cell in the path with the same terrain. This function might update neighboring tiles if needed to create correct terrain transitions.  
         *  If [param ignore_empty_terrains] is `true`, empty terrains will be ignored when trying to find the best fitting tile for the given terrain constraints.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         *      
         *  **Note:** To work correctly, this method requires the TileMap's TileSet to have terrains set up with all required terrain combinations. Otherwise, it may produce unexpected results.  
         */
        set_cells_terrain_path(layer: int64, path: GArray<Vector2i>, terrain_set: int64, terrain: int64, ignore_empty_terrains?: boolean /* = true */): void
        
        /** Clears cells that do not exist in the tileset. */
        fix_invalid_tiles(): void
        
        /** Clears all cells on the given layer.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        clear_layer(layer: int64): void
        
        /** Clears all cells. */
        clear(): void
        
        /** Triggers a direct update of the TileMap. Usually, calling this function is not needed, as TileMap node updates automatically when one of its properties or cells is modified.  
         *  However, for performance reasons, those updates are batched and delayed to the end of the frame. Calling this function will force the TileMap to update right away instead.  
         *  **Warning:** Updating the TileMap is computationally expensive and may impact performance. Try to limit the number of updates and how many tiles they impact.  
         */
        update_internals(): void
        
        /** Notifies the TileMap node that calls to [method _use_tile_data_runtime_update] or [method _tile_data_runtime_update] will lead to different results. This will thus trigger a TileMap update.  
         *  If [param layer] is provided, only notifies changes for the given layer. Providing the [param layer] argument (when applicable) is usually preferred for performance reasons.  
         *  **Warning:** Updating the TileMap is computationally expensive and may impact performance. Try to limit the number of calls to this function to avoid unnecessary update.  
         *      
         *  **Note:** This does not trigger a direct update of the TileMap, the update will be done at the end of the frame as usual (unless you call [method update_internals]).  
         */
        notify_runtime_tile_data_update(layer?: int64 /* = -1 */): void
        
        /** Returns the list of all neighbourings cells to the one at [param coords]. */
        get_surrounding_cells(coords: Vector2i): GArray<Vector2i>
        
        /** Returns a [Vector2i] array with the positions of all cells containing a tile in the given layer. A cell is considered empty if its source identifier equals -1, its atlas coordinates identifiers is `Vector2(-1, -1)` and its alternative identifier is -1.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        get_used_cells(layer: int64): GArray<Vector2i>
        
        /** Returns a [Vector2i] array with the positions of all cells containing a tile in the given layer. Tiles may be filtered according to their source ([param source_id]), their atlas coordinates ([param atlas_coords]) or alternative id ([param alternative_tile]).  
         *  If a parameter has its value set to the default one, this parameter is not used to filter a cell. Thus, if all parameters have their respective default value, this method returns the same result as [method get_used_cells].  
         *  A cell is considered empty if its source identifier equals -1, its atlas coordinates identifiers is `Vector2(-1, -1)` and its alternative identifier is -1.  
         *  If [param layer] is negative, the layers are accessed from the last one.  
         */
        get_used_cells_by_id(layer: int64, source_id?: int64 /* = -1 */, atlas_coords?: Vector2i /* = new Vector2i(-1, -1) */, alternative_tile?: int64 /* = -1 */): GArray<Vector2i>
        
        /** Returns a rectangle enclosing the used (non-empty) tiles of the map, including all layers. */
        get_used_rect(): Rect2i
        
        /** Returns the centered position of a cell in the TileMap's local coordinate space. To convert the returned value into global coordinates, use [method Node2D.to_global]. See also [method local_to_map].  
         *      
         *  **Note:** This may not correspond to the visual position of the tile, i.e. it ignores the [member TileData.texture_origin] property of individual tiles.  
         */
        map_to_local(map_position: Vector2i): Vector2
        
        /** Returns the map coordinates of the cell containing the given [param local_position]. If [param local_position] is in global coordinates, consider using [method Node2D.to_local] before passing it to this method. See also [method map_to_local]. */
        local_to_map(local_position: Vector2): Vector2i
        
        /** Returns the neighboring cell to the one at coordinates [param coords], identified by the [param neighbor] direction. This method takes into account the different layouts a TileMap can take. */
        get_neighbor_cell(coords: Vector2i, neighbor: TileSet.CellNeighbor): Vector2i
        
        /** The [TileSet] used by this [TileMap]. The textures, collisions, and additional behavior of all available tiles are stored here. */
        get tile_set(): null | TileSet
        set tile_set(value: null | TileSet)
        
        /** The TileMap's quadrant size. A quadrant is a group of tiles to be drawn together on a single canvas item, for optimization purposes. [member rendering_quadrant_size] defines the length of a square's side, in the map's coordinate system, that forms the quadrant. Thus, the default quadrant size groups together `16 * 16 = 256` tiles.  
         *  The quadrant size does not apply on Y-sorted layers, as tiles are grouped by Y position instead in that case.  
         *      
         *  **Note:** As quadrants are created according to the map's coordinate system, the quadrant's "square shape" might not look like square in the TileMap's local coordinate system.  
         */
        get rendering_quadrant_size(): int64
        set rendering_quadrant_size(value: int64)
        
        /** If enabled, the TileMap will see its collisions synced to the physics tick and change its collision type from static to kinematic. This is required to create TileMap-based moving platform.  
         *      
         *  **Note:** Enabling [member collision_animatable] may have a small performance impact, only do it if the TileMap is moving and has colliding tiles.  
         */
        get collision_animatable(): boolean
        set collision_animatable(value: boolean)
        
        /** Show or hide the TileMap's collision shapes. If set to [constant VISIBILITY_MODE_DEFAULT], this depends on the show collision debug settings. */
        get collision_visibility_mode(): int64
        set collision_visibility_mode(value: int64)
        
        /** Show or hide the TileMap's navigation meshes. If set to [constant VISIBILITY_MODE_DEFAULT], this depends on the show navigation debug settings. */
        get navigation_visibility_mode(): int64
        set navigation_visibility_mode(value: int64)
        
        /** Emitted when the [TileSet] of this TileMap changes. */
        readonly changed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTileMap;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTileMap;
    }
    namespace TileMapLayer {
        enum DebugVisibilityMode {
            /** Hide the collisions or navigation debug shapes in the editor, and use the debug settings to determine their visibility in game (i.e. [member SceneTree.debug_collisions_hint] or [member SceneTree.debug_navigation_hint]). */
            DEBUG_VISIBILITY_MODE_DEFAULT = 0,
            
            /** Always hide the collisions or navigation debug shapes. */
            DEBUG_VISIBILITY_MODE_FORCE_HIDE = 2,
            
            /** Always show the collisions or navigation debug shapes. */
            DEBUG_VISIBILITY_MODE_FORCE_SHOW = 1,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTileMapLayer extends __RPCMapNode2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTileMapLayer extends __NameMapNode2D {
    }
    /** Node for 2D tile-based maps.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_tilemaplayer.html  
     */
    class TileMapLayer<Map extends NodePathMap = any> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Should return `true` if the tile at coordinates [param coords] requires a runtime update.  
         *  **Warning:** Make sure this function only returns `true` when needed. Any tile processed at runtime without a need for it will imply a significant performance penalty.  
         *      
         *  **Note:** If the result of this function should change, use [method notify_runtime_tile_data_update] to notify the [TileMapLayer] it needs an update.  
         */
        /* gdvirtual */ _use_tile_data_runtime_update(coords: Vector2i): boolean
        
        /** Called with a [TileData] object about to be used internally by the [TileMapLayer], allowing its modification at runtime.  
         *  This method is only called if [method _use_tile_data_runtime_update] is implemented and returns `true` for the given tile [param coords].  
         *  **Warning:** The [param tile_data] object's sub-resources are the same as the one in the TileSet. Modifying them might impact the whole TileSet. Instead, make sure to duplicate those resources.  
         *      
         *  **Note:** If the properties of [param tile_data] object should change over time, use [method notify_runtime_tile_data_update] to notify the [TileMapLayer] it needs an update.  
         */
        /* gdvirtual */ _tile_data_runtime_update(coords: Vector2i, tile_data: TileData): void
        
        /** Called when this [TileMapLayer]'s cells need an internal update. This update may be caused from individual cells being modified or by a change in the [member tile_set] (causing all cells to be queued for an update). The first call to this function is always for initializing all the [TileMapLayer]'s cells. [param coords] contains the coordinates of all modified cells, roughly in the order they were modified. [param forced_cleanup] is `true` when the [TileMapLayer]'s internals should be fully cleaned up. This is the case when:  
         *  - The layer is disabled;  
         *  - The layer is not visible;  
         *  - [member tile_set] is set to `null`;  
         *  - The node is removed from the tree;  
         *  - The node is freed.  
         *  Note that any internal update happening while one of these conditions is verified is considered to be a "cleanup". See also [method update_internals].  
         *  **Warning:** Implementing this method may degrade the [TileMapLayer]'s performance.  
         */
        /* gdvirtual */ _update_cells(coords: GArray<Vector2i>, forced_cleanup: boolean): void
        
        /** Sets the tile identifiers for the cell at coordinates [param coords]. Each tile of the [TileSet] is identified using three parts:  
         *  - The source identifier [param source_id] identifies a [TileSetSource] identifier. See [method TileSet.set_source_id],  
         *  - The atlas coordinate identifier [param atlas_coords] identifies a tile coordinates in the atlas (if the source is a [TileSetAtlasSource]). For [TileSetScenesCollectionSource] it should always be `Vector2i(0, 0)`,  
         *  - The alternative tile identifier [param alternative_tile] identifies a tile alternative in the atlas (if the source is a [TileSetAtlasSource]), and the scene for a [TileSetScenesCollectionSource].  
         *  If [param source_id] is set to `-1`, [param atlas_coords] to `Vector2i(-1, -1)`, or [param alternative_tile] to `-1`, the cell will be erased. An erased cell gets **all** its identifiers automatically set to their respective invalid values, namely `-1`, `Vector2i(-1, -1)` and `-1`.  
         */
        set_cell(coords: Vector2i, source_id?: int64 /* = -1 */, atlas_coords?: Vector2i /* = new Vector2i(-1, -1) */, alternative_tile?: int64 /* = 0 */): void
        
        /** Erases the cell at coordinates [param coords]. */
        erase_cell(coords: Vector2i): void
        
        /** Clears cells containing tiles that do not exist in the [member tile_set]. */
        fix_invalid_tiles(): void
        
        /** Clears all cells. */
        clear(): void
        
        /** Returns the tile source ID of the cell at coordinates [param coords]. Returns `-1` if the cell does not exist. */
        get_cell_source_id(coords: Vector2i): int64
        
        /** Returns the tile atlas coordinates ID of the cell at coordinates [param coords]. Returns `Vector2i(-1, -1)` if the cell does not exist. */
        get_cell_atlas_coords(coords: Vector2i): Vector2i
        
        /** Returns the tile alternative ID of the cell at coordinates [param coords]. */
        get_cell_alternative_tile(coords: Vector2i): int64
        
        /** Returns the [TileData] object associated with the given cell, or `null` if the cell does not exist or is not a [TileSetAtlasSource].  
         *    
         */
        get_cell_tile_data(coords: Vector2i): null | TileData
        
        /** Returns `true` if the cell at coordinates [param coords] is flipped horizontally. The result is valid only for atlas sources. */
        is_cell_flipped_h(coords: Vector2i): boolean
        
        /** Returns `true` if the cell at coordinates [param coords] is flipped vertically. The result is valid only for atlas sources. */
        is_cell_flipped_v(coords: Vector2i): boolean
        
        /** Returns `true` if the cell at coordinates [param coords] is transposed. The result is valid only for atlas sources. */
        is_cell_transposed(coords: Vector2i): boolean
        
        /** Returns a [Vector2i] array with the positions of all cells containing a tile. A cell is considered empty if its source identifier equals `-1`, its atlas coordinate identifier is `Vector2(-1, -1)` and its alternative identifier is `-1`. */
        get_used_cells(): GArray<Vector2i>
        
        /** Returns a [Vector2i] array with the positions of all cells containing a tile. Tiles may be filtered according to their source ([param source_id]), their atlas coordinates ([param atlas_coords]), or alternative id ([param alternative_tile]).  
         *  If a parameter has its value set to the default one, this parameter is not used to filter a cell. Thus, if all parameters have their respective default values, this method returns the same result as [method get_used_cells].  
         *  A cell is considered empty if its source identifier equals `-1`, its atlas coordinate identifier is `Vector2(-1, -1)` and its alternative identifier is `-1`.  
         */
        get_used_cells_by_id(source_id?: int64 /* = -1 */, atlas_coords?: Vector2i /* = new Vector2i(-1, -1) */, alternative_tile?: int64 /* = -1 */): GArray<Vector2i>
        
        /** Returns a rectangle enclosing the used (non-empty) tiles of the map. */
        get_used_rect(): Rect2i
        
        /** Creates and returns a new [TileMapPattern] from the given array of cells. See also [method set_pattern]. */
        get_pattern(coords_array: GArray<Vector2i>): null | TileMapPattern
        
        /** Pastes the [TileMapPattern] at the given [param position] in the tile map. See also [method get_pattern]. */
        set_pattern(position: Vector2i, pattern: TileMapPattern): void
        
        /** Update all the cells in the [param cells] coordinates array so that they use the given [param terrain] for the given [param terrain_set]. If an updated cell has the same terrain as one of its neighboring cells, this function tries to join the two. This function might update neighboring tiles if needed to create correct terrain transitions.  
         *  If [param ignore_empty_terrains] is `true`, empty terrains will be ignored when trying to find the best fitting tile for the given terrain constraints.  
         *      
         *  **Note:** To work correctly, this method requires the [TileMapLayer]'s TileSet to have terrains set up with all required terrain combinations. Otherwise, it may produce unexpected results.  
         */
        set_cells_terrain_connect(cells: GArray<Vector2i>, terrain_set: int64, terrain: int64, ignore_empty_terrains?: boolean /* = true */): void
        
        /** Update all the cells in the [param path] coordinates array so that they use the given [param terrain] for the given [param terrain_set]. The function will also connect two successive cell in the path with the same terrain. This function might update neighboring tiles if needed to create correct terrain transitions.  
         *  If [param ignore_empty_terrains] is `true`, empty terrains will be ignored when trying to find the best fitting tile for the given terrain constraints.  
         *      
         *  **Note:** To work correctly, this method requires the [TileMapLayer]'s TileSet to have terrains set up with all required terrain combinations. Otherwise, it may produce unexpected results.  
         */
        set_cells_terrain_path(path: GArray<Vector2i>, terrain_set: int64, terrain: int64, ignore_empty_terrains?: boolean /* = true */): void
        
        /** Returns whether the provided [param body] [RID] belongs to one of this [TileMapLayer]'s cells. */
        has_body_rid(body: RID): boolean
        
        /** Returns the coordinates of the physics quadrant (see [member physics_quadrant_size]) for given physics body [RID]. Such an [RID] can be retrieved from [method KinematicCollision2D.get_collider_rid], when colliding with a tile.  
         *      
         *  **Note:** Higher values of [member physics_quadrant_size] will make this function less precise. To get the exact cell coordinates, you need to set [member physics_quadrant_size] to `1`, which disables physics chunking.  
         */
        get_coords_for_body_rid(body: RID): Vector2i
        
        /** Triggers a direct update of the [TileMapLayer]. Usually, calling this function is not needed, as [TileMapLayer] node updates automatically when one of its properties or cells is modified.  
         *  However, for performance reasons, those updates are batched and delayed to the end of the frame. Calling this function will force the [TileMapLayer] to update right away instead.  
         *  **Warning:** Updating the [TileMapLayer] is computationally expensive and may impact performance. Try to limit the number of updates and how many tiles they impact.  
         */
        update_internals(): void
        
        /** Notifies the [TileMapLayer] node that calls to [method _use_tile_data_runtime_update] or [method _tile_data_runtime_update] will lead to different results. This will thus trigger a [TileMapLayer] update.  
         *  **Warning:** Updating the [TileMapLayer] is computationally expensive and may impact performance. Try to limit the number of calls to this function to avoid unnecessary update.  
         *      
         *  **Note:** This does not trigger a direct update of the [TileMapLayer], the update will be done at the end of the frame as usual (unless you call [method update_internals]).  
         */
        notify_runtime_tile_data_update(): void
        
        /** Returns for the given coordinates [param coords_in_pattern] in a [TileMapPattern] the corresponding cell coordinates if the pattern was pasted at the [param position_in_tilemap] coordinates (see [method set_pattern]). This mapping is required as in half-offset tile shapes, the mapping might not work by calculating `position_in_tile_map + coords_in_pattern`. */
        map_pattern(position_in_tilemap: Vector2i, coords_in_pattern: Vector2i, pattern: TileMapPattern): Vector2i
        
        /** Returns the list of all neighboring cells to the one at [param coords]. Any neighboring cell is one that is touching edges, so for a square cell 4 cells would be returned, for a hexagon 6 cells are returned. */
        get_surrounding_cells(coords: Vector2i): GArray<Vector2i>
        
        /** Returns the neighboring cell to the one at coordinates [param coords], identified by the [param neighbor] direction. This method takes into account the different layouts a TileMap can take. */
        get_neighbor_cell(coords: Vector2i, neighbor: TileSet.CellNeighbor): Vector2i
        
        /** Returns the centered position of a cell in the [TileMapLayer]'s local coordinate space. To convert the returned value into global coordinates, use [method Node2D.to_global]. See also [method local_to_map].  
         *      
         *  **Note:** This may not correspond to the visual position of the tile, i.e. it ignores the [member TileData.texture_origin] property of individual tiles.  
         */
        map_to_local(map_position: Vector2i): Vector2
        
        /** Returns the map coordinates of the cell containing the given [param local_position]. If [param local_position] is in global coordinates, consider using [method Node2D.to_local] before passing it to this method. See also [method map_to_local]. */
        local_to_map(local_position: Vector2): Vector2i
        
        /** Sets a custom [param map] as a [NavigationServer2D] navigation map. If not set, uses the default [World2D] navigation map instead. */
        set_navigation_map(map: RID): void
        
        /** Returns the [RID] of the [NavigationServer2D] navigation used by this [TileMapLayer].  
         *  By default this returns the default [World2D] navigation map, unless a custom map was provided using [method set_navigation_map].  
         */
        get_navigation_map(): RID
        
        /** The raw tile map data as a byte array. */
        get tile_map_data(): PackedByteArray
        set tile_map_data(value: PackedByteArray | byte[] | ArrayBuffer)
        
        /** If `false`, disables this [TileMapLayer] completely (rendering, collision, navigation, scene tiles, etc.) */
        get enabled(): boolean
        set enabled(value: boolean)
        
        /** The [TileSet] used by this layer. The textures, collisions, and additional behavior of all available tiles are stored here. */
        get tile_set(): null | TileSet
        set tile_set(value: null | TileSet)
        
        /** Enable or disable light occlusion. */
        get occlusion_enabled(): boolean
        set occlusion_enabled(value: boolean)
        
        /** This Y-sort origin value is added to each tile's Y-sort origin value. This allows, for example, to fake a different height level. This can be useful for top-down view games. */
        get y_sort_origin(): int64
        set y_sort_origin(value: int64)
        
        /** If [member CanvasItem.y_sort_enabled] is enabled, setting this to `true` will reverse the order the tiles are drawn on the X-axis. */
        get x_draw_order_reversed(): boolean
        set x_draw_order_reversed(value: boolean)
        
        /** The [TileMapLayer]'s rendering quadrant size. A quadrant is a group of tiles to be drawn together on a single canvas item, for optimization purposes. [member rendering_quadrant_size] defines the length of a square's side, in the map's coordinate system, that forms the quadrant. Thus, the default quadrant size groups together `16 * 16 = 256` tiles.  
         *  The quadrant size does not apply on a Y-sorted [TileMapLayer], as tiles are grouped by Y position instead in that case.  
         *      
         *  **Note:** As quadrants are created according to the map's coordinate system, the quadrant's "square shape" might not look like square in the [TileMapLayer]'s local coordinate system.  
         */
        get rendering_quadrant_size(): int64
        set rendering_quadrant_size(value: int64)
        
        /** Enable or disable collisions. */
        get collision_enabled(): boolean
        set collision_enabled(value: boolean)
        
        /** If `true`, this [TileMapLayer] collision shapes will be instantiated as kinematic bodies. This can be needed for moving [TileMapLayer] nodes (i.e. moving platforms). */
        get use_kinematic_bodies(): boolean
        set use_kinematic_bodies(value: boolean)
        
        /** Show or hide the [TileMapLayer]'s collision shapes. If set to [constant DEBUG_VISIBILITY_MODE_DEFAULT], this depends on the show collision debug settings. */
        get collision_visibility_mode(): int64
        set collision_visibility_mode(value: int64)
        
        /** The [TileMapLayer]'s physics quadrant size. Within a physics quadrant, cells with similar physics properties are grouped together and their collision shapes get merged. [member physics_quadrant_size] defines the length of a square's side, in the map's coordinate system, that forms the quadrant. Thus, the default quadrant size groups together `16 * 16 = 256` tiles.  
         *      
         *  **Note:** As quadrants are created according to the map's coordinate system, the quadrant's "square shape" might not look like square in the [TileMapLayer]'s local coordinate system.  
         *      
         *  **Note:** This impacts the value returned by [method get_coords_for_body_rid]. Higher values will make that function less precise. To get the exact cell coordinates, you need to set [member physics_quadrant_size] to `1`, which disables physics chunking.  
         */
        get physics_quadrant_size(): int64
        set physics_quadrant_size(value: int64)
        
        /** If `true`, navigation regions are enabled. */
        get navigation_enabled(): boolean
        set navigation_enabled(value: boolean)
        
        /** Show or hide the [TileMapLayer]'s navigation meshes. If set to [constant DEBUG_VISIBILITY_MODE_DEFAULT], this depends on the show navigation debug settings. */
        get navigation_visibility_mode(): int64
        set navigation_visibility_mode(value: int64)
        
        /** Emitted when this [TileMapLayer]'s properties changes. This includes modified cells, properties, or changes made to its assigned [TileSet].  
         *      
         *  **Note:** This signal may be emitted very often when batch-modifying a [TileMapLayer]. Avoid executing complex processing in a connected function, and consider delaying it to the end of the frame instead (i.e. calling [method Object.call_deferred]).  
         */
        readonly changed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTileMapLayer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTileMapLayer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTileMapPattern extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTileMapPattern extends __NameMapResource {
    }
    /** Holds a pattern to be copied from or pasted into [TileMap]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_tilemappattern.html  
     */
    class TileMapPattern extends Resource {
        constructor(identifier?: any)
        /** Sets the tile identifiers for the cell at coordinates [param coords]. See [method TileMap.set_cell]. */
        set_cell(coords: Vector2i, source_id?: int64 /* = -1 */, atlas_coords?: Vector2i /* = new Vector2i(-1, -1) */, alternative_tile?: int64 /* = -1 */): void
        
        /** Returns whether the pattern has a tile at the given coordinates. */
        has_cell(coords: Vector2i): boolean
        
        /** Remove the cell at the given coordinates. */
        remove_cell(coords: Vector2i, update_size: boolean): void
        
        /** Returns the tile source ID of the cell at [param coords]. */
        get_cell_source_id(coords: Vector2i): int64
        
        /** Returns the tile atlas coordinates ID of the cell at [param coords]. */
        get_cell_atlas_coords(coords: Vector2i): Vector2i
        
        /** Returns the tile alternative ID of the cell at [param coords]. */
        get_cell_alternative_tile(coords: Vector2i): int64
        
        /** Returns the list of used cell coordinates in the pattern. */
        get_used_cells(): GArray<Vector2i>
        
        /** Returns the size, in cells, of the pattern. */
        get_size(): Vector2i
        
        /** Sets the size of the pattern. */
        set_size(size: Vector2i): void
        
        /** Returns whether the pattern is empty or not. */
        is_empty(): boolean
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTileMapPattern;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTileMapPattern;
    }
    namespace TileSet {
        enum TileShape {
            /** Rectangular tile shape. */
            TILE_SHAPE_SQUARE = 0,
            
            /** Diamond tile shape (for isometric look).  
             *      
             *  **Note:** Isometric [TileSet] works best if all sibling [TileMapLayer]s and their parent inheriting from [Node2D] have Y-sort enabled.  
             */
            TILE_SHAPE_ISOMETRIC = 1,
            
            /** Rectangular tile shape with one row/column out of two offset by half a tile. */
            TILE_SHAPE_HALF_OFFSET_SQUARE = 2,
            
            /** Hexagonal tile shape. */
            TILE_SHAPE_HEXAGON = 3,
        }
        enum TileLayout {
            /** Tile coordinates layout where both axis stay consistent with their respective local horizontal and vertical axis. */
            TILE_LAYOUT_STACKED = 0,
            
            /** Same as [constant TILE_LAYOUT_STACKED], but the first half-offset is negative instead of positive. */
            TILE_LAYOUT_STACKED_OFFSET = 1,
            
            /** Tile coordinates layout where the horizontal axis stay horizontal, and the vertical one goes down-right. */
            TILE_LAYOUT_STAIRS_RIGHT = 2,
            
            /** Tile coordinates layout where the vertical axis stay vertical, and the horizontal one goes down-right. */
            TILE_LAYOUT_STAIRS_DOWN = 3,
            
            /** Tile coordinates layout where the horizontal axis goes up-right, and the vertical one goes down-right. */
            TILE_LAYOUT_DIAMOND_RIGHT = 4,
            
            /** Tile coordinates layout where the horizontal axis goes down-right, and the vertical one goes down-left. */
            TILE_LAYOUT_DIAMOND_DOWN = 5,
        }
        enum TileOffsetAxis {
            /** Horizontal half-offset. */
            TILE_OFFSET_AXIS_HORIZONTAL = 0,
            
            /** Vertical half-offset. */
            TILE_OFFSET_AXIS_VERTICAL = 1,
        }
        enum CellNeighbor {
            /** Neighbor on the right side. */
            CELL_NEIGHBOR_RIGHT_SIDE = 0,
            
            /** Neighbor in the right corner. */
            CELL_NEIGHBOR_RIGHT_CORNER = 1,
            
            /** Neighbor on the bottom right side. */
            CELL_NEIGHBOR_BOTTOM_RIGHT_SIDE = 2,
            
            /** Neighbor in the bottom right corner. */
            CELL_NEIGHBOR_BOTTOM_RIGHT_CORNER = 3,
            
            /** Neighbor on the bottom side. */
            CELL_NEIGHBOR_BOTTOM_SIDE = 4,
            
            /** Neighbor in the bottom corner. */
            CELL_NEIGHBOR_BOTTOM_CORNER = 5,
            
            /** Neighbor on the bottom left side. */
            CELL_NEIGHBOR_BOTTOM_LEFT_SIDE = 6,
            
            /** Neighbor in the bottom left corner. */
            CELL_NEIGHBOR_BOTTOM_LEFT_CORNER = 7,
            
            /** Neighbor on the left side. */
            CELL_NEIGHBOR_LEFT_SIDE = 8,
            
            /** Neighbor in the left corner. */
            CELL_NEIGHBOR_LEFT_CORNER = 9,
            
            /** Neighbor on the top left side. */
            CELL_NEIGHBOR_TOP_LEFT_SIDE = 10,
            
            /** Neighbor in the top left corner. */
            CELL_NEIGHBOR_TOP_LEFT_CORNER = 11,
            
            /** Neighbor on the top side. */
            CELL_NEIGHBOR_TOP_SIDE = 12,
            
            /** Neighbor in the top corner. */
            CELL_NEIGHBOR_TOP_CORNER = 13,
            
            /** Neighbor on the top right side. */
            CELL_NEIGHBOR_TOP_RIGHT_SIDE = 14,
            
            /** Neighbor in the top right corner. */
            CELL_NEIGHBOR_TOP_RIGHT_CORNER = 15,
        }
        enum TerrainMode {
            /** Requires both corners and side to match with neighboring tiles' terrains. */
            TERRAIN_MODE_MATCH_CORNERS_AND_SIDES = 0,
            
            /** Requires corners to match with neighboring tiles' terrains. */
            TERRAIN_MODE_MATCH_CORNERS = 1,
            
            /** Requires sides to match with neighboring tiles' terrains. */
            TERRAIN_MODE_MATCH_SIDES = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTileSet extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTileSet extends __NameMapResource {
    }
    /** Tile library for tilemaps.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_tileset.html  
     */
    class TileSet extends Resource {
        constructor(identifier?: any)
        /** Returns a new unused source ID. This generated ID is the same that a call to [method add_source] would return. */
        get_next_source_id(): int64
        
        /** Adds a [TileSetSource] to the TileSet. If [param atlas_source_id_override] is not -1, also set its source ID. Otherwise, a unique identifier is automatically generated.  
         *  The function returns the added source ID or -1 if the source could not be added.  
         *  **Warning:** A source cannot belong to two TileSets at the same time. If the added source was attached to another [TileSet], it will be removed from that one.  
         */
        add_source(source: TileSetSource, atlas_source_id_override?: int64 /* = -1 */): int64
        
        /** Removes the source with the given source ID. */
        remove_source(source_id: int64): void
        
        /** Changes a source's ID. */
        set_source_id(source_id: int64, new_source_id: int64): void
        
        /** Returns the number of [TileSetSource] in this TileSet. */
        get_source_count(): int64
        
        /** Returns the source ID for source with index [param index]. */
        get_source_id(index: int64): int64
        
        /** Returns if this TileSet has a source for the given source ID. */
        has_source(source_id: int64): boolean
        
        /** Returns the [TileSetSource] with ID [param source_id]. */
        get_source(source_id: int64): null | TileSetSource
        
        /** Returns the occlusion layers count. */
        get_occlusion_layers_count(): int64
        
        /** Adds an occlusion layer to the TileSet at the given position [param to_position] in the array. If [param to_position] is -1, adds it at the end of the array.  
         *  Occlusion layers allow assigning occlusion polygons to atlas tiles.  
         */
        add_occlusion_layer(to_position?: int64 /* = -1 */): void
        
        /** Moves the occlusion layer at index [param layer_index] to the given position [param to_position] in the array. Also updates the atlas tiles accordingly. */
        move_occlusion_layer(layer_index: int64, to_position: int64): void
        
        /** Removes the occlusion layer at index [param layer_index]. Also updates the atlas tiles accordingly. */
        remove_occlusion_layer(layer_index: int64): void
        
        /** Sets the occlusion layer (as in the rendering server) for occluders in the given TileSet occlusion layer. */
        set_occlusion_layer_light_mask(layer_index: int64, light_mask: int64): void
        
        /** Returns the light mask of the occlusion layer. */
        get_occlusion_layer_light_mask(layer_index: int64): int64
        
        /** Enables or disables SDF collision for occluders in the given TileSet occlusion layer. */
        set_occlusion_layer_sdf_collision(layer_index: int64, sdf_collision: boolean): void
        
        /** Returns if the occluders from this layer use `sdf_collision`. */
        get_occlusion_layer_sdf_collision(layer_index: int64): boolean
        
        /** Returns the physics layers count. */
        get_physics_layers_count(): int64
        
        /** Adds a physics layer to the TileSet at the given position [param to_position] in the array. If [param to_position] is -1, adds it at the end of the array.  
         *  Physics layers allow assigning collision polygons to atlas tiles.  
         */
        add_physics_layer(to_position?: int64 /* = -1 */): void
        
        /** Moves the physics layer at index [param layer_index] to the given position [param to_position] in the array. Also updates the atlas tiles accordingly. */
        move_physics_layer(layer_index: int64, to_position: int64): void
        
        /** Removes the physics layer at index [param layer_index]. Also updates the atlas tiles accordingly. */
        remove_physics_layer(layer_index: int64): void
        
        /** Sets the collision layer (as in the physics server) for bodies in the given TileSet physics layer. */
        set_physics_layer_collision_layer(layer_index: int64, layer: int64): void
        
        /** Returns the collision layer (as in the physics server) bodies on the given TileSet's physics layer are in. */
        get_physics_layer_collision_layer(layer_index: int64): int64
        
        /** Sets the collision mask for bodies in the given TileSet physics layer. */
        set_physics_layer_collision_mask(layer_index: int64, mask: int64): void
        
        /** Returns the collision mask of bodies on the given TileSet's physics layer. */
        get_physics_layer_collision_mask(layer_index: int64): int64
        
        /** Sets the collision priority for bodies in the given TileSet physics layer. */
        set_physics_layer_collision_priority(layer_index: int64, priority: float64): void
        
        /** Returns the collision priority of bodies on the given TileSet's physics layer. */
        get_physics_layer_collision_priority(layer_index: int64): float64
        
        /** Sets the physics material for bodies in the given TileSet physics layer. */
        set_physics_layer_physics_material(layer_index: int64, physics_material: PhysicsMaterial): void
        
        /** Returns the physics material of bodies on the given TileSet's physics layer. */
        get_physics_layer_physics_material(layer_index: int64): null | PhysicsMaterial
        
        /** Returns the terrain sets count. */
        get_terrain_sets_count(): int64
        
        /** Adds a new terrain set at the given position [param to_position] in the array. If [param to_position] is -1, adds it at the end of the array. */
        add_terrain_set(to_position?: int64 /* = -1 */): void
        
        /** Moves the terrain set at index [param terrain_set] to the given position [param to_position] in the array. Also updates the atlas tiles accordingly. */
        move_terrain_set(terrain_set: int64, to_position: int64): void
        
        /** Removes the terrain set at index [param terrain_set]. Also updates the atlas tiles accordingly. */
        remove_terrain_set(terrain_set: int64): void
        
        /** Sets a terrain mode. Each mode determines which bits of a tile shape is used to match the neighboring tiles' terrains. */
        set_terrain_set_mode(terrain_set: int64, mode: TileSet.TerrainMode): void
        
        /** Returns a terrain set mode. */
        get_terrain_set_mode(terrain_set: int64): TileSet.TerrainMode
        
        /** Returns the number of terrains in the given terrain set. */
        get_terrains_count(terrain_set: int64): int64
        
        /** Adds a new terrain to the given terrain set [param terrain_set] at the given position [param to_position] in the array. If [param to_position] is -1, adds it at the end of the array. */
        add_terrain(terrain_set: int64, to_position?: int64 /* = -1 */): void
        
        /** Moves the terrain at index [param terrain_index] for terrain set [param terrain_set] to the given position [param to_position] in the array. Also updates the atlas tiles accordingly. */
        move_terrain(terrain_set: int64, terrain_index: int64, to_position: int64): void
        
        /** Removes the terrain at index [param terrain_index] in the given terrain set [param terrain_set]. Also updates the atlas tiles accordingly. */
        remove_terrain(terrain_set: int64, terrain_index: int64): void
        
        /** Sets a terrain's name. */
        set_terrain_name(terrain_set: int64, terrain_index: int64, name: string): void
        
        /** Returns a terrain's name. */
        get_terrain_name(terrain_set: int64, terrain_index: int64): string
        
        /** Sets a terrain's color. This color is used for identifying the different terrains in the TileSet editor. */
        set_terrain_color(terrain_set: int64, terrain_index: int64, color: Color): void
        
        /** Returns a terrain's color. */
        get_terrain_color(terrain_set: int64, terrain_index: int64): Color
        
        /** Returns the navigation layers count. */
        get_navigation_layers_count(): int64
        
        /** Adds a navigation layer to the TileSet at the given position [param to_position] in the array. If [param to_position] is -1, adds it at the end of the array.  
         *  Navigation layers allow assigning a navigable area to atlas tiles.  
         */
        add_navigation_layer(to_position?: int64 /* = -1 */): void
        
        /** Moves the navigation layer at index [param layer_index] to the given position [param to_position] in the array. Also updates the atlas tiles accordingly. */
        move_navigation_layer(layer_index: int64, to_position: int64): void
        
        /** Removes the navigation layer at index [param layer_index]. Also updates the atlas tiles accordingly. */
        remove_navigation_layer(layer_index: int64): void
        
        /** Sets the navigation layers (as in the navigation server) for navigation regions in the given TileSet navigation layer. */
        set_navigation_layer_layers(layer_index: int64, layers: int64): void
        
        /** Returns the navigation layers (as in the Navigation server) of the given TileSet navigation layer. */
        get_navigation_layer_layers(layer_index: int64): int64
        
        /** Based on [param value], enables or disables the specified navigation layer of the TileSet navigation data layer identified by the given [param layer_index], given a navigation_layers [param layer_number] between 1 and 32. */
        set_navigation_layer_layer_value(layer_index: int64, layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified navigation layer of the TileSet navigation data layer identified by the given [param layer_index] is enabled, given a navigation_layers [param layer_number] between 1 and 32. */
        get_navigation_layer_layer_value(layer_index: int64, layer_number: int64): boolean
        
        /** Returns the custom data layers count. */
        get_custom_data_layers_count(): int64
        
        /** Adds a custom data layer to the TileSet at the given position [param to_position] in the array. If [param to_position] is -1, adds it at the end of the array.  
         *  Custom data layers allow assigning custom properties to atlas tiles.  
         */
        add_custom_data_layer(to_position?: int64 /* = -1 */): void
        
        /** Moves the custom data layer at index [param layer_index] to the given position [param to_position] in the array. Also updates the atlas tiles accordingly. */
        move_custom_data_layer(layer_index: int64, to_position: int64): void
        
        /** Removes the custom data layer at index [param layer_index]. Also updates the atlas tiles accordingly. */
        remove_custom_data_layer(layer_index: int64): void
        
        /** Returns the index of the custom data layer identified by the given name. */
        get_custom_data_layer_by_name(layer_name: string): int64
        
        /** Sets the name of the custom data layer identified by the given index. Names are identifiers of the layer therefore if the name is already taken it will fail and raise an error. */
        set_custom_data_layer_name(layer_index: int64, layer_name: string): void
        
        /** Returns if there is a custom data layer named [param layer_name]. */
        has_custom_data_layer_by_name(layer_name: string): boolean
        
        /** Returns the name of the custom data layer identified by the given index. */
        get_custom_data_layer_name(layer_index: int64): string
        
        /** Sets the type of the custom data layer identified by the given index. */
        set_custom_data_layer_type(layer_index: int64, layer_type: Variant.Type): void
        
        /** Returns the type of the custom data layer identified by the given index. */
        get_custom_data_layer_type(layer_index: int64): Variant.Type
        
        /** Creates a source-level proxy for the given source ID. A proxy will map set of tile identifiers to another set of identifiers. Both the atlas coordinates ID and the alternative tile ID are kept the same when using source-level proxies.  
         *  Proxied tiles can be automatically replaced in TileMapLayer nodes using the editor.  
         */
        set_source_level_tile_proxy(source_from: int64, source_to: int64): void
        
        /** Returns the source-level proxy for the given source identifier.  
         *  If the TileSet has no proxy for the given identifier, returns -1.  
         */
        get_source_level_tile_proxy(source_from: int64): int64
        
        /** Returns if there is a source-level proxy for the given source ID. */
        has_source_level_tile_proxy(source_from: int64): boolean
        
        /** Removes a source-level tile proxy. */
        remove_source_level_tile_proxy(source_from: int64): void
        
        /** Creates a coordinates-level proxy for the given identifiers. A proxy will map set of tile identifiers to another set of identifiers. The alternative tile ID is kept the same when using coordinates-level proxies.  
         *  Proxied tiles can be automatically replaced in TileMapLayer nodes using the editor.  
         */
        set_coords_level_tile_proxy(p_source_from: int64, coords_from: Vector2i, source_to: int64, coords_to: Vector2i): void
        
        /** Returns the coordinate-level proxy for the given identifiers. The returned array contains the two target identifiers of the proxy (source ID and atlas coordinates ID).  
         *  If the TileSet has no proxy for the given identifiers, returns an empty Array.  
         */
        get_coords_level_tile_proxy(source_from: int64, coords_from: Vector2i): GArray
        
        /** Returns if there is a coodinates-level proxy for the given identifiers. */
        has_coords_level_tile_proxy(source_from: int64, coords_from: Vector2i): boolean
        
        /** Removes a coordinates-level proxy for the given identifiers. */
        remove_coords_level_tile_proxy(source_from: int64, coords_from: Vector2i): void
        
        /** Create an alternative-level proxy for the given identifiers. A proxy will map set of tile identifiers to another set of identifiers.  
         *  Proxied tiles can be automatically replaced in TileMapLayer nodes using the editor.  
         */
        set_alternative_level_tile_proxy(source_from: int64, coords_from: Vector2i, alternative_from: int64, source_to: int64, coords_to: Vector2i, alternative_to: int64): void
        
        /** Returns the alternative-level proxy for the given identifiers. The returned array contains the three proxie's target identifiers (source ID, atlas coords ID and alternative tile ID).  
         *  If the TileSet has no proxy for the given identifiers, returns an empty Array.  
         */
        get_alternative_level_tile_proxy(source_from: int64, coords_from: Vector2i, alternative_from: int64): GArray
        
        /** Returns if there is an alternative-level proxy for the given identifiers. */
        has_alternative_level_tile_proxy(source_from: int64, coords_from: Vector2i, alternative_from: int64): boolean
        
        /** Removes an alternative-level proxy for the given identifiers. */
        remove_alternative_level_tile_proxy(source_from: int64, coords_from: Vector2i, alternative_from: int64): void
        
        /** According to the configured proxies, maps the provided identifiers to a new set of identifiers. The source ID, atlas coordinates ID and alternative tile ID are returned as a 3 elements Array.  
         *  This function first look for matching alternative-level proxies, then coordinates-level proxies, then source-level proxies.  
         *  If no proxy corresponding to provided identifiers are found, returns the same values the ones used as arguments.  
         */
        map_tile_proxy(source_from: int64, coords_from: Vector2i, alternative_from: int64): GArray
        
        /** Clears tile proxies pointing to invalid tiles. */
        cleanup_invalid_tile_proxies(): void
        
        /** Clears all tile proxies. */
        clear_tile_proxies(): void
        
        /** Adds a [TileMapPattern] to be stored in the TileSet resource. If provided, insert it at the given [param index]. */
        add_pattern(pattern: TileMapPattern, index?: int64 /* = -1 */): int64
        
        /** Returns the [TileMapPattern] at the given [param index]. */
        get_pattern(index?: int64 /* = -1 */): null | TileMapPattern
        
        /** Remove the [TileMapPattern] at the given index. */
        remove_pattern(index: int64): void
        
        /** Returns the number of [TileMapPattern] this tile set handles. */
        get_patterns_count(): int64
        
        /** The tile shape. */
        get tile_shape(): int64
        set tile_shape(value: int64)
        
        /** For all half-offset shapes (Isometric, Hexagonal and Half-Offset square), changes the way tiles are indexed in the [TileMapLayer] grid. */
        get tile_layout(): int64
        set tile_layout(value: int64)
        
        /** For all half-offset shapes (Isometric, Hexagonal and Half-Offset square), determines the offset axis. */
        get tile_offset_axis(): int64
        set tile_offset_axis(value: int64)
        
        /** The tile size, in pixels. For all tile shapes, this size corresponds to the encompassing rectangle of the tile shape. This is thus the minimal cell size required in an atlas. */
        get tile_size(): Vector2i
        set tile_size(value: Vector2i)
        
        /** Enables/Disable uv clipping when rendering the tiles. */
        get uv_clipping(): boolean
        set uv_clipping(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTileSet;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTileSet;
    }
    namespace TileSetAtlasSource {
        enum TileAnimationMode {
            /** Tile animations start at same time, looking identical. */
            TILE_ANIMATION_MODE_DEFAULT = 0,
            
            /** Tile animations start at random times, looking varied. */
            TILE_ANIMATION_MODE_RANDOM_START_TIMES = 1,
            
            /** Represents the size of the [enum TileAnimationMode] enum. */
            TILE_ANIMATION_MODE_MAX = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTileSetAtlasSource extends __RPCMapTileSetSource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTileSetAtlasSource extends __NameMapTileSetSource {
    }
    /** Exposes a 2D atlas texture as a set of tiles for a [TileSet] resource.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_tilesetatlassource.html  
     */
    class TileSetAtlasSource extends TileSetSource {
        /** Represents cell's horizontal flip flag. Should be used directly with [TileMapLayer] to flip placed tiles by altering their alternative IDs.  
         *    
         *      
         *  **Note:** These transformations can be combined to do the equivalent of 0, 90, 180, and 270 degree rotations, as shown below:  
         *    
         */
        static readonly TRANSFORM_FLIP_H = 4096
        
        /** Represents cell's vertical flip flag. See [constant TRANSFORM_FLIP_H] for usage. */
        static readonly TRANSFORM_FLIP_V = 8192
        
        /** Represents cell's transposed flag. See [constant TRANSFORM_FLIP_H] for usage. */
        static readonly TRANSFORM_TRANSPOSE = 16384
        constructor(identifier?: any)
        
        /** Creates a new tile at coordinates [param atlas_coords] with the given [param size]. */
        create_tile(atlas_coords: Vector2i, size?: Vector2i /* = Vector2i.ONE */): void
        
        /** Remove a tile and its alternative at coordinates [param atlas_coords]. */
        remove_tile(atlas_coords: Vector2i): void
        
        /** Move the tile and its alternatives at the [param atlas_coords] coordinates to the [param new_atlas_coords] coordinates with the [param new_size] size. This functions will fail if a tile is already present in the given area.  
         *  If [param new_atlas_coords] is `Vector2i(-1, -1)`, keeps the tile's coordinates. If [param new_size] is `Vector2i(-1, -1)`, keeps the tile's size.  
         *  To avoid an error, first check if a move is possible using [method has_room_for_tile].  
         */
        move_tile_in_atlas(atlas_coords: Vector2i, new_atlas_coords?: Vector2i /* = new Vector2i(-1, -1) */, new_size?: Vector2i /* = new Vector2i(-1, -1) */): void
        
        /** Returns the size of the tile (in the grid coordinates system) at coordinates [param atlas_coords]. */
        get_tile_size_in_atlas(atlas_coords: Vector2i): Vector2i
        
        /** Returns whether there is enough room in an atlas to create/modify a tile with the given properties. If [param ignored_tile] is provided, act as is the given tile was not present in the atlas. This may be used when you want to modify a tile's properties. */
        has_room_for_tile(atlas_coords: Vector2i, size: Vector2i, animation_columns: int64, animation_separation: Vector2i, frames_count: int64, ignored_tile?: Vector2i /* = new Vector2i(-1, -1) */): boolean
        
        /** Returns an array of tiles coordinates ID that will be automatically removed when modifying one or several of those properties: [param texture], [param margins], [param separation] or [param texture_region_size]. This can be used to undo changes that would have caused tiles data loss. */
        get_tiles_to_be_removed_on_change(texture: Texture2D, margins: Vector2i, separation: Vector2i, texture_region_size: Vector2i): PackedVector2Array
        
        /** If there is a tile covering the [param atlas_coords] coordinates, returns the top-left coordinates of the tile (thus its coordinate ID). Returns `Vector2i(-1, -1)` otherwise. */
        get_tile_at_coords(atlas_coords: Vector2i): Vector2i
        
        /** Checks if the source has any tiles that don't fit the texture area (either partially or completely). */
        has_tiles_outside_texture(): boolean
        
        /** Removes all tiles that don't fit the available texture area. This method iterates over all the source's tiles, so it's advised to use [method has_tiles_outside_texture] beforehand. */
        clear_tiles_outside_texture(): void
        
        /** Sets the number of columns in the animation layout of the tile at coordinates [param atlas_coords]. If set to 0, then the different frames of the animation are laid out as a single horizontal line in the atlas. */
        set_tile_animation_columns(atlas_coords: Vector2i, frame_columns: int64): void
        
        /** Returns how many columns the tile at [param atlas_coords] has in its animation layout. */
        get_tile_animation_columns(atlas_coords: Vector2i): int64
        
        /** Sets the margin (in grid tiles) between each tile in the animation layout of the tile at coordinates [param atlas_coords] has. */
        set_tile_animation_separation(atlas_coords: Vector2i, separation: Vector2i): void
        
        /** Returns the separation (as in the atlas grid) between each frame of an animated tile at coordinates [param atlas_coords]. */
        get_tile_animation_separation(atlas_coords: Vector2i): Vector2i
        
        /** Sets the animation speed of the tile at coordinates [param atlas_coords] has. */
        set_tile_animation_speed(atlas_coords: Vector2i, speed: float64): void
        
        /** Returns the animation speed of the tile at coordinates [param atlas_coords]. */
        get_tile_animation_speed(atlas_coords: Vector2i): float64
        
        /** Sets the tile animation mode of the tile at [param atlas_coords] to [param mode]. See also [method get_tile_animation_mode]. */
        set_tile_animation_mode(atlas_coords: Vector2i, mode: TileSetAtlasSource.TileAnimationMode): void
        
        /** Returns the tile animation mode of the tile at [param atlas_coords]. See also [method set_tile_animation_mode]. */
        get_tile_animation_mode(atlas_coords: Vector2i): TileSetAtlasSource.TileAnimationMode
        
        /** Sets how many animation frames the tile at coordinates [param atlas_coords] has. */
        set_tile_animation_frames_count(atlas_coords: Vector2i, frames_count: int64): void
        
        /** Returns how many animation frames has the tile at coordinates [param atlas_coords]. */
        get_tile_animation_frames_count(atlas_coords: Vector2i): int64
        
        /** Sets the animation frame [param duration] of frame [param frame_index] for the tile at coordinates [param atlas_coords]. */
        set_tile_animation_frame_duration(atlas_coords: Vector2i, frame_index: int64, duration: float64): void
        
        /** Returns the animation frame duration of frame [param frame_index] for the tile at coordinates [param atlas_coords]. */
        get_tile_animation_frame_duration(atlas_coords: Vector2i, frame_index: int64): float64
        
        /** Returns the sum of the sum of the frame durations of the tile at coordinates [param atlas_coords]. This value needs to be divided by the animation speed to get the actual animation loop duration. */
        get_tile_animation_total_duration(atlas_coords: Vector2i): float64
        
        /** Creates an alternative tile for the tile at coordinates [param atlas_coords]. If [param alternative_id_override] is -1, give it an automatically generated unique ID, or assigns it the given ID otherwise.  
         *  Returns the new alternative identifier, or -1 if the alternative could not be created with a provided [param alternative_id_override].  
         */
        create_alternative_tile(atlas_coords: Vector2i, alternative_id_override?: int64 /* = -1 */): int64
        
        /** Remove a tile's alternative with alternative ID [param alternative_tile].  
         *  Calling this function with [param alternative_tile] equals to 0 will fail, as the base tile alternative cannot be removed.  
         */
        remove_alternative_tile(atlas_coords: Vector2i, alternative_tile: int64): void
        
        /** Change a tile's alternative ID from [param alternative_tile] to [param new_id].  
         *  Calling this function with [param new_id] of 0 will fail, as the base tile alternative cannot be moved.  
         */
        set_alternative_tile_id(atlas_coords: Vector2i, alternative_tile: int64, new_id: int64): void
        
        /** Returns the alternative ID a following call to [method create_alternative_tile] would return. */
        get_next_alternative_tile_id(atlas_coords: Vector2i): int64
        
        /** Returns the [TileData] object for the given atlas coordinates and alternative ID. */
        get_tile_data(atlas_coords: Vector2i, alternative_tile: int64): null | TileData
        
        /** Returns the atlas grid size, which depends on how many tiles can fit in the texture. It thus depends on the [member texture]'s size, the atlas [member margins], and the tiles' [member texture_region_size]. */
        get_atlas_grid_size(): Vector2i
        
        /** Returns a tile's texture region in the atlas texture. For animated tiles, a [param frame] argument might be provided for the different frames of the animation. */
        get_tile_texture_region(atlas_coords: Vector2i, frame?: int64 /* = 0 */): Rect2i
        
        /** If [member use_texture_padding] is `false`, returns [member texture]. Otherwise, returns an internal [ImageTexture] created that includes the padding. */
        get_runtime_texture(): null | Texture2D
        
        /** Returns the region of the tile at coordinates [param atlas_coords] for the given [param frame] inside the texture returned by [method get_runtime_texture].  
         *      
         *  **Note:** If [member use_texture_padding] is `false`, returns the same as [method get_tile_texture_region].  
         */
        get_runtime_tile_texture_region(atlas_coords: Vector2i, frame: int64): Rect2i
        
        /** The atlas texture. */
        get texture(): null | Texture2D
        set texture(value: null | Texture2D)
        
        /** Margins, in pixels, to offset the origin of the grid in the texture. */
        get margins(): Vector2i
        set margins(value: Vector2i)
        
        /** Separation, in pixels, between each tile texture region of the grid. */
        get separation(): Vector2i
        set separation(value: Vector2i)
        
        /** The base tile size in the texture (in pixel). This size must be bigger than or equal to the TileSet's `tile_size` value. */
        get texture_region_size(): Vector2i
        set texture_region_size(value: Vector2i)
        
        /** If `true`, generates an internal texture with an additional one pixel padding around each tile. Texture padding avoids a common artifact where lines appear between tiles.  
         *  Disabling this setting might lead a small performance improvement, as generating the internal texture requires both memory and processing time when the TileSetAtlasSource resource is modified.  
         */
        get use_texture_padding(): boolean
        set use_texture_padding(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTileSetAtlasSource;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTileSetAtlasSource;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTileSetScenesCollectionSource extends __RPCMapTileSetSource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTileSetScenesCollectionSource extends __NameMapTileSetSource {
    }
    /** Exposes a set of scenes as tiles for a [TileSet] resource.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_tilesetscenescollectionsource.html  
     */
    class TileSetScenesCollectionSource extends TileSetSource {
        constructor(identifier?: any)
        /** Returns the number or scene tiles this TileSet source has. */
        get_scene_tiles_count(): int64
        
        /** Returns the scene tile ID of the scene tile at [param index]. */
        get_scene_tile_id(index: int64): int64
        
        /** Returns whether this TileSet source has a scene tile with [param id]. */
        has_scene_tile_id(id: int64): boolean
        
        /** Creates a scene-based tile out of the given scene.  
         *  Returns a newly generated unique ID.  
         */
        create_scene_tile(packed_scene: PackedScene, id_override?: int64 /* = -1 */): int64
        
        /** Changes a scene tile's ID from [param id] to [param new_id]. This will fail if there is already a tile with an ID equal to [param new_id]. */
        set_scene_tile_id(id: int64, new_id: int64): void
        
        /** Assigns a [PackedScene] resource to the scene tile with [param id]. This will fail if the scene does not extend [CanvasItem], as positioning properties are needed to place the scene on the [TileMapLayer]. */
        set_scene_tile_scene(id: int64, packed_scene: PackedScene): void
        
        /** Returns the [PackedScene] resource of scene tile with [param id]. */
        get_scene_tile_scene(id: int64): null | PackedScene
        
        /** Sets whether or not the scene tile with [param id] should display a placeholder in the editor. This might be useful for scenes that are not visible. */
        set_scene_tile_display_placeholder(id: int64, display_placeholder: boolean): void
        
        /** Returns whether the scene tile with [param id] displays a placeholder in the editor. */
        get_scene_tile_display_placeholder(id: int64): boolean
        
        /** Remove the scene tile with [param id]. */
        remove_scene_tile(id: int64): void
        
        /** Returns the scene ID a following call to [method create_scene_tile] would return. */
        get_next_scene_tile_id(): int64
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTileSetScenesCollectionSource;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTileSetScenesCollectionSource;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTileSetSource extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTileSetSource extends __NameMapResource {
    }
    /** Exposes a set of tiles for a [TileSet] resource.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_tilesetsource.html  
     */
    class TileSetSource extends Resource {
        constructor(identifier?: any)
        /** Returns how many tiles this atlas source defines (not including alternative tiles). */
        get_tiles_count(): int64
        
        /** Returns the tile coordinates ID of the tile with index [param index]. */
        get_tile_id(index: int64): Vector2i
        
        /** Returns if this atlas has a tile with coordinates ID [param atlas_coords]. */
        has_tile(atlas_coords: Vector2i): boolean
        
        /** Returns the number of alternatives tiles for the coordinates ID [param atlas_coords].  
         *  For [TileSetAtlasSource], this always return at least 1, as the base tile with ID 0 is always part of the alternatives list.  
         *  Returns -1 if there is not tile at the given coords.  
         */
        get_alternative_tiles_count(atlas_coords: Vector2i): int64
        
        /** Returns the alternative ID for the tile with coordinates ID [param atlas_coords] at index [param index]. */
        get_alternative_tile_id(atlas_coords: Vector2i, index: int64): int64
        
        /** Returns if the base tile at coordinates [param atlas_coords] has an alternative with ID [param alternative_tile]. */
        has_alternative_tile(atlas_coords: Vector2i, alternative_tile: int64): boolean
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTileSetSource;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTileSetSource;
    }
    namespace Timer {
        enum TimerProcessCallback {
            /** Update the timer every physics process frame (see [constant Node.NOTIFICATION_INTERNAL_PHYSICS_PROCESS]). */
            TIMER_PROCESS_PHYSICS = 0,
            
            /** Update the timer every process (rendered) frame (see [constant Node.NOTIFICATION_INTERNAL_PROCESS]). */
            TIMER_PROCESS_IDLE = 1,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTimer extends __RPCMapNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTimer extends __NameMapNode {
    }
    /** A countdown timer.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_timer.html  
     */
    class Timer<Map extends NodePathMap = any> extends Node<Map> {
        constructor(identifier?: any)
        /** Starts the timer, or resets the timer if it was started already. Fails if the timer is not inside the scene tree. If [param time_sec] is greater than `0`, this value is used for the [member wait_time].  
         *      
         *  **Note:** This method does not resume a paused timer. See [member paused].  
         */
        start(time_sec?: float64 /* = -1 */): void
        
        /** Stops the timer. See also [member paused]. Unlike [method start], this can safely be called if the timer is not inside the scene tree.  
         *      
         *  **Note:** Calling [method stop] does not emit the [signal timeout] signal, as the timer is not considered to have timed out. If this is desired, use `$Timer.timeout.emit()` after calling [method stop] to manually emit the signal.  
         */
        stop(): void
        
        /** Returns `true` if the timer is stopped or has not started. */
        is_stopped(): boolean
        
        /** Specifies when the timer is updated during the main loop. */
        get process_callback(): int64
        set process_callback(value: int64)
        
        /** The time required for the timer to end, in seconds. This property can also be set every time [method start] is called.  
         *      
         *  **Note:** Timers can only process once per physics or process frame (depending on the [member process_callback]). An unstable framerate may cause the timer to end inconsistently, which is especially noticeable if the wait time is lower than roughly `0.05` seconds. For very short timers, it is recommended to write your own code instead of using a [Timer] node. Timers are also affected by [member Engine.time_scale].  
         */
        get wait_time(): float64
        set wait_time(value: float64)
        
        /** If `true`, the timer will stop after reaching the end. Otherwise, as by default, the timer will automatically restart. */
        get one_shot(): boolean
        set one_shot(value: boolean)
        
        /** If `true`, the timer will start immediately when it enters the scene tree.  
         *      
         *  **Note:** After the timer enters the tree, this property is automatically set to `false`.  
         *      
         *  **Note:** This property does nothing when the timer is running in the editor.  
         */
        get autostart(): boolean
        set autostart(value: boolean)
        
        /** If `true`, the timer is paused. A paused timer does not process until this property is set back to `false`, even when [method start] is called. See also [method stop]. */
        get paused(): boolean
        set paused(value: boolean)
        
        /** If `true`, the timer will ignore [member Engine.time_scale] and update with the real, elapsed time. */
        get ignore_time_scale(): boolean
        set ignore_time_scale(value: boolean)
        
        /** The timer's remaining time in seconds. This is always `0` if the timer is stopped.  
         *      
         *  **Note:** This property is read-only and cannot be modified. It is based on [member wait_time].  
         */
        get time_left(): float64
        
        /** Emitted when the timer reaches the end. */
        readonly timeout: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTimer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTimer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTorusMesh extends __RPCMapPrimitiveMesh {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTorusMesh extends __NameMapPrimitiveMesh {
    }
    /** Class representing a torus [PrimitiveMesh].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_torusmesh.html  
     */
    class TorusMesh extends PrimitiveMesh {
        constructor(identifier?: any)
        /** The inner radius of the torus. */
        get inner_radius(): float64
        set inner_radius(value: float64)
        
        /** The outer radius of the torus. */
        get outer_radius(): float64
        set outer_radius(value: float64)
        
        /** The number of slices the torus is constructed of. */
        get rings(): int64
        set rings(value: int64)
        
        /** The number of edges each ring of the torus is constructed of. */
        get ring_segments(): int64
        set ring_segments(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTorusMesh;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTorusMesh;
    }
    namespace TouchScreenButton {
        enum VisibilityMode {
            /** Always visible. */
            VISIBILITY_ALWAYS = 0,
            
            /** Visible on touch screens only. */
            VISIBILITY_TOUCHSCREEN_ONLY = 1,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTouchScreenButton extends __RPCMapNode2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTouchScreenButton extends __NameMapNode2D {
    }
    /** Button for touch screen devices for gameplay use.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_touchscreenbutton.html  
     */
    class TouchScreenButton<Map extends NodePathMap = any> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Returns `true` if this button is currently pressed. */
        is_pressed(): boolean
        
        /** The button's texture for the normal state. */
        get texture_normal(): null | Texture2D
        set texture_normal(value: null | Texture2D)
        
        /** The button's texture for the pressed state. */
        get texture_pressed(): null | Texture2D
        set texture_pressed(value: null | Texture2D)
        
        /** The button's bitmask. */
        get bitmask(): null | BitMap
        set bitmask(value: null | BitMap)
        
        /** The button's shape. */
        get shape(): null | Shape2D
        set shape(value: null | Shape2D)
        
        /** If `true`, the button's shape is centered in the provided texture. If no texture is used, this property has no effect. */
        get shape_centered(): boolean
        set shape_centered(value: boolean)
        
        /** If `true`, the button's shape is visible in the editor. */
        get shape_visible(): boolean
        set shape_visible(value: boolean)
        
        /** If `true`, the [signal pressed] and [signal released] signals are emitted whenever a pressed finger goes in and out of the button, even if the pressure started outside the active area of the button.  
         *      
         *  **Note:** This is a "pass-by" (not "bypass") press mode.  
         */
        get passby_press(): boolean
        set passby_press(value: boolean)
        
        /** The button's action. Actions can be handled with [InputEventAction]. */
        get action(): StringName
        set action(value: StringName)
        
        /** The button's visibility mode. */
        get visibility_mode(): int64
        set visibility_mode(value: int64)
        
        /** Emitted when the button is pressed (down). */
        readonly pressed: Signal<() => void>
        
        /** Emitted when the button is released (up). */
        readonly released: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTouchScreenButton;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTouchScreenButton;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTranslation extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTranslation extends __NameMapResource {
    }
    /** A language translation that maps a collection of strings to their individual translations.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_translation.html  
     */
    class Translation extends Resource {
        constructor(identifier?: any)
        /** Virtual method to override [method get_plural_message]. */
        /* gdvirtual */ _get_plural_message(src_message: StringName, src_plural_message: StringName, n: int64, context: StringName): StringName
        
        /** Virtual method to override [method get_message]. */
        /* gdvirtual */ _get_message(src_message: StringName, context: StringName): StringName
        
        /** Adds a message if nonexistent, followed by its translation.  
         *  An additional context could be used to specify the translation context or differentiate polysemic words.  
         */
        add_message(src_message: StringName, xlated_message: StringName, context?: StringName /* = '' */): void
        
        /** Adds a message involving plural translation if nonexistent, followed by its translation.  
         *  An additional context could be used to specify the translation context or differentiate polysemic words.  
         */
        add_plural_message(src_message: StringName, xlated_messages: PackedStringArray | string[], context?: StringName /* = '' */): void
        
        /** Returns a message's translation. */
        get_message(src_message: StringName, context?: StringName /* = '' */): StringName
        
        /** Returns a message's translation involving plurals.  
         *  The number [param n] is the number or quantity of the plural object. It will be used to guide the translation system to fetch the correct plural form for the selected language.  
         *      
         *  **Note:** Plurals are only supported in [url=https://docs.godotengine.org/en/4.6/tutorials/i18n/localization_using_gettext.html]gettext-based translations (PO)[/url], not CSV.  
         */
        get_plural_message(src_message: StringName, src_plural_message: StringName, n: int64, context?: StringName /* = '' */): StringName
        
        /** Erases a message. */
        erase_message(src_message: StringName, context?: StringName /* = '' */): void
        
        /** Returns the keys of all messages, that is, the context and untranslated strings of each message.  
         *      
         *  **Note:** If a message does not use a context, the corresponding element is the untranslated string. Otherwise, the corresponding element is the context and untranslated string separated by the EOT character (`U+0004`). This is done for compatibility purposes.  
         *    
         */
        get_message_list(): PackedStringArray
        
        /** Returns all the translated strings. */
        get_translated_message_list(): PackedStringArray
        
        /** Returns the number of existing messages. */
        get_message_count(): int64
        get messages(): GDictionary
        set messages(value: GDictionary)
        
        /** The locale of the translation. */
        get locale(): string
        set locale(value: string)
        
        /** The plural rules string to enforce. See [url=https://www.gnu.org/software/gettext/manual/html_node/Plural-forms.html]GNU gettext[/url] for examples and more info.  
         *  If empty or invalid, default plural rules from [method TranslationServer.get_plural_rules] are used. The English plural rules are used as a fallback.  
         */
        get plural_rules_override(): string
        set plural_rules_override(value: string)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTranslation;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTranslation;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTranslationDomain extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTranslationDomain extends __NameMapRefCounted {
    }
    /** A self-contained collection of [Translation] resources.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_translationdomain.html  
     */
    class TranslationDomain extends RefCounted {
        constructor(identifier?: any)
        /** Returns the [Translation] instance that best matches [param locale]. Returns `null` if there are no matches. */
        get_translation_object(locale: string): null | Translation
        
        /** Adds a translation. */
        add_translation(translation: Translation): void
        
        /** Removes the given translation. */
        remove_translation(translation: Translation): void
        
        /** Removes all translations. */
        clear(): void
        
        /** Returns all available [Translation] instances as added by [method add_translation]. */
        get_translations(): GArray<Translation>
        
        /** Returns `true` if there are any [Translation] instances that match [param locale] (see [method TranslationServer.compare_locales]). If [param exact] is `true`, only instances whose locale exactly equals [param locale] are considered. */
        has_translation_for_locale(locale: string, exact: boolean): boolean
        
        /** Returns `true` if this translation domain contains the given [param translation]. */
        has_translation(translation: Translation): boolean
        
        /** Returns the [Translation] instances that match [param locale] (see [method TranslationServer.compare_locales]). If [param exact] is `true`, only instances whose locale exactly equals [param locale] will be returned. */
        find_translations(locale: string, exact: boolean): GArray<Translation>
        
        /** Returns the current locale's translation for the given message and context. */
        translate(message: StringName, context?: StringName /* = '' */): StringName
        
        /** Returns the current locale's translation for the given message, plural message and context.  
         *  The number [param n] is the number or quantity of the plural object. It will be used to guide the translation system to fetch the correct plural form for the selected language.  
         */
        translate_plural(message: StringName, message_plural: StringName, n: int64, context?: StringName /* = '' */): StringName
        
        /** Returns the locale override of the domain. Returns an empty string if locale override is disabled. */
        get_locale_override(): string
        
        /** Sets the locale override of the domain.  
         *  If [param locale] is an empty string, locale override is disabled. Otherwise, [param locale] will be standardized to match known locales (e.g. `en-US` would be matched to `en_US`).  
         *      
         *  **Note:** Calling this method does not automatically update texts in the scene tree. Please propagate the [constant MainLoop.NOTIFICATION_TRANSLATION_CHANGED] signal manually.  
         */
        set_locale_override(locale: string): void
        
        /** Returns the pseudolocalized string based on the [param message] passed in. */
        pseudolocalize(message: StringName): StringName
        
        /** If `true`, translation is enabled. Otherwise, [method translate] and [method translate_plural] will return the input message unchanged regardless of the current locale. */
        get enabled(): boolean
        set enabled(value: boolean)
        
        /** If `true`, enables pseudolocalization for the project. This can be used to spot untranslatable strings or layout issues that may occur once the project is localized to languages that have longer strings than the source language.  
         *      
         *  **Note:** Updating this property does not automatically update texts in the scene tree. Please propagate the [constant MainLoop.NOTIFICATION_TRANSLATION_CHANGED] notification manually after you have finished modifying pseudolocalization related options.  
         */
        get pseudolocalization_enabled(): boolean
        set pseudolocalization_enabled(value: boolean)
        
        /** Replace all characters with their accented variants during pseudolocalization.  
         *      
         *  **Note:** Updating this property does not automatically update texts in the scene tree. Please propagate the [constant MainLoop.NOTIFICATION_TRANSLATION_CHANGED] notification manually after you have finished modifying pseudolocalization related options.  
         */
        get pseudolocalization_accents_enabled(): boolean
        set pseudolocalization_accents_enabled(value: boolean)
        
        /** Double vowels in strings during pseudolocalization to simulate the lengthening of text due to localization.  
         *      
         *  **Note:** Updating this property does not automatically update texts in the scene tree. Please propagate the [constant MainLoop.NOTIFICATION_TRANSLATION_CHANGED] notification manually after you have finished modifying pseudolocalization related options.  
         */
        get pseudolocalization_double_vowels_enabled(): boolean
        set pseudolocalization_double_vowels_enabled(value: boolean)
        
        /** If `true`, emulate bidirectional (right-to-left) text when pseudolocalization is enabled. This can be used to spot issues with RTL layout and UI mirroring that will crop up if the project is localized to RTL languages such as Arabic or Hebrew.  
         *      
         *  **Note:** Updating this property does not automatically update texts in the scene tree. Please propagate the [constant MainLoop.NOTIFICATION_TRANSLATION_CHANGED] notification manually after you have finished modifying pseudolocalization related options.  
         */
        get pseudolocalization_fake_bidi_enabled(): boolean
        set pseudolocalization_fake_bidi_enabled(value: boolean)
        
        /** Replace all characters in the string with `*`. Useful for finding non-localizable strings.  
         *      
         *  **Note:** Updating this property does not automatically update texts in the scene tree. Please propagate the [constant MainLoop.NOTIFICATION_TRANSLATION_CHANGED] notification manually after you have finished modifying pseudolocalization related options.  
         */
        get pseudolocalization_override_enabled(): boolean
        set pseudolocalization_override_enabled(value: boolean)
        
        /** Skip placeholders for string formatting like `%s` or `%f` during pseudolocalization. Useful to identify strings which need additional control characters to display correctly.  
         *      
         *  **Note:** Updating this property does not automatically update texts in the scene tree. Please propagate the [constant MainLoop.NOTIFICATION_TRANSLATION_CHANGED] notification manually after you have finished modifying pseudolocalization related options.  
         */
        get pseudolocalization_skip_placeholders_enabled(): boolean
        set pseudolocalization_skip_placeholders_enabled(value: boolean)
        
        /** The expansion ratio to use during pseudolocalization. A value of `0.3` is sufficient for most practical purposes, and will increase the length of each string by 30%.  
         *      
         *  **Note:** Updating this property does not automatically update texts in the scene tree. Please propagate the [constant MainLoop.NOTIFICATION_TRANSLATION_CHANGED] notification manually after you have finished modifying pseudolocalization related options.  
         */
        get pseudolocalization_expansion_ratio(): float64
        set pseudolocalization_expansion_ratio(value: float64)
        
        /** Prefix that will be prepended to the pseudolocalized string.  
         *      
         *  **Note:** Updating this property does not automatically update texts in the scene tree. Please propagate the [constant MainLoop.NOTIFICATION_TRANSLATION_CHANGED] notification manually after you have finished modifying pseudolocalization related options.  
         */
        get pseudolocalization_prefix(): string
        set pseudolocalization_prefix(value: string)
        
        /** Suffix that will be appended to the pseudolocalized string.  
         *      
         *  **Note:** Updating this property does not automatically update texts in the scene tree. Please propagate the [constant MainLoop.NOTIFICATION_TRANSLATION_CHANGED] notification manually after you have finished modifying pseudolocalization related options.  
         */
        get pseudolocalization_suffix(): string
        set pseudolocalization_suffix(value: string)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTranslationDomain;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTranslationDomain;
    }
    namespace Tree {
        enum SelectMode {
            /** Allows selection of a single cell at a time. From the perspective of items, only a single item is allowed to be selected. And there is only one column selected in the selected item.  
             *  The focus cursor is always hidden in this mode, but it is positioned at the current selection, making the currently selected item the currently focused item.  
             */
            SELECT_SINGLE = 0,
            
            /** Allows selection of a single row at a time. From the perspective of items, only a single items is allowed to be selected. And all the columns are selected in the selected item.  
             *  The focus cursor is always hidden in this mode, but it is positioned at the first column of the current selection, making the currently selected item the currently focused item.  
             */
            SELECT_ROW = 1,
            
            /** Allows selection of multiple cells at the same time. From the perspective of items, multiple items are allowed to be selected. And there can be multiple columns selected in each selected item.  
             *  The focus cursor is visible in this mode, the item or column under the cursor is not necessarily selected.  
             */
            SELECT_MULTI = 2,
        }
        enum DropModeFlags {
            /** Disables all drop sections, but still allows to detect the "on item" drop section by [method get_drop_section_at_position].  
             *      
             *  **Note:** This is the default flag, it has no effect when combined with other flags.  
             */
            DROP_MODE_DISABLED = 0,
            
            /** Enables the "on item" drop section. This drop section covers the entire item.  
             *  When combined with [constant DROP_MODE_INBETWEEN], this drop section halves the height and stays centered vertically.  
             */
            DROP_MODE_ON_ITEM = 1,
            
            /** Enables "above item" and "below item" drop sections. The "above item" drop section covers the top half of the item, and the "below item" drop section covers the bottom half.  
             *  When combined with [constant DROP_MODE_ON_ITEM], these drop sections halves the height and stays on top / bottom accordingly.  
             */
            DROP_MODE_INBETWEEN = 2,
        }
        enum ScrollHintMode {
            /** Scroll hints will never be shown. */
            SCROLL_HINT_MODE_DISABLED = 0,
            
            /** Scroll hints will be shown at the top and bottom. */
            SCROLL_HINT_MODE_BOTH = 1,
            
            /** Only the top scroll hint will be shown. */
            SCROLL_HINT_MODE_TOP = 2,
            
            /** Only the bottom scroll hint will be shown. */
            SCROLL_HINT_MODE_BOTTOM = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTree extends __RPCMapControl {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTree extends __NameMapControl {
    }
    /** A control used to show a set of internal [TreeItem]s in a hierarchical structure.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_tree.html  
     */
    class Tree<Map extends NodePathMap = any> extends Control<Map> {
        constructor(identifier?: any)
        /** Clears the tree. This removes all items. */
        clear(): void
        
        /** Creates an item in the tree and adds it as a child of [param parent], which can be either a valid [TreeItem] or `null`.  
         *  If [param parent] is `null`, the root item will be the parent, or the new item will be the root itself if the tree is empty.  
         *  The new item will be the [param index]-th child of parent, or it will be the last child if there are not enough siblings.  
         */
        create_item(parent?: TreeItem, index?: int64 /* = -1 */): TreeItem
        
        /** Returns the tree's root item, or `null` if the tree is empty. */
        get_root(): null | TreeItem
        
        /** Overrides the calculated minimum width of a column. It can be set to `0` to restore the default behavior. Columns that have the "Expand" flag will use their "min_width" in a similar fashion to [member Control.size_flags_stretch_ratio]. */
        set_column_custom_minimum_width(column: int64, min_width: int64): void
        
        /** If `true`, the column will have the "Expand" flag of [Control]. Columns that have the "Expand" flag will use their expand ratio in a similar fashion to [member Control.size_flags_stretch_ratio] (see [method set_column_expand_ratio]). */
        set_column_expand(column: int64, expand: boolean): void
        
        /** Sets the relative expand ratio for a column. See [method set_column_expand]. */
        set_column_expand_ratio(column: int64, ratio: int64): void
        
        /** Allows to enable clipping for column's content, making the content size ignored. */
        set_column_clip_content(column: int64, enable: boolean): void
        
        /** Returns `true` if the column has enabled expanding (see [method set_column_expand]). */
        is_column_expanding(column: int64): boolean
        
        /** Returns `true` if the column has enabled clipping (see [method set_column_clip_content]). */
        is_column_clipping_content(column: int64): boolean
        
        /** Returns the expand ratio assigned to the column. */
        get_column_expand_ratio(column: int64): int64
        
        /** Returns the column's width in pixels. */
        get_column_width(column: int64): int64
        
        /** Returns the next selected [TreeItem] after the given one, or `null` if the end is reached.  
         *  If [param from] is `null`, this returns the first selected item.  
         */
        get_next_selected(from: TreeItem): null | TreeItem
        
        /** Returns the currently focused item, or `null` if no item is focused.  
         *  In [constant SELECT_ROW] and [constant SELECT_SINGLE] modes, the focused item is same as the selected item. In [constant SELECT_MULTI] mode, the focused item is the item under the focus cursor, not necessarily selected.  
         *  To get the currently selected item(s), use [method get_next_selected].  
         */
        get_selected(): null | TreeItem
        
        /** Selects the specified [TreeItem] and column. */
        set_selected(item: TreeItem, column: int64): void
        
        /** Returns the currently focused column, or -1 if no column is focused.  
         *  In [constant SELECT_SINGLE] mode, the focused column is the selected column. In [constant SELECT_ROW] mode, the focused column is always 0 if any item is selected. In [constant SELECT_MULTI] mode, the focused column is the column under the focus cursor, and there are not necessarily any column selected.  
         *  To tell whether a column of an item is selected, use [method TreeItem.is_selected].  
         */
        get_selected_column(): int64
        
        /** Returns the last pressed button's index. */
        get_pressed_button(): int64
        
        /** Deselects all tree items (rows and columns). In [constant SELECT_MULTI] mode also removes selection cursor. */
        deselect_all(): void
        
        /** Returns the currently edited item. Can be used with [signal item_edited] to get the item that was modified.  
         *    
         */
        get_edited(): null | TreeItem
        
        /** Returns the column for the currently edited item. */
        get_edited_column(): int64
        
        /** Edits the selected tree item as if it was clicked.  
         *  Either the item must be set editable with [method TreeItem.set_editable] or [param force_edit] must be `true`.  
         *  Returns `true` if the item could be edited. Fails if no item is selected.  
         */
        edit_selected(force_edit?: boolean /* = false */): boolean
        
        /** Returns the rectangle for custom popups. Helper to create custom cell controls that display a popup. See [method TreeItem.set_cell_mode]. */
        get_custom_popup_rect(): Rect2
        
        /** Returns the rectangle area for the specified [TreeItem]. If [param column] is specified, only get the position and size of that column, otherwise get the rectangle containing all columns. If a button index is specified, the rectangle of that button will be returned. */
        get_item_area_rect(item: TreeItem, column?: int64 /* = -1 */, button_index?: int64 /* = -1 */): Rect2
        
        /** Returns the tree item at the specified position (relative to the tree origin position). */
        get_item_at_position(position: Vector2): null | TreeItem
        
        /** Returns the column index at [param position], or -1 if no item is there. */
        get_column_at_position(position: Vector2): int64
        
        /** Returns the drop section at [param position], or -100 if no item is there.  
         *  Values -1, 0, or 1 will be returned for the "above item", "on item", and "below item" drop sections, respectively. See [enum DropModeFlags] for a description of each drop section.  
         *  To get the item which the returned drop section is relative to, use [method get_item_at_position].  
         */
        get_drop_section_at_position(position: Vector2): int64
        
        /** Returns the button ID at [param position], or -1 if no button is there. */
        get_button_id_at_position(position: Vector2): int64
        
        /** Makes the currently focused cell visible.  
         *  This will scroll the tree if necessary. In [constant SELECT_ROW] mode, this will not do horizontal scrolling, as all the cells in the selected row is focused logically.  
         *      
         *  **Note:** Despite the name of this method, the focus cursor itself is only visible in [constant SELECT_MULTI] mode.  
         */
        ensure_cursor_is_visible(): void
        
        /** Sets the title of a column. */
        set_column_title(column: int64, title: string): void
        
        /** Returns the column's title. */
        get_column_title(column: int64): string
        
        /** Sets the column title's tooltip text. */
        set_column_title_tooltip_text(column: int64, tooltip_text: string): void
        
        /** Returns the column title's tooltip text. */
        get_column_title_tooltip_text(column: int64): string
        
        /** Sets the column title alignment. Note that [constant @GlobalScope.HORIZONTAL_ALIGNMENT_FILL] is not supported for column titles. */
        set_column_title_alignment(column: int64, title_alignment: HorizontalAlignment): void
        
        /** Returns the column title alignment. */
        get_column_title_alignment(column: int64): HorizontalAlignment
        
        /** Sets column title base writing direction. */
        set_column_title_direction(column: int64, direction: Control.TextDirection): void
        
        /** Returns column title base writing direction. */
        get_column_title_direction(column: int64): Control.TextDirection
        
        /** Sets the language code of the given [param column]'s title to [param language]. This is used for line-breaking and text shaping algorithms. If [param language] is empty, the current locale is used. */
        set_column_title_language(column: int64, language: string): void
        
        /** Returns column title language code. */
        get_column_title_language(column: int64): string
        
        /** Returns the current scrolling position. */
        get_scroll(): Vector2
        
        /** Causes the [Tree] to jump to the specified [TreeItem]. */
        scroll_to_item(item: TreeItem, center_on_item?: boolean /* = false */): void
        
        /** The number of columns. */
        get columns(): int64
        set columns(value: int64)
        
        /** If `true`, column titles are visible. */
        get column_titles_visible(): boolean
        set column_titles_visible(value: boolean)
        
        /** If `true`, the currently selected cell may be selected again. */
        get allow_reselect(): boolean
        set allow_reselect(value: boolean)
        
        /** If `true`, a right mouse button click can select items. */
        get allow_rmb_select(): boolean
        set allow_rmb_select(value: boolean)
        
        /** If `true`, allows navigating the [Tree] with letter keys through incremental search. */
        get allow_search(): boolean
        set allow_search(value: boolean)
        
        /** If `true`, the folding arrow is hidden. */
        get hide_folding(): boolean
        set hide_folding(value: boolean)
        
        /** If `true`, recursive folding is enabled for this [Tree]. Holding down [kbd]Shift[/kbd] while clicking the fold arrow or using `ui_right`/`ui_left` shortcuts collapses or uncollapses the [TreeItem] and all its descendants. */
        get enable_recursive_folding(): boolean
        set enable_recursive_folding(value: boolean)
        
        /** If `true`, tree items will unfold when hovered over during a drag-and-drop. The delay for when this happens is dictated by [theme_item dragging_unfold_wait_msec]. */
        get enable_drag_unfolding(): boolean
        set enable_drag_unfolding(value: boolean)
        
        /** If `true`, the tree's root is hidden. */
        get hide_root(): boolean
        set hide_root(value: boolean)
        
        /** The drop mode as an OR combination of flags. See [enum DropModeFlags] constants. Once dropping is done, reverts to [constant DROP_MODE_DISABLED]. Setting this during [method Control._can_drop_data] is recommended.  
         *  This controls the drop sections, i.e. the decision and drawing of possible drop locations based on the mouse position.  
         */
        get drop_mode_flags(): int64
        set drop_mode_flags(value: int64)
        
        /** Allows single or multiple selection. See the [enum SelectMode] constants. */
        get select_mode(): int64
        set select_mode(value: int64)
        
        /** If `true`, tree items with no tooltip assigned display their text as their tooltip. See also [method TreeItem.get_tooltip_text] and [method TreeItem.get_button_tooltip_text]. */
        get auto_tooltip(): boolean
        set auto_tooltip(value: boolean)
        
        /** If `true`, enables horizontal scrolling. */
        get scroll_horizontal_enabled(): boolean
        set scroll_horizontal_enabled(value: boolean)
        
        /** If `true`, enables vertical scrolling. */
        get scroll_vertical_enabled(): boolean
        set scroll_vertical_enabled(value: boolean)
        
        /** The way which scroll hints (indicators that show that the content can still be scrolled in a certain direction) will be shown. */
        get scroll_hint_mode(): int64
        set scroll_hint_mode(value: int64)
        
        /** If `true`, the scroll hint texture will be tiled instead of stretched. See [member scroll_hint_mode]. */
        get tile_scroll_hint(): boolean
        set tile_scroll_hint(value: boolean)
        
        /** Emitted when an item is selected. */
        readonly item_selected: Signal<() => void>
        
        /** Emitted when a cell is selected. */
        readonly cell_selected: Signal<() => void>
        
        /** Emitted instead of [signal item_selected] if [member select_mode] is set to [constant SELECT_MULTI]. */
        readonly multi_selected: Signal<(item: TreeItem, column: int64, selected: boolean) => void>
        
        /** Emitted when an item is selected with a mouse button. */
        readonly item_mouse_selected: Signal<(mouse_position: Vector2, mouse_button_index: int64) => void>
        
        /** Emitted when a mouse button is clicked in the empty space of the tree. */
        readonly empty_clicked: Signal<(click_position: Vector2, mouse_button_index: int64) => void>
        
        /** Emitted when an item is edited. */
        readonly item_edited: Signal<() => void>
        
        /** Emitted when an item with [constant TreeItem.CELL_MODE_CUSTOM] is clicked with a mouse button. */
        readonly custom_item_clicked: Signal<(mouse_button_index: int64) => void>
        
        /** Emitted when an item's icon is double-clicked. For a signal that emits when any part of the item is double-clicked, see [signal item_activated]. */
        readonly item_icon_double_clicked: Signal<() => void>
        
        /** Emitted when an item is expanded or collapsed by clicking on the folding arrow or through code.  
         *      
         *  **Note:** Despite its name, this signal is also emitted when an item is expanded.  
         */
        readonly item_collapsed: Signal<(item: TreeItem) => void>
        
        /** Emitted when [method TreeItem.propagate_check] is called. Connect to this signal to process the items that are affected when [method TreeItem.propagate_check] is invoked. The order that the items affected will be processed is as follows: the item that invoked the method, children of that item, and finally parents of that item. */
        readonly check_propagated_to_item: Signal<(item: TreeItem, column: int64) => void>
        
        /** Emitted when a button on the tree was pressed (see [method TreeItem.add_button]). */
        readonly button_clicked: Signal<(item: TreeItem, column: int64, id: int64, mouse_button_index: int64) => void>
        
        /** Emitted when a cell with the [constant TreeItem.CELL_MODE_CUSTOM] is clicked to be edited. */
        readonly custom_popup_edited: Signal<(arrow_clicked: boolean) => void>
        
        /** Emitted when an item is double-clicked, or selected with a `ui_accept` input event (e.g. using [kbd]Enter[/kbd] or [kbd]Space[/kbd] on the keyboard). */
        readonly item_activated: Signal<() => void>
        
        /** Emitted when a column's title is clicked with either [constant MOUSE_BUTTON_LEFT] or [constant MOUSE_BUTTON_RIGHT]. */
        readonly column_title_clicked: Signal<(column: int64, mouse_button_index: int64) => void>
        
        /** Emitted when a left mouse button click does not select any item. */
        readonly nothing_selected: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTree;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTree;
    }
    namespace TreeItem {
        enum TreeCellMode {
            /** Cell shows a string label, optionally with an icon. When editable, the text can be edited using a [LineEdit], or a [TextEdit] popup if [method set_edit_multiline] is used. */
            CELL_MODE_STRING = 0,
            
            /** Cell shows a checkbox, optionally with text and an icon. The checkbox can be pressed, released, or indeterminate (via [method set_indeterminate]). The checkbox can't be clicked unless the cell is editable. */
            CELL_MODE_CHECK = 1,
            
            /** Cell shows a numeric range. When editable, it can be edited using a range slider. Use [method set_range] to set the value and [method set_range_config] to configure the range.  
             *  This cell can also be used in a text dropdown mode when you assign a text with [method set_text]. Separate options with a comma, e.g. `"Option1,Option2,Option3"`.  
             */
            CELL_MODE_RANGE = 2,
            
            /** Cell shows an icon. It can't be edited nor display text. The icon is always centered within the cell. */
            CELL_MODE_ICON = 3,
            
            /** Cell shows as a clickable button. It will display an arrow similar to [OptionButton], but doesn't feature a dropdown (for that you can use [constant CELL_MODE_RANGE]). Clicking the button emits the [signal Tree.item_edited] signal. The button is flat by default, you can use [method set_custom_as_button] to display it with a [StyleBox].  
             *  This mode also supports custom drawing using [method set_custom_draw_callback].  
             */
            CELL_MODE_CUSTOM = 4,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTreeItem extends __RPCMapObject {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTreeItem extends __NameMapObject {
    }
    /** An internal control for a single item inside [Tree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_treeitem.html  
     */
    class TreeItem extends Object {
        constructor(identifier?: any)
        /** Sets the given column's cell mode to [param mode]. This determines how the cell is displayed and edited. */
        set_cell_mode(column: int64, mode: TreeItem.TreeCellMode): void
        
        /** Returns the column's cell mode. */
        get_cell_mode(column: int64): TreeItem.TreeCellMode
        
        /** Sets the given column's auto translate mode to [param mode].  
         *  All columns use [constant Node.AUTO_TRANSLATE_MODE_INHERIT] by default, which uses the same auto translate mode as the [Tree] itself.  
         */
        set_auto_translate_mode(column: int64, mode: Node.AutoTranslateMode): void
        
        /** Returns the column's auto translate mode. */
        get_auto_translate_mode(column: int64): Node.AutoTranslateMode
        
        /** If [param multiline] is `true`, the given [param column] is multiline editable.  
         *      
         *  **Note:** This option only affects the type of control ([LineEdit] or [TextEdit]) that appears when editing the column. You can set multiline values with [method set_text] even if the column is not multiline editable.  
         */
        set_edit_multiline(column: int64, multiline: boolean): void
        
        /** Returns `true` if the given [param column] is multiline editable. */
        is_edit_multiline(column: int64): boolean
        
        /** If [param checked] is `true`, the given [param column] is checked. Clears column's indeterminate status. */
        set_checked(column: int64, checked: boolean): void
        
        /** If [param indeterminate] is `true`, the given [param column] is marked indeterminate.  
         *      
         *  **Note:** If set `true` from `false`, then column is cleared of checked status.  
         */
        set_indeterminate(column: int64, indeterminate: boolean): void
        
        /** Returns `true` if the given [param column] is checked. */
        is_checked(column: int64): boolean
        
        /** Returns `true` if the given [param column] is indeterminate. */
        is_indeterminate(column: int64): boolean
        
        /** Propagates this item's checked status to its children and parents for the given [param column]. It is possible to process the items affected by this method call by connecting to [signal Tree.check_propagated_to_item]. The order that the items affected will be processed is as follows: the item invoking this method, children of that item, and finally parents of that item. If [param emit_signal] is `false`, then [signal Tree.check_propagated_to_item] will not be emitted. */
        propagate_check(column: int64, emit_signal?: boolean /* = true */): void
        
        /** Sets the given column's text value. */
        set_text(column: int64, text: string): void
        
        /** Returns the given column's text. */
        get_text(column: int64): string
        
        /** Sets the given column's description for assistive apps. */
        set_description(column: int64, description: string): void
        
        /** Returns the given column's description for assistive apps. */
        get_description(column: int64): string
        
        /** Sets item's text base writing direction. */
        set_text_direction(column: int64, direction: Control.TextDirection): void
        
        /** Returns item's text base writing direction. */
        get_text_direction(column: int64): Control.TextDirection
        
        /** Sets the autowrap mode in the given [param column]. If set to something other than [constant TextServer.AUTOWRAP_OFF], the text gets wrapped inside the cell's bounding rectangle. */
        set_autowrap_mode(column: int64, autowrap_mode: TextServer.AutowrapMode): void
        
        /** Returns the text autowrap mode in the given [param column]. By default it is [constant TextServer.AUTOWRAP_OFF]. */
        get_autowrap_mode(column: int64): TextServer.AutowrapMode
        
        /** Sets the clipping behavior when the text exceeds the item's bounding rectangle in the given [param column]. */
        set_text_overrun_behavior(column: int64, overrun_behavior: TextServer.OverrunBehavior): void
        
        /** Returns the clipping behavior when the text exceeds the item's bounding rectangle in the given [param column]. By default it is [constant TextServer.OVERRUN_TRIM_ELLIPSIS]. */
        get_text_overrun_behavior(column: int64): TextServer.OverrunBehavior
        
        /** Set BiDi algorithm override for the structured text. Has effect for cells that display text. */
        set_structured_text_bidi_override(column: int64, parser: TextServer.StructuredTextParser): void
        
        /** Returns the BiDi algorithm override set for this cell. */
        get_structured_text_bidi_override(column: int64): TextServer.StructuredTextParser
        
        /** Set additional options for BiDi override. Has effect for cells that display text. */
        set_structured_text_bidi_override_options(column: int64, args: GArray): void
        
        /** Returns the additional BiDi options set for this cell. */
        get_structured_text_bidi_override_options(column: int64): GArray
        
        /** Sets the language code of the given [param column]'s text to [param language]. This is used for line-breaking and text shaping algorithms. If [param language] is empty, the current locale is used. */
        set_language(column: int64, language: string): void
        
        /** Returns item's text language code. */
        get_language(column: int64): string
        
        /** Sets a string to be shown after a column's value (for example, a unit abbreviation). */
        set_suffix(column: int64, text: string): void
        
        /** Gets the suffix string shown after the column value. */
        get_suffix(column: int64): string
        
        /** Sets the given cell's icon [Texture2D]. If the cell is in [constant CELL_MODE_ICON] mode, the icon is displayed in the center of the cell. Otherwise, the icon is displayed before the cell's text. [constant CELL_MODE_RANGE] does not display an icon. */
        set_icon(column: int64, texture: Texture2D): void
        
        /** Returns the given column's icon [Texture2D]. Error if no icon is set. */
        get_icon(column: int64): null | Texture2D
        
        /** Sets the given cell's icon overlay [Texture2D]. The cell has to be in [constant CELL_MODE_ICON] mode, and icon has to be set. Overlay is drawn on top of icon, in the bottom left corner. */
        set_icon_overlay(column: int64, texture: Texture2D): void
        
        /** Returns the given column's icon overlay [Texture2D]. */
        get_icon_overlay(column: int64): null | Texture2D
        
        /** Sets the given column's icon's texture region. */
        set_icon_region(column: int64, region: Rect2): void
        
        /** Returns the icon [Texture2D] region as [Rect2]. */
        get_icon_region(column: int64): Rect2
        
        /** Sets the maximum allowed width of the icon in the given [param column]. This limit is applied on top of the default size of the icon and on top of [theme_item Tree.icon_max_width]. The height is adjusted according to the icon's ratio. */
        set_icon_max_width(column: int64, width: int64): void
        
        /** Returns the maximum allowed width of the icon in the given [param column]. */
        get_icon_max_width(column: int64): int64
        
        /** Modulates the given column's icon with [param modulate]. */
        set_icon_modulate(column: int64, modulate: Color): void
        
        /** Returns the [Color] modulating the column's icon. */
        get_icon_modulate(column: int64): Color
        
        /** Sets the value of a [constant CELL_MODE_RANGE] column. */
        set_range(column: int64, value: float64): void
        
        /** Returns the value of a [constant CELL_MODE_RANGE] column. */
        get_range(column: int64): float64
        
        /** Sets the range of accepted values for a column. The column must be in the [constant CELL_MODE_RANGE] mode.  
         *  If [param expr] is `true`, the edit mode slider will use an exponential scale as with [member Range.exp_edit].  
         */
        set_range_config(column: int64, min: float64, max: float64, step: float64, expr?: boolean /* = false */): void
        
        /** Returns a dictionary containing the range parameters for a given column. The keys are "min", "max", "step", and "expr". */
        get_range_config(column: int64): GDictionary
        
        /** Sets the metadata value for the given column, which can be retrieved later using [method get_metadata]. This can be used, for example, to store a reference to the original data. */
        set_metadata(column: int64, meta: any): void
        
        /** Returns the metadata value that was set for the given column using [method set_metadata]. */
        get_metadata(column: int64): any
        
        /** Sets the given column's custom draw callback to the [param callback] method on [param object].  
         *  The method named [param callback] should accept two arguments: the [TreeItem] that is drawn and its position and size as a [Rect2].  
         */
        set_custom_draw(column: int64, object: Object, callback: StringName): void
        
        /** Sets the given column's custom draw callback. Use an empty [Callable] ([code skip-lint]Callable()`) to clear the custom callback. The cell has to be in [constant CELL_MODE_CUSTOM] to use this feature.  
         *  The [param callback] should accept two arguments: the [TreeItem] that is drawn and its position and size as a [Rect2].  
         */
        set_custom_draw_callback(column: int64, callback: Callable): void
        
        /** Returns the custom callback of column [param column]. */
        get_custom_draw_callback(column: int64): Callable
        
        /** Sets the given column's custom [StyleBox] used to draw the background.  
         *      
         *  **Note:** If a custom background color is set, the [StyleBox] will be drawn in front of it.  
         */
        set_custom_stylebox(column: int64, stylebox: StyleBox): void
        
        /** Returns the given column's custom [StyleBox] used to draw the background. */
        get_custom_stylebox(column: int64): null | StyleBox
        
        /** Collapses or uncollapses this [TreeItem] and all the descendants of this item. */
        set_collapsed_recursive(enable: boolean): void
        
        /** Returns `true` if this [TreeItem], or any of its descendants, is collapsed.  
         *  If [param only_visible] is `true` it ignores non-visible [TreeItem]s.  
         */
        is_any_collapsed(only_visible?: boolean /* = false */): boolean
        
        /** Returns `true` if [member visible] is `true` and all its ancestors are also visible. */
        is_visible_in_tree(): boolean
        
        /** Uncollapses all [TreeItem]s necessary to reveal this [TreeItem], i.e. all ancestor [TreeItem]s. */
        uncollapse_tree(): void
        
        /** If [param selectable] is `true`, the given [param column] is selectable. */
        set_selectable(column: int64, selectable: boolean): void
        
        /** Returns `true` if the given [param column] is selectable. */
        is_selectable(column: int64): boolean
        
        /** Returns `true` if the given [param column] is selected. */
        is_selected(column: int64): boolean
        
        /** Selects the given [param column]. */
        select(column: int64): void
        
        /** Deselects the given column. */
        deselect(column: int64): void
        
        /** If [param enabled] is `true`, the given [param column] is editable. */
        set_editable(column: int64, enabled: boolean): void
        
        /** Returns `true` if the given [param column] is editable. */
        is_editable(column: int64): boolean
        
        /** Sets the given column's custom color. */
        set_custom_color(column: int64, color: Color): void
        
        /** Returns the custom color of column [param column]. */
        get_custom_color(column: int64): Color
        
        /** Resets the color for the given column to default. */
        clear_custom_color(column: int64): void
        
        /** Sets custom font used to draw text in the given [param column]. */
        set_custom_font(column: int64, font: Font): void
        
        /** Returns custom font used to draw text in the column [param column]. */
        get_custom_font(column: int64): null | Font
        
        /** Sets custom font size used to draw text in the given [param column]. */
        set_custom_font_size(column: int64, font_size: int64): void
        
        /** Returns custom font size used to draw text in the column [param column]. */
        get_custom_font_size(column: int64): int64
        
        /** Sets the given column's custom background color and whether to just use it as an outline.  
         *      
         *  **Note:** If a custom [StyleBox] is set, the background color will be drawn behind it.  
         */
        set_custom_bg_color(column: int64, color: Color, just_outline?: boolean /* = false */): void
        
        /** Resets the background color for the given column to default. */
        clear_custom_bg_color(column: int64): void
        
        /** Returns the custom background color of column [param column]. */
        get_custom_bg_color(column: int64): Color
        
        /** Makes a cell with [constant CELL_MODE_CUSTOM] display as a non-flat button with a [StyleBox]. */
        set_custom_as_button(column: int64, enable: boolean): void
        
        /** Returns `true` if the cell was made into a button with [method set_custom_as_button]. */
        is_custom_set_as_button(column: int64): boolean
        
        /** Removes all buttons from all columns of this item. */
        clear_buttons(): void
        
        /** Adds a button with [Texture2D] [param button] to the end of the cell at column [param column]. The [param id] is used to identify the button in the according [signal Tree.button_clicked] signal and can be different from the buttons index. If not specified, the next available index is used, which may be retrieved by calling [method get_button_count] immediately before this method. Optionally, the button can be [param disabled] and have a [param tooltip_text]. [param description] is used as the button description for assistive apps. */
        add_button(column: int64, button: Texture2D, id?: int64 /* = -1 */, disabled?: boolean /* = false */, tooltip_text?: string /* = '' */, description?: string /* = '' */): void
        
        /** Returns the number of buttons in column [param column]. */
        get_button_count(column: int64): int64
        
        /** Returns the tooltip text for the button at index [param button_index] in column [param column]. */
        get_button_tooltip_text(column: int64, button_index: int64): string
        
        /** Returns the ID for the button at index [param button_index] in column [param column]. */
        get_button_id(column: int64, button_index: int64): int64
        
        /** Returns the button index if there is a button with ID [param id] in column [param column], otherwise returns -1. */
        get_button_by_id(column: int64, id: int64): int64
        
        /** Returns the color of the button with ID [param id] in column [param column]. If the specified button does not exist, returns [constant Color.BLACK]. */
        get_button_color(column: int64, id: int64): Color
        
        /** Returns the [Texture2D] of the button at index [param button_index] in column [param column]. */
        get_button(column: int64, button_index: int64): null | Texture2D
        
        /** Sets the tooltip text for the button at index [param button_index] in the given [param column]. */
        set_button_tooltip_text(column: int64, button_index: int64, tooltip: string): void
        
        /** Sets the given column's button [Texture2D] at index [param button_index] to [param button]. */
        set_button(column: int64, button_index: int64, button: Texture2D): void
        
        /** Removes the button at index [param button_index] in column [param column]. */
        erase_button(column: int64, button_index: int64): void
        
        /** Sets the given column's button description at index [param button_index] for assistive apps. */
        set_button_description(column: int64, button_index: int64, description: string): void
        
        /** If `true`, disables the button at index [param button_index] in the given [param column]. */
        set_button_disabled(column: int64, button_index: int64, disabled: boolean): void
        
        /** Sets the given column's button color at index [param button_index] to [param color]. */
        set_button_color(column: int64, button_index: int64, color: Color): void
        
        /** Returns `true` if the button at index [param button_index] for the given [param column] is disabled. */
        is_button_disabled(column: int64, button_index: int64): boolean
        
        /** Sets the given column's tooltip text. */
        set_tooltip_text(column: int64, tooltip: string): void
        
        /** Returns the given column's tooltip text. */
        get_tooltip_text(column: int64): string
        
        /** Sets the given column's text alignment to [param text_alignment]. */
        set_text_alignment(column: int64, text_alignment: HorizontalAlignment): void
        
        /** Returns the given column's text alignment. */
        get_text_alignment(column: int64): HorizontalAlignment
        
        /** If [param enable] is `true`, the given [param column] is expanded to the right. */
        set_expand_right(column: int64, enable: boolean): void
        
        /** Returns `true` if `expand_right` is set. */
        get_expand_right(column: int64): boolean
        
        /** Creates an item and adds it as a child.  
         *  The new item will be inserted as position [param index] (the default value `-1` means the last position), or it will be the last child if [param index] is higher than the child count.  
         */
        create_child(index?: int64 /* = -1 */): TreeItem
        
        /** Adds a previously unparented [TreeItem] as a direct child of this one. The [param child] item must not be a part of any [Tree] or parented to any [TreeItem]. See also [method remove_child]. */
        add_child(child: TreeItem): void
        
        /** Removes the given child [TreeItem] and all its children from the [Tree]. Note that it doesn't free the item from memory, so it can be reused later (see [method add_child]). To completely remove a [TreeItem] use [method Object.free].  
         *      
         *  **Note:** If you want to move a child from one [Tree] to another, then instead of removing and adding it manually you can use [method move_before] or [method move_after].  
         */
        remove_child(child: TreeItem): void
        
        /** Returns the [Tree] that owns this TreeItem. */
        get_tree(): null | Tree
        
        /** Returns the next sibling TreeItem in the tree or a `null` object if there is none. */
        get_next(): null | TreeItem
        
        /** Returns the previous sibling TreeItem in the tree or a `null` object if there is none. */
        get_prev(): null | TreeItem
        
        /** Returns the parent TreeItem or a `null` object if there is none. */
        get_parent(): null | TreeItem
        
        /** Returns the TreeItem's first child. */
        get_first_child(): null | TreeItem
        
        /** Returns the next TreeItem in the tree (in the context of a depth-first search) or a `null` object if there is none.  
         *  If [param wrap] is enabled, the method will wrap around to the first element in the tree when called on the last element, otherwise it returns `null`.  
         */
        get_next_in_tree(wrap?: boolean /* = false */): null | TreeItem
        
        /** Returns the previous TreeItem in the tree (in the context of a depth-first search) or a `null` object if there is none.  
         *  If [param wrap] is enabled, the method will wrap around to the last element in the tree when called on the first visible element, otherwise it returns `null`.  
         */
        get_prev_in_tree(wrap?: boolean /* = false */): null | TreeItem
        
        /** Returns the next visible TreeItem in the tree (in the context of a depth-first search) or a `null` object if there is none.  
         *  If [param wrap] is enabled, the method will wrap around to the first visible element in the tree when called on the last visible element, otherwise it returns `null`.  
         */
        get_next_visible(wrap?: boolean /* = false */): null | TreeItem
        
        /** Returns the previous visible sibling TreeItem in the tree (in the context of a depth-first search) or a `null` object if there is none.  
         *  If [param wrap] is enabled, the method will wrap around to the last visible element in the tree when called on the first visible element, otherwise it returns `null`.  
         */
        get_prev_visible(wrap?: boolean /* = false */): null | TreeItem
        
        /** Returns a child item by its [param index] (see [method get_child_count]). This method is often used for iterating all children of an item.  
         *  Negative indices access the children from the last one.  
         */
        get_child(index: int64): null | TreeItem
        
        /** Returns the number of child items. */
        get_child_count(): int64
        
        /** Returns an array of references to the item's children. */
        get_children(): GArray<TreeItem>
        
        /** Returns the node's order in the tree. For example, if called on the first child item the position is `0`. */
        get_index(): int64
        
        /** Moves this TreeItem right before the given [param item].  
         *      
         *  **Note:** You can't move to the root or move the root.  
         */
        move_before(item: TreeItem): void
        
        /** Moves this TreeItem right after the given [param item].  
         *      
         *  **Note:** You can't move to the root or move the root.  
         */
        move_after(item: TreeItem): void
        
        /** Calls the [param method] on the actual TreeItem and its children recursively. Pass parameters as a comma separated list. */
        call_recursive(method: StringName, ...varargs: any[]): void
        
        /** If `true`, the TreeItem is collapsed. */
        get collapsed(): boolean
        set collapsed(value: boolean)
        
        /** If `true`, the [TreeItem] is visible (default).  
         *  Note that if a [TreeItem] is set to not be visible, none of its children will be visible either.  
         */
        get visible(): boolean
        set visible(value: boolean)
        
        /** If `true`, folding is disabled for this TreeItem. */
        get disable_folding(): boolean
        set disable_folding(value: boolean)
        
        /** The custom minimum height. */
        get custom_minimum_height(): int64
        set custom_minimum_height(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTreeItem;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTreeItem;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTriangleMesh extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTriangleMesh extends __NameMapRefCounted {
    }
    /** Triangle geometry for efficient, physicsless intersection queries.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_trianglemesh.html  
     */
    class TriangleMesh extends RefCounted {
        constructor(identifier?: any)
        /** Creates the BVH tree from an array of faces. Each 3 vertices of the input [param faces] array represent one triangle (face).  
         *  Returns `true` if the tree is successfully built, `false` otherwise.  
         */
        create_from_faces(faces: PackedVector3Array | Vector3[]): boolean
        
        /** Returns a copy of the geometry faces. Each 3 vertices of the array represent one triangle (face). */
        get_faces(): PackedVector3Array
        
        /** Tests for intersection with a segment going from [param begin] to [param end].  
         *  If an intersection with a triangle happens returns a [Dictionary] with the following fields:  
         *  `position`: The position on the intersected triangle.  
         *  `normal`: The normal of the intersected triangle.  
         *  `face_index`: The index of the intersected triangle.  
         *  Returns an empty [Dictionary] if no intersection happens.  
         *  See also [method intersect_ray], which is similar but uses an infinite-length ray.  
         */
        intersect_segment(begin: Vector3, end: Vector3): GDictionary
        
        /** Tests for intersection with a ray starting at [param begin] and facing [param dir] and extending toward infinity.  
         *  If an intersection with a triangle happens, returns a [Dictionary] with the following fields:  
         *  `position`: The position on the intersected triangle.  
         *  `normal`: The normal of the intersected triangle.  
         *  `face_index`: The index of the intersected triangle.  
         *  Returns an empty [Dictionary] if no intersection happens.  
         *  See also [method intersect_segment], which is similar but uses a finite-length segment.  
         */
        intersect_ray(begin: Vector3, dir: Vector3): GDictionary
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTriangleMesh;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTriangleMesh;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTubeTrailMesh extends __RPCMapPrimitiveMesh {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTubeTrailMesh extends __NameMapPrimitiveMesh {
    }
    /** Represents a straight tube-shaped [PrimitiveMesh] with variable width.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_tubetrailmesh.html  
     */
    class TubeTrailMesh extends PrimitiveMesh {
        constructor(identifier?: any)
        /** The baseline radius of the tube. The radius of a particular section ring is obtained by multiplying this radius by the value of the [member curve] at the given distance. */
        get radius(): float64
        set radius(value: float64)
        
        /** The number of sides on the tube. For example, a value of `5` means the tube will be pentagonal. Higher values result in a more detailed tube at the cost of performance. */
        get radial_steps(): int64
        set radial_steps(value: int64)
        
        /** The total number of sections on the tube. */
        get sections(): int64
        set sections(value: int64)
        
        /** The length of a section of the tube. */
        get section_length(): float64
        set section_length(value: float64)
        
        /** The number of rings in a section. The [member curve] is sampled on each ring to determine its radius. Higher values result in a more detailed tube at the cost of performance. */
        get section_rings(): int64
        set section_rings(value: int64)
        
        /** If `true`, generates a cap at the top of the tube. This can be set to `false` to speed up generation and rendering when the cap is never seen by the camera. */
        get cap_top(): boolean
        set cap_top(value: boolean)
        
        /** If `true`, generates a cap at the bottom of the tube. This can be set to `false` to speed up generation and rendering when the cap is never seen by the camera. */
        get cap_bottom(): boolean
        set cap_bottom(value: boolean)
        
        /** Determines the radius of the tube along its length. The radius of a particular section ring is obtained by multiplying the baseline [member radius] by the value of this curve at the given distance. For values smaller than `0`, the faces will be inverted. Should be a unit [Curve]. */
        get curve(): null | Curve
        set curve(value: null | Curve)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTubeTrailMesh;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTubeTrailMesh;
    }
    namespace Tween {
        enum TweenProcessMode {
            /** The [Tween] updates after each physics frame (see [method Node._physics_process]). */
            TWEEN_PROCESS_PHYSICS = 0,
            
            /** The [Tween] updates after each process frame (see [method Node._process]). */
            TWEEN_PROCESS_IDLE = 1,
        }
        enum TweenPauseMode {
            /** If the [Tween] has a bound node, it will process when that node can process (see [member Node.process_mode]). Otherwise it's the same as [constant TWEEN_PAUSE_STOP]. */
            TWEEN_PAUSE_BOUND = 0,
            
            /** If [SceneTree] is paused, the [Tween] will also pause. */
            TWEEN_PAUSE_STOP = 1,
            
            /** The [Tween] will process regardless of whether [SceneTree] is paused. */
            TWEEN_PAUSE_PROCESS = 2,
        }
        enum TransitionType {
            /** The animation is interpolated linearly. */
            TRANS_LINEAR = 0,
            
            /** The animation is interpolated using a sine function. */
            TRANS_SINE = 1,
            
            /** The animation is interpolated with a quintic (to the power of 5) function. */
            TRANS_QUINT = 2,
            
            /** The animation is interpolated with a quartic (to the power of 4) function. */
            TRANS_QUART = 3,
            
            /** The animation is interpolated with a quadratic (to the power of 2) function. */
            TRANS_QUAD = 4,
            
            /** The animation is interpolated with an exponential (to the power of x) function. */
            TRANS_EXPO = 5,
            
            /** The animation is interpolated with elasticity, wiggling around the edges. */
            TRANS_ELASTIC = 6,
            
            /** The animation is interpolated with a cubic (to the power of 3) function. */
            TRANS_CUBIC = 7,
            
            /** The animation is interpolated with a function using square roots. */
            TRANS_CIRC = 8,
            
            /** The animation is interpolated by bouncing at the end. */
            TRANS_BOUNCE = 9,
            
            /** The animation is interpolated backing out at ends. */
            TRANS_BACK = 10,
            
            /** The animation is interpolated like a spring towards the end. */
            TRANS_SPRING = 11,
        }
        enum EaseType {
            /** The interpolation starts slowly and speeds up towards the end. */
            EASE_IN = 0,
            
            /** The interpolation starts quickly and slows down towards the end. */
            EASE_OUT = 1,
            
            /** A combination of [constant EASE_IN] and [constant EASE_OUT]. The interpolation is slowest at both ends. */
            EASE_IN_OUT = 2,
            
            /** A combination of [constant EASE_IN] and [constant EASE_OUT]. The interpolation is fastest at both ends. */
            EASE_OUT_IN = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTween extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTween extends __NameMapRefCounted {
    }
    /** Lightweight object used for general-purpose animation via script, using [Tweener]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_tween.html  
     */
    class Tween extends RefCounted {
        constructor(identifier?: any)
        /** Creates and appends a [PropertyTweener]. This method tweens a [param property] of an [param object] between an initial value and [param final_val] in a span of time equal to [param duration], in seconds. The initial value by default is the property's value at the time the tweening of the [PropertyTweener] starts.  
         *    
         *  will move the sprite to position (100, 200) and then to (200, 300). If you use [method PropertyTweener.from] or [method PropertyTweener.from_current], the starting position will be overwritten by the given value instead. See other methods in [PropertyTweener] to see how the tweening can be tweaked further.  
         *      
         *  **Note:** You can find the correct property name by hovering over the property in the Inspector. You can also provide the components of a property directly by using `"property:component"` (eg. `position:x`), where it would only apply to that particular component.  
         *  **Example:** Moving an object twice from the same position, with different transition types:  
         *    
         */
        tween_property(object: Object, property: NodePath | string, final_val: any, duration: float64): null | PropertyTweener
        
        /** Creates and appends an [IntervalTweener]. This method can be used to create delays in the tween animation, as an alternative to using the delay in other [Tweener]s, or when there's no animation (in which case the [Tween] acts as a timer). [param time] is the length of the interval, in seconds.  
         *  **Example:** Creating an interval in code execution:  
         *    
         *  **Example:** Creating an object that moves back and forth and jumps every few seconds:  
         *    
         */
        tween_interval(time: float64): null | IntervalTweener
        
        /** Creates and appends a [CallbackTweener]. This method can be used to call an arbitrary method in any object. Use [method Callable.bind] to bind additional arguments for the call.  
         *  **Example:** Object that keeps shooting every 1 second:  
         *    
         *  **Example:** Turning a sprite red and then blue, with 2 second delay:  
         *    
         */
        tween_callback(callback: Callable): null | CallbackTweener
        
        /** Creates and appends a [MethodTweener]. This method is similar to a combination of [method tween_callback] and [method tween_property]. It calls a method over time with a tweened value provided as an argument. The value is tweened between [param from] and [param to] over the time specified by [param duration], in seconds. Use [method Callable.bind] to bind additional arguments for the call. You can use [method MethodTweener.set_ease] and [method MethodTweener.set_trans] to tweak the easing and transition of the value or [method MethodTweener.set_delay] to delay the tweening.  
         *  **Example:** Making a 3D object look from one point to another point:  
         *    
         *  **Example:** Setting the text of a [Label], using an intermediate method and after a delay:  
         *    
         */
        tween_method(method: Callable, from: any, to: any, duration: float64): null | MethodTweener
        
        /** Creates and appends a [SubtweenTweener]. This method can be used to nest [param subtween] within this [Tween], allowing for the creation of more complex and composable sequences.  
         *    
         *      
         *  **Note:** The methods [method pause], [method stop], and [method set_loops] can cause the parent [Tween] to get stuck on the subtween step; see the documentation for those methods for more information.  
         *      
         *  **Note:** The pause and process modes set by [method set_pause_mode] and [method set_process_mode] on [param subtween] will be overridden by the parent [Tween]'s settings.  
         */
        tween_subtween(subtween: Tween): null | SubtweenTweener
        
        /** Processes the [Tween] by the given [param delta] value, in seconds. This is mostly useful for manual control when the [Tween] is paused. It can also be used to end the [Tween] animation immediately, by setting [param delta] longer than the whole duration of the [Tween] animation.  
         *  Returns `true` if the [Tween] still has [Tweener]s that haven't finished.  
         */
        custom_step(delta: float64): boolean
        
        /** Stops the tweening and resets the [Tween] to its initial state. This will not remove any appended [Tweener]s.  
         *      
         *  **Note:** This does  *not*  reset targets of [PropertyTweener]s to their values when the [Tween] first started.  
         *    
         *      
         *  **Note:** If a Tween is stopped and not bound to any node, it will exist indefinitely until manually started or invalidated. If you lose a reference to such Tween, you can retrieve it using [method SceneTree.get_processed_tweens].  
         */
        stop(): void
        
        /** Pauses the tweening. The animation can be resumed by using [method play].  
         *      
         *  **Note:** If a Tween is paused and not bound to any node, it will exist indefinitely until manually started or invalidated. If you lose a reference to such Tween, you can retrieve it using [method SceneTree.get_processed_tweens].  
         */
        pause(): void
        
        /** Resumes a paused or stopped [Tween]. */
        play(): void
        
        /** Aborts all tweening operations and invalidates the [Tween]. */
        kill(): void
        
        /** Returns the total time in seconds the [Tween] has been animating (i.e. the time since it started, not counting pauses etc.). The time is affected by [method set_speed_scale], and [method stop] will reset it to `0`.  
         *      
         *  **Note:** As it results from accumulating frame deltas, the time returned after the [Tween] has finished animating will be slightly greater than the actual [Tween] duration.  
         */
        get_total_elapsed_time(): float64
        
        /** Returns whether the [Tween] is currently running, i.e. it wasn't paused and it's not finished. */
        is_running(): boolean
        
        /** Returns whether the [Tween] is valid. A valid [Tween] is a [Tween] contained by the scene tree (i.e. the array from [method SceneTree.get_processed_tweens] will contain this [Tween]). A [Tween] might become invalid when it has finished tweening, is killed, or when created with `Tween.new()`. Invalid [Tween]s can't have [Tweener]s appended. */
        is_valid(): boolean
        
        /** Binds this [Tween] with the given [param node]. [Tween]s are processed directly by the [SceneTree], so they run independently of the animated nodes. When you bind a [Node] with the [Tween], the [Tween] will halt the animation when the object is not inside tree and the [Tween] will be automatically killed when the bound object is freed. Also [constant TWEEN_PAUSE_BOUND] will make the pausing behavior dependent on the bound node.  
         *  For a shorter way to create and bind a [Tween], you can use [method Node.create_tween].  
         */
        bind_node(node: Node): null | Tween
        
        /** Determines whether the [Tween] should run after process frames (see [method Node._process]) or physics frames (see [method Node._physics_process]).  
         *  Default value is [constant TWEEN_PROCESS_IDLE].  
         */
        set_process_mode(mode: Tween.TweenProcessMode): null | Tween
        
        /** Determines the behavior of the [Tween] when the [SceneTree] is paused.  
         *  Default value is [constant TWEEN_PAUSE_BOUND].  
         */
        set_pause_mode(mode: Tween.TweenPauseMode): null | Tween
        
        /** If [param ignore] is `true`, the tween will ignore [member Engine.time_scale] and update with the real, elapsed time. This affects all [Tweener]s and their delays. Default value is `false`. */
        set_ignore_time_scale(ignore?: boolean /* = true */): null | Tween
        
        /** If [param parallel] is `true`, the [Tweener]s appended after this method will by default run simultaneously, as opposed to sequentially.  
         *      
         *  **Note:** Just like with [method parallel], the tweener added right before this method will also be part of the parallel step.  
         *    
         */
        set_parallel(parallel?: boolean /* = true */): null | Tween
        
        /** Sets the number of times the tweening sequence will be repeated, i.e. `set_loops(2)` will run the animation twice.  
         *  Calling this method without arguments will make the [Tween] run infinitely, until either it is killed with [method kill], the [Tween]'s bound node is freed, or all the animated objects have been freed (which makes further animation impossible).  
         *  **Warning:** Make sure to always add some duration/delay when using infinite loops. To prevent the game freezing, 0-duration looped animations (e.g. a single [CallbackTweener] with no delay) are stopped after a small number of loops, which may produce unexpected results. If a [Tween]'s lifetime depends on some node, always use [method bind_node].  
         */
        set_loops(loops?: int64 /* = 0 */): null | Tween
        
        /** Returns the number of remaining loops for this [Tween] (see [method set_loops]). A return value of `-1` indicates an infinitely looping [Tween], and a return value of `0` indicates that the [Tween] has already finished. */
        get_loops_left(): int64
        
        /** Scales the speed of tweening. This affects all [Tweener]s and their delays. */
        set_speed_scale(speed: float64): null | Tween
        
        /** Sets the default transition type for [PropertyTweener]s and [MethodTweener]s appended after this method.  
         *  Before this method is called, the default transition type is [constant TRANS_LINEAR].  
         *    
         */
        set_trans(trans: Tween.TransitionType): null | Tween
        
        /** Sets the default ease type for [PropertyTweener]s and [MethodTweener]s appended after this method.  
         *  Before this method is called, the default ease type is [constant EASE_IN_OUT].  
         *    
         */
        set_ease(ease: Tween.EaseType): null | Tween
        
        /** Makes the next [Tweener] run parallelly to the previous one.  
         *    
         *  All [Tweener]s in the example will run at the same time.  
         *  You can make the [Tween] parallel by default by using [method set_parallel].  
         */
        parallel(): null | Tween
        
        /** Used to chain two [Tweener]s after [method set_parallel] is called with `true`.  
         *    
         */
        chain(): null | Tween
        
        /** This method can be used for manual interpolation of a value, when you don't want [Tween] to do animating for you. It's similar to [method @GlobalScope.lerp], but with support for custom transition and easing.  
         *  [param initial_value] is the starting value of the interpolation.  
         *  [param delta_value] is the change of the value in the interpolation, i.e. it's equal to `final_value - initial_value`.  
         *  [param elapsed_time] is the time in seconds that passed after the interpolation started and it's used to control the position of the interpolation. E.g. when it's equal to half of the [param duration], the interpolated value will be halfway between initial and final values. This value can also be greater than [param duration] or lower than 0, which will extrapolate the value.  
         *  [param duration] is the total time of the interpolation.  
         *      
         *  **Note:** If [param duration] is equal to `0`, the method will always return the final value, regardless of [param elapsed_time] provided.  
         */
        static interpolate_value(initial_value: any, delta_value: any, elapsed_time: float64, duration: float64, trans_type: Tween.TransitionType, ease_type: Tween.EaseType): any
        
        /** Emitted when one step of the [Tween] is complete, providing the step index. One step is either a single [Tweener] or a group of [Tweener]s running in parallel. */
        readonly step_finished: Signal<(idx: int64) => void>
        
        /** Emitted when a full loop is complete (see [method set_loops]), providing the loop index. This signal is not emitted after the final loop, use [signal finished] instead for this case. */
        readonly loop_finished: Signal<(loop_count: int64) => void>
        
        /** Emitted when the [Tween] has finished all tweening. Never emitted when the [Tween] is set to infinite looping (see [method set_loops]). */
        readonly finished: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTween;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTween;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTweener extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTweener extends __NameMapRefCounted {
    }
    /** Abstract class for all Tweeners used by [Tween].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_tweener.html  
     */
    class Tweener extends RefCounted {
        constructor(identifier?: any)
        /** Emitted when the [Tweener] has just finished its job or became invalid (e.g. due to a freed object). */
        readonly finished: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTweener;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTweener;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTwoBoneIK3D extends __RPCMapIKModifier3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTwoBoneIK3D extends __NameMapIKModifier3D {
    }
    /** Rotation based intersection of two circles inverse kinematics solver.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_twoboneik3d.html  
     */
    class TwoBoneIK3D<Map extends NodePathMap = any> extends IKModifier3D<Map> {
        constructor(identifier?: any)
        /** Sets the target node that the end bone is trying to reach. */
        set_target_node(index: int64, target_node: NodePath | string): void
        
        /** Returns the target node that the end bone is trying to reach. */
        get_target_node(index: int64): NodePath
        
        /** Sets the pole target node that constructs a plane which the joints are all on and the pole is trying to direct. */
        set_pole_node(index: int64, pole_node: NodePath | string): void
        
        /** Returns the pole target node that constructs a plane which the joints are all on and the pole is trying to direct. */
        get_pole_node(index: int64): NodePath
        
        /** Sets the root bone name. */
        set_root_bone_name(index: int64, bone_name: string): void
        
        /** Returns the root bone name. */
        get_root_bone_name(index: int64): string
        
        /** Sets the root bone index. */
        set_root_bone(index: int64, bone: int64): void
        
        /** Returns the root bone index. */
        get_root_bone(index: int64): int64
        
        /** Sets the middle bone name.  
         *      
         *  **Note:** The middle bone must be a child of the root bone.  
         */
        set_middle_bone_name(index: int64, bone_name: string): void
        
        /** Returns the middle bone name. */
        get_middle_bone_name(index: int64): string
        
        /** Sets the middle bone index. */
        set_middle_bone(index: int64, bone: int64): void
        
        /** Returns the middle bone index. */
        get_middle_bone(index: int64): int64
        
        /** Sets the pole direction.  
         *  The pole is on the middle bone and will direct to the pole target.  
         *  The rotation axis is a vector that is orthogonal to this and the forward vector.  
         *      
         *  **Note:** The pole direction and the forward vector shouldn't be colinear to avoid unintended rotation.  
         */
        set_pole_direction(index: int64, direction: SkeletonModifier3D.SecondaryDirection): void
        
        /** Returns the pole direction. */
        get_pole_direction(index: int64): SkeletonModifier3D.SecondaryDirection
        
        /** Sets the pole direction vector.  
         *  This vector is normalized by an internal process.  
         *  If the vector length is `0`, it is considered synonymous with [constant SkeletonModifier3D.SECONDARY_DIRECTION_NONE].  
         */
        set_pole_direction_vector(index: int64, vector: Vector3): void
        
        /** Returns the pole direction vector.  
         *  If [method get_pole_direction] is [constant SkeletonModifier3D.SECONDARY_DIRECTION_NONE], this method returns `Vector3(0, 0, 0)`.  
         */
        get_pole_direction_vector(index: int64): Vector3
        
        /** Sets the end bone name.  
         *      
         *  **Note:** The end bone must be a child of the middle bone.  
         */
        set_end_bone_name(index: int64, bone_name: string): void
        
        /** Returns the end bone name. */
        get_end_bone_name(index: int64): string
        
        /** Sets the end bone index. */
        set_end_bone(index: int64, bone: int64): void
        
        /** Returns the end bone index. */
        get_end_bone(index: int64): int64
        
        /** If [param enabled] is `true`, the end bone is extended from the middle bone as a virtual bone. */
        set_use_virtual_end(index: int64, enabled: boolean): void
        
        /** Returns `true` if the end bone is extended from the middle bone as a virtual bone. */
        is_using_virtual_end(index: int64): boolean
        
        /** If [param enabled] is `true`, the end bone is extended to have a tail. */
        set_extend_end_bone(index: int64, enabled: boolean): void
        
        /** Returns `true` if the end bone is extended to have a tail. */
        is_end_bone_extended(index: int64): boolean
        
        /** Sets the end bone tail direction when [method is_end_bone_extended] is `true`. */
        set_end_bone_direction(index: int64, bone_direction: SkeletonModifier3D.BoneDirection): void
        
        /** Returns the end bone's tail direction when [method is_end_bone_extended] is `true`. */
        get_end_bone_direction(index: int64): SkeletonModifier3D.BoneDirection
        
        /** Sets the end bone tail length when [method is_end_bone_extended] is `true`. */
        set_end_bone_length(index: int64, length: float64): void
        
        /** Returns the end bone tail length of the bone chain when [method is_end_bone_extended] is `true`. */
        get_end_bone_length(index: int64): float64
        
        /** The number of settings. */
        get setting_count(): int64
        set setting_count(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTwoBoneIK3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTwoBoneIK3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapUDPServer extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapUDPServer extends __NameMapRefCounted {
    }
    /** Helper class to implement a UDP server.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_udpserver.html  
     */
    class UDPServer extends RefCounted {
        constructor(identifier?: any)
        /** Starts the server by opening a UDP socket listening on the given [param port]. You can optionally specify a [param bind_address] to only listen for packets sent to that address. See also [method PacketPeerUDP.bind]. */
        listen(port: int64, bind_address?: string /* = '*' */): Error
        
        /** Call this method at regular intervals (e.g. inside [method Node._process]) to process new packets. Any packet from a known address/port pair will be delivered to the appropriate [PacketPeerUDP], while any packet received from an unknown address/port pair will be added as a pending connection (see [method is_connection_available] and [method take_connection]). The maximum number of pending connections is defined via [member max_pending_connections]. */
        poll(): Error
        
        /** Returns `true` if a packet with a new address/port combination was received on the socket. */
        is_connection_available(): boolean
        
        /** Returns the local port this server is listening to. */
        get_local_port(): int64
        
        /** Returns `true` if the socket is open and listening on a port. */
        is_listening(): boolean
        
        /** Returns the first pending connection (connected to the appropriate address/port). Will return `null` if no new connection is available. See also [method is_connection_available], [method PacketPeerUDP.connect_to_host]. */
        take_connection(): null | PacketPeerUDP
        
        /** Stops the server, closing the UDP socket if open. Will close all connected [PacketPeerUDP] accepted via [method take_connection] (remote peers will not be notified). */
        stop(): void
        
        /** Define the maximum number of pending connections, during [method poll], any new pending connection exceeding that value will be automatically dropped. Setting this value to `0` effectively prevents any new pending connection to be accepted (e.g. when all your players have connected). */
        get max_pending_connections(): int64
        set max_pending_connections(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapUDPServer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapUDPServer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapUDSServer extends __RPCMapSocketServer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapUDSServer extends __NameMapSocketServer {
    }
    /** A Unix Domain Socket (UDS) server.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_udsserver.html  
     */
    class UDSServer extends SocketServer {
        constructor(identifier?: any)
        /** Listens on the socket at [param path]. The socket file will be created at the specified path.  
         *      
         *  **Note:** The socket file must not already exist at the specified path. You may need to remove any existing socket file before calling this method.  
         */
        listen(path: string): Error
        
        /** If a connection is available, returns a StreamPeerUDS with the connection. */
        take_connection(): null | StreamPeerUDS
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapUDSServer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapUDSServer;
    }
    namespace UPNP {
        enum UPNPResult {
            /** UPNP command or discovery was successful. */
            UPNP_RESULT_SUCCESS = 0,
            
            /** Not authorized to use the command on the [UPNPDevice]. May be returned when the user disabled UPNP on their router. */
            UPNP_RESULT_NOT_AUTHORIZED = 1,
            
            /** No port mapping was found for the given port, protocol combination on the given [UPNPDevice]. */
            UPNP_RESULT_PORT_MAPPING_NOT_FOUND = 2,
            
            /** Inconsistent parameters. */
            UPNP_RESULT_INCONSISTENT_PARAMETERS = 3,
            
            /** No such entry in array. May be returned if a given port, protocol combination is not found on a [UPNPDevice]. */
            UPNP_RESULT_NO_SUCH_ENTRY_IN_ARRAY = 4,
            
            /** The action failed. */
            UPNP_RESULT_ACTION_FAILED = 5,
            
            /** The [UPNPDevice] does not allow wildcard values for the source IP address. */
            UPNP_RESULT_SRC_IP_WILDCARD_NOT_PERMITTED = 6,
            
            /** The [UPNPDevice] does not allow wildcard values for the external port. */
            UPNP_RESULT_EXT_PORT_WILDCARD_NOT_PERMITTED = 7,
            
            /** The [UPNPDevice] does not allow wildcard values for the internal port. */
            UPNP_RESULT_INT_PORT_WILDCARD_NOT_PERMITTED = 8,
            
            /** The remote host value must be a wildcard. */
            UPNP_RESULT_REMOTE_HOST_MUST_BE_WILDCARD = 9,
            
            /** The external port value must be a wildcard. */
            UPNP_RESULT_EXT_PORT_MUST_BE_WILDCARD = 10,
            
            /** No port maps are available. May also be returned if port mapping functionality is not available. */
            UPNP_RESULT_NO_PORT_MAPS_AVAILABLE = 11,
            
            /** Conflict with other mechanism. May be returned instead of [constant UPNP_RESULT_CONFLICT_WITH_OTHER_MAPPING] if a port mapping conflicts with an existing one. */
            UPNP_RESULT_CONFLICT_WITH_OTHER_MECHANISM = 12,
            
            /** Conflict with an existing port mapping. */
            UPNP_RESULT_CONFLICT_WITH_OTHER_MAPPING = 13,
            
            /** External and internal port values must be the same. */
            UPNP_RESULT_SAME_PORT_VALUES_REQUIRED = 14,
            
            /** Only permanent leases are supported. Do not use the `duration` parameter when adding port mappings. */
            UPNP_RESULT_ONLY_PERMANENT_LEASE_SUPPORTED = 15,
            
            /** Invalid gateway. */
            UPNP_RESULT_INVALID_GATEWAY = 16,
            
            /** Invalid port. */
            UPNP_RESULT_INVALID_PORT = 17,
            
            /** Invalid protocol. */
            UPNP_RESULT_INVALID_PROTOCOL = 18,
            
            /** Invalid duration. */
            UPNP_RESULT_INVALID_DURATION = 19,
            
            /** Invalid arguments. */
            UPNP_RESULT_INVALID_ARGS = 20,
            
            /** Invalid response. */
            UPNP_RESULT_INVALID_RESPONSE = 21,
            
            /** Invalid parameter. */
            UPNP_RESULT_INVALID_PARAM = 22,
            
            /** HTTP error. */
            UPNP_RESULT_HTTP_ERROR = 23,
            
            /** Socket error. */
            UPNP_RESULT_SOCKET_ERROR = 24,
            
            /** Error allocating memory. */
            UPNP_RESULT_MEM_ALLOC_ERROR = 25,
            
            /** No gateway available. You may need to call [method discover] first, or discovery didn't detect any valid IGDs (InternetGatewayDevices). */
            UPNP_RESULT_NO_GATEWAY = 26,
            
            /** No devices available. You may need to call [method discover] first, or discovery didn't detect any valid [UPNPDevice]s. */
            UPNP_RESULT_NO_DEVICES = 27,
            
            /** Unknown error. */
            UPNP_RESULT_UNKNOWN_ERROR = 28,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapUPNP extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapUPNP extends __NameMapRefCounted {
    }
    /** Universal Plug and Play (UPnP) functions for network device discovery, querying and port forwarding.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_upnp.html  
     */
    class UPNP extends RefCounted {
        constructor(identifier?: any)
        /** Returns the number of discovered [UPNPDevice]s. */
        get_device_count(): int64
        
        /** Returns the [UPNPDevice] at the given [param index]. */
        get_device(index: int64): null | UPNPDevice
        
        /** Adds the given [UPNPDevice] to the list of discovered devices. */
        add_device(device: UPNPDevice): void
        
        /** Sets the device at [param index] from the list of discovered devices to [param device]. */
        set_device(index: int64, device: UPNPDevice): void
        
        /** Removes the device at [param index] from the list of discovered devices. */
        remove_device(index: int64): void
        
        /** Clears the list of discovered devices. */
        clear_devices(): void
        
        /** Returns the default gateway. That is the first discovered [UPNPDevice] that is also a valid IGD (InternetGatewayDevice). */
        get_gateway(): null | UPNPDevice
        
        /** Discovers local [UPNPDevice]s. Clears the list of previously discovered devices.  
         *  Filters for IGD (InternetGatewayDevice) type devices by default, as those manage port forwarding. [param timeout] is the time to wait for responses in milliseconds. [param ttl] is the time-to-live; only touch this if you know what you're doing.  
         *  See [enum UPNPResult] for possible return values.  
         */
        discover(timeout?: int64 /* = 2000 */, ttl?: int64 /* = 2 */, device_filter?: string /* = 'InternetGatewayDevice' */): int64
        
        /** Returns the external [IP] address of the default gateway (see [method get_gateway]) as string. Returns an empty string on error. */
        query_external_address(): string
        
        /** Adds a mapping to forward the external [param port] (between 1 and 65535, although recommended to use port 1024 or above) on the default gateway (see [method get_gateway]) to the [param port_internal] on the local machine for the given protocol [param proto] (either `"TCP"` or `"UDP"`, with UDP being the default). If a port mapping for the given port and protocol combination already exists on that gateway device, this method tries to overwrite it. If that is not desired, you can retrieve the gateway manually with [method get_gateway] and call [method add_port_mapping] on it, if any. Note that forwarding a well-known port (below 1024) with UPnP may fail depending on the device.  
         *  Depending on the gateway device, if a mapping for that port already exists, it will either be updated or it will refuse this command due to that conflict, especially if the existing mapping for that port wasn't created via UPnP or points to a different network address (or device) than this one.  
         *  If [param port_internal] is `0` (the default), the same port number is used for both the external and the internal port (the [param port] value).  
         *  The description ([param desc]) is shown in some routers management UIs and can be used to point out which application added the mapping.  
         *  The mapping's lease [param duration] can be limited by specifying a duration in seconds. The default of `0` means no duration, i.e. a permanent lease and notably some devices only support these permanent leases. Note that whether permanent or not, this is only a request and the gateway may still decide at any point to remove the mapping (which usually happens on a reboot of the gateway, when its external IP address changes, or on some models when it detects a port mapping has become inactive, i.e. had no traffic for multiple minutes). If not `0` (permanent), the allowed range according to spec is between `120` (2 minutes) and `86400` seconds (24 hours).  
         *  See [enum UPNPResult] for possible return values.  
         */
        add_port_mapping(port: int64, port_internal?: int64 /* = 0 */, desc?: string /* = '' */, proto?: string /* = 'UDP' */, duration?: int64 /* = 0 */): int64
        
        /** Deletes the port mapping for the given port and protocol combination on the default gateway (see [method get_gateway]) if one exists. [param port] must be a valid port between 1 and 65535, [param proto] can be either `"TCP"` or `"UDP"`. May be refused for mappings pointing to addresses other than this one, for well-known ports (below 1024), or for mappings not added via UPnP. See [enum UPNPResult] for possible return values. */
        delete_port_mapping(port: int64, proto?: string /* = 'UDP' */): int64
        
        /** Multicast interface to use for discovery. Uses the default multicast interface if empty. */
        get discover_multicast_if(): string
        set discover_multicast_if(value: string)
        
        /** If `0`, the local port to use for discovery is chosen automatically by the system. If `1`, discovery will be done from the source port 1900 (same as destination port). Otherwise, the value will be used as the port. */
        get discover_local_port(): int64
        set discover_local_port(value: int64)
        
        /** If `true`, IPv6 is used for [UPNPDevice] discovery. */
        get discover_ipv6(): boolean
        set discover_ipv6(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapUPNP;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapUPNP;
    }
    namespace UPNPDevice {
        enum IGDStatus {
            /** OK. */
            IGD_STATUS_OK = 0,
            
            /** HTTP error. */
            IGD_STATUS_HTTP_ERROR = 1,
            
            /** Empty HTTP response. */
            IGD_STATUS_HTTP_EMPTY = 2,
            
            /** Returned response contained no URLs. */
            IGD_STATUS_NO_URLS = 3,
            
            /** Not a valid IGD. */
            IGD_STATUS_NO_IGD = 4,
            
            /** Disconnected. */
            IGD_STATUS_DISCONNECTED = 5,
            
            /** Unknown device. */
            IGD_STATUS_UNKNOWN_DEVICE = 6,
            
            /** Invalid control. */
            IGD_STATUS_INVALID_CONTROL = 7,
            
            /** Memory allocation error. */
            IGD_STATUS_MALLOC_ERROR = 8,
            
            /** Unknown error. */
            IGD_STATUS_UNKNOWN_ERROR = 9,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapUPNPDevice extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapUPNPDevice extends __NameMapRefCounted {
    }
    /** Universal Plug and Play (UPnP) device.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_upnpdevice.html  
     */
    class UPNPDevice extends RefCounted {
        constructor(identifier?: any)
        /** Returns `true` if this is a valid IGD (InternetGatewayDevice) which potentially supports port forwarding. */
        is_valid_gateway(): boolean
        
        /** Returns the external IP address of this [UPNPDevice] or an empty string. */
        query_external_address(): string
        
        /** Adds a port mapping to forward the given external port on this [UPNPDevice] for the given protocol to the local machine. See [method UPNP.add_port_mapping]. */
        add_port_mapping(port: int64, port_internal?: int64 /* = 0 */, desc?: string /* = '' */, proto?: string /* = 'UDP' */, duration?: int64 /* = 0 */): int64
        
        /** Deletes the port mapping identified by the given port and protocol combination on this device. See [method UPNP.delete_port_mapping]. */
        delete_port_mapping(port: int64, proto?: string /* = 'UDP' */): int64
        
        /** URL to the device description. */
        get description_url(): string
        set description_url(value: string)
        
        /** Service type. */
        get service_type(): string
        set service_type(value: string)
        
        /** IDG control URL. */
        get igd_control_url(): string
        set igd_control_url(value: string)
        
        /** IGD service type. */
        get igd_service_type(): string
        set igd_service_type(value: string)
        
        /** Address of the local machine in the network connecting it to this [UPNPDevice]. */
        get igd_our_addr(): string
        set igd_our_addr(value: string)
        
        /** IGD status. */
        get igd_status(): int64
        set igd_status(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapUPNPDevice;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapUPNPDevice;
    }
    namespace UndoRedo {
        enum MergeMode {
            /** Makes "do"/"undo" operations stay in separate actions. */
            MERGE_DISABLE = 0,
            
            /** Merges this action with the previous one if they have the same name. Keeps only the first action's "undo" operations and the last action's "do" operations. Useful for sequential changes to a single value. */
            MERGE_ENDS = 1,
            
            /** Merges this action with the previous one if they have the same name. */
            MERGE_ALL = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapUndoRedo extends __RPCMapObject {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapUndoRedo extends __NameMapObject {
    }
    /** Provides a high-level interface for implementing undo and redo operations.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_undoredo.html  
     */
    class UndoRedo extends Object {
        constructor(identifier?: any)
        /** Create a new action. After this is called, do all your calls to [method add_do_method], [method add_undo_method], [method add_do_property], and [method add_undo_property], then commit the action with [method commit_action].  
         *  The way actions are merged is dictated by [param merge_mode].  
         *  The way undo operation are ordered in actions is dictated by [param backward_undo_ops]. When [param backward_undo_ops] is `false` undo option are ordered in the same order they were added. Which means the first operation to be added will be the first to be undone.  
         */
        create_action(name: string, merge_mode?: UndoRedo.MergeMode /* = 0 */, backward_undo_ops?: boolean /* = false */): void
        
        /** Commit the action. If [param execute] is `true` (which it is by default), all "do" methods/properties are called/set when this function is called. */
        commit_action(execute?: boolean /* = true */): void
        
        /** Returns `true` if the [UndoRedo] is currently committing the action, i.e. running its "do" method or property change (see [method commit_action]). */
        is_committing_action(): boolean
        
        /** Register a [Callable] that will be called when the action is committed. */
        add_do_method(callable: Callable): void
        
        /** Register a [Callable] that will be called when the action is undone. */
        add_undo_method(callable: Callable): void
        
        /** Register a [param property] that would change its value to [param value] when the action is committed. */
        add_do_property<T extends Object, P extends GodotNames<T>>(object: T, property: P, value: ResolveGodotNameValue<T, P>): void
        
        /** Register a [param property] that would change its value to [param value] when the action is undone. */
        add_undo_property<T extends Object, P extends GodotNames<T>>(object: T, property: P, value: ResolveGodotNameValue<T, P>): void
        
        /** Register a reference to an object that will be erased if the "do" history is deleted. This is useful for objects added by the "do" action and removed by the "undo" action.  
         *  When the "do" history is deleted, if the object is a [RefCounted], it will be unreferenced. Otherwise, it will be freed. Do not use for resources.  
         *    
         */
        add_do_reference(object: Object): void
        
        /** Register a reference to an object that will be erased if the "undo" history is deleted. This is useful for objects added by the "undo" action and removed by the "do" action.  
         *  When the "undo" history is deleted, if the object is a [RefCounted], it will be unreferenced. Otherwise, it will be freed. Do not use for resources.  
         *    
         */
        add_undo_reference(object: Object): void
        
        /** Marks the next "do" and "undo" operations to be processed even if the action gets merged with another in the [constant MERGE_ENDS] mode. Return to normal operation using [method end_force_keep_in_merge_ends]. */
        start_force_keep_in_merge_ends(): void
        
        /** Stops marking operations as to be processed even if the action gets merged with another in the [constant MERGE_ENDS] mode. See [method start_force_keep_in_merge_ends]. */
        end_force_keep_in_merge_ends(): void
        
        /** Returns how many elements are in the history. */
        get_history_count(): int64
        
        /** Gets the index of the current action. */
        get_current_action(): int64
        
        /** Gets the action name from its index. */
        get_action_name(id: int64): string
        
        /** Clear the undo/redo history and associated references.  
         *  Passing `false` to [param increase_version] will prevent the version number from increasing when the history is cleared.  
         */
        clear_history(increase_version?: boolean /* = true */): void
        
        /** Gets the name of the current action, equivalent to `get_action_name(get_current_action())`. */
        get_current_action_name(): string
        
        /** Returns `true` if an "undo" action is available. */
        has_undo(): boolean
        
        /** Returns `true` if a "redo" action is available. */
        has_redo(): boolean
        
        /** Gets the version. Every time a new action is committed, the [UndoRedo]'s version number is increased automatically.  
         *  This is useful mostly to check if something changed from a saved version.  
         */
        get_version(): int64
        
        /** Redo the last action. */
        redo(): boolean
        
        /** Undo the last action. */
        undo(): boolean
        
        /** The maximum number of steps that can be stored in the undo/redo history. If the number of stored steps exceeds this limit, older steps are removed from history and can no longer be reached by calling [method undo]. A value of `0` or lower means no limit. */
        get max_steps(): int64
        set max_steps(value: int64)
        
        /** Called when [method undo] or [method redo] was called. */
        readonly version_changed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapUndoRedo;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapUndoRedo;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapUniformSetCacheRD extends __RPCMapObject {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapUniformSetCacheRD extends __NameMapObject {
    }
    /** Uniform set cache manager for Rendering Device based renderers.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_uniformsetcacherd.html  
     */
    class UniformSetCacheRD extends Object {
        constructor(identifier?: any)
        /** Creates/returns a cached uniform set based on the provided uniforms for a given shader. */
        static get_cache(shader: RID, set: int64, uniforms: GArray<RDUniform>): RID
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapUniformSetCacheRD;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapUniformSetCacheRD;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVBoxContainer extends __RPCMapBoxContainer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVBoxContainer extends __NameMapBoxContainer {
    }
    /** A container that arranges its child controls vertically.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_vboxcontainer.html  
     */
    class VBoxContainer<Map extends NodePathMap = any> extends BoxContainer<Map> {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVBoxContainer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVBoxContainer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVFlowContainer extends __RPCMapFlowContainer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVFlowContainer extends __NameMapFlowContainer {
    }
    /** A container that arranges its child controls vertically and wraps them around at the borders.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_vflowcontainer.html  
     */
    class VFlowContainer<Map extends NodePathMap = any> extends FlowContainer<Map> {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVFlowContainer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVFlowContainer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVScrollBar extends __RPCMapScrollBar {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVScrollBar extends __NameMapScrollBar {
    }
    /** A vertical scrollbar that goes from top (min) to bottom (max).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_vscrollbar.html  
     */
    class VScrollBar<Map extends NodePathMap = any> extends ScrollBar<Map> {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVScrollBar;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVScrollBar;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVSeparator extends __RPCMapSeparator {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVSeparator extends __NameMapSeparator {
    }
    /** A vertical line used for separating other controls.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_vseparator.html  
     */
    class VSeparator<Map extends NodePathMap = any> extends Separator<Map> {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVSeparator;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVSeparator;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVSlider extends __RPCMapSlider {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVSlider extends __NameMapSlider {
    }
    /** A vertical slider that goes from bottom (min) to top (max).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_vslider.html  
     */
    class VSlider<Map extends NodePathMap = any> extends Slider<Map> {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVSlider;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVSlider;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVSplitContainer extends __RPCMapSplitContainer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVSplitContainer extends __NameMapSplitContainer {
    }
    /** A container that splits two child controls vertically and provides a grabber for adjusting the split ratio.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_vsplitcontainer.html  
     */
    class VSplitContainer<Map extends NodePathMap = any> extends SplitContainer<Map> {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVSplitContainer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVSplitContainer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVehicleBody3D extends __RPCMapRigidBody3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVehicleBody3D extends __NameMapRigidBody3D {
    }
    /** A 3D physics body that simulates the behavior of a car.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_vehiclebody3d.html  
     */
    class VehicleBody3D<Map extends NodePathMap = any> extends RigidBody3D<Map> {
        constructor(identifier?: any)
        /** Accelerates the vehicle by applying an engine force. The vehicle is only sped up if the wheels that have [member VehicleWheel3D.use_as_traction] set to `true` and are in contact with a surface. The [member RigidBody3D.mass] of the vehicle has an effect on the acceleration of the vehicle. For a vehicle with a mass set to 1000, try a value in the 25 - 50 range for acceleration.  
         *      
         *  **Note:** The simulation does not take the effect of gears into account, you will need to add logic for this if you wish to simulate gears.  
         *  A negative value will result in the vehicle reversing.  
         */
        get engine_force(): float64
        set engine_force(value: float64)
        
        /** Slows down the vehicle by applying a braking force. The vehicle is only slowed down if the wheels are in contact with a surface. The force you need to apply to adequately slow down your vehicle depends on the [member RigidBody3D.mass] of the vehicle. For a vehicle with a mass set to 1000, try a value in the 25 - 30 range for hard braking. */
        get brake(): float64
        set brake(value: float64)
        
        /** The steering angle for the vehicle. Setting this to a non-zero value will result in the vehicle turning when it's moving. Wheels that have [member VehicleWheel3D.use_as_steering] set to `true` will automatically be rotated.  
         *      
         *  **Note:** This property is edited in the inspector in degrees. In code the property is set in radians.  
         */
        get steering(): float64
        set steering(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVehicleBody3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVehicleBody3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVehicleWheel3D extends __RPCMapNode3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVehicleWheel3D extends __NameMapNode3D {
    }
    /** A 3D physics body for a [VehicleBody3D] that simulates the behavior of a wheel.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_vehiclewheel3d.html  
     */
    class VehicleWheel3D<Map extends NodePathMap = any> extends Node3D<Map> {
        constructor(identifier?: any)
        /** Returns `true` if this wheel is in contact with a surface. */
        is_in_contact(): boolean
        
        /** Returns the contacting body node if valid in the tree, as [Node3D]. At the moment, [GridMap] is not supported so the node will be always of type [PhysicsBody3D].  
         *  Returns `null` if the wheel is not in contact with a surface, or the contact body is not a [PhysicsBody3D].  
         */
        get_contact_body(): null | Node3D
        
        /** Returns the point of the suspension's collision in world space if the wheel is in contact. If the wheel isn't in contact with anything, returns the maximum point of the wheel's ray cast in world space, which is defined by `wheel_rest_length + wheel_radius`. */
        get_contact_point(): Vector3
        
        /** Returns the normal of the suspension's collision in world space if the wheel is in contact. If the wheel isn't in contact with anything, returns a vector pointing directly along the suspension axis toward the vehicle in world space. */
        get_contact_normal(): Vector3
        
        /** Returns a value between 0.0 and 1.0 that indicates whether this wheel is skidding. 0.0 is skidding (the wheel has lost grip, e.g. icy terrain), 1.0 means not skidding (the wheel has full grip, e.g. dry asphalt road). */
        get_skidinfo(): float64
        
        /** Returns the rotational speed of the wheel in revolutions per minute. */
        get_rpm(): float64
        
        /** Accelerates the wheel by applying an engine force. The wheel is only sped up if it is in contact with a surface. The [member RigidBody3D.mass] of the vehicle has an effect on the acceleration of the vehicle. For a vehicle with a mass set to 1000, try a value in the 25 - 50 range for acceleration.  
         *      
         *  **Note:** The simulation does not take the effect of gears into account, you will need to add logic for this if you wish to simulate gears.  
         *  A negative value will result in the wheel reversing.  
         */
        get engine_force(): float64
        set engine_force(value: float64)
        
        /** Slows down the wheel by applying a braking force. The wheel is only slowed down if it is in contact with a surface. The force you need to apply to adequately slow down your vehicle depends on the [member RigidBody3D.mass] of the vehicle. For a vehicle with a mass set to 1000, try a value in the 25 - 30 range for hard braking. */
        get brake(): float64
        set brake(value: float64)
        
        /** The steering angle for the wheel, in radians. Setting this to a non-zero value will result in the vehicle turning when it's moving. */
        get steering(): float64
        set steering(value: float64)
        
        /** If `true`, this wheel transfers engine force to the ground to propel the vehicle forward. This value is used in conjunction with [member VehicleBody3D.engine_force] and ignored if you are using the per-wheel [member engine_force] value instead. */
        get use_as_traction(): boolean
        set use_as_traction(value: boolean)
        
        /** If `true`, this wheel will be turned when the car steers. This value is used in conjunction with [member VehicleBody3D.steering] and ignored if you are using the per-wheel [member steering] value instead. */
        get use_as_steering(): boolean
        set use_as_steering(value: boolean)
        
        /** This value affects the roll of your vehicle. If set to 1.0 for all wheels, your vehicle will resist body roll, while a value of 0.0 will be prone to rolling over. */
        get wheel_roll_influence(): float64
        set wheel_roll_influence(value: float64)
        
        /** The radius of the wheel in meters. */
        get wheel_radius(): float64
        set wheel_radius(value: float64)
        
        /** This is the distance in meters the wheel is lowered from its origin point. Don't set this to 0.0 and move the wheel into position, instead move the origin point of your wheel (the gizmo in Godot) to the position the wheel will take when bottoming out, then use the rest length to move the wheel down to the position it should be in when the car is in rest. */
        get wheel_rest_length(): float64
        set wheel_rest_length(value: float64)
        
        /** This determines how much grip this wheel has. It is combined with the friction setting of the surface the wheel is in contact with. 0.0 means no grip, 1.0 is normal grip. For a drift car setup, try setting the grip of the rear wheels slightly lower than the front wheels, or use a lower value to simulate tire wear.  
         *  It's best to set this to 1.0 when starting out.  
         */
        get wheel_friction_slip(): float64
        set wheel_friction_slip(value: float64)
        
        /** This is the distance the suspension can travel. As Godot units are equivalent to meters, keep this setting relatively low. Try a value between 0.1 and 0.3 depending on the type of car. */
        get suspension_travel(): float64
        set suspension_travel(value: float64)
        
        /** The stiffness of the suspension, measured in Newtons per millimeter (N/mm), or megagrams per second squared (Mg/s²). Use a value lower than 50 for an off-road car, a value between 50 and 100 for a race car and try something around 200 for something like a Formula 1 car. */
        get suspension_stiffness(): float64
        set suspension_stiffness(value: float64)
        
        /** The maximum force the spring can resist. This value should be higher than a quarter of the [member RigidBody3D.mass] of the [VehicleBody3D] or the spring will not carry the weight of the vehicle. Good results are often obtained by a value that is about 3× to 4× this number. */
        get suspension_max_force(): float64
        set suspension_max_force(value: float64)
        
        /** The damping applied to the suspension spring when being compressed, meaning when the wheel is moving up relative to the vehicle. It is measured in Newton-seconds per millimeter (N⋅s/mm), or megagrams per second (Mg/s). This value should be between 0.0 (no damping) and 1.0, but may be more. A value of 0.0 means the car will keep bouncing as the spring keeps its energy. A good value for this is around 0.3 for a normal car, 0.5 for a race car. */
        get damping_compression(): float64
        set damping_compression(value: float64)
        
        /** The damping applied to the suspension spring when rebounding or extending, meaning when the wheel is moving down relative to the vehicle. It is measured in Newton-seconds per millimeter (N⋅s/mm), or megagrams per second (Mg/s). This value should be between 0.0 (no damping) and 1.0, but may be more. This value should always be slightly higher than the [member damping_compression] property. For a [member damping_compression] value of 0.3, try a relaxation value of 0.5. */
        get damping_relaxation(): float64
        set damping_relaxation(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVehicleWheel3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVehicleWheel3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVideoStream extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVideoStream extends __NameMapResource {
    }
    /** Base resource for video streams.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_videostream.html  
     */
    class VideoStream extends Resource {
        constructor(identifier?: any)
        /** Called when the video starts playing, to initialize and return a subclass of [VideoStreamPlayback]. */
        /* gdvirtual */ _instantiate_playback(): null | VideoStreamPlayback
        
        /** The video file path or URI that this [VideoStream] resource handles.  
         *  For [VideoStreamTheora], this filename should be an Ogg Theora video file with the `.ogv` extension.  
         */
        get file(): string
        set file(value: string)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVideoStream;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVideoStream;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVideoStreamPlayback extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVideoStreamPlayback extends __NameMapResource {
    }
    /** Internal class used by [VideoStream] to manage playback state when played from a [VideoStreamPlayer].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_videostreamplayback.html  
     */
    class VideoStreamPlayback extends Resource {
        constructor(identifier?: any)
        /** Stops playback. May be called multiple times before [method _play], or in response to [method VideoStreamPlayer.stop]. [method _is_playing] should return `false` once stopped. */
        /* gdvirtual */ _stop(): void
        
        /** Called in response to [member VideoStreamPlayer.autoplay] or [method VideoStreamPlayer.play]. Note that manual playback may also invoke [method _stop] multiple times before this method is called. [method _is_playing] should return `true` once playing. */
        /* gdvirtual */ _play(): void
        
        /** Returns the playback state, as determined by calls to [method _play] and [method _stop]. */
        /* gdvirtual */ _is_playing(): boolean
        
        /** Set the paused status of video playback. [method _is_paused] must return [param paused]. Called in response to the [member VideoStreamPlayer.paused] setter. */
        /* gdvirtual */ _set_paused(paused: boolean): void
        
        /** Returns the paused status, as set by [method _set_paused]. */
        /* gdvirtual */ _is_paused(): boolean
        
        /** Returns the video duration in seconds, if known, or 0 if unknown. */
        /* gdvirtual */ _get_length(): float64
        
        /** Return the current playback timestamp. Called in response to the [member VideoStreamPlayer.stream_position] getter. */
        /* gdvirtual */ _get_playback_position(): float64
        
        /** Seeks to [param time] seconds. Called in response to the [member VideoStreamPlayer.stream_position] setter. */
        /* gdvirtual */ _seek(time: float64): void
        
        /** Select the audio track [param idx]. Called when playback starts, and in response to the [member VideoStreamPlayer.audio_track] setter. */
        /* gdvirtual */ _set_audio_track(idx: int64): void
        
        /** Allocates a [Texture2D] in which decoded video frames will be drawn. */
        /* gdvirtual */ _get_texture(): null | Texture2D
        
        /** Ticks video playback for [param delta] seconds. Called every frame as long as both [method _is_paused] and [method _is_playing] return `true`. */
        /* gdvirtual */ _update(delta: float64): void
        
        /** Returns the number of audio channels. */
        /* gdvirtual */ _get_channels(): int64
        
        /** Returns the audio sample rate used for mixing. */
        /* gdvirtual */ _get_mix_rate(): int64
        
        /** Render [param num_frames] audio frames (of [method _get_channels] floats each) from [param buffer], starting from index [param offset] in the array. Returns the number of audio frames rendered, or -1 on error. */
        mix_audio(num_frames: int64, buffer?: PackedFloat32Array | float32[] /* = [] */, offset?: int64 /* = 0 */): int64
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVideoStreamPlayback;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVideoStreamPlayback;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVideoStreamPlayer extends __RPCMapControl {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVideoStreamPlayer extends __NameMapControl {
    }
    /** A control used for video playback.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_videostreamplayer.html  
     */
    class VideoStreamPlayer<Map extends NodePathMap = any> extends Control<Map> {
        constructor(identifier?: any)
        /** Starts the video playback from the beginning. If the video is paused, this will not unpause the video. */
        play(): void
        
        /** Stops the video playback and sets the stream position to 0.  
         *      
         *  **Note:** Although the stream position will be set to 0, the first frame of the video stream won't become the current frame.  
         */
        stop(): void
        
        /** Returns `true` if the video is playing.  
         *      
         *  **Note:** The video is still considered playing if paused during playback.  
         */
        is_playing(): boolean
        
        /** Returns the video stream's name, or `"<No Stream>"` if no video stream is assigned. */
        get_stream_name(): string
        
        /** The length of the current stream, in seconds. */
        get_stream_length(): float64
        
        /** Returns the current frame as a [Texture2D]. */
        get_video_texture(): null | Texture2D
        
        /** The embedded audio track to play. */
        get audio_track(): int64
        set audio_track(value: int64)
        
        /** The assigned video stream. See description for supported formats. */
        get stream(): null | VideoStream
        set stream(value: null | VideoStream)
        
        /** Audio volume in dB. */
        get volume_db(): float64
        set volume_db(value: float64)
        
        /** Audio volume as a linear value. */
        get volume(): float64
        set volume(value: float64)
        
        /** The stream's current speed scale. `1.0` is the normal speed, while `2.0` is double speed and `0.5` is half speed. A speed scale of `0.0` pauses the video, similar to setting [member paused] to `true`. */
        get speed_scale(): float64
        set speed_scale(value: float64)
        
        /** If `true`, playback starts when the scene loads. */
        get autoplay(): boolean
        set autoplay(value: boolean)
        
        /** If `true`, the video is paused. */
        get paused(): boolean
        set paused(value: boolean)
        
        /** If `true`, the video scales to the control size. Otherwise, the control minimum size will be automatically adjusted to match the video stream's dimensions. */
        get expand(): boolean
        set expand(value: boolean)
        
        /** If `true`, the video restarts when it reaches its end. */
        get loop(): boolean
        set loop(value: boolean)
        
        /** Amount of time in milliseconds to store in buffer while playing. */
        get buffering_msec(): int64
        set buffering_msec(value: int64)
        
        /** The current position of the stream, in seconds. */
        get stream_position(): float64
        set stream_position(value: float64)
        
        /** Audio bus to use for sound playback. */
        get bus(): StringName
        set bus(value: StringName)
        
        /** Emitted when playback is finished. */
        readonly finished: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVideoStreamPlayer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVideoStreamPlayer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVideoStreamTheora extends __RPCMapVideoStream {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVideoStreamTheora extends __NameMapVideoStream {
    }
    /** [VideoStream] resource for Ogg Theora videos.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_videostreamtheora.html  
     */
    class VideoStreamTheora extends VideoStream {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVideoStreamTheora;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVideoStreamTheora;
    }
    namespace Viewport {
        enum PositionalShadowAtlasQuadrantSubdiv {
            /** This quadrant will not be used. */
            SHADOW_ATLAS_QUADRANT_SUBDIV_DISABLED = 0,
            
            /** This quadrant will only be used by one shadow map. */
            SHADOW_ATLAS_QUADRANT_SUBDIV_1 = 1,
            
            /** This quadrant will be split in 4 and used by up to 4 shadow maps. */
            SHADOW_ATLAS_QUADRANT_SUBDIV_4 = 2,
            
            /** This quadrant will be split 16 ways and used by up to 16 shadow maps. */
            SHADOW_ATLAS_QUADRANT_SUBDIV_16 = 3,
            
            /** This quadrant will be split 64 ways and used by up to 64 shadow maps. */
            SHADOW_ATLAS_QUADRANT_SUBDIV_64 = 4,
            
            /** This quadrant will be split 256 ways and used by up to 256 shadow maps. Unless the [member positional_shadow_atlas_size] is very high, the shadows in this quadrant will be very low resolution. */
            SHADOW_ATLAS_QUADRANT_SUBDIV_256 = 5,
            
            /** This quadrant will be split 1024 ways and used by up to 1024 shadow maps. Unless the [member positional_shadow_atlas_size] is very high, the shadows in this quadrant will be very low resolution. */
            SHADOW_ATLAS_QUADRANT_SUBDIV_1024 = 6,
            
            /** Represents the size of the [enum PositionalShadowAtlasQuadrantSubdiv] enum. */
            SHADOW_ATLAS_QUADRANT_SUBDIV_MAX = 7,
        }
        enum Scaling3DMode {
            /** Use bilinear scaling for the viewport's 3D buffer. The amount of scaling can be set using [member scaling_3d_scale]. Values less than `1.0` will result in undersampling while values greater than `1.0` will result in supersampling. A value of `1.0` disables scaling. */
            SCALING_3D_MODE_BILINEAR = 0,
            
            /** Use AMD FidelityFX Super Resolution 1.0 upscaling for the viewport's 3D buffer. The amount of scaling can be set using [member scaling_3d_scale]. Values less than `1.0` will result in the viewport being upscaled using FSR. Values greater than `1.0` are not supported and bilinear downsampling will be used instead. A value of `1.0` disables scaling. */
            SCALING_3D_MODE_FSR = 1,
            
            /** Use AMD FidelityFX Super Resolution 2.2 upscaling for the viewport's 3D buffer. The amount of scaling can be set using [member Viewport.scaling_3d_scale]. Values less than `1.0` will result in the viewport being upscaled using FSR2. Values greater than `1.0` are not supported and bilinear downsampling will be used instead. A value of `1.0` will use FSR2 at native resolution as a TAA solution. */
            SCALING_3D_MODE_FSR2 = 2,
            
            /** Use the [url=https://developer.apple.com/documentation/metalfx/mtlfxspatialscaler#overview]MetalFX spatial upscaler[/url] for the viewport's 3D buffer.  
             *  The amount of scaling can be set using [member scaling_3d_scale].  
             *  Values less than `1.0` will result in the viewport being upscaled using MetalFX. Values greater than `1.0` are not supported and bilinear downsampling will be used instead. A value of `1.0` disables scaling.  
             *  More information: [url=https://developer.apple.com/documentation/metalfx]MetalFX[/url].  
             *      
             *  **Note:** Only supported when the Metal rendering driver is in use, which limits this scaling mode to macOS and iOS.  
             */
            SCALING_3D_MODE_METALFX_SPATIAL = 3,
            
            /** Use the [url=https://developer.apple.com/documentation/metalfx/mtlfxtemporalscaler#overview]MetalFX temporal upscaler[/url] for the viewport's 3D buffer.  
             *  The amount of scaling can be set using [member scaling_3d_scale]. To determine the minimum input scale, use the [method RenderingDevice.limit_get] method with [constant RenderingDevice.LIMIT_METALFX_TEMPORAL_SCALER_MIN_SCALE].  
             *  Values less than `1.0` will result in the viewport being upscaled using MetalFX. Values greater than `1.0` are not supported and bilinear downsampling will be used instead. A value of `1.0` will use MetalFX at native resolution as a TAA solution.  
             *  More information: [url=https://developer.apple.com/documentation/metalfx]MetalFX[/url].  
             *      
             *  **Note:** Only supported when the Metal rendering driver is in use, which limits this scaling mode to macOS and iOS.  
             */
            SCALING_3D_MODE_METALFX_TEMPORAL = 4,
            
            /** Represents the size of the [enum Scaling3DMode] enum. */
            SCALING_3D_MODE_MAX = 5,
        }
        enum MSAA {
            /** Multisample antialiasing mode disabled. This is the default value, and is also the fastest setting. */
            MSAA_DISABLED = 0,
            
            /** Use 2× Multisample Antialiasing. This has a moderate performance cost. It helps reduce aliasing noticeably, but 4× MSAA still looks substantially better. */
            MSAA_2X = 1,
            
            /** Use 4× Multisample Antialiasing. This has a significant performance cost, and is generally a good compromise between performance and quality. */
            MSAA_4X = 2,
            
            /** Use 8× Multisample Antialiasing. This has a very high performance cost. The difference between 4× and 8× MSAA may not always be visible in real gameplay conditions. Likely unsupported on low-end and older hardware. */
            MSAA_8X = 3,
            
            /** Represents the size of the [enum MSAA] enum. */
            MSAA_MAX = 4,
        }
        enum AnisotropicFiltering {
            /** Anisotropic filtering is disabled. */
            ANISOTROPY_DISABLED = 0,
            
            /** Use 2× anisotropic filtering. */
            ANISOTROPY_2X = 1,
            
            /** Use 4× anisotropic filtering. This is the default value. */
            ANISOTROPY_4X = 2,
            
            /** Use 8× anisotropic filtering. */
            ANISOTROPY_8X = 3,
            
            /** Use 16× anisotropic filtering. */
            ANISOTROPY_16X = 4,
            
            /** Represents the size of the [enum AnisotropicFiltering] enum. */
            ANISOTROPY_MAX = 5,
        }
        enum ScreenSpaceAA {
            /** Do not perform any antialiasing in the full screen post-process. */
            SCREEN_SPACE_AA_DISABLED = 0,
            
            /** Use fast approximate antialiasing. FXAA is a popular screen-space antialiasing method, which is fast but will make the image look blurry, especially at lower resolutions. It can still work relatively well at large resolutions such as 1440p and 4K. */
            SCREEN_SPACE_AA_FXAA = 1,
            
            /** Use subpixel morphological antialiasing. SMAA may produce clearer results than FXAA, but at a slightly higher performance cost. */
            SCREEN_SPACE_AA_SMAA = 2,
            
            /** Represents the size of the [enum ScreenSpaceAA] enum. */
            SCREEN_SPACE_AA_MAX = 3,
        }
        enum RenderInfo {
            /** Amount of objects in frame. */
            RENDER_INFO_OBJECTS_IN_FRAME = 0,
            
            /** Amount of vertices in frame. */
            RENDER_INFO_PRIMITIVES_IN_FRAME = 1,
            
            /** Amount of draw calls in frame. */
            RENDER_INFO_DRAW_CALLS_IN_FRAME = 2,
            
            /** Represents the size of the [enum RenderInfo] enum. */
            RENDER_INFO_MAX = 3,
        }
        enum RenderInfoType {
            /** Visible render pass (excluding shadows). */
            RENDER_INFO_TYPE_VISIBLE = 0,
            
            /** Shadow render pass. Objects will be rendered several times depending on the number of amounts of lights with shadows and the number of directional shadow splits. */
            RENDER_INFO_TYPE_SHADOW = 1,
            
            /** Canvas item rendering. This includes all 2D rendering. */
            RENDER_INFO_TYPE_CANVAS = 2,
            
            /** Represents the size of the [enum RenderInfoType] enum. */
            RENDER_INFO_TYPE_MAX = 3,
        }
        enum DebugDraw {
            /** Objects are displayed normally. */
            DEBUG_DRAW_DISABLED = 0,
            
            /** Objects are displayed without light information. */
            DEBUG_DRAW_UNSHADED = 1,
            
            /** Objects are displayed without textures and only with lighting information.  
             *      
             *  **Note:** When using this debug draw mode, custom shaders are ignored since all materials in the scene temporarily use a debug material. This means the result from custom shader functions (such as vertex displacement) won't be visible anymore when using this debug draw mode.  
             */
            DEBUG_DRAW_LIGHTING = 2,
            
            /** Objects are displayed semi-transparent with additive blending so you can see where they are drawing over top of one another. A higher overdraw means you are wasting performance on drawing pixels that are being hidden behind others.  
             *      
             *  **Note:** When using this debug draw mode, custom shaders are ignored since all materials in the scene temporarily use a debug material. This means the result from custom shader functions (such as vertex displacement) won't be visible anymore when using this debug draw mode.  
             */
            DEBUG_DRAW_OVERDRAW = 3,
            
            /** Objects are displayed as wireframe models.  
             *      
             *  **Note:** [method RenderingServer.set_debug_generate_wireframes] must be called before loading any meshes for wireframes to be visible when using the Compatibility renderer.  
             */
            DEBUG_DRAW_WIREFRAME = 4,
            
            /** Objects are displayed without lighting information and their textures replaced by normal mapping.  
             *      
             *  **Note:** Only supported when using the Forward+ rendering method.  
             */
            DEBUG_DRAW_NORMAL_BUFFER = 5,
            
            /** Objects are displayed with only the albedo value from [VoxelGI]s. Requires at least one visible [VoxelGI] node that has been baked to have a visible effect.  
             *      
             *  **Note:** Only supported when using the Forward+ rendering method.  
             */
            DEBUG_DRAW_VOXEL_GI_ALBEDO = 6,
            
            /** Objects are displayed with only the lighting value from [VoxelGI]s. Requires at least one visible [VoxelGI] node that has been baked to have a visible effect.  
             *      
             *  **Note:** Only supported when using the Forward+ rendering method.  
             */
            DEBUG_DRAW_VOXEL_GI_LIGHTING = 7,
            
            /** Objects are displayed with only the emission color from [VoxelGI]s. Requires at least one visible [VoxelGI] node that has been baked to have a visible effect.  
             *      
             *  **Note:** Only supported when using the Forward+ rendering method.  
             */
            DEBUG_DRAW_VOXEL_GI_EMISSION = 8,
            
            /** Draws the shadow atlas that stores shadows from [OmniLight3D]s and [SpotLight3D]s in the upper left quadrant of the [Viewport]. */
            DEBUG_DRAW_SHADOW_ATLAS = 9,
            
            /** Draws the shadow atlas that stores shadows from [DirectionalLight3D]s in the upper left quadrant of the [Viewport]. */
            DEBUG_DRAW_DIRECTIONAL_SHADOW_ATLAS = 10,
            
            /** Draws the scene luminance buffer (if available) in the upper left quadrant of the [Viewport].  
             *      
             *  **Note:** Only supported when using the Forward+ or Mobile rendering methods.  
             */
            DEBUG_DRAW_SCENE_LUMINANCE = 11,
            
            /** Draws the screen-space ambient occlusion texture instead of the scene so that you can clearly see how it is affecting objects. In order for this display mode to work, you must have [member Environment.ssao_enabled] set in your [WorldEnvironment].  
             *      
             *  **Note:** Only supported when using the Forward+ rendering method.  
             */
            DEBUG_DRAW_SSAO = 12,
            
            /** Draws the screen-space indirect lighting texture instead of the scene so that you can clearly see how it is affecting objects. In order for this display mode to work, you must have [member Environment.ssil_enabled] set in your [WorldEnvironment].  
             *      
             *  **Note:** Only supported when using the Forward+ rendering method.  
             */
            DEBUG_DRAW_SSIL = 13,
            
            /** Colors each PSSM split for the [DirectionalLight3D]s in the scene a different color so you can see where the splits are. In order (from closest to furthest from the camera), they are colored red, green, blue, and yellow.  
             *      
             *  **Note:** When using this debug draw mode, custom shaders are ignored since all materials in the scene temporarily use a debug material. This means the result from custom shader functions (such as vertex displacement) won't be visible anymore when using this debug draw mode.  
             *      
             *  **Note:** Only supported when using the Forward+ or Mobile rendering methods.  
             */
            DEBUG_DRAW_PSSM_SPLITS = 14,
            
            /** Draws the decal atlas used by [Decal]s and light projector textures in the upper left quadrant of the [Viewport].  
             *      
             *  **Note:** Only supported when using the Forward+ or Mobile rendering methods.  
             */
            DEBUG_DRAW_DECAL_ATLAS = 15,
            
            /** Draws the cascades used to render signed distance field global illumination (SDFGI).  
             *  Does nothing if the current environment's [member Environment.sdfgi_enabled] is `false`.  
             *      
             *  **Note:** Only supported when using the Forward+ rendering method.  
             */
            DEBUG_DRAW_SDFGI = 16,
            
            /** Draws the probes used for signed distance field global illumination (SDFGI).  
             *  When in the editor, left-clicking a probe will display additional bright dots that show its occlusion information. A white dot means the light is not occluded at all at the dot's position, while a red dot means the light is fully occluded. Intermediate values are possible.  
             *  Does nothing if the current environment's [member Environment.sdfgi_enabled] is `false`.  
             *      
             *  **Note:** Only supported when using the Forward+ rendering method.  
             */
            DEBUG_DRAW_SDFGI_PROBES = 17,
            
            /** Draws the buffer used for global illumination from [VoxelGI] or SDFGI. Requires [VoxelGI] (at least one visible baked VoxelGI node) or SDFGI ([member Environment.sdfgi_enabled]) to be enabled to have a visible effect.  
             *      
             *  **Note:** Only supported when using the Forward+ rendering method.  
             */
            DEBUG_DRAW_GI_BUFFER = 18,
            
            /** Draws all of the objects at their highest polycount regardless of their distance from the camera. No low level of detail (LOD) is applied. */
            DEBUG_DRAW_DISABLE_LOD = 19,
            
            /** Draws the cluster used by [OmniLight3D] nodes to optimize light rendering.  
             *      
             *  **Note:** Only supported when using the Forward+ rendering method.  
             */
            DEBUG_DRAW_CLUSTER_OMNI_LIGHTS = 20,
            
            /** Draws the cluster used by [SpotLight3D] nodes to optimize light rendering.  
             *      
             *  **Note:** Only supported when using the Forward+ rendering method.  
             */
            DEBUG_DRAW_CLUSTER_SPOT_LIGHTS = 21,
            
            /** Draws the cluster used by [Decal] nodes to optimize decal rendering.  
             *      
             *  **Note:** Only supported when using the Forward+ rendering method.  
             */
            DEBUG_DRAW_CLUSTER_DECALS = 22,
            
            /** Draws the cluster used by [ReflectionProbe] nodes to optimize reflection probes.  
             *      
             *  **Note:** Only supported when using the Forward+ rendering method.  
             */
            DEBUG_DRAW_CLUSTER_REFLECTION_PROBES = 23,
            
            /** Draws the buffer used for occlusion culling.  
             *      
             *  **Note:** Only supported when using the Forward+ or Mobile rendering methods.  
             */
            DEBUG_DRAW_OCCLUDERS = 24,
            
            /** Draws vector lines over the viewport to indicate the movement of pixels between frames.  
             *      
             *  **Note:** Only supported when using the Forward+ rendering method.  
             */
            DEBUG_DRAW_MOTION_VECTORS = 25,
            
            /** Draws the internal resolution buffer of the scene in linear colorspace before tonemapping or post-processing is applied.  
             *      
             *  **Note:** Only supported when using the Forward+ or Mobile rendering methods.  
             */
            DEBUG_DRAW_INTERNAL_BUFFER = 26,
        }
        enum DefaultCanvasItemTextureFilter {
            /** The texture filter reads from the nearest pixel only. This makes the texture look pixelated from up close, and grainy from a distance (due to mipmaps not being sampled). */
            DEFAULT_CANVAS_ITEM_TEXTURE_FILTER_NEAREST = 0,
            
            /** The texture filter blends between the nearest 4 pixels. This makes the texture look smooth from up close, and grainy from a distance (due to mipmaps not being sampled). */
            DEFAULT_CANVAS_ITEM_TEXTURE_FILTER_LINEAR = 1,
            
            /** The texture filter blends between the nearest 4 pixels and between the nearest 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`). This makes the texture look smooth from up close, and smooth from a distance.  
             *  Use this for non-pixel art textures that may be viewed at a low scale (e.g. due to [Camera2D] zoom or sprite scaling), as mipmaps are important to smooth out pixels that are smaller than on-screen pixels.  
             */
            DEFAULT_CANVAS_ITEM_TEXTURE_FILTER_LINEAR_WITH_MIPMAPS = 2,
            
            /** The texture filter reads from the nearest pixel and blends between the nearest 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`). This makes the texture look pixelated from up close, and smooth from a distance.  
             *  Use this for non-pixel art textures that may be viewed at a low scale (e.g. due to [Camera2D] zoom or sprite scaling), as mipmaps are important to smooth out pixels that are smaller than on-screen pixels.  
             */
            DEFAULT_CANVAS_ITEM_TEXTURE_FILTER_NEAREST_WITH_MIPMAPS = 3,
            
            /** Represents the size of the [enum DefaultCanvasItemTextureFilter] enum. */
            DEFAULT_CANVAS_ITEM_TEXTURE_FILTER_MAX = 4,
        }
        enum DefaultCanvasItemTextureRepeat {
            /** Disables textures repeating. Instead, when reading UVs outside the 0-1 range, the value will be clamped to the edge of the texture, resulting in a stretched out look at the borders of the texture. */
            DEFAULT_CANVAS_ITEM_TEXTURE_REPEAT_DISABLED = 0,
            
            /** Enables the texture to repeat when UV coordinates are outside the 0-1 range. If using one of the linear filtering modes, this can result in artifacts at the edges of a texture when the sampler filters across the edges of the texture. */
            DEFAULT_CANVAS_ITEM_TEXTURE_REPEAT_ENABLED = 1,
            
            /** Flip the texture when repeating so that the edge lines up instead of abruptly changing. */
            DEFAULT_CANVAS_ITEM_TEXTURE_REPEAT_MIRROR = 2,
            
            /** Represents the size of the [enum DefaultCanvasItemTextureRepeat] enum. */
            DEFAULT_CANVAS_ITEM_TEXTURE_REPEAT_MAX = 3,
        }
        enum SDFOversize {
            /** The signed distance field only covers the viewport's own rectangle. */
            SDF_OVERSIZE_100_PERCENT = 0,
            
            /** The signed distance field is expanded to cover 20% of the viewport's size around the borders. */
            SDF_OVERSIZE_120_PERCENT = 1,
            
            /** The signed distance field is expanded to cover 50% of the viewport's size around the borders. */
            SDF_OVERSIZE_150_PERCENT = 2,
            
            /** The signed distance field is expanded to cover 100% (double) of the viewport's size around the borders. */
            SDF_OVERSIZE_200_PERCENT = 3,
            
            /** Represents the size of the [enum SDFOversize] enum. */
            SDF_OVERSIZE_MAX = 4,
        }
        enum SDFScale {
            /** The signed distance field is rendered at full resolution. */
            SDF_SCALE_100_PERCENT = 0,
            
            /** The signed distance field is rendered at half the resolution of this viewport. */
            SDF_SCALE_50_PERCENT = 1,
            
            /** The signed distance field is rendered at a quarter the resolution of this viewport. */
            SDF_SCALE_25_PERCENT = 2,
            
            /** Represents the size of the [enum SDFScale] enum. */
            SDF_SCALE_MAX = 3,
        }
        enum VRSMode {
            /** Variable Rate Shading is disabled. */
            VRS_DISABLED = 0,
            
            /** Variable Rate Shading uses a texture. Note, for stereoscopic use a texture atlas with a texture for each view. */
            VRS_TEXTURE = 1,
            
            /** Variable Rate Shading's texture is supplied by the primary [XRInterface]. */
            VRS_XR = 2,
            
            /** Represents the size of the [enum VRSMode] enum. */
            VRS_MAX = 3,
        }
        enum VRSUpdateMode {
            /** The input texture for variable rate shading will not be processed. */
            VRS_UPDATE_DISABLED = 0,
            
            /** The input texture for variable rate shading will be processed once. */
            VRS_UPDATE_ONCE = 1,
            
            /** The input texture for variable rate shading will be processed each frame. */
            VRS_UPDATE_ALWAYS = 2,
            
            /** Represents the size of the [enum VRSUpdateMode] enum. */
            VRS_UPDATE_MAX = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapViewport extends __RPCMapNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapViewport extends __NameMapNode {
    }
    /** Abstract base class for viewports. Encapsulates drawing and interaction with a game world.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_viewport.html  
     */
    class Viewport<Map extends NodePathMap = any> extends Node<Map> {
        constructor(identifier?: any)
        /** Returns the first valid [World2D] for this viewport, searching the [member world_2d] property of itself and any Viewport ancestor. */
        find_world_2d(): null | World2D
        
        /** Returns the automatically computed 2D stretch transform, taking the [Viewport]'s stretch settings into account. The final value is multiplied by [member Window.content_scale_factor], but only for the root viewport. If this method is called on a [SubViewport] (e.g., in a scene tree with [SubViewportContainer] and [SubViewport]), the scale factor of the root window will not be applied. Using [method Transform2D.get_scale] on the returned value, this can be used to compensate for scaling when zooming a [Camera2D] node, or to scale down a [TextureRect] to be pixel-perfect regardless of the automatically computed scale factor.  
         *      
         *  **Note:** Due to how pixel scaling works, the returned transform's X and Y scale may differ slightly, even when [member Window.content_scale_aspect] is set to a mode that preserves the pixels' aspect ratio. If [member Window.content_scale_aspect] is [constant Window.CONTENT_SCALE_ASPECT_IGNORE], the X and Y scale may differ  *significantly* .  
         */
        get_stretch_transform(): Transform2D
        
        /** Returns the transform from the viewport's coordinate system to the embedder's coordinate system. */
        get_final_transform(): Transform2D
        
        /** Returns the transform from the Viewport's coordinates to the screen coordinates of the containing window manager window. */
        get_screen_transform(): Transform2D
        
        /** Returns the visible rectangle in global screen coordinates. */
        get_visible_rect(): Rect2
        
        /** Returns viewport oversampling factor. */
        get_oversampling(): float64
        
        /** Returns rendering statistics of the given type. */
        get_render_info(type: Viewport.RenderInfoType, info: Viewport.RenderInfo): int64
        
        /** Returns the viewport's texture.  
         *      
         *  **Note:** When trying to store the current texture (e.g. in a file), it might be completely black or outdated if used too early, especially when used in e.g. [method Node._ready]. To make sure the texture you get is correct, you can await [signal RenderingServer.frame_post_draw] signal.  
         *    
         *      
         *  **Note:** When [member use_hdr_2d] is `true` the returned texture will be an HDR image using linear encoding.  
         */
        get_texture(): null | ViewportTexture
        
        /** Returns the viewport's RID from the [RenderingServer]. */
        get_viewport_rid(): RID
        
        /** Helper method which calls the `set_text()` method on the currently focused [Control], provided that it is defined (e.g. if the focused Control is [Button] or [LineEdit]). */
        push_text_input(text: string): void
        
        /** Triggers the given [param event] in this [Viewport]. This can be used to pass an [InputEvent] between viewports, or to locally apply inputs that were sent over the network or saved to a file.  
         *  If [param in_local_coords] is `false`, the event's position is in the embedder's coordinates and will be converted to viewport coordinates. If [param in_local_coords] is `true`, the event's position is in viewport coordinates.  
         *  While this method serves a similar purpose as [method Input.parse_input_event], it does not remap the specified [param event] based on project settings like [member ProjectSettings.input_devices/pointing/emulate_touch_from_mouse].  
         *  Calling this method will propagate calls to child nodes for following methods in the given order:  
         *  - [method Node._input]  
         *  - [method Control._gui_input] for [Control] nodes  
         *  - [method Node._shortcut_input]  
         *  - [method Node._unhandled_key_input]  
         *  - [method Node._unhandled_input]  
         *  If an earlier method marks the input as handled via [method set_input_as_handled], any later method in this list will not be called.  
         *  If none of the methods handle the event and [member physics_object_picking] is `true`, the event is used for physics object picking.  
         */
        push_input(event: InputEvent, in_local_coords?: boolean /* = false */): void
        
        /** Triggers the given [param event] in this [Viewport]. This can be used to pass an [InputEvent] between viewports, or to locally apply inputs that were sent over the network or saved to a file.  
         *  If [param in_local_coords] is `false`, the event's position is in the embedder's coordinates and will be converted to viewport coordinates. If [param in_local_coords] is `true`, the event's position is in viewport coordinates.  
         *  Calling this method will propagate calls to child nodes for following methods in the given order:  
         *  - [method Node._shortcut_input]  
         *  - [method Node._unhandled_key_input]  
         *  - [method Node._unhandled_input]  
         *  If an earlier method marks the input as handled via [method set_input_as_handled], any later method in this list will not be called.  
         *  If none of the methods handle the event and [member physics_object_picking] is `true`, the event is used for physics object picking.  
         *      
         *  **Note:** This method doesn't propagate input events to embedded [Window]s or [SubViewport]s.  
         */
        push_unhandled_input(event: InputEvent, in_local_coords?: boolean /* = false */): void
        
        /** Inform the Viewport that the mouse has entered its area. Use this function before sending an [InputEventMouseButton] or [InputEventMouseMotion] to the [Viewport] with [method Viewport.push_input]. See also [method notify_mouse_exited].  
         *      
         *  **Note:** In most cases, it is not necessary to call this function because [SubViewport] nodes that are children of [SubViewportContainer] are notified automatically. This is only necessary when interacting with viewports in non-default ways, for example as textures in [TextureRect] or with an [Area3D] that forwards input events.  
         */
        notify_mouse_entered(): void
        
        /** Inform the Viewport that the mouse has left its area. Use this function when the node that displays the viewport notices the mouse has left the area of the displayed viewport. See also [method notify_mouse_entered].  
         *      
         *  **Note:** In most cases, it is not necessary to call this function because [SubViewport] nodes that are children of [SubViewportContainer] are notified automatically. This is only necessary when interacting with viewports in non-default ways, for example as textures in [TextureRect] or with an [Area3D] that forwards input events.  
         */
        notify_mouse_exited(): void
        
        /** Returns the mouse's position in this [Viewport] using the coordinate system of this [Viewport]. */
        get_mouse_position(): Vector2
        
        /** Moves the mouse pointer to the specified position in this [Viewport] using the coordinate system of this [Viewport].  
         *      
         *  **Note:** [method warp_mouse] is only supported on Windows, macOS and Linux. It has no effect on Android, iOS and Web.  
         */
        warp_mouse(position: Vector2): void
        
        /** Force instantly updating the display based on the current mouse cursor position. This includes updating the mouse cursor shape and sending necessary [signal Control.mouse_entered], [signal CollisionObject2D.mouse_entered], [signal CollisionObject3D.mouse_entered] and [signal Window.mouse_entered] signals and their respective `mouse_exited` counterparts. */
        update_mouse_cursor_state(): void
        
        /** Cancels the drag operation that was previously started through [method Control._get_drag_data] or forced with [method Control.force_drag]. */
        gui_cancel_drag(): void
        
        /** Returns the drag data from the GUI, that was previously returned by [method Control._get_drag_data]. */
        gui_get_drag_data(): any
        
        /** Returns the human-readable description of the drag data, used for assistive apps. */
        gui_get_drag_description(): string
        
        /** Sets the human-readable description of the drag data to [param description], used for assistive apps. */
        gui_set_drag_description(description: string): void
        
        /** Returns `true` if a drag operation is currently ongoing and where the drop action could happen in this viewport.  
         *  Alternative to [constant Node.NOTIFICATION_DRAG_BEGIN] and [constant Node.NOTIFICATION_DRAG_END] when you prefer polling the value.  
         */
        gui_is_dragging(): boolean
        
        /** Returns `true` if the drag operation is successful. */
        gui_is_drag_successful(): boolean
        
        /** Removes the focus from the currently focused [Control] within this viewport. If no [Control] has the focus, does nothing. */
        gui_release_focus(): void
        
        /** Returns the currently focused [Control] within this viewport. If no [Control] is focused, returns `null`. */
        gui_get_focus_owner(): null | Control
        
        /** Returns the [Control] that the mouse is currently hovering over in this viewport. If no [Control] has the cursor, returns `null`.  
         *  Typically the leaf [Control] node or deepest level of the subtree which claims hover. This is very useful when used together with [method Node.is_ancestor_of] to find if the mouse is within a control tree.  
         */
        gui_get_hovered_control(): null | Control
        _gui_remove_focus_for_window(_unnamed_arg0: Node): void
        
        /** Sets the number of subdivisions to use in the specified quadrant. A higher number of subdivisions allows you to have more shadows in the scene at once, but reduces the quality of the shadows. A good practice is to have quadrants with a varying number of subdivisions and to have as few subdivisions as possible. */
        set_positional_shadow_atlas_quadrant_subdiv(quadrant: int64, subdiv: Viewport.PositionalShadowAtlasQuadrantSubdiv): void
        
        /** Returns the positional shadow atlas quadrant subdivision of the specified quadrant. */
        get_positional_shadow_atlas_quadrant_subdiv(quadrant: int64): Viewport.PositionalShadowAtlasQuadrantSubdiv
        
        /** Stops the input from propagating further up the [SceneTree].  
         *      
         *  **Note:** This does not affect the methods in [Input], only the way events are propagated.  
         */
        set_input_as_handled(): void
        
        /** Returns whether the current [InputEvent] has been handled. Input events are not handled until [method set_input_as_handled] has been called during the lifetime of an [InputEvent].  
         *  This is usually done as part of input handling methods like [method Node._input], [method Control._gui_input] or others, as well as in corresponding signal handlers.  
         *  If [member handle_input_locally] is set to `false`, this method will try finding the first parent viewport that is set to handle input locally, and return its value for [method is_input_handled] instead.  
         */
        is_input_handled(): boolean
        
        /** Returns a list of the visible embedded [Window]s inside the viewport.  
         *      
         *  **Note:** [Window]s inside other viewports will not be listed.  
         */
        get_embedded_subwindows(): GArray<Window>
        
        /** Set/clear individual bits on the rendering layer mask. This simplifies editing this [Viewport]'s layers. */
        set_canvas_cull_mask_bit(layer: int64, enable: boolean): void
        
        /** Returns an individual bit on the rendering layer mask. */
        get_canvas_cull_mask_bit(layer: int64): boolean
        _process_picking(): void
        
        /** Returns the currently active 2D audio listener. Returns `null` if there are no active 2D audio listeners, in which case the active 2D camera will be treated as listener. */
        get_audio_listener_2d(): null | AudioListener2D
        
        /** Returns the currently active 2D camera. Returns `null` if there are no active cameras.  
         *      
         *  **Note:** If called while the  *Camera Override*  system is active in editor, this will return the internally managed override camera. It is therefore advised to avoid caching the return value, or to check that the cached value is still a valid instance and is the current camera before use. See [method @GlobalScope.is_instance_valid] and [method Camera2D.is_current].  
         */
        get_camera_2d(): null | Camera2D
        
        /** Returns the first valid [World3D] for this viewport, searching the [member world_3d] property of itself and any Viewport ancestor. */
        find_world_3d(): null | World3D
        
        /** Returns the currently active 3D audio listener. Returns `null` if there are no active 3D audio listeners, in which case the active 3D camera will be treated as listener. */
        get_audio_listener_3d(): null | AudioListener3D
        
        /** Returns the currently active 3D camera. Returns `null` if there are no active cameras.  
         *      
         *  **Note:** If called while the  *Camera Override*  system is active in editor, this will return the internally managed override camera. It is therefore advised to avoid caching the return value, or to check that the cached value is a valid instance and is the current camera before use. See [method @GlobalScope.is_instance_valid] and [member Camera3D.current].  
         */
        get_camera_3d(): null | Camera3D
        
        /** Disable 3D rendering (but keep 2D rendering). */
        get disable_3d(): boolean
        set disable_3d(value: boolean)
        
        /** If `true`, the viewport will use the primary XR interface to render XR output. When applicable this can result in a stereoscopic image and the resulting render being output to a headset. */
        get use_xr(): boolean
        set use_xr(value: boolean)
        
        /** If `true`, the viewport will use a unique copy of the [World3D] defined in [member world_3d]. */
        get own_world_3d(): boolean
        set own_world_3d(value: boolean)
        
        /** The custom [World3D] which can be used as 3D environment source. */
        get world_3d(): null | World3D
        set world_3d(value: null | World3D)
        
        /** The custom [World2D] which can be used as 2D environment source. */
        get world_2d(): null | World2D
        set world_2d(value: null | World2D)
        
        /** If `true`, the viewport should render its background as transparent.  
         *      
         *  **Note:** Due to technical limitations, certain rendering features are disabled when a viewport has a transparent background. This currently applies to screen-space reflections, subsurface scattering, and depth of field.  
         */
        get transparent_bg(): boolean
        set transparent_bg(value: boolean)
        
        /** If `true`, this viewport will mark incoming input events as handled by itself. If `false`, this is instead done by the first parent viewport that is set to handle input locally.  
         *  A [SubViewportContainer] will automatically set this property to `false` for the [Viewport] contained inside of it.  
         *  See also [method set_input_as_handled] and [method is_input_handled].  
         */
        get handle_input_locally(): boolean
        set handle_input_locally(value: boolean)
        
        /** If `true`, [CanvasItem] nodes will internally snap to full pixels. Their position can still be sub-pixel, but the decimals will not have effect. This can lead to a crisper appearance at the cost of less smooth movement, especially when [Camera2D] smoothing is enabled. */
        get snap_2d_transforms_to_pixel(): boolean
        set snap_2d_transforms_to_pixel(value: boolean)
        
        /** If `true`, vertices of [CanvasItem] nodes will snap to full pixels. Only affects the final vertex positions, not the transforms. This can lead to a crisper appearance at the cost of less smooth movement, especially when [Camera2D] smoothing is enabled. */
        get snap_2d_vertices_to_pixel(): boolean
        set snap_2d_vertices_to_pixel(value: boolean)
        
        /** The multisample antialiasing mode for 2D/Canvas rendering. A higher number results in smoother edges at the cost of significantly worse performance. A value of [constant Viewport.MSAA_2X] or [constant Viewport.MSAA_4X] is best unless targeting very high-end systems. This has no effect on shader-induced aliasing or texture aliasing.  
         *  See also [member ProjectSettings.rendering/anti_aliasing/quality/msaa_2d] and [method RenderingServer.viewport_set_msaa_2d].  
         */
        get msaa_2d(): int64
        set msaa_2d(value: int64)
        
        /** The multisample antialiasing mode for 3D rendering. A higher number results in smoother edges at the cost of significantly worse performance. A value of [constant Viewport.MSAA_2X] or [constant Viewport.MSAA_4X] is best unless targeting very high-end systems. See also bilinear scaling 3D [member scaling_3d_mode] for supersampling, which provides higher quality but is much more expensive. This has no effect on shader-induced aliasing or texture aliasing.  
         *  See also [member ProjectSettings.rendering/anti_aliasing/quality/msaa_3d] and [method RenderingServer.viewport_set_msaa_3d].  
         */
        get msaa_3d(): int64
        set msaa_3d(value: int64)
        
        /** Sets the screen-space antialiasing method used. Screen-space antialiasing works by selectively blurring edges in a post-process shader. It differs from MSAA which takes multiple coverage samples while rendering objects. Screen-space AA methods are typically faster than MSAA and will smooth out specular aliasing, but tend to make scenes appear blurry.  
         *  See also [member ProjectSettings.rendering/anti_aliasing/quality/screen_space_aa] and [method RenderingServer.viewport_set_screen_space_aa].  
         */
        get screen_space_aa(): int64
        set screen_space_aa(value: int64)
        
        /** Enables temporal antialiasing for this viewport. TAA works by jittering the camera and accumulating the images of the last rendered frames, motion vector rendering is used to account for camera and object motion.  
         *      
         *  **Note:** The implementation is not complete yet, some visual instances such as particles and skinned meshes may show artifacts.  
         *  See also [member ProjectSettings.rendering/anti_aliasing/quality/use_taa] and [method RenderingServer.viewport_set_use_taa].  
         */
        get use_taa(): boolean
        set use_taa(value: boolean)
        
        /** When using the Mobile or Forward+ renderers, set [member use_debanding] to enable or disable the debanding feature of this [Viewport]. If [member use_hdr_2d] is `false`, 2D rendering is  *not*  affected by debanding unless the [member Environment.background_mode] is [constant Environment.BG_CANVAS]. If [member use_hdr_2d] is `true`, debanding will only be applied if this is the root [Viewport] and will affect all 2D and 3D rendering, including canvas items.  
         *  [member use_debanding] has no effect when using the Compatibility rendering method. The Mobile renderer can also use material debanding, which can be set with [method RenderingServer.material_set_use_debanding] or configured with [member ProjectSettings.rendering/anti_aliasing/quality/use_debanding].  
         *  See also [member ProjectSettings.rendering/anti_aliasing/quality/use_debanding], [method RenderingServer.material_set_use_debanding], and [method RenderingServer.viewport_set_use_debanding].  
         */
        get use_debanding(): boolean
        set use_debanding(value: boolean)
        
        /** If `true`, [OccluderInstance3D] nodes will be usable for occlusion culling in 3D for this viewport. For the root viewport, [member ProjectSettings.rendering/occlusion_culling/use_occlusion_culling] must be set to `true` instead.  
         *      
         *  **Note:** Enabling occlusion culling has a cost on the CPU. Only enable occlusion culling if you actually plan to use it, and think whether your scene can actually benefit from occlusion culling. Large, open scenes with few or no objects blocking the view will generally not benefit much from occlusion culling. Large open scenes generally benefit more from mesh LOD and visibility ranges ([member GeometryInstance3D.visibility_range_begin] and [member GeometryInstance3D.visibility_range_end]) compared to occlusion culling.  
         *      
         *  **Note:** Due to memory constraints, occlusion culling is not supported by default in Web export templates. It can be enabled by compiling custom Web export templates with `module_raycast_enabled=yes`.  
         */
        get use_occlusion_culling(): boolean
        set use_occlusion_culling(value: boolean)
        
        /** The automatic LOD bias to use for meshes rendered within the [Viewport] (this is analogous to [member ReflectionProbe.mesh_lod_threshold]). Higher values will use less detailed versions of meshes that have LOD variations generated. If set to `0.0`, automatic LOD is disabled. Increase [member mesh_lod_threshold] to improve performance at the cost of geometry detail.  
         *  To control this property on the root viewport, set the [member ProjectSettings.rendering/mesh_lod/lod_change/threshold_pixels] project setting.  
         *      
         *  **Note:** [member mesh_lod_threshold] does not affect [GeometryInstance3D] visibility ranges (also known as "manual" LOD or hierarchical LOD).  
         */
        get mesh_lod_threshold(): float64
        set mesh_lod_threshold(value: float64)
        
        /** The overlay mode for test rendered geometry in debug purposes. */
        get debug_draw(): int64
        set debug_draw(value: int64)
        
        /** If `true`, 2D rendering will use a high dynamic range (HDR) `RGBA16` format framebuffer. Additionally, 2D rendering will be performed on linear values and will be converted using the appropriate transfer function immediately before blitting to the screen (if the Viewport is attached to the screen).  
         *  Practically speaking, this means that the end result of the Viewport will not be clamped to the `0-1` range and can be used in 3D rendering without color encoding adjustments. This allows 2D rendering to take advantage of effects requiring high dynamic range (e.g. 2D glow) as well as substantially improves the appearance of effects requiring highly detailed gradients.  
         */
        get use_hdr_2d(): boolean
        set use_hdr_2d(value: boolean)
        
        /** Sets scaling 3D mode. Bilinear scaling renders at different resolution to either undersample or supersample the viewport. FidelityFX Super Resolution 1.0, abbreviated to FSR, is an upscaling technology that produces high quality images at fast framerates by using a spatially aware upscaling algorithm. FSR is slightly more expensive than bilinear, but it produces significantly higher image quality. FSR should be used where possible.  
         *  To control this property on the root viewport, set the [member ProjectSettings.rendering/scaling_3d/mode] project setting.  
         */
        get scaling_3d_mode(): int64
        set scaling_3d_mode(value: int64)
        
        /** Scales the 3D render buffer based on the viewport size uses an image filter specified in [member ProjectSettings.rendering/scaling_3d/mode] to scale the output image to the full viewport size. Values lower than `1.0` can be used to speed up 3D rendering at the cost of quality (undersampling). Values greater than `1.0` are only valid for bilinear mode and can be used to improve 3D rendering quality at a high performance cost (supersampling). See also [member ProjectSettings.rendering/anti_aliasing/quality/msaa_3d] for multi-sample antialiasing, which is significantly cheaper but only smooths the edges of polygons.  
         *  When using FSR upscaling, AMD recommends exposing the following values as preset options to users "Ultra Quality: 0.77", "Quality: 0.67", "Balanced: 0.59", "Performance: 0.5" instead of exposing the entire scale.  
         *  To control this property on the root viewport, set the [member ProjectSettings.rendering/scaling_3d/scale] project setting.  
         */
        get scaling_3d_scale(): float64
        set scaling_3d_scale(value: float64)
        
        /** Affects the final texture sharpness by reading from a lower or higher mipmap (also called "texture LOD bias"). Negative values make mipmapped textures sharper but grainier when viewed at a distance, while positive values make mipmapped textures blurrier (even when up close).  
         *  Enabling temporal antialiasing ([member use_taa]) will automatically apply a `-0.5` offset to this value, while enabling FXAA ([member screen_space_aa]) will automatically apply a `-0.25` offset to this value. If both TAA and FXAA are enabled at the same time, an offset of `-0.75` is applied to this value.  
         *      
         *  **Note:** If [member scaling_3d_scale] is lower than `1.0` (exclusive), [member texture_mipmap_bias] is used to adjust the automatic mipmap bias which is calculated internally based on the scale factor. The formula for this is `log2(scaling_3d_scale) + mipmap_bias`.  
         *  To control this property on the root viewport, set the [member ProjectSettings.rendering/textures/default_filters/texture_mipmap_bias] project setting.  
         */
        get texture_mipmap_bias(): float64
        set texture_mipmap_bias(value: float64)
        
        /** Sets the maximum number of samples to take when using anisotropic filtering on textures (as a power of two). A higher sample count will result in sharper textures at oblique angles, but is more expensive to compute. A value of `0` forcibly disables anisotropic filtering, even on materials where it is enabled.  
         *  The anisotropic filtering level also affects decals and light projectors if they are configured to use anisotropic filtering. See [member ProjectSettings.rendering/textures/decals/filter] and [member ProjectSettings.rendering/textures/light_projectors/filter].  
         *      
         *  **Note:** In 3D, for this setting to have an effect, set [member BaseMaterial3D.texture_filter] to [constant BaseMaterial3D.TEXTURE_FILTER_LINEAR_WITH_MIPMAPS_ANISOTROPIC] or [constant BaseMaterial3D.TEXTURE_FILTER_NEAREST_WITH_MIPMAPS_ANISOTROPIC] on materials.  
         *      
         *  **Note:** In 2D, for this setting to have an effect, set [member CanvasItem.texture_filter] to [constant CanvasItem.TEXTURE_FILTER_LINEAR_WITH_MIPMAPS_ANISOTROPIC] or [constant CanvasItem.TEXTURE_FILTER_NEAREST_WITH_MIPMAPS_ANISOTROPIC] on the [CanvasItem] node displaying the texture (or in [CanvasTexture]). However, anisotropic filtering is rarely useful in 2D, so only enable it for textures in 2D if it makes a meaningful visual difference.  
         */
        get anisotropic_filtering_level(): int64
        set anisotropic_filtering_level(value: int64)
        
        /** Determines how sharp the upscaled image will be when using the FSR upscaling mode. Sharpness halves with every whole number. Values go from 0.0 (sharpest) to 2.0. Values above 2.0 won't make a visible difference.  
         *  To control this property on the root viewport, set the [member ProjectSettings.rendering/scaling_3d/fsr_sharpness] project setting.  
         */
        get fsr_sharpness(): float64
        set fsr_sharpness(value: float64)
        
        /** The Variable Rate Shading (VRS) mode that is used for this viewport. Note, if hardware does not support VRS this property is ignored. */
        get vrs_mode(): int64
        set vrs_mode(value: int64)
        
        /** Sets the update mode for Variable Rate Shading (VRS) for the viewport. VRS requires the input texture to be converted to the format usable by the VRS method supported by the hardware. The update mode defines how often this happens. If the GPU does not support VRS, or VRS is not enabled, this property is ignored. */
        get vrs_update_mode(): int64
        set vrs_update_mode(value: int64)
        
        /** Texture to use when [member vrs_mode] is set to [constant Viewport.VRS_TEXTURE].  
         *  The texture  *must*  use a lossless compression format so that colors can be matched precisely. The following VRS densities are mapped to various colors, with brighter colors representing a lower level of shading precision:  
         *  [codeblock lang=text]  
         *  - 1×1 = rgb(0, 0, 0)     - #000000  
         *  - 1×2 = rgb(0, 85, 0)    - #005500  
         *  - 2×1 = rgb(85, 0, 0)    - #550000  
         *  - 2×2 = rgb(85, 85, 0)   - #555500  
         *  - 2×4 = rgb(85, 170, 0)  - #55aa00  
         *  - 4×2 = rgb(170, 85, 0)  - #aa5500  
         *  - 4×4 = rgb(170, 170, 0) - #aaaa00  
         *  - 4×8 = rgb(170, 255, 0) - #aaff00 - Not supported on most hardware  
         *  - 8×4 = rgb(255, 170, 0) - #ffaa00 - Not supported on most hardware  
         *  - 8×8 = rgb(255, 255, 0) - #ffff00 - Not supported on most hardware  
         *  [/codeblock]  
         */
        get vrs_texture(): null | Texture2D
        set vrs_texture(value: null | Texture2D)
        
        /** The default filter mode used by [CanvasItem] nodes in this viewport. */
        get canvas_item_default_texture_filter(): int64
        set canvas_item_default_texture_filter(value: int64)
        
        /** The default repeat mode used by [CanvasItem] nodes in this viewport. */
        get canvas_item_default_texture_repeat(): int64
        set canvas_item_default_texture_repeat(value: int64)
        
        /** If `true`, the viewport will process 2D audio streams. */
        get audio_listener_enable_2d(): boolean
        set audio_listener_enable_2d(value: boolean)
        
        /** If `true`, the viewport will process 3D audio streams. */
        get audio_listener_enable_3d(): boolean
        set audio_listener_enable_3d(value: boolean)
        
        /** If `true`, the objects rendered by viewport become subjects of mouse picking process.  
         *      
         *  **Note:** The number of simultaneously pickable objects is limited to 64 and they are selected in a non-deterministic order, which can be different in each picking process.  
         */
        get physics_object_picking(): boolean
        set physics_object_picking(value: boolean)
        
        /** If `true`, objects receive mouse picking events sorted primarily by their [member CanvasItem.z_index] and secondarily by their position in the scene tree. If `false`, the order is undetermined.  
         *      
         *  **Note:** This setting is disabled by default because of its potential expensive computational cost.  
         *      
         *  **Note:** Sorting happens after selecting the pickable objects. Because of the limitation of 64 simultaneously pickable objects, it is not guaranteed that the object with the highest [member CanvasItem.z_index] receives the picking event.  
         */
        get physics_object_picking_sort(): boolean
        set physics_object_picking_sort(value: boolean)
        
        /** If `true`, the input_event signal will only be sent to one physics object in the mouse picking process. If you want to get the top object only, you must also enable [member physics_object_picking_sort].  
         *  If `false`, an input_event signal will be sent to all physics objects in the mouse picking process.  
         *  This applies to 2D CanvasItem object picking only.  
         */
        get physics_object_picking_first_only(): boolean
        set physics_object_picking_first_only(value: boolean)
        
        /** If `true`, the viewport will not receive input events. */
        get gui_disable_input(): boolean
        set gui_disable_input(value: boolean)
        
        /** If `true`, the GUI controls on the viewport will lay pixel perfectly. */
        get gui_snap_controls_to_pixels(): boolean
        set gui_snap_controls_to_pixels(value: boolean)
        
        /** If `true`, sub-windows (popups and dialogs) will be embedded inside application window as control-like nodes. If `false`, they will appear as separate windows handled by the operating system. */
        get gui_embed_subwindows(): boolean
        set gui_embed_subwindows(value: boolean)
        
        /** The minimum distance the mouse cursor must move while pressed before a drag operation begins. */
        get gui_drag_threshold(): int64
        set gui_drag_threshold(value: int64)
        
        /** Controls how much of the original viewport's size should be covered by the 2D signed distance field. This SDF can be sampled in [CanvasItem] shaders and is also used for [GPUParticles2D] collision. Higher values allow portions of occluders located outside the viewport to still be taken into account in the generated signed distance field, at the cost of performance. If you notice particles falling through [LightOccluder2D]s as the occluders leave the viewport, increase this setting.  
         *  The percentage is added on each axis and on both sides. For example, with the default [constant SDF_OVERSIZE_120_PERCENT], the signed distance field will cover 20% of the viewport's size outside the viewport on each side (top, right, bottom, left).  
         */
        get sdf_oversize(): int64
        set sdf_oversize(value: int64)
        
        /** The resolution scale to use for the 2D signed distance field. Higher values lead to a more precise and more stable signed distance field as the camera moves, at the cost of performance. */
        get sdf_scale(): int64
        set sdf_scale(value: int64)
        
        /** The shadow atlas' resolution (used for omni and spot lights). The value is rounded up to the nearest power of 2.  
         *      
         *  **Note:** If this is set to `0`, no positional shadows will be visible at all. This can improve performance significantly on low-end systems by reducing both the CPU and GPU load (as fewer draw calls are needed to draw the scene without shadows).  
         */
        get positional_shadow_atlas_size(): int64
        set positional_shadow_atlas_size(value: int64)
        
        /** Use 16 bits for the omni/spot shadow depth map. Enabling this results in shadows having less precision and may result in shadow acne, but can lead to performance improvements on some devices. */
        get positional_shadow_atlas_16_bits(): boolean
        set positional_shadow_atlas_16_bits(value: boolean)
        
        /** The subdivision amount of the first quadrant on the shadow atlas. */
        get positional_shadow_atlas_quad_0(): int64
        set positional_shadow_atlas_quad_0(value: int64)
        
        /** The subdivision amount of the second quadrant on the shadow atlas. */
        get positional_shadow_atlas_quad_1(): int64
        set positional_shadow_atlas_quad_1(value: int64)
        
        /** The subdivision amount of the third quadrant on the shadow atlas. */
        get positional_shadow_atlas_quad_2(): int64
        set positional_shadow_atlas_quad_2(value: int64)
        
        /** The subdivision amount of the fourth quadrant on the shadow atlas. */
        get positional_shadow_atlas_quad_3(): int64
        set positional_shadow_atlas_quad_3(value: int64)
        
        /** The canvas transform of the viewport, useful for changing the on-screen positions of all child [CanvasItem]s. This is relative to the global canvas transform of the viewport. */
        get canvas_transform(): Transform2D
        set canvas_transform(value: Transform2D)
        
        /** The global canvas transform of the viewport. The canvas transform is relative to this. */
        get global_canvas_transform(): Transform2D
        set global_canvas_transform(value: Transform2D)
        
        /** The rendering layers in which this [Viewport] renders [CanvasItem] nodes.  
         *      
         *  **Note:** A [CanvasItem] does not inherit its parents' visibility layers. See [member CanvasItem.visibility_layer]'s description for details.  
         */
        get canvas_cull_mask(): int64
        set canvas_cull_mask(value: int64)
        
        /** If `true` and one of the following conditions are true: [member SubViewport.size_2d_override_stretch] and [member SubViewport.size_2d_override] are set, [member Window.content_scale_factor] is set and scaling is enabled, [member oversampling_override] is set, font and [DPITexture] oversampling are enabled. */
        get oversampling(): boolean
        set oversampling(value: boolean)
        
        /** If greater than zero, this value is used as the font oversampling factor, otherwise oversampling is equal to viewport scale. */
        get oversampling_override(): float64
        set oversampling_override(value: float64)
        
        /** Emitted when the size of the viewport is changed, whether by resizing of window, or some other means. */
        readonly size_changed: Signal<() => void>
        
        /** Emitted when a Control node grabs keyboard focus.  
         *      
         *  **Note:** A Control node losing focus doesn't cause this signal to be emitted.  
         */
        readonly gui_focus_changed: Signal<(node: Control) => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapViewport;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapViewport;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapViewportTexture extends __RPCMapTexture2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapViewportTexture extends __NameMapTexture2D {
    }
    /** Provides the content of a [Viewport] as a dynamic texture.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_viewporttexture.html  
     */
    class ViewportTexture extends Texture2D {
        constructor(identifier?: any)
        /** The path to the [Viewport] node to display. This is relative to the local scene root (see [method Resource.get_local_scene]), **not** to the nodes that use this texture.  
         *      
         *  **Note:** In the editor, this path is automatically updated when the target viewport or one of its ancestors is renamed or moved. At runtime, this path may not automatically update if the scene root cannot be found.  
         */
        get viewport_path(): NodePath
        set viewport_path(value: NodePath | string)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapViewportTexture;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapViewportTexture;
    }
    namespace VisibleOnScreenEnabler2D {
        enum EnableMode {
            /** Corresponds to [constant Node.PROCESS_MODE_INHERIT]. */
            ENABLE_MODE_INHERIT = 0,
            
            /** Corresponds to [constant Node.PROCESS_MODE_ALWAYS]. */
            ENABLE_MODE_ALWAYS = 1,
            
            /** Corresponds to [constant Node.PROCESS_MODE_WHEN_PAUSED]. */
            ENABLE_MODE_WHEN_PAUSED = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisibleOnScreenEnabler2D extends __RPCMapVisibleOnScreenNotifier2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisibleOnScreenEnabler2D extends __NameMapVisibleOnScreenNotifier2D {
    }
    /** A rectangular region of 2D space that, when visible on screen, enables a target node.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visibleonscreenenabler2d.html  
     */
    class VisibleOnScreenEnabler2D<Map extends NodePathMap = any> extends VisibleOnScreenNotifier2D<Map> {
        constructor(identifier?: any)
        /** Determines how the target node is enabled. Corresponds to [enum Node.ProcessMode]. When the node is disabled, it always uses [constant Node.PROCESS_MODE_DISABLED]. */
        get enable_mode(): int64
        set enable_mode(value: int64)
        
        /** The path to the target node, relative to the [VisibleOnScreenEnabler2D]. The target node is cached; it's only assigned when setting this property (if the [VisibleOnScreenEnabler2D] is inside the scene tree) and every time the [VisibleOnScreenEnabler2D] enters the scene tree. If the path is empty, no node will be affected. If the path is invalid, an error is also generated. */
        get enable_node_path(): NodePath
        set enable_node_path(value: NodePath | string)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisibleOnScreenEnabler2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisibleOnScreenEnabler2D;
    }
    namespace VisibleOnScreenEnabler3D {
        enum EnableMode {
            /** Corresponds to [constant Node.PROCESS_MODE_INHERIT]. */
            ENABLE_MODE_INHERIT = 0,
            
            /** Corresponds to [constant Node.PROCESS_MODE_ALWAYS]. */
            ENABLE_MODE_ALWAYS = 1,
            
            /** Corresponds to [constant Node.PROCESS_MODE_WHEN_PAUSED]. */
            ENABLE_MODE_WHEN_PAUSED = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisibleOnScreenEnabler3D extends __RPCMapVisibleOnScreenNotifier3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisibleOnScreenEnabler3D extends __NameMapVisibleOnScreenNotifier3D {
    }
    /** A box-shaped region of 3D space that, when visible on screen, enables a target node.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visibleonscreenenabler3d.html  
     */
    class VisibleOnScreenEnabler3D<Map extends NodePathMap = any> extends VisibleOnScreenNotifier3D<Map> {
        constructor(identifier?: any)
        /** Determines how the target node is enabled. Corresponds to [enum Node.ProcessMode]. When the node is disabled, it always uses [constant Node.PROCESS_MODE_DISABLED]. */
        get enable_mode(): int64
        set enable_mode(value: int64)
        
        /** The path to the target node, relative to the [VisibleOnScreenEnabler3D]. The target node is cached; it's only assigned when setting this property (if the [VisibleOnScreenEnabler3D] is inside the scene tree) and every time the [VisibleOnScreenEnabler3D] enters the scene tree. If the path is empty, no node will be affected. If the path is invalid, an error is also generated. */
        get enable_node_path(): NodePath
        set enable_node_path(value: NodePath | string)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisibleOnScreenEnabler3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisibleOnScreenEnabler3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisibleOnScreenNotifier2D extends __RPCMapNode2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisibleOnScreenNotifier2D extends __NameMapNode2D {
    }
    /** A rectangular region of 2D space that detects whether it is visible on screen.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visibleonscreennotifier2d.html  
     */
    class VisibleOnScreenNotifier2D<Map extends NodePathMap = any> extends Node2D<Map> {
        constructor(identifier?: any)
        /** If `true`, the bounding rectangle is on the screen.  
         *      
         *  **Note:** It takes one frame for the [VisibleOnScreenNotifier2D]'s visibility to be determined once added to the scene tree, so this method will always return `false` right after it is instantiated, before the draw pass.  
         */
        is_on_screen(): boolean
        
        /** The VisibleOnScreenNotifier2D's bounding rectangle. */
        get rect(): Rect2
        set rect(value: Rect2)
        
        /** If `true`, shows the rectangle area of [member rect] in the editor with a translucent magenta fill. Unlike changing the visibility of the VisibleOnScreenNotifier2D, this does not affect the screen culling detection. */
        get show_rect(): boolean
        set show_rect(value: boolean)
        
        /** Emitted when the VisibleOnScreenNotifier2D enters the screen. */
        readonly screen_entered: Signal<() => void>
        
        /** Emitted when the VisibleOnScreenNotifier2D exits the screen. */
        readonly screen_exited: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisibleOnScreenNotifier2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisibleOnScreenNotifier2D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisibleOnScreenNotifier3D extends __RPCMapVisualInstance3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisibleOnScreenNotifier3D extends __NameMapVisualInstance3D {
    }
    /** A box-shaped region of 3D space that detects whether it is visible on screen.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visibleonscreennotifier3d.html  
     */
    class VisibleOnScreenNotifier3D<Map extends NodePathMap = any> extends VisualInstance3D<Map> {
        constructor(identifier?: any)
        /** Returns `true` if the bounding box is on the screen.  
         *      
         *  **Note:** It takes one frame for the [VisibleOnScreenNotifier3D]'s visibility to be assessed once added to the scene tree, so this method will always return `false` right after it is instantiated.  
         */
        is_on_screen(): boolean
        
        /** The [VisibleOnScreenNotifier3D]'s bounding box. */
        get aabb(): AABB
        set aabb(value: AABB)
        
        /** Emitted when the [VisibleOnScreenNotifier3D] enters the screen. */
        readonly screen_entered: Signal<() => void>
        
        /** Emitted when the [VisibleOnScreenNotifier3D] exits the screen. */
        readonly screen_exited: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisibleOnScreenNotifier3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisibleOnScreenNotifier3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualInstance3D extends __RPCMapNode3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualInstance3D extends __NameMapNode3D {
    }
    /** Parent of all visual 3D nodes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualinstance3d.html  
     */
    class VisualInstance3D<Map extends NodePathMap = any> extends Node3D<Map> {
        constructor(identifier?: any)
        /* gdvirtual */ _get_aabb(): AABB
        
        /** Sets the resource that is instantiated by this [VisualInstance3D], which changes how the engine handles the [VisualInstance3D] under the hood. Equivalent to [method RenderingServer.instance_set_base]. */
        set_base(base: RID): void
        
        /** Returns the RID of the resource associated with this [VisualInstance3D]. For example, if the Node is a [MeshInstance3D], this will return the RID of the associated [Mesh]. */
        get_base(): RID
        
        /** Returns the RID of this instance. This RID is the same as the RID returned by [method RenderingServer.instance_create]. This RID is needed if you want to call [RenderingServer] functions directly on this [VisualInstance3D]. */
        get_instance(): RID
        
        /** Based on [param value], enables or disables the specified layer in the [member layers], given a [param layer_number] between 1 and 20. */
        set_layer_mask_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member layers] is enabled, given a [param layer_number] between 1 and 20. */
        get_layer_mask_value(layer_number: int64): boolean
        
        /** Returns the [AABB] (also known as the bounding box) for this [VisualInstance3D]. */
        get_aabb(): AABB
        
        /** The render layer(s) this [VisualInstance3D] is drawn on.  
         *  This object will only be visible for [Camera3D]s whose cull mask includes any of the render layers this [VisualInstance3D] is set to.  
         *  For [Light3D]s, this can be used to control which [VisualInstance3D]s are affected by a specific light. For [GPUParticles3D], this can be used to control which particles are effected by a specific attractor. For [Decal]s, this can be used to control which [VisualInstance3D]s are affected by a specific decal.  
         *  To adjust [member layers] more easily using a script, use [method get_layer_mask_value] and [method set_layer_mask_value].  
         *      
         *  **Note:** [VoxelGI], SDFGI and [LightmapGI] will always take all layers into account to determine what contributes to global illumination. If this is an issue, set [member GeometryInstance3D.gi_mode] to [constant GeometryInstance3D.GI_MODE_DISABLED] for meshes and [member Light3D.light_bake_mode] to [constant Light3D.BAKE_DISABLED] for lights to exclude them from global illumination.  
         */
        get layers(): int64
        set layers(value: int64)
        
        /** The amount by which the depth of this [VisualInstance3D] will be adjusted when sorting by depth. Uses the same units as the engine (which are typically meters). Adjusting it to a higher value will make the [VisualInstance3D] reliably draw on top of other [VisualInstance3D]s that are otherwise positioned at the same spot. To ensure it always draws on top of other objects around it (not positioned at the same spot), set the value to be greater than the distance between this [VisualInstance3D] and the other nearby [VisualInstance3D]s. */
        get sorting_offset(): float64
        set sorting_offset(value: float64)
        
        /** If `true`, the object is sorted based on the [AABB] center. The object will be sorted based on the global position otherwise.  
         *  The [AABB] center based sorting is generally more accurate for 3D models. The position based sorting instead allows to better control the drawing order when working with [GPUParticles3D] and [CPUParticles3D].  
         */
        get sorting_use_aabb_center(): boolean
        set sorting_use_aabb_center(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualInstance3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualInstance3D;
    }
    namespace VisualShader {
        enum Type {
            /** A vertex shader, operating on vertices. */
            TYPE_VERTEX = 0,
            
            /** A fragment shader, operating on fragments (pixels). */
            TYPE_FRAGMENT = 1,
            
            /** A shader for light calculations. */
            TYPE_LIGHT = 2,
            
            /** A function for the "start" stage of particle shader. */
            TYPE_START = 3,
            
            /** A function for the "process" stage of particle shader. */
            TYPE_PROCESS = 4,
            
            /** A function for the "collide" stage (particle collision handler) of particle shader. */
            TYPE_COLLIDE = 5,
            
            /** A function for the "start" stage of particle shader, with customized output. */
            TYPE_START_CUSTOM = 6,
            
            /** A function for the "process" stage of particle shader, with customized output. */
            TYPE_PROCESS_CUSTOM = 7,
            
            /** A shader for 3D environment's sky. */
            TYPE_SKY = 8,
            
            /** A compute shader that runs for each froxel of the volumetric fog map. */
            TYPE_FOG = 9,
            
            /** Represents the size of the [enum Type] enum. */
            TYPE_MAX = 10,
        }
        enum VaryingMode {
            /** Varying is passed from `Vertex` function to `Fragment` and `Light` functions. */
            VARYING_MODE_VERTEX_TO_FRAG_LIGHT = 0,
            
            /** Varying is passed from `Fragment` function to `Light` function. */
            VARYING_MODE_FRAG_TO_LIGHT = 1,
            
            /** Represents the size of the [enum VaryingMode] enum. */
            VARYING_MODE_MAX = 2,
        }
        enum VaryingType {
            /** Varying is of type [float]. */
            VARYING_TYPE_FLOAT = 0,
            
            /** Varying is of type [int]. */
            VARYING_TYPE_INT = 1,
            
            /** Varying is of type unsigned [int]. */
            VARYING_TYPE_UINT = 2,
            
            /** Varying is of type [Vector2]. */
            VARYING_TYPE_VECTOR_2D = 3,
            
            /** Varying is of type [Vector3]. */
            VARYING_TYPE_VECTOR_3D = 4,
            
            /** Varying is of type [Vector4]. */
            VARYING_TYPE_VECTOR_4D = 5,
            
            /** Varying is of type [bool]. */
            VARYING_TYPE_BOOLEAN = 6,
            
            /** Varying is of type [Transform3D]. */
            VARYING_TYPE_TRANSFORM = 7,
            
            /** Represents the size of the [enum VaryingType] enum. */
            VARYING_TYPE_MAX = 8,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShader extends __RPCMapShader {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShader extends __NameMapShader {
    }
    /** A custom shader program with a visual editor.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshader.html  
     */
    class VisualShader extends Shader {
        /** Indicates an invalid [VisualShader] node. */
        static readonly NODE_ID_INVALID = -1
        
        /** Indicates an output node of [VisualShader]. */
        static readonly NODE_ID_OUTPUT = 0
        constructor(identifier?: any)
        
        /** Sets the mode of this shader. */
        set_mode(mode: Shader.Mode): void
        
        /** Adds the specified [param node] to the shader. */
        add_node(type: VisualShader.Type, node: VisualShaderNode, position: Vector2, id: int64): void
        
        /** Returns the shader node instance with specified [param type] and [param id]. */
        get_node(type: VisualShader.Type, id: int64): null | VisualShaderNode
        
        /** Sets the position of the specified node. */
        set_node_position(type: VisualShader.Type, id: int64, position: Vector2): void
        
        /** Returns the position of the specified node within the shader graph. */
        get_node_position(type: VisualShader.Type, id: int64): Vector2
        
        /** Returns the list of all nodes in the shader with the specified type. */
        get_node_list(type: VisualShader.Type): PackedInt32Array
        
        /** Returns next valid node ID that can be added to the shader graph. */
        get_valid_node_id(type: VisualShader.Type): int64
        
        /** Removes the specified node from the shader. */
        remove_node(type: VisualShader.Type, id: int64): void
        
        /** Replaces the specified node with a node of new class type. */
        replace_node(type: VisualShader.Type, id: int64, new_class: StringName): void
        
        /** Returns `true` if the specified node and port connection exist. */
        is_node_connection(type: VisualShader.Type, from_node: int64, from_port: int64, to_node: int64, to_port: int64): boolean
        
        /** Returns `true` if the specified nodes and ports can be connected together. */
        can_connect_nodes(type: VisualShader.Type, from_node: int64, from_port: int64, to_node: int64, to_port: int64): boolean
        
        /** Connects the specified nodes and ports. */
        connect_nodes(type: VisualShader.Type, from_node: int64, from_port: int64, to_node: int64, to_port: int64): Error
        
        /** Connects the specified nodes and ports. */
        disconnect_nodes(type: VisualShader.Type, from_node: int64, from_port: int64, to_node: int64, to_port: int64): void
        
        /** Connects the specified nodes and ports, even if they can't be connected. Such connection is invalid and will not function properly. */
        connect_nodes_forced(type: VisualShader.Type, from_node: int64, from_port: int64, to_node: int64, to_port: int64): void
        
        /** Returns the list of connected nodes with the specified type. */
        get_node_connections(type: VisualShader.Type): GArray<GDictionary>
        
        /** Attaches the given node to the given frame. */
        attach_node_to_frame(type: VisualShader.Type, id: int64, frame: int64): void
        
        /** Detaches the given node from the frame it is attached to. */
        detach_node_from_frame(type: VisualShader.Type, id: int64): void
        
        /** Adds a new varying value node to the shader. */
        add_varying(name: string, mode: VisualShader.VaryingMode, type: VisualShader.VaryingType): void
        
        /** Removes a varying value node with the given [param name]. Prints an error if a node with this name is not found. */
        remove_varying(name: string): void
        
        /** Returns `true` if the shader has a varying with the given [param name]. */
        has_varying(name: string): boolean
        _set_preview_shader_parameter(name: string, value: any): void
        _get_preview_shader_parameter(name: string): any
        _has_preview_shader_parameter(name: string): boolean
        _update_shader(): void
        
        /** Deprecated. */
        get graph_offset(): Vector2
        set graph_offset(value: Vector2)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShader;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShader;
    }
    namespace VisualShaderNode {
        enum PortType {
            /** Floating-point scalar. Translated to [code skip-lint]float` type in shader code. */
            PORT_TYPE_SCALAR = 0,
            
            /** Integer scalar. Translated to [code skip-lint]int` type in shader code. */
            PORT_TYPE_SCALAR_INT = 1,
            
            /** Unsigned integer scalar. Translated to [code skip-lint]uint` type in shader code. */
            PORT_TYPE_SCALAR_UINT = 2,
            
            /** 2D vector of floating-point values. Translated to [code skip-lint]vec2` type in shader code. */
            PORT_TYPE_VECTOR_2D = 3,
            
            /** 3D vector of floating-point values. Translated to [code skip-lint]vec3` type in shader code. */
            PORT_TYPE_VECTOR_3D = 4,
            
            /** 4D vector of floating-point values. Translated to [code skip-lint]vec4` type in shader code. */
            PORT_TYPE_VECTOR_4D = 5,
            
            /** Boolean type. Translated to [code skip-lint]bool` type in shader code. */
            PORT_TYPE_BOOLEAN = 6,
            
            /** Transform type. Translated to [code skip-lint]mat4` type in shader code. */
            PORT_TYPE_TRANSFORM = 7,
            
            /** Sampler type. Translated to reference of sampler uniform in shader code. Can only be used for input ports in non-uniform nodes. */
            PORT_TYPE_SAMPLER = 8,
            
            /** Represents the size of the [enum PortType] enum. */
            PORT_TYPE_MAX = 9,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNode extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNode extends __NameMapResource {
    }
    /** Base class for [VisualShader] nodes. Not related to scene nodes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernode.html  
     */
    class VisualShaderNode extends Resource {
        constructor(identifier?: any)
        /** Returns the input port which should be connected by default when this node is created as a result of dragging a connection from an existing node to the empty space on the graph. */
        get_default_input_port(type: VisualShaderNode.PortType): int64
        _set_output_port_expanded(port: int64, _unnamed_arg1: boolean): void
        _is_output_port_expanded(_unnamed_arg0: int64): boolean
        
        /** Sets the default [param value] for the selected input [param port]. */
        set_input_port_default_value(port: int64, value: any, prev_value?: any /* = {} */): void
        
        /** Returns the default value of the input [param port]. */
        get_input_port_default_value(port: int64): any
        
        /** Removes the default value of the input [param port]. */
        remove_input_port_default_value(port: int64): void
        
        /** Clears the default input ports value. */
        clear_default_input_values(): void
        
        /** Sets the output port index which will be showed for preview. If set to `-1` no port will be open for preview. */
        get output_port_for_preview(): int64
        set output_port_for_preview(value: int64)
        get default_input_values(): GArray
        set default_input_values(value: GArray)
        get expanded_output_ports(): GArray
        set expanded_output_ports(value: GArray)
        
        /** Represents the index of the frame this node is linked to. If set to `-1` the node is not linked to any frame. */
        get linked_parent_graph_frame(): int64
        set linked_parent_graph_frame(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNode;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNode;
    }
    namespace VisualShaderNodeBillboard {
        enum BillboardType {
            /** Billboarding is disabled and the node does nothing. */
            BILLBOARD_TYPE_DISABLED = 0,
            
            /** A standard billboarding algorithm is enabled. */
            BILLBOARD_TYPE_ENABLED = 1,
            
            /** A billboarding algorithm to rotate around Y-axis is enabled. */
            BILLBOARD_TYPE_FIXED_Y = 2,
            
            /** A billboarding algorithm designed to use on particles is enabled. */
            BILLBOARD_TYPE_PARTICLES = 3,
            
            /** Represents the size of the [enum BillboardType] enum. */
            BILLBOARD_TYPE_MAX = 4,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeBillboard extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeBillboard extends __NameMapVisualShaderNode {
    }
    /** A node that controls how the object faces the camera to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodebillboard.html  
     */
    class VisualShaderNodeBillboard extends VisualShaderNode {
        constructor(identifier?: any)
        /** Controls how the object faces the camera. */
        get billboard_type(): int64
        set billboard_type(value: int64)
        
        /** If `true`, the shader will keep the scale set for the mesh. Otherwise, the scale is lost when billboarding. */
        get keep_scale(): boolean
        set keep_scale(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeBillboard;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeBillboard;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeBooleanConstant extends __RPCMapVisualShaderNodeConstant {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeBooleanConstant extends __NameMapVisualShaderNodeConstant {
    }
    /** A boolean constant to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodebooleanconstant.html  
     */
    class VisualShaderNodeBooleanConstant extends VisualShaderNodeConstant {
        constructor(identifier?: any)
        /** A boolean constant which represents a state of this node. */
        get constant(): boolean
        set constant(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeBooleanConstant;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeBooleanConstant;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeBooleanParameter extends __RPCMapVisualShaderNodeParameter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeBooleanParameter extends __NameMapVisualShaderNodeParameter {
    }
    /** A boolean parameter to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodebooleanparameter.html  
     */
    class VisualShaderNodeBooleanParameter extends VisualShaderNodeParameter {
        constructor(identifier?: any)
        /** Enables usage of the [member default_value]. */
        get default_value_enabled(): boolean
        set default_value_enabled(value: boolean)
        
        /** A default value to be assigned within the shader. */
        get default_value(): boolean
        set default_value(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeBooleanParameter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeBooleanParameter;
    }
    namespace VisualShaderNodeClamp {
        enum OpType {
            /** A floating-point scalar. */
            OP_TYPE_FLOAT = 0,
            
            /** An integer scalar. */
            OP_TYPE_INT = 1,
            
            /** An unsigned integer scalar. */
            OP_TYPE_UINT = 2,
            
            /** A 2D vector type. */
            OP_TYPE_VECTOR_2D = 3,
            
            /** A 3D vector type. */
            OP_TYPE_VECTOR_3D = 4,
            
            /** A 4D vector type. */
            OP_TYPE_VECTOR_4D = 5,
            
            /** Represents the size of the [enum OpType] enum. */
            OP_TYPE_MAX = 6,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeClamp extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeClamp extends __NameMapVisualShaderNode {
    }
    /** Clamps a value within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeclamp.html  
     */
    class VisualShaderNodeClamp extends VisualShaderNode {
        constructor(identifier?: any)
        /** A type of operands and returned value. */
        get op_type(): int64
        set op_type(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeClamp;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeClamp;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeColorConstant extends __RPCMapVisualShaderNodeConstant {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeColorConstant extends __NameMapVisualShaderNodeConstant {
    }
    /** A [Color] constant to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodecolorconstant.html  
     */
    class VisualShaderNodeColorConstant extends VisualShaderNodeConstant {
        constructor(identifier?: any)
        /** A [Color] constant which represents a state of this node. */
        get constant(): Color
        set constant(value: Color)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeColorConstant;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeColorConstant;
    }
    namespace VisualShaderNodeColorFunc {
        enum Function {
            /** Converts the color to grayscale using the following formula:  
             *    
             */
            FUNC_GRAYSCALE = 0,
            
            /** Converts HSV vector to RGB equivalent. */
            FUNC_HSV2RGB = 1,
            
            /** Converts RGB vector to HSV equivalent. */
            FUNC_RGB2HSV = 2,
            
            /** Applies sepia tone effect using the following formula:  
             *    
             */
            FUNC_SEPIA = 3,
            
            /** Converts color from linear encoding to nonlinear sRGB encoding using the following formula:  
             *    
             *  The Compatibility renderer uses a simpler formula:  
             *    
             */
            FUNC_LINEAR_TO_SRGB = 4,
            
            /** Converts color from nonlinear sRGB encoding to linear encoding using the following formula:  
             *    
             *  The Compatibility renderer uses a simpler formula:  
             *    
             */
            FUNC_SRGB_TO_LINEAR = 5,
            
            /** Represents the size of the [enum Function] enum. */
            FUNC_MAX = 6,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeColorFunc extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeColorFunc extends __NameMapVisualShaderNode {
    }
    /** A [Color] function to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodecolorfunc.html  
     */
    class VisualShaderNodeColorFunc extends VisualShaderNode {
        constructor(identifier?: any)
        /** A function to be applied to the input color. */
        get "function"(): int64
        set "function"(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeColorFunc;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeColorFunc;
    }
    namespace VisualShaderNodeColorOp {
        enum Operator {
            /** Produce a screen effect with the following formula:  
             *    
             */
            OP_SCREEN = 0,
            
            /** Produce a difference effect with the following formula:  
             *    
             */
            OP_DIFFERENCE = 1,
            
            /** Produce a darken effect with the following formula:  
             *    
             */
            OP_DARKEN = 2,
            
            /** Produce a lighten effect with the following formula:  
             *    
             */
            OP_LIGHTEN = 3,
            
            /** Produce an overlay effect with the following formula:  
             *    
             */
            OP_OVERLAY = 4,
            
            /** Produce a dodge effect with the following formula:  
             *    
             */
            OP_DODGE = 5,
            
            /** Produce a burn effect with the following formula:  
             *    
             */
            OP_BURN = 6,
            
            /** Produce a soft light effect with the following formula:  
             *    
             */
            OP_SOFT_LIGHT = 7,
            
            /** Produce a hard light effect with the following formula:  
             *    
             */
            OP_HARD_LIGHT = 8,
            
            /** Represents the size of the [enum Operator] enum. */
            OP_MAX = 9,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeColorOp extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeColorOp extends __NameMapVisualShaderNode {
    }
    /** A [Color] operator to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodecolorop.html  
     */
    class VisualShaderNodeColorOp extends VisualShaderNode {
        constructor(identifier?: any)
        /** An operator to be applied to the inputs. */
        get operator(): int64
        set operator(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeColorOp;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeColorOp;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeColorParameter extends __RPCMapVisualShaderNodeParameter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeColorParameter extends __NameMapVisualShaderNodeParameter {
    }
    /** A [Color] parameter to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodecolorparameter.html  
     */
    class VisualShaderNodeColorParameter extends VisualShaderNodeParameter {
        constructor(identifier?: any)
        /** Enables usage of the [member default_value]. */
        get default_value_enabled(): boolean
        set default_value_enabled(value: boolean)
        
        /** A default value to be assigned within the shader. */
        get default_value(): Color
        set default_value(value: Color)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeColorParameter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeColorParameter;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeComment extends __RPCMapVisualShaderNodeFrame {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeComment extends __NameMapVisualShaderNodeFrame {
    }
    /** Only exists for compatibility. Use [VisualShaderNodeFrame] as a replacement.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodecomment.html  
     */
    class VisualShaderNodeComment extends VisualShaderNodeFrame {
        constructor(identifier?: any)
        /** This property only exists to preserve data authored in earlier versions of Godot. It has currently no function. */
        get description(): string
        set description(value: string)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeComment;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeComment;
    }
    namespace VisualShaderNodeCompare {
        enum ComparisonType {
            /** A floating-point scalar. */
            CTYPE_SCALAR = 0,
            
            /** An integer scalar. */
            CTYPE_SCALAR_INT = 1,
            
            /** An unsigned integer scalar. */
            CTYPE_SCALAR_UINT = 2,
            
            /** A 2D vector type. */
            CTYPE_VECTOR_2D = 3,
            
            /** A 3D vector type. */
            CTYPE_VECTOR_3D = 4,
            
            /** A 4D vector type. */
            CTYPE_VECTOR_4D = 5,
            
            /** A boolean type. */
            CTYPE_BOOLEAN = 6,
            
            /** A transform (`mat4`) type. */
            CTYPE_TRANSFORM = 7,
            
            /** Represents the size of the [enum ComparisonType] enum. */
            CTYPE_MAX = 8,
        }
        enum Function {
            /** Comparison for equality (`a == b`). */
            FUNC_EQUAL = 0,
            
            /** Comparison for inequality (`a != b`). */
            FUNC_NOT_EQUAL = 1,
            
            /** Comparison for greater than (`a > b`). Cannot be used if [member type] set to [constant CTYPE_BOOLEAN] or [constant CTYPE_TRANSFORM]. */
            FUNC_GREATER_THAN = 2,
            
            /** Comparison for greater than or equal (`a >= b`). Cannot be used if [member type] set to [constant CTYPE_BOOLEAN] or [constant CTYPE_TRANSFORM]. */
            FUNC_GREATER_THAN_EQUAL = 3,
            
            /** Comparison for less than (`a < b`). Cannot be used if [member type] set to [constant CTYPE_BOOLEAN] or [constant CTYPE_TRANSFORM]. */
            FUNC_LESS_THAN = 4,
            
            /** Comparison for less than or equal (`a <= b`). Cannot be used if [member type] set to [constant CTYPE_BOOLEAN] or [constant CTYPE_TRANSFORM]. */
            FUNC_LESS_THAN_EQUAL = 5,
            
            /** Represents the size of the [enum Function] enum. */
            FUNC_MAX = 6,
        }
        enum Condition {
            /** The result will be `true` if all components in the vector satisfy the comparison condition. */
            COND_ALL = 0,
            
            /** The result will be `true` if any component in the vector satisfies the comparison condition. */
            COND_ANY = 1,
            
            /** Represents the size of the [enum Condition] enum. */
            COND_MAX = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeCompare extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeCompare extends __NameMapVisualShaderNode {
    }
    /** A comparison function for common types within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodecompare.html  
     */
    class VisualShaderNodeCompare extends VisualShaderNode {
        constructor(identifier?: any)
        /** The type to be used in the comparison. */
        get type(): int64
        set type(value: int64)
        
        /** A comparison function. */
        get "function"(): int64
        set "function"(value: int64)
        
        /** Extra condition which is applied if [member type] is set to [constant CTYPE_VECTOR_3D]. */
        get condition(): int64
        set condition(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeCompare;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeCompare;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeConstant extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeConstant extends __NameMapVisualShaderNode {
    }
    /** A base type for the constants within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeconstant.html  
     */
    class VisualShaderNodeConstant extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeConstant;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeConstant;
    }
    namespace VisualShaderNodeCubemap {
        enum Source {
            /** Use the [Cubemap] set via [member cube_map]. If this is set to [member source], the `samplerCube` port is ignored. */
            SOURCE_TEXTURE = 0,
            
            /** Use the [Cubemap] sampler reference passed via the `samplerCube` port. If this is set to [member source], the [member cube_map] texture is ignored. */
            SOURCE_PORT = 1,
            
            /** Represents the size of the [enum Source] enum. */
            SOURCE_MAX = 2,
        }
        enum TextureType {
            /** No hints are added to the uniform declaration. */
            TYPE_DATA = 0,
            
            /** Adds `source_color` as hint to the uniform declaration for proper conversion from nonlinear sRGB encoding to linear encoding. */
            TYPE_COLOR = 1,
            
            /** Adds `hint_normal` as hint to the uniform declaration, which internally converts the texture for proper usage as normal map. */
            TYPE_NORMAL_MAP = 2,
            
            /** Represents the size of the [enum TextureType] enum. */
            TYPE_MAX = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeCubemap extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeCubemap extends __NameMapVisualShaderNode {
    }
    /** A [Cubemap] sampling node to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodecubemap.html  
     */
    class VisualShaderNodeCubemap extends VisualShaderNode {
        constructor(identifier?: any)
        /** Defines which source should be used for the sampling. */
        get source(): int64
        set source(value: int64)
        
        /** The [Cubemap] texture to sample when using [constant SOURCE_TEXTURE] as [member source]. */
        get cube_map(): null | Cubemap | CompressedCubemap | PlaceholderCubemap | TextureCubemapRD
        set cube_map(value: null | Cubemap | CompressedCubemap | PlaceholderCubemap | TextureCubemapRD)
        
        /** Defines the type of data provided by the source texture. */
        get texture_type(): int64
        set texture_type(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeCubemap;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeCubemap;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeCubemapParameter extends __RPCMapVisualShaderNodeTextureParameter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeCubemapParameter extends __NameMapVisualShaderNodeTextureParameter {
    }
    /** A [Cubemap] parameter node to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodecubemapparameter.html  
     */
    class VisualShaderNodeCubemapParameter extends VisualShaderNodeTextureParameter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeCubemapParameter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeCubemapParameter;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeCurveTexture extends __RPCMapVisualShaderNodeResizableBase {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeCurveTexture extends __NameMapVisualShaderNodeResizableBase {
    }
    /** Performs a [CurveTexture] lookup within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodecurvetexture.html  
     */
    class VisualShaderNodeCurveTexture extends VisualShaderNodeResizableBase {
        constructor(identifier?: any)
        /** The source texture. */
        get texture(): null | CurveTexture
        set texture(value: null | CurveTexture)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeCurveTexture;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeCurveTexture;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeCurveXYZTexture extends __RPCMapVisualShaderNodeResizableBase {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeCurveXYZTexture extends __NameMapVisualShaderNodeResizableBase {
    }
    /** Performs a [CurveXYZTexture] lookup within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodecurvexyztexture.html  
     */
    class VisualShaderNodeCurveXYZTexture extends VisualShaderNodeResizableBase {
        constructor(identifier?: any)
        /** The source texture. */
        get texture(): null | CurveXYZTexture
        set texture(value: null | CurveXYZTexture)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeCurveXYZTexture;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeCurveXYZTexture;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeCustom extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeCustom extends __NameMapVisualShaderNode {
    }
    /** Virtual class to define custom [VisualShaderNode]s for use in the Visual Shader Editor.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodecustom.html  
     */
    class VisualShaderNodeCustom extends VisualShaderNode {
        constructor(identifier?: any)
        /** Override this method to define the name of the associated custom node in the Visual Shader Editor's members dialog and graph.  
         *  Defining this method is **optional**, but recommended. If not overridden, the node will be named as "Unnamed".  
         */
        /* gdvirtual */ _get_name(): string
        
        /** Override this method to define the description of the associated custom node in the Visual Shader Editor's members dialog.  
         *  Defining this method is **optional**.  
         */
        /* gdvirtual */ _get_description(): string
        
        /** Override this method to define the path to the associated custom node in the Visual Shader Editor's members dialog. The path may look like `"MyGame/MyFunctions/Noise"`.  
         *  Defining this method is **optional**. If not overridden, the node will be filed under the "Addons" category.  
         */
        /* gdvirtual */ _get_category(): string
        
        /** Override this method to define the return icon of the associated custom node in the Visual Shader Editor's members dialog.  
         *  Defining this method is **optional**. If not overridden, no return icon is shown.  
         */
        /* gdvirtual */ _get_return_icon_type(): VisualShaderNode.PortType
        
        /** Override this method to define the number of input ports of the associated custom node.  
         *  Defining this method is **required**. If not overridden, the node has no input ports.  
         */
        /* gdvirtual */ _get_input_port_count(): int64
        
        /** Override this method to define the returned type of each input port of the associated custom node.  
         *  Defining this method is **optional**, but recommended. If not overridden, input ports will return the [constant VisualShaderNode.PORT_TYPE_SCALAR] type.  
         */
        /* gdvirtual */ _get_input_port_type(port: int64): VisualShaderNode.PortType
        
        /** Override this method to define the names of input ports of the associated custom node. The names are used both for the input slots in the editor and as identifiers in the shader code, and are passed in the `input_vars` array in [method _get_code].  
         *  Defining this method is **optional**, but recommended. If not overridden, input ports are named as `"in" + str(port)`.  
         */
        /* gdvirtual */ _get_input_port_name(port: int64): string
        
        /** Override this method to define the default value for the specified input port. Prefer use this over [method VisualShaderNode.set_input_port_default_value].  
         *  Defining this method is **required**. If not overridden, the node has no default values for their input ports.  
         */
        /* gdvirtual */ _get_input_port_default_value(port: int64): any
        
        /** Override this method to define the input port which should be connected by default when this node is created as a result of dragging a connection from an existing node to the empty space on the graph.  
         *  Defining this method is **optional**. If not overridden, the connection will be created to the first valid port.  
         */
        /* gdvirtual */ _get_default_input_port(type: VisualShaderNode.PortType): int64
        
        /** Override this method to define the number of output ports of the associated custom node.  
         *  Defining this method is **required**. If not overridden, the node has no output ports.  
         */
        /* gdvirtual */ _get_output_port_count(): int64
        
        /** Override this method to define the returned type of each output port of the associated custom node.  
         *  Defining this method is **optional**, but recommended. If not overridden, output ports will return the [constant VisualShaderNode.PORT_TYPE_SCALAR] type.  
         */
        /* gdvirtual */ _get_output_port_type(port: int64): VisualShaderNode.PortType
        
        /** Override this method to define the names of output ports of the associated custom node. The names are used both for the output slots in the editor and as identifiers in the shader code, and are passed in the `output_vars` array in [method _get_code].  
         *  Defining this method is **optional**, but recommended. If not overridden, output ports are named as `"out" + str(port)`.  
         */
        /* gdvirtual */ _get_output_port_name(port: int64): string
        
        /** Override this method to define the number of the properties.  
         *  Defining this method is **optional**.  
         */
        /* gdvirtual */ _get_property_count(): int64
        
        /** Override this method to define the names of the property of the associated custom node.  
         *  Defining this method is **optional**.  
         */
        /* gdvirtual */ _get_property_name(index: int64): string
        
        /** Override this method to define the default index of the property of the associated custom node.  
         *  Defining this method is **optional**.  
         */
        /* gdvirtual */ _get_property_default_index(index: int64): int64
        
        /** Override this method to define the options inside the drop-down list property of the associated custom node.  
         *  Defining this method is **optional**.  
         */
        /* gdvirtual */ _get_property_options(index: int64): PackedStringArray
        
        /** Override this method to define the actual shader code of the associated custom node. The shader code should be returned as a string, which can have multiple lines (the `"""` multiline string construct can be used for convenience).  
         *  The [param input_vars] and [param output_vars] arrays contain the string names of the various input and output variables, as defined by `_get_input_*` and `_get_output_*` virtual methods in this class.  
         *  The output ports can be assigned values in the shader code. For example, `return output_vars[0] + " = " + input_vars[0] + ";"`.  
         *  You can customize the generated code based on the shader [param mode] and/or [param type].  
         *  Defining this method is **required**.  
         */
        /* gdvirtual */ _get_code(input_vars: GArray<string>, output_vars: GArray<string>, mode: Shader.Mode, type: VisualShader.Type): string
        
        /** Override this method to add a shader code to the beginning of each shader function (once). The shader code should be returned as a string, which can have multiple lines (the `"""` multiline string construct can be used for convenience).  
         *  If there are multiple custom nodes of different types which use this feature the order of each insertion is undefined.  
         *  You can customize the generated code based on the shader [param mode] and/or [param type].  
         *  Defining this method is **optional**.  
         */
        /* gdvirtual */ _get_func_code(mode: Shader.Mode, type: VisualShader.Type): string
        
        /** Override this method to add shader code on top of the global shader, to define your own standard library of reusable methods, varyings, constants, uniforms, etc. The shader code should be returned as a string, which can have multiple lines (the `"""` multiline string construct can be used for convenience).  
         *  Be careful with this functionality as it can cause name conflicts with other custom nodes, so be sure to give the defined entities unique names.  
         *  You can customize the generated code based on the shader [param mode].  
         *  Defining this method is **optional**.  
         */
        /* gdvirtual */ _get_global_code(mode: Shader.Mode): string
        
        /** Override this method to enable the high-end mark in the Visual Shader Editor's members dialog. This should return `true` for nodes that only work when using the Forward+ and Mobile renderers.  
         *  Defining this method is **optional**. If not overridden, it's `false`, which indicates this node works with all renderers (including Compatibility).  
         */
        /* gdvirtual */ _is_highend(): boolean
        
        /** Override this method to prevent the node to be visible in the member dialog for the certain [param mode] and/or [param type].  
         *  Defining this method is **optional**. If not overridden, it's `true`.  
         */
        /* gdvirtual */ _is_available(mode: Shader.Mode, type: VisualShader.Type): boolean
        _set_input_port_default_value(port: int64, value: any): void
        _set_option_index(option: int64, value: int64): void
        
        /** Returns the selected index of the drop-down list option within a graph. You may use this function to define the specific behavior in the [method _get_code] or [method _get_global_code]. */
        get_option_index(option: int64): int64
        get initialized(): boolean
        set initialized(value: boolean)
        get properties(): string
        set properties(value: string)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeCustom;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeCustom;
    }
}
