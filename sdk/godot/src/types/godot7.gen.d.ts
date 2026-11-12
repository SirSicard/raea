// AUTO-GENERATED
declare module "godot" {
    namespace Resource {
        enum DeepDuplicateMode {
            /** No subresorces at all are duplicated. This is useful even in a deep duplication to have all the arrays and dictionaries duplicated but still pointing to the original resources. */
            DEEP_DUPLICATE_NONE = 0,
            
            /** Only subresources without a path or with a scene-local path will be duplicated. */
            DEEP_DUPLICATE_INTERNAL = 1,
            
            /** Every subresource found will be duplicated, even if it has a non-local path. In other words, even potentially big resources stored separately will be duplicated. */
            DEEP_DUPLICATE_ALL = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResource extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResource extends __NameMapRefCounted {
    }
    /** Base class for serializable objects.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resource.html  
     */
    class Resource extends RefCounted {
        constructor(identifier?: any)
        /** Override this method to customize the newly duplicated resource created from [method PackedScene.instantiate], if the original's [member resource_local_to_scene] is set to `true`.  
         *  **Example:** Set a random `damage` value to every local resource from an instantiated scene:  
         *    
         */
        /* gdvirtual */ _setup_local_to_scene(): void
        
        /** Override this method to return a custom [RID] when [method get_rid] is called. */
        /* gdvirtual */ _get_rid(): RID
        
        /** For resources that store state in non-exported properties, such as via [method Object._validate_property] or [method Object._get_property_list], this method must be implemented to clear them. */
        /* gdvirtual */ _reset_state(): void
        
        /** Override this method to execute additional logic after [method set_path_cache] is called on this object. */
        /* gdvirtual */ _set_path_cache(path: string): void
        
        /** Sets the [member resource_path] to [param path], potentially overriding an existing cache entry for this path. Further attempts to load an overridden resource by path will instead return this resource. */
        take_over_path(path: string): void
        
        /** Sets the resource's path to [param path] without involving the resource cache. Useful for handling [enum ResourceFormatLoader.CacheMode] values when implementing a custom resource format by extending [ResourceFormatLoader] and [ResourceFormatSaver]. */
        set_path_cache(path: string): void
        
        /** Returns the [RID] of this resource (or an empty RID). Many resources (such as [Texture2D], [Mesh], and so on) are high-level abstractions of resources stored in a specialized server ([DisplayServer], [RenderingServer], etc.), so this function will return the original [RID]. */
        get_rid(): RID
        
        /** If [member resource_local_to_scene] is set to `true` and the resource has been loaded from a [PackedScene] instantiation, returns the root [Node] of the scene where this resource is used. Otherwise, returns `null`. */
        get_local_scene(): null | Node
        
        /** Calls [method _setup_local_to_scene]. If [member resource_local_to_scene] is set to `true`, this method is automatically called from [method PackedScene.instantiate] by the newly duplicated resource within the scene instance. */
        setup_local_to_scene(): void
        
        /** Makes the resource clear its non-exported properties. See also [method _reset_state]. Useful when implementing a custom resource format by extending [ResourceFormatLoader] and [ResourceFormatSaver]. */
        reset_state(): void
        
        /** In the internal cache for scene-unique IDs, sets the ID of this resource to [param id] for the scene at [param path]. If [param id] is empty, the cache entry for [param path] is cleared. Useful to keep scene-unique IDs the same when implementing a VCS-friendly custom resource format by extending [ResourceFormatLoader] and [ResourceFormatSaver].  
         *      
         *  **Note:** This method is only implemented when running in an editor context.  
         */
        set_id_for_path(path: string, id: string): void
        
        /** From the internal cache for scene-unique IDs, returns the ID of this resource for the scene at [param path]. If there is no entry, an empty string is returned. Useful to keep scene-unique IDs the same when implementing a VCS-friendly custom resource format by extending [ResourceFormatLoader] and [ResourceFormatSaver].  
         *      
         *  **Note:** This method is only implemented when running in an editor context. At runtime, it returns an empty string.  
         */
        get_id_for_path(path: string): string
        
        /** Returns `true` if the resource is saved on disk as a part of another resource's file. */
        is_built_in(): boolean
        
        /** Generates a unique identifier for a resource to be contained inside a [PackedScene], based on the current date, time, and a random value. The returned string is only composed of letters (`a` to `y`) and numbers (`0` to `8`). See also [member resource_scene_unique_id]. */
        static generate_scene_unique_id(): string
        
        /** Emits the [signal changed] signal. This method is called automatically for some built-in resources.  
         *      
         *  **Note:** For custom resources, it's recommended to call this method whenever a meaningful change occurs, such as a modified property. This ensures that custom [Object]s depending on the resource are properly updated.  
         *    
         */
        emit_changed(): void
        
        /** Duplicates this resource, returning a new resource with its `export`ed or [constant PROPERTY_USAGE_STORAGE] properties copied from the original.  
         *  If [param deep] is `false`, a **shallow** copy is returned: nested [Array], [Dictionary], and [Resource] properties are not duplicated and are shared with the original resource.  
         *  If [param deep] is `true`, a **deep** copy is returned: all nested arrays, dictionaries, and packed arrays are also duplicated (recursively). Any [Resource] found inside will only be duplicated if it's local, like [constant DEEP_DUPLICATE_INTERNAL] used with [method duplicate_deep].  
         *  The following exceptions apply:  
         *  - Subresource properties with the [constant PROPERTY_USAGE_ALWAYS_DUPLICATE] flag are always duplicated (recursively or not, depending on [param deep]).  
         *  - Subresource properties with the [constant PROPERTY_USAGE_NEVER_DUPLICATE] flag are never duplicated.  
         *      
         *  **Note:** For custom resources, this method will fail if [method Object._init] has been defined with required parameters.  
         *      
         *  **Note:** When duplicating with [param deep] set to `true`, each resource found, including the one on which this method is called, will be only duplicated once and referenced as many times as needed in the duplicate. For instance, if you are duplicating resource A that happens to have resource B referenced twice, you'll get a new resource A' referencing a new resource B' twice.  
         */
        duplicate(deep?: boolean /* = false */): this
        
        /** Duplicates this resource, deeply, like [method duplicate] when passing `true`, with extra control over how subresources are handled. */
        duplicate_deep(deep_subresources_mode?: Resource.DeepDuplicateMode /* = 1 */): null | Resource
        
        /** If `true`, the resource is duplicated for each instance of all scenes using it. At run-time, the resource can be modified in one scene without affecting other instances (see [method PackedScene.instantiate]).  
         *      
         *  **Note:** Changing this property at run-time has no effect on already created duplicate resources.  
         */
        get resource_local_to_scene(): boolean
        set resource_local_to_scene(value: boolean)
        
        /** The unique path to this resource. If it has been saved to disk, the value will be its filepath. If the resource is exclusively contained within a scene, the value will be the [PackedScene]'s filepath, followed by a unique identifier.  
         *      
         *  **Note:** Setting this property manually may fail if a resource with the same path has already been previously loaded. If necessary, use [method take_over_path].  
         */
        get resource_path(): string
        set resource_path(value: string)
        
        /** An optional name for this resource. When defined, its value is displayed to represent the resource in the Inspector dock. For built-in scripts, the name is displayed as part of the tab name in the script editor.  
         *      
         *  **Note:** Some resource formats do not support resource names. You can still set the name in the editor or via code, but it will be lost when the resource is reloaded. For example, only built-in scripts can have a resource name, while scripts stored in separate files cannot.  
         */
        get resource_name(): string
        set resource_name(value: string)
        
        /** A unique identifier relative to the this resource's scene. If left empty, the ID is automatically generated when this resource is saved inside a [PackedScene]. If the resource is not inside a scene, this property is empty by default.  
         *      
         *  **Note:** When the [PackedScene] is saved, if multiple resources in the same scene use the same ID, only the earliest resource in the scene hierarchy keeps the original ID. The other resources are assigned new IDs from [method generate_scene_unique_id].  
         *      
         *  **Note:** Setting this property does not emit the [signal changed] signal.  
         *  **Warning:** When setting, the ID must only consist of letters, numbers, and underscores. Otherwise, it will fail and default to a randomly generated ID.  
         */
        get resource_scene_unique_id(): string
        set resource_scene_unique_id(value: string)
        
        /** Emitted when the resource changes, usually when one of its properties is modified. See also [method emit_changed].  
         *      
         *  **Note:** This signal is not emitted automatically for properties of custom resources. If necessary, a setter needs to be created to emit the signal.  
         */
        readonly changed: Signal<() => void>
        
        /** Emitted by a newly duplicated resource with [member resource_local_to_scene] set to `true`. */
        readonly setup_local_to_scene_requested: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResource;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResource;
    }
    namespace ResourceFormatLoader {
        enum CacheMode {
            /** Neither the main resource (the one requested to be loaded) nor any of its subresources are retrieved from cache nor stored into it. Dependencies (external resources) are loaded with [constant CACHE_MODE_REUSE]. */
            CACHE_MODE_IGNORE = 0,
            
            /** The main resource (the one requested to be loaded), its subresources, and its dependencies (external resources) are retrieved from cache if present, instead of loaded. Those not cached are loaded and then stored into the cache. The same rules are propagated recursively down the tree of dependencies (external resources). */
            CACHE_MODE_REUSE = 1,
            
            /** Like [constant CACHE_MODE_REUSE], but the cache is checked for the main resource (the one requested to be loaded) as well as for each of its subresources. Those already in the cache, as long as the loaded and cached types match, have their data refreshed from storage into the already existing instances. Otherwise, they are recreated as completely new objects. */
            CACHE_MODE_REPLACE = 2,
            
            /** Like [constant CACHE_MODE_IGNORE], but propagated recursively down the tree of dependencies (external resources). */
            CACHE_MODE_IGNORE_DEEP = 3,
            
            /** Like [constant CACHE_MODE_REPLACE], but propagated recursively down the tree of dependencies (external resources). */
            CACHE_MODE_REPLACE_DEEP = 4,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceFormatLoader extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceFormatLoader extends __NameMapRefCounted {
    }
    /** Loads a specific resource type from a file.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceformatloader.html  
     */
    class ResourceFormatLoader extends RefCounted {
        constructor(identifier?: any)
        /** Gets the list of extensions for files this loader is able to read. */
        /* gdvirtual */ _get_recognized_extensions(): PackedStringArray
        
        /** Tells whether or not this loader should load a resource from its resource path for a given type.  
         *  If it is not implemented, the default behavior returns whether the path's extension is within the ones provided by [method _get_recognized_extensions], and if the type is within the ones provided by [method _get_resource_type].  
         */
        /* gdvirtual */ _recognize_path(path: string, type: StringName): boolean
        
        /** Tells which resource class this loader can load.  
         *      
         *  **Note:** Custom resource types defined by scripts aren't known by the [ClassDB], so you might just handle `"Resource"` for them.  
         */
        /* gdvirtual */ _handles_type(type: StringName): boolean
        
        /** Gets the class name of the resource associated with the given path. If the loader cannot handle it, it should return `""`.  
         *      
         *  **Note:** Custom resource types defined by scripts aren't known by the [ClassDB], so you might just return `"Resource"` for them.  
         */
        /* gdvirtual */ _get_resource_type(path: string): string
        
        /** Returns the script class name associated with the [Resource] under the given [param path]. If the resource has no script or the script isn't a named class, it should return `""`. */
        /* gdvirtual */ _get_resource_script_class(path: string): string
        
        /** Should return the unique ID for the resource associated with the given path. If this method is not overridden, a `.uid` file is generated along with the resource file, containing the unique ID. */
        /* gdvirtual */ _get_resource_uid(path: string): int64
        
        /** Should return the dependencies for the resource at the given [param path]. Each dependency is a string composed of one to three sections separated by `::`, with trailing empty sections omitted:  
         *  - The first section should contain the UID if the resource has one. Otherwise, it should contain the file path.  
         *  - The second section should contain the class name of the dependency if [param add_types] is `true`. Otherwise, it should be empty.  
         *  - The third section should contain the fallback path if the resource has a UID. Otherwise, it should be empty.  
         *    
         *      
         *  **Note:** Custom resource types defined by scripts aren't known by the [ClassDB], so `"Resource"` can be used for the class name.  
         */
        /* gdvirtual */ _get_dependencies(path: string, add_types: boolean): PackedStringArray
        
        /** If implemented, renames dependencies within the given resource and saves it. [param renames] is a dictionary `{ String => String }` mapping old dependency paths to new paths.  
         *  Returns [constant OK] on success, or an [enum Error] constant in case of failure.  
         */
        /* gdvirtual */ _rename_dependencies(path: string, renames: GDictionary): Error
        /* gdvirtual */ _exists(path: string): boolean
        /* gdvirtual */ _get_classes_used(path: string): PackedStringArray
        
        /** Loads a resource when the engine finds this loader to be compatible. If the loaded resource is the result of an import, [param original_path] will target the source file. Returns a [Resource] object on success, or an [enum Error] constant in case of failure.  
         *  The [param cache_mode] property defines whether and how the cache should be used or updated when loading the resource. See [enum CacheMode] for details.  
         */
        /* gdvirtual */ _load(path: string, original_path: string, use_sub_threads: boolean, cache_mode: int64): any
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceFormatLoader;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceFormatLoader;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceFormatSaver extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceFormatSaver extends __NameMapRefCounted {
    }
    /** Saves a specific resource type to a file.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceformatsaver.html  
     */
    class ResourceFormatSaver extends RefCounted {
        constructor(identifier?: any)
        /** Saves the given resource object to a file at the target [param path]. [param flags] is a bitmask composed with [enum ResourceSaver.SaverFlags] constants.  
         *  Returns [constant OK] on success, or an [enum Error] constant in case of failure.  
         */
        /* gdvirtual */ _save(resource: Resource, path: string, flags: int64): Error
        
        /** Sets a new UID for the resource at the given [param path]. Returns [constant OK] on success, or an [enum Error] constant in case of failure. */
        /* gdvirtual */ _set_uid(path: string, uid: int64): Error
        
        /** Returns whether the given resource object can be saved by this saver. */
        /* gdvirtual */ _recognize(resource: Resource): boolean
        
        /** Returns the list of extensions available for saving the resource object, provided it is recognized (see [method _recognize]). */
        /* gdvirtual */ _get_recognized_extensions(resource: Resource): PackedStringArray
        
        /** Returns `true` if this saver handles a given save path and `false` otherwise.  
         *  If this method is not implemented, the default behavior returns whether the path's extension is within the ones provided by [method _get_recognized_extensions].  
         */
        /* gdvirtual */ _recognize_path(resource: Resource, path: string): boolean
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceFormatSaver;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceFormatSaver;
    }
    namespace ResourceImporter {
        enum ImportOrder {
            /** The default import order. */
            IMPORT_ORDER_DEFAULT = 0,
            
            /** The import order for scenes, which ensures scenes are imported  *after*  all other core resources such as textures. Custom importers should generally have an import order lower than `100` to avoid issues when importing scenes that rely on custom resources. */
            IMPORT_ORDER_SCENE = 100,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceImporter extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceImporter extends __NameMapRefCounted {
    }
    /** Base class for resource importers.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceimporter.html  
     */
    class ResourceImporter extends RefCounted {
        constructor(identifier?: any)
        /** Called when the engine compilation profile editor wants to check what build options an imported resource needs. For example, [ResourceImporterDynamicFont] has a property called [member ResourceImporterDynamicFont.multichannel_signed_distance_field], that depends on the engine to be build with the "msdfgen" module. If that resource happened to be a custom one, it would be handled like this:  
         *    
         */
        /* gdvirtual */ _get_build_dependencies(path: string): PackedStringArray
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceImporter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceImporter;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceImporterBMFont extends __RPCMapResourceImporter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceImporterBMFont extends __NameMapResourceImporter {
    }
    /** Imports a bitmap font in the BMFont (`.fnt`) format.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceimporterbmfont.html  
     */
    class ResourceImporterBMFont extends ResourceImporter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceImporterBMFont;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceImporterBMFont;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceImporterBitMap extends __RPCMapResourceImporter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceImporterBitMap extends __NameMapResourceImporter {
    }
    /** Imports a [BitMap] resource (2D array of boolean values).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceimporterbitmap.html  
     */
    class ResourceImporterBitMap extends ResourceImporter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceImporterBitMap;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceImporterBitMap;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceImporterCSVTranslation extends __RPCMapResourceImporter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceImporterCSVTranslation extends __NameMapResourceImporter {
    }
    /** Imports comma-separated values as [Translation]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceimportercsvtranslation.html  
     */
    class ResourceImporterCSVTranslation extends ResourceImporter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceImporterCSVTranslation;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceImporterCSVTranslation;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceImporterDynamicFont extends __RPCMapResourceImporter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceImporterDynamicFont extends __NameMapResourceImporter {
    }
    /** Imports a TTF, TTC, OTF, OTC, WOFF or WOFF2 font file for font rendering that adapts to any size.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceimporterdynamicfont.html  
     */
    class ResourceImporterDynamicFont extends ResourceImporter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceImporterDynamicFont;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceImporterDynamicFont;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceImporterImage extends __RPCMapResourceImporter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceImporterImage extends __NameMapResourceImporter {
    }
    /** Imports an image for use in scripting, with no rendering capabilities.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceimporterimage.html  
     */
    class ResourceImporterImage extends ResourceImporter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceImporterImage;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceImporterImage;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceImporterImageFont extends __RPCMapResourceImporter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceImporterImageFont extends __NameMapResourceImporter {
    }
    /** Imports a bitmap font where all glyphs have the same width and height.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceimporterimagefont.html  
     */
    class ResourceImporterImageFont extends ResourceImporter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceImporterImageFont;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceImporterImageFont;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceImporterLayeredTexture extends __RPCMapResourceImporter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceImporterLayeredTexture extends __NameMapResourceImporter {
    }
    /** Imports a 3-dimensional texture ([Texture3D]), a [Texture2DArray], a [Cubemap] or a [CubemapArray].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceimporterlayeredtexture.html  
     */
    class ResourceImporterLayeredTexture extends ResourceImporter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceImporterLayeredTexture;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceImporterLayeredTexture;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceImporterMP3 extends __RPCMapResourceImporter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceImporterMP3 extends __NameMapResourceImporter {
    }
    /** Imports an MP3 audio file for playback.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceimportermp3.html  
     */
    class ResourceImporterMP3 extends ResourceImporter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceImporterMP3;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceImporterMP3;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceImporterOBJ extends __RPCMapResourceImporter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceImporterOBJ extends __NameMapResourceImporter {
    }
    /** Imports an OBJ 3D model as an independent [Mesh] or scene.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceimporterobj.html  
     */
    class ResourceImporterOBJ extends ResourceImporter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceImporterOBJ;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceImporterOBJ;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceImporterOggVorbis extends __RPCMapResourceImporter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceImporterOggVorbis extends __NameMapResourceImporter {
    }
    /** Imports an Ogg Vorbis audio file for playback.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceimporteroggvorbis.html  
     */
    class ResourceImporterOggVorbis extends ResourceImporter {
        constructor(identifier?: any)
        /** Creates a new [AudioStreamOggVorbis] instance from the given buffer. The buffer must contain Ogg Vorbis data. */
        static load_from_buffer(stream_data: PackedByteArray | byte[] | ArrayBuffer): null | AudioStreamOggVorbis
        
        /** Creates a new [AudioStreamOggVorbis] instance from the given file path. The file must be in Ogg Vorbis format. */
        static load_from_file(path: string): null | AudioStreamOggVorbis
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceImporterOggVorbis;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceImporterOggVorbis;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceImporterSVG extends __RPCMapResourceImporter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceImporterSVG extends __NameMapResourceImporter {
    }
    /** Imports an SVG file as an automatically scalable texture for use in UI elements and 2D rendering.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceimportersvg.html  
     */
    class ResourceImporterSVG extends ResourceImporter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceImporterSVG;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceImporterSVG;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceImporterScene extends __RPCMapResourceImporter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceImporterScene extends __NameMapResourceImporter {
    }
    /** Imports a glTF, FBX, COLLADA, or Blender 3D scene.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceimporterscene.html  
     */
    class ResourceImporterScene extends ResourceImporter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceImporterScene;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceImporterScene;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceImporterShaderFile extends __RPCMapResourceImporter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceImporterShaderFile extends __NameMapResourceImporter {
    }
    /** Imports native GLSL shaders (not Godot shaders) as an [RDShaderFile].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceimportershaderfile.html  
     */
    class ResourceImporterShaderFile extends ResourceImporter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceImporterShaderFile;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceImporterShaderFile;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceImporterTexture extends __RPCMapResourceImporter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceImporterTexture extends __NameMapResourceImporter {
    }
    /** Imports an image for use in 2D or 3D rendering.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceimportertexture.html  
     */
    class ResourceImporterTexture extends ResourceImporter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceImporterTexture;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceImporterTexture;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceImporterTextureAtlas extends __RPCMapResourceImporter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceImporterTextureAtlas extends __NameMapResourceImporter {
    }
    /** Imports a collection of textures from a PNG image into an optimized [AtlasTexture] for 2D rendering.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceimportertextureatlas.html  
     */
    class ResourceImporterTextureAtlas extends ResourceImporter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceImporterTextureAtlas;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceImporterTextureAtlas;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourceImporterWAV extends __RPCMapResourceImporter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourceImporterWAV extends __NameMapResourceImporter {
    }
    /** Imports a WAV audio file for playback.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourceimporterwav.html  
     */
    class ResourceImporterWAV extends ResourceImporter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourceImporterWAV;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourceImporterWAV;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapResourcePreloader extends __RPCMapNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapResourcePreloader extends __NameMapNode {
    }
    /** A node used to preload sub-resources inside a scene.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_resourcepreloader.html  
     */
    class ResourcePreloader<Map extends NodePathMap = any> extends Node<Map> {
        constructor(identifier?: any)
        /** Adds a resource to the preloader with the given [param name]. If a resource with the given [param name] already exists, the new resource will be renamed to "[param name] N" where N is an incrementing number starting from 2. */
        add_resource(name: StringName, resource: Resource): void
        
        /** Removes the resource associated to [param name] from the preloader. */
        remove_resource(name: StringName): void
        
        /** Renames a resource inside the preloader from [param name] to [param newname]. */
        rename_resource(name: StringName, newname: StringName): void
        
        /** Returns `true` if the preloader contains a resource associated to [param name]. */
        has_resource(name: StringName): boolean
        
        /** Returns the resource associated to [param name]. */
        get_resource(name: StringName): null | Resource
        
        /** Returns the list of resources inside the preloader. */
        get_resource_list(): PackedStringArray
        get resources(): GArray
        set resources(value: GArray)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapResourcePreloader;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapResourcePreloader;
    }
    namespace RetargetModifier3D {
        enum TransformFlag {
            /** If set, allows to retarget the position. */
            TRANSFORM_FLAG_POSITION = 1,
            
            /** If set, allows to retarget the rotation. */
            TRANSFORM_FLAG_ROTATION = 2,
            
            /** If set, allows to retarget the scale. */
            TRANSFORM_FLAG_SCALE = 4,
            
            /** If set, allows to retarget the position/rotation/scale. */
            TRANSFORM_FLAG_ALL = 7,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapRetargetModifier3D extends __RPCMapSkeletonModifier3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapRetargetModifier3D extends __NameMapSkeletonModifier3D {
    }
    /** A modifier to transfer parent skeleton poses (or global poses) to child skeletons in model space with different rests.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_retargetmodifier3d.html  
     */
    class RetargetModifier3D<Map extends NodePathMap = any> extends SkeletonModifier3D<Map> {
        constructor(identifier?: any)
        /** Sets [constant TRANSFORM_FLAG_POSITION] into [member enable]. */
        set_position_enabled(enabled: boolean): void
        
        /** Returns `true` if [member enable] has [constant TRANSFORM_FLAG_POSITION]. */
        is_position_enabled(): boolean
        
        /** Sets [constant TRANSFORM_FLAG_ROTATION] into [member enable]. */
        set_rotation_enabled(enabled: boolean): void
        
        /** Returns `true` if [member enable] has [constant TRANSFORM_FLAG_ROTATION]. */
        is_rotation_enabled(): boolean
        
        /** Sets [constant TRANSFORM_FLAG_SCALE] into [member enable]. */
        set_scale_enabled(enabled: boolean): void
        
        /** Returns `true` if [member enable] has [constant TRANSFORM_FLAG_SCALE]. */
        is_scale_enabled(): boolean
        
        /** [SkeletonProfile] for retargeting bones with names matching the bone list. */
        get profile(): null | SkeletonProfile
        set profile(value: null | SkeletonProfile)
        
        /** If `false`, in case the target skeleton has fewer bones than the source skeleton, the source bone parent's transform will be ignored.  
         *  Instead, it is possible to retarget between models with different body shapes, and position, rotation, and scale can be retargeted separately.  
         *  If `true`, retargeting is performed taking into account global pose.  
         *  In case the target skeleton has fewer bones than the source skeleton, the source bone parent's transform is taken into account. However, bone length between skeletons must match exactly, if not, the bones will be forced to expand or shrink.  
         *  This is useful for using dummy bone with length `0` to match postures when retargeting between models with different number of bones.  
         */
        get use_global_pose(): boolean
        set use_global_pose(value: boolean)
        
        /** Flags to control the process of the transform elements individually when [member use_global_pose] is disabled. */
        get enable(): int64
        set enable(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapRetargetModifier3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapRetargetModifier3D;
    }
    namespace RibbonTrailMesh {
        enum Shape {
            /** Gives the mesh a single flat face. */
            SHAPE_FLAT = 0,
            
            /** Gives the mesh two perpendicular flat faces, making a cross shape. */
            SHAPE_CROSS = 1,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapRibbonTrailMesh extends __RPCMapPrimitiveMesh {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapRibbonTrailMesh extends __NameMapPrimitiveMesh {
    }
    /** Represents a straight ribbon-shaped [PrimitiveMesh] with variable width.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_ribbontrailmesh.html  
     */
    class RibbonTrailMesh extends PrimitiveMesh {
        constructor(identifier?: any)
        /** Determines the shape of the ribbon. */
        get shape(): int64
        set shape(value: int64)
        
        /** The baseline size of the ribbon. The size of a particular section segment is obtained by multiplying this size by the value of the [member curve] at the given distance. */
        get size(): float64
        set size(value: float64)
        
        /** The total number of sections on the ribbon. */
        get sections(): int64
        set sections(value: int64)
        
        /** The length of a section of the ribbon. */
        get section_length(): float64
        set section_length(value: float64)
        
        /** The number of segments in a section. The [member curve] is sampled on each segment to determine its size. Higher values result in a more detailed ribbon at the cost of performance. */
        get section_segments(): int64
        set section_segments(value: int64)
        
        /** Determines the size of the ribbon along its length. The size of a particular section segment is obtained by multiplying the baseline [member size] by the value of this curve at the given distance. For values smaller than `0`, the faces will be inverted. Should be a unit [Curve]. */
        get curve(): null | Curve
        set curve(value: null | Curve)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapRibbonTrailMesh;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapRibbonTrailMesh;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapRichTextEffect extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapRichTextEffect extends __NameMapResource {
    }
    /** A custom effect for a [RichTextLabel].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_richtexteffect.html  
     */
    class RichTextEffect extends Resource {
        constructor(identifier?: any)
        /** Override this method to modify properties in [param char_fx]. The method must return `true` if the character could be transformed successfully. If the method returns `false`, it will skip transformation to avoid displaying broken text. */
        /* gdvirtual */ _process_custom_fx(char_fx: CharFXTransform): boolean
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapRichTextEffect;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapRichTextEffect;
    }
    namespace RichTextLabel {
        enum ListType {
            /** Each list item has a number marker. */
            LIST_NUMBERS = 0,
            
            /** Each list item has a letter marker. */
            LIST_LETTERS = 1,
            
            /** Each list item has a roman number marker. */
            LIST_ROMAN = 2,
            
            /** Each list item has a filled circle marker. */
            LIST_DOTS = 3,
        }
        enum MenuItems {
            /** Copies the selected text. */
            MENU_COPY = 0,
            
            /** Selects the whole [RichTextLabel] text. */
            MENU_SELECT_ALL = 1,
            
            /** Represents the size of the [enum MenuItems] enum. */
            MENU_MAX = 2,
        }
        enum MetaUnderline {
            /** Meta tag does not display an underline, even if [member meta_underlined] is `true`. */
            META_UNDERLINE_NEVER = 0,
            
            /** If [member meta_underlined] is `true`, meta tag always display an underline. */
            META_UNDERLINE_ALWAYS = 1,
            
            /** If [member meta_underlined] is `true`, meta tag display an underline when the mouse cursor is over it. */
            META_UNDERLINE_ON_HOVER = 2,
        }
        enum ImageUpdateMask {
            /** If this bit is set, [method update_image] changes image texture. */
            UPDATE_TEXTURE = 1,
            
            /** If this bit is set, [method update_image] changes image size. */
            UPDATE_SIZE = 2,
            
            /** If this bit is set, [method update_image] changes image color. */
            UPDATE_COLOR = 4,
            
            /** If this bit is set, [method update_image] changes image inline alignment. */
            UPDATE_ALIGNMENT = 8,
            
            /** If this bit is set, [method update_image] changes image texture region. */
            UPDATE_REGION = 16,
            
            /** If this bit is set, [method update_image] changes image padding. */
            UPDATE_PAD = 32,
            
            /** If this bit is set, [method update_image] changes image tooltip. */
            UPDATE_TOOLTIP = 64,
            
            /** If this bit is set, [method update_image] changes image width from/to percents. */
            UPDATE_WIDTH_IN_PERCENT = 128,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapRichTextLabel extends __RPCMapControl {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapRichTextLabel extends __NameMapControl {
    }
    /** A control for displaying text that can contain different font styles, images, and basic formatting.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_richtextlabel.html  
     */
    class RichTextLabel<Map extends NodePathMap = any> extends Control<Map> {
        constructor(identifier?: any)
        /** Returns the text without BBCode mark-up. */
        get_parsed_text(): string
        
        /** Adds raw non-BBCode-parsed text to the tag stack. */
        add_text(text: string): void
        
        /** Adds a horizontal rule that can be used to separate content.  
         *  If [param width_in_percent] is set, [param width] values are percentages of the control width instead of pixels.  
         *  If [param height_in_percent] is set, [param height] values are percentages of the control width instead of pixels.  
         */
        add_hr(width?: int64 /* = 90 */, height?: int64 /* = 2 */, color?: Color /* = new Color(1, 1, 1, 1) */, alignment?: HorizontalAlignment /* = 1 */, width_in_percent?: boolean /* = true */, height_in_percent?: boolean /* = false */): void
        
        /** Adds an image's opening and closing tags to the tag stack, optionally providing a [param width] and [param height] to resize the image, a [param color] to tint the image and a [param region] to only use parts of the image.  
         *  If [param width] or [param height] is set to 0, the image size will be adjusted in order to keep the original aspect ratio.  
         *  If [param width] and [param height] are not set, but [param region] is, the region's rect will be used.  
         *  [param key] is an optional identifier, that can be used to modify the image via [method update_image].  
         *  If [param pad] is set, and the image is smaller than the size specified by [param width] and [param height], the image padding is added to match the size instead of upscaling.  
         *  If [param width_in_percent] is set, [param width] values are percentages of the control width instead of pixels.  
         *  If [param height_in_percent] is set, [param height] values are percentages of the control width instead of pixels.  
         *  [param alt_text] is used as the image description for assistive apps.  
         */
        add_image(image: Texture2D, width?: int64 /* = 0 */, height?: int64 /* = 0 */, color?: Color /* = new Color(1, 1, 1, 1) */, inline_align?: InlineAlignment /* = 5 */, region?: Rect2 /* = new Rect2(0, 0, 0, 0) */, key?: any /* = {} */, pad?: boolean /* = false */, tooltip?: string /* = '' */, width_in_percent?: boolean /* = false */, height_in_percent?: boolean /* = false */, alt_text?: string /* = '' */): void
        
        /** Updates the existing images with the key [param key]. Only properties specified by [param mask] bits are updated. See [method add_image]. */
        update_image(key: any, mask: RichTextLabel.ImageUpdateMask, image: Texture2D, width?: int64 /* = 0 */, height?: int64 /* = 0 */, color?: Color /* = new Color(1, 1, 1, 1) */, inline_align?: InlineAlignment /* = 5 */, region?: Rect2 /* = new Rect2(0, 0, 0, 0) */, pad?: boolean /* = false */, tooltip?: string /* = '' */, width_in_percent?: boolean /* = false */, height_in_percent?: boolean /* = false */): void
        
        /** Adds a newline tag to the tag stack. */
        newline(): void
        
        /** Removes a paragraph of content from the label. Returns `true` if the paragraph exists.  
         *  The [param paragraph] argument is the index of the paragraph to remove, it can take values in the interval `[0, get_paragraph_count() - 1]`.  
         *  If [param no_invalidate] is set to `true`, cache for the subsequent paragraphs is not invalidated. Use it for faster updates if deleted paragraph is fully self-contained (have no unclosed tags), or this call is part of the complex edit operation and [method invalidate_paragraph] will be called at the end of operation.  
         */
        remove_paragraph(paragraph: int64, no_invalidate?: boolean /* = false */): boolean
        
        /** Invalidates [param paragraph] and all subsequent paragraphs cache. */
        invalidate_paragraph(paragraph: int64): boolean
        
        /** Adds a [code skip-lint][font]` tag to the tag stack. Overrides default fonts for its duration.  
         *  Passing `0` to [param font_size] will use the existing default font size.  
         */
        push_font(font: Font, font_size?: int64 /* = 0 */): void
        
        /** Adds a [code skip-lint][font_size]` tag to the tag stack. Overrides default font size for its duration. */
        push_font_size(font_size: int64): void
        
        /** Adds a [code skip-lint][font]` tag with a normal font to the tag stack. */
        push_normal(): void
        
        /** Adds a [code skip-lint][font]` tag with a bold font to the tag stack. This is the same as adding a [code skip-lint]**` tag if not currently in a [code skip-lint] *` tag. */
        push_bold(): void
        
        /** Adds a [code skip-lint][font]` tag with a bold italics font to the tag stack. */
        push_bold_italics(): void
        
        /** Adds a [code skip-lint][font]` tag with an italics font to the tag stack. This is the same as adding an [code skip-lint] *` tag if not currently in a [code skip-lint]**` tag. */
        push_italics(): void
        
        /** Adds a [code skip-lint][font]` tag with a monospace font to the tag stack. */
        push_mono(): void
        
        /** Adds a [code skip-lint][color]` tag to the tag stack. */
        push_color(color: Color): void
        
        /** Adds a [code skip-lint][outline_size]` tag to the tag stack. Overrides default text outline size for its duration. */
        push_outline_size(outline_size: int64): void
        
        /** Adds a [code skip-lint][outline_color]` tag to the tag stack. Adds text outline for its duration. */
        push_outline_color(color: Color): void
        
        /** Adds a [code skip-lint][p]` tag to the tag stack. */
        push_paragraph(alignment: HorizontalAlignment, base_direction?: Control.TextDirection /* = 0 */, language?: string /* = '' */, st_parser?: TextServer.StructuredTextParser /* = 0 */, justification_flags?: TextServer.JustificationFlag /* = 163 */, tab_stops?: PackedFloat32Array | float32[] /* = [] */): void
        
        /** Adds an [code skip-lint][indent]` tag to the tag stack. Multiplies [param level] by current [member tab_size] to determine new margin length. */
        push_indent(level: int64): void
        
        /** Adds [code skip-lint][ol]` or [code skip-lint][ul]` tag to the tag stack. Multiplies [param level] by current [member tab_size] to determine new margin length. */
        push_list(level: int64, type: RichTextLabel.ListType, capitalize: boolean, bullet?: string /* = '•' */): void
        
        /** Adds a meta tag to the tag stack. Similar to the BBCode [code skip-lint][url=something]{text}[/url]`, but supports non-[String] metadata types.  
         *  If [member meta_underlined] is `true`, meta tags display an underline. This behavior can be customized with [param underline_mode].  
         *      
         *  **Note:** Meta tags do nothing by default when clicked. To assign behavior when clicked, connect [signal meta_clicked] to a function that is called when the meta tag is clicked.  
         */
        push_meta(data: any, underline_mode?: RichTextLabel.MetaUnderline /* = 1 */, tooltip?: string /* = '' */): void
        
        /** Adds a [code skip-lint][hint]` tag to the tag stack. Same as BBCode [code skip-lint][hint=something]{text}[/hint]`. */
        push_hint(description: string): void
        
        /** Adds language code used for text shaping algorithm and Open-Type font features. */
        push_language(language: string): void
        
        /** Adds a [code skip-lint][u]` tag to the tag stack. If [param color]'s alpha value is `0.0`, the current font's color with its alpha multiplied by [theme_item underline_alpha] is used. */
        push_underline(color?: Color /* = new Color(0, 0, 0, 0) */): void
        
        /** Adds a [code skip-lint][s]` tag to the tag stack. If [param color]'s alpha value is `0.0`, the current font's color with its alpha multiplied by [theme_item strikethrough_alpha] is used. */
        push_strikethrough(color?: Color /* = new Color(0, 0, 0, 0) */): void
        
        /** Adds a [code skip-lint][table=columns,inline_align]` tag to the tag stack. Use [method set_table_column_expand] to set column expansion ratio. Use [method push_cell] to add cells. [param name] is used as the table name for assistive apps. */
        push_table(columns: int64, inline_align?: InlineAlignment /* = 0 */, align_to_row?: int64 /* = -1 */, name?: string /* = '' */): void
        
        /** Adds a [code skip-lint][dropcap]` tag to the tag stack. Drop cap (dropped capital) is a decorative element at the beginning of a paragraph that is larger than the rest of the text. */
        push_dropcap(string_: string, font: Font, size: int64, dropcap_margins?: Rect2 /* = new Rect2(0, 0, 0, 0) */, color?: Color /* = new Color(1, 1, 1, 1) */, outline_size?: int64 /* = 0 */, outline_color?: Color /* = new Color(0, 0, 0, 0) */): void
        
        /** Edits the selected column's expansion options. If [param expand] is `true`, the column expands in proportion to its expansion ratio versus the other columns' ratios.  
         *  For example, 2 columns with ratios 3 and 4 plus 70 pixels in available width would expand 30 and 40 pixels, respectively.  
         *  If [param expand] is `false`, the column will not contribute to the total ratio.  
         */
        set_table_column_expand(column: int64, expand: boolean, ratio?: int64 /* = 1 */, shrink?: boolean /* = true */): void
        
        /** Sets table column name for assistive apps. */
        set_table_column_name(column: int64, name: string): void
        
        /** Sets color of a table cell. Separate colors for alternating rows can be specified. */
        set_cell_row_background_color(odd_row_bg: Color, even_row_bg: Color): void
        
        /** Sets color of a table cell border. */
        set_cell_border_color(color: Color): void
        
        /** Sets minimum and maximum size overrides for a table cell. */
        set_cell_size_override(min_size: Vector2, max_size: Vector2): void
        
        /** Sets inner padding of a table cell. */
        set_cell_padding(padding: Rect2): void
        
        /** Adds a [code skip-lint][cell]` tag to the tag stack. Must be inside a [code skip-lint][table]` tag. See [method push_table] for details. Use [method set_table_column_expand] to set column expansion ratio, [method set_cell_border_color] to set cell border, [method set_cell_row_background_color] to set cell background, [method set_cell_size_override] to override cell size, and [method set_cell_padding] to set padding. */
        push_cell(): void
        
        /** Adds a [code skip-lint][fgcolor]` tag to the tag stack.  
         *      
         *  **Note:** The foreground color has padding applied by default, which is controlled using [theme_item text_highlight_h_padding] and [theme_item text_highlight_v_padding]. This can lead to overlapping highlights if foreground colors are placed on neighboring lines/columns, so consider setting those theme items to `0` if you want to avoid this.  
         */
        push_fgcolor(fgcolor: Color): void
        
        /** Adds a [code skip-lint][bgcolor]` tag to the tag stack.  
         *      
         *  **Note:** The background color has padding applied by default, which is controlled using [theme_item text_highlight_h_padding] and [theme_item text_highlight_v_padding]. This can lead to overlapping highlights if background colors are placed on neighboring lines/columns, so consider setting those theme items to `0` if you want to avoid this.  
         */
        push_bgcolor(bgcolor: Color): void
        
        /** Adds a custom effect tag to the tag stack. The effect does not need to be in [member custom_effects]. The environment is directly passed to the effect. */
        push_customfx(effect: RichTextEffect, env: GDictionary): void
        
        /** Adds a context marker to the tag stack. See [method pop_context]. */
        push_context(): void
        
        /** Terminates tags opened after the last [method push_context] call (including context marker), or all tags if there's no context marker on the stack. */
        pop_context(): void
        
        /** Terminates the current tag. Use after `push_*` methods to close BBCodes manually. Does not need to follow `add_*` methods. */
        pop(): void
        
        /** Terminates all tags opened by `push_*` methods. */
        pop_all(): void
        
        /** Clears the tag stack, causing the label to display nothing.  
         *      
         *  **Note:** This method does not affect [member text], and its contents will show again if the label is redrawn. However, setting [member text] to an empty [String] also clears the stack.  
         */
        clear(): void
        
        /** Returns the vertical scrollbar.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member CanvasItem.visible] property.  
         */
        get_v_scroll_bar(): null | VScrollBar
        
        /** Scrolls the window's top line to match [param line]. */
        scroll_to_line(line: int64): void
        
        /** Scrolls the window's top line to match first line of the [param paragraph]. */
        scroll_to_paragraph(paragraph: int64): void
        
        /** Scrolls to the beginning of the current selection. */
        scroll_to_selection(): void
        
        /** Returns the current selection first character index if a selection is active, `-1` otherwise. Does not include BBCodes. */
        get_selection_from(): int64
        
        /** Returns the current selection last character index if a selection is active, `-1` otherwise. Does not include BBCodes. */
        get_selection_to(): int64
        
        /** Returns the current selection vertical line offset if a selection is active, `-1.0` otherwise. */
        get_selection_line_offset(): float64
        
        /** Select all the text.  
         *  If [member selection_enabled] is `false`, no selection will occur.  
         */
        select_all(): void
        
        /** Returns the current selection text. Does not include BBCodes. */
        get_selected_text(): string
        
        /** Clears the current selection. */
        deselect(): void
        
        /** The assignment version of [method append_text]. Clears the tag stack and inserts the new content. */
        parse_bbcode(bbcode: string): void
        
        /** Parses [param bbcode] and adds tags to the tag stack as needed.  
         *      
         *  **Note:** Using this method, you can't close a tag that was opened in a previous [method append_text] call. This is done to improve performance, especially when updating large RichTextLabels since rebuilding the whole BBCode every time would be slower. If you absolutely need to close a tag in a future method call, append the [member text] instead of using [method append_text].  
         */
        append_text(bbcode: string): void
        
        /** If [member threaded] is enabled, returns `true` if the background thread has finished text processing, otherwise always return `true`. */
        is_ready(): boolean
        
        /** If [member threaded] is enabled, returns `true` if the background thread has finished text processing, otherwise always return `true`. */
        is_finished(): boolean
        
        /** Returns the line number of the character position provided. Line and character numbers are both zero-indexed.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_character_line(character: int64): int64
        
        /** Returns the paragraph number of the character position provided. Paragraph and character numbers are both zero-indexed.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_character_paragraph(character: int64): int64
        
        /** Returns the total number of characters from text tags. Does not include BBCodes. */
        get_total_character_count(): int64
        
        /** Returns the total number of lines in the text. Wrapped text is counted as multiple lines.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_line_count(): int64
        
        /** Returns the indexes of the first and last visible characters for the given [param line], as a [Vector2i].  
         *      
         *  **Note:** If [member visible_characters_behavior] is set to [constant TextServer.VC_CHARS_BEFORE_SHAPING] only visible wrapped lines are counted.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_line_range(line: int64): Vector2i
        
        /** Returns the number of visible lines.  
         *      
         *  **Note:** This method returns a correct value only after the label has been drawn.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_visible_line_count(): int64
        
        /** Returns the total number of paragraphs (newlines or `p` tags in the tag stack's text tags). Considers wrapped text as one paragraph. */
        get_paragraph_count(): int64
        
        /** Returns the number of visible paragraphs. A paragraph is considered visible if at least one of its lines is visible.  
         *      
         *  **Note:** This method returns a correct value only after the label has been drawn.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_visible_paragraph_count(): int64
        
        /** Returns the height of the content.  
         *      
         *  **Note:** This method always returns the full content size, and is not affected by [member visible_ratio] and [member visible_characters]. To get the visible content size, use [method get_visible_content_rect].  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_content_height(): int64
        
        /** Returns the width of the content.  
         *      
         *  **Note:** This method always returns the full content size, and is not affected by [member visible_ratio] and [member visible_characters]. To get the visible content size, use [method get_visible_content_rect].  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_content_width(): int64
        
        /** Returns the height of the line found at the provided index.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether the document is fully loaded.  
         */
        get_line_height(line: int64): int64
        
        /** Returns the width of the line found at the provided index.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether the document is fully loaded.  
         */
        get_line_width(line: int64): int64
        
        /** Returns the bounding rectangle of the visible content.  
         *      
         *  **Note:** This method returns a correct value only after the label has been drawn.  
         *    
         */
        get_visible_content_rect(): Rect2i
        
        /** Returns the vertical offset of the line found at the provided index.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_line_offset(line: int64): float64
        
        /** Returns the vertical offset of the paragraph found at the provided index.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_paragraph_offset(paragraph: int64): float64
        
        /** Parses BBCode parameter [param expressions] into a dictionary. */
        parse_expressions_for_values(expressions: PackedStringArray | string[]): GDictionary
        
        /** Installs a custom effect. This can also be done in the Inspector through the [member custom_effects] property. [param effect] should be a valid [RichTextEffect].  
         *  **Example:** With the following script extending from [RichTextEffect]:  
         *    
         *  The above effect can be installed in [RichTextLabel] from a script:  
         *    
         */
        install_effect(effect: any): void
        
        /** Reloads custom effects. Useful when [member custom_effects] is modified manually. */
        reload_effects(): void
        
        /** Returns the [PopupMenu] of this [RichTextLabel]. By default, this menu is displayed when right-clicking on the [RichTextLabel].  
         *  You can add custom menu items or remove standard ones. Make sure your IDs don't conflict with the standard ones (see [enum MenuItems]). For example:  
         *    
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member Window.visible] property.  
         */
        get_menu(): null | PopupMenu
        
        /** Returns whether the menu is visible. Use this instead of `get_menu().visible` to improve performance (so the creation of the menu is avoided). */
        is_menu_visible(): boolean
        
        /** Executes a given action as defined in the [enum MenuItems] enum. */
        menu_option(option: int64): void
        
        /** If `true`, the label uses BBCode formatting.  
         *      
         *  **Note:** This only affects the contents of [member text], not the tag stack.  
         */
        get bbcode_enabled(): boolean
        set bbcode_enabled(value: boolean)
        
        /** The label's text in BBCode format. Is not representative of manual modifications to the internal tag stack. Erases changes made by other methods when edited.  
         *      
         *  **Note:** If [member bbcode_enabled] is `true`, it is unadvised to use the `+=` operator with [member text] (e.g. `text += "some string"`) as it replaces the whole text and can cause slowdowns. It will also erase all BBCode that was added to stack using `push_*` methods. Use [method append_text] for adding text instead, unless you absolutely need to close a tag that was opened in an earlier method call.  
         */
        get text(): string
        set text(value: string)
        
        /** If `true`, the label's minimum size will be automatically updated to fit its content, matching the behavior of [Label]. */
        get fit_content(): boolean
        set fit_content(value: boolean)
        
        /** If `true`, the scrollbar is visible. Setting this to `false` does not block scrolling completely. See [method scroll_to_line]. */
        get scroll_active(): boolean
        set scroll_active(value: boolean)
        
        /** If `true`, the window scrolls down to display new content automatically. */
        get scroll_following(): boolean
        set scroll_following(value: boolean)
        
        /** If `true`, the window scrolls to display the last visible line when [member visible_characters] or [member visible_ratio] is changed. */
        get scroll_following_visible_characters(): boolean
        set scroll_following_visible_characters(value: boolean)
        
        /** If set to something other than [constant TextServer.AUTOWRAP_OFF], the text gets wrapped inside the node's bounding rectangle. */
        get autowrap_mode(): int64
        set autowrap_mode(value: int64)
        
        /** Autowrap space trimming flags. See [constant TextServer.BREAK_TRIM_START_EDGE_SPACES] and [constant TextServer.BREAK_TRIM_END_EDGE_SPACES] for more info. */
        get autowrap_trim_flags(): int64
        set autowrap_trim_flags(value: int64)
        
        /** The number of spaces associated with a single tab length. Does not affect `\t` in text tags, only indent tags. */
        get tab_size(): int64
        set tab_size(value: int64)
        
        /** If `true`, a right-click displays the context menu. */
        get context_menu_enabled(): boolean
        set context_menu_enabled(value: boolean)
        
        /** If `true`, shortcut keys for context menu items are enabled, even if the context menu is disabled. */
        get shortcut_keys_enabled(): boolean
        set shortcut_keys_enabled(value: boolean)
        
        /** Controls the text's horizontal alignment. Supports left, center, right, and fill (also known as justify). */
        get horizontal_alignment(): int64
        set horizontal_alignment(value: int64)
        
        /** Controls the text's vertical alignment. Supports top, center, bottom, and fill. */
        get vertical_alignment(): int64
        set vertical_alignment(value: int64)
        
        /** Line fill alignment rules. */
        get justification_flags(): int64
        set justification_flags(value: int64)
        
        /** Aligns text to the given tab-stops. */
        get tab_stops(): PackedFloat32Array
        set tab_stops(value: PackedFloat32Array | float32[])
        
        /** The currently installed custom effects. This is an array of [RichTextEffect]s.  
         *  To add a custom effect, it's more convenient to use [method install_effect].  
         */
        get custom_effects(): GArray<RichTextEffect>
        set custom_effects(value: GArray<RichTextEffect>)
        
        /** If `true`, the label underlines meta tags such as [code skip-lint][url]{text}[/url]`. These tags can call a function when clicked if [signal meta_clicked] is connected to a function. */
        get meta_underlined(): boolean
        set meta_underlined(value: boolean)
        
        /** If `true`, the label underlines hint tags such as [code skip-lint][hint=description]{text}[/hint]`. */
        get hint_underlined(): boolean
        set hint_underlined(value: boolean)
        
        /** If `true`, text processing is done in a background thread. */
        get threaded(): boolean
        set threaded(value: boolean)
        
        /** The delay after which the loading progress bar is displayed, in milliseconds. Set to `-1` to disable progress bar entirely.  
         *      
         *  **Note:** Progress bar is displayed only if [member threaded] is enabled.  
         */
        get progress_bar_delay(): int64
        set progress_bar_delay(value: int64)
        
        /** If `true`, the label allows text selection. */
        get selection_enabled(): boolean
        set selection_enabled(value: boolean)
        
        /** If `true`, the selected text will be deselected when focus is lost. */
        get deselect_on_focus_loss_enabled(): boolean
        set deselect_on_focus_loss_enabled(value: boolean)
        
        /** If `true`, allow drag and drop of selected text. */
        get drag_and_drop_selection_enabled(): boolean
        set drag_and_drop_selection_enabled(value: boolean)
        
        /** The number of characters to display. If set to `-1`, all characters are displayed. This can be useful when animating the text appearing in a dialog box.  
         *      
         *  **Note:** Setting this property updates [member visible_ratio] accordingly.  
         *      
         *  **Note:** Characters are counted as Unicode codepoints. A single visible grapheme may contain multiple codepoints (e.g. certain emoji use three codepoints). A single codepoint may contain two UTF-16 characters, which are used in C# strings.  
         */
        get visible_characters(): int64
        set visible_characters(value: int64)
        
        /** The clipping behavior when [member visible_characters] or [member visible_ratio] is set. */
        get visible_characters_behavior(): int64
        set visible_characters_behavior(value: int64)
        
        /** The fraction of characters to display, relative to the total number of characters (see [method get_total_character_count]). If set to `1.0`, all characters are displayed. If set to `0.5`, only half of the characters will be displayed. This can be useful when animating the text appearing in a dialog box.  
         *      
         *  **Note:** Setting this property updates [member visible_characters] accordingly.  
         */
        get visible_ratio(): float64
        set visible_ratio(value: float64)
        
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
        
        /** Triggered when the user clicks on content between meta (URL) tags. If the meta is defined in BBCode, e.g. [code skip-lint][url={"key": "value"}]Text[/url]`, then the parameter for this signal will always be a [String] type. If a particular type or an object is desired, the [method push_meta] method must be used to manually insert the data into the tag stack. Alternatively, you can convert the [String] input to the desired type based on its contents (such as calling [method JSON.parse] on it).  
         *  For example, the following method can be connected to [signal meta_clicked] to open clicked URLs using the user's default web browser:  
         *    
         */
        readonly meta_clicked: Signal<(meta: any) => void>
        
        /** Triggers when the mouse enters a meta tag. */
        readonly meta_hover_started: Signal<(meta: any) => void>
        
        /** Triggers when the mouse exits a meta tag. */
        readonly meta_hover_ended: Signal<(meta: any) => void>
        
        /** Triggered when the document is fully loaded.  
         *      
         *  **Note:** This can happen before the text is processed for drawing. Scrolling values may not be valid until the document is drawn for the first time after this signal.  
         */
        readonly finished: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapRichTextLabel;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapRichTextLabel;
    }
    namespace RigidBody2D {
        enum FreezeMode {
            /** Static body freeze mode (default). The body is not affected by gravity and forces. It can be only moved by user code and doesn't collide with other bodies along its path. */
            FREEZE_MODE_STATIC = 0,
            
            /** Kinematic body freeze mode. Similar to [constant FREEZE_MODE_STATIC], but collides with other bodies along its path when moved. Useful for a frozen body that needs to be animated. */
            FREEZE_MODE_KINEMATIC = 1,
        }
        enum CenterOfMassMode {
            /** In this mode, the body's center of mass is calculated automatically based on its shapes. This assumes that the shapes' origins are also their center of mass. */
            CENTER_OF_MASS_MODE_AUTO = 0,
            
            /** In this mode, the body's center of mass is set through [member center_of_mass]. Defaults to the body's origin position. */
            CENTER_OF_MASS_MODE_CUSTOM = 1,
        }
        enum DampMode {
            /** In this mode, the body's damping value is added to any value set in areas or the default value. */
            DAMP_MODE_COMBINE = 0,
            
            /** In this mode, the body's damping value replaces any value set in areas or the default value. */
            DAMP_MODE_REPLACE = 1,
        }
        enum CCDMode {
            /** Continuous collision detection disabled. This is the fastest way to detect body collisions, but can miss small, fast-moving objects. */
            CCD_MODE_DISABLED = 0,
            
            /** Continuous collision detection enabled using raycasting. This is faster than shapecasting but less precise. */
            CCD_MODE_CAST_RAY = 1,
            
            /** Continuous collision detection enabled using shapecasting. This is the slowest CCD method and the most precise. */
            CCD_MODE_CAST_SHAPE = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapRigidBody2D extends __RPCMapPhysicsBody2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapRigidBody2D extends __NameMapPhysicsBody2D {
    }
    /** A 2D physics body that is moved by a physics simulation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_rigidbody2d.html  
     */
    class RigidBody2D<Map extends NodePathMap = any> extends PhysicsBody2D<Map> {
        constructor(identifier?: any)
        /** Called during physics processing, allowing you to read and safely modify the simulation state for the object. By default, it is called before the standard force integration, but the [member custom_integrator] property allows you to disable the standard force integration and do fully custom force integration for a body. */
        /* gdvirtual */ _integrate_forces(state: PhysicsDirectBodyState2D): void
        
        /** Returns the number of contacts this body has with other bodies. By default, this returns 0 unless bodies are configured to monitor contacts (see [member contact_monitor]).  
         *      
         *  **Note:** To retrieve the colliding bodies, use [method get_colliding_bodies].  
         */
        get_contact_count(): int64
        
        /** Sets the body's velocity on the given axis. The velocity in the given vector axis will be set as the given vector length. This is useful for jumping behavior. */
        set_axis_velocity(axis_velocity: Vector2): void
        
        /** Applies a directional impulse without affecting rotation.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         *  This is equivalent to using [method apply_impulse] at the body's center of mass.  
         */
        apply_central_impulse(impulse?: Vector2 /* = Vector2.ZERO */): void
        
        /** Applies a positioned impulse to the body.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         *  [param position] is the offset from the body origin in global coordinates.  
         */
        apply_impulse(impulse: Vector2, position?: Vector2 /* = Vector2.ZERO */): void
        
        /** Applies a rotational impulse to the body without affecting the position.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         *      
         *  **Note:** [member inertia] is required for this to work. To have [member inertia], an active [CollisionShape2D] must be a child of the node, or you can manually set [member inertia].  
         */
        apply_torque_impulse(torque: float64): void
        
        /** Applies a directional force without affecting rotation. A force is time dependent and meant to be applied every physics update.  
         *  This is equivalent to using [method apply_force] at the body's center of mass.  
         */
        apply_central_force(force: Vector2): void
        
        /** Applies a positioned force to the body. A force is time dependent and meant to be applied every physics update.  
         *  [param position] is the offset from the body origin in global coordinates.  
         */
        apply_force(force: Vector2, position?: Vector2 /* = Vector2.ZERO */): void
        
        /** Applies a rotational force without affecting position. A force is time dependent and meant to be applied every physics update.  
         *      
         *  **Note:** [member inertia] is required for this to work. To have [member inertia], an active [CollisionShape2D] must be a child of the node, or you can manually set [member inertia].  
         */
        apply_torque(torque: float64): void
        
        /** Adds a constant directional force without affecting rotation that keeps being applied over time until cleared with `constant_force = Vector2(0, 0)`.  
         *  This is equivalent to using [method add_constant_force] at the body's center of mass.  
         */
        add_constant_central_force(force: Vector2): void
        
        /** Adds a constant positioned force to the body that keeps being applied over time until cleared with `constant_force = Vector2(0, 0)`.  
         *  [param position] is the offset from the body origin in global coordinates.  
         */
        add_constant_force(force: Vector2, position?: Vector2 /* = Vector2.ZERO */): void
        
        /** Adds a constant rotational force without affecting position that keeps being applied over time until cleared with `constant_torque = 0`. */
        add_constant_torque(torque: float64): void
        
        /** Returns a list of the bodies colliding with this one. Requires [member contact_monitor] to be set to `true` and [member max_contacts_reported] to be set high enough to detect all the collisions.  
         *      
         *  **Note:** The result of this test is not immediate after moving objects. For performance, list of collisions is updated once per frame and before the physics step. Consider using signals instead.  
         */
        get_colliding_bodies(): GArray<Node2D>
        
        /** The body's mass. */
        get mass(): float64
        set mass(value: float64)
        
        /** The physics material override for the body.  
         *  If a material is assigned to this property, it will be used instead of any other physics material, such as an inherited one.  
         */
        get physics_material_override(): null | PhysicsMaterial
        set physics_material_override(value: null | PhysicsMaterial)
        
        /** Multiplies the gravity applied to the body. The body's gravity is calculated from the [member ProjectSettings.physics/2d/default_gravity] project setting and/or any additional gravity vector applied by [Area2D]s. */
        get gravity_scale(): float64
        set gravity_scale(value: float64)
        
        /** Defines the way the body's center of mass is set. */
        get center_of_mass_mode(): int64
        set center_of_mass_mode(value: int64)
        
        /** The body's custom center of mass, relative to the body's origin position, when [member center_of_mass_mode] is set to [constant CENTER_OF_MASS_MODE_CUSTOM]. This is the balanced point of the body, where applied forces only cause linear acceleration. Applying forces outside of the center of mass causes angular acceleration.  
         *  When [member center_of_mass_mode] is set to [constant CENTER_OF_MASS_MODE_AUTO] (default value), the center of mass is automatically determined, but this does not update the value of [member center_of_mass].  
         */
        get center_of_mass(): Vector2
        set center_of_mass(value: Vector2)
        
        /** The body's moment of inertia. This is like mass, but for rotation: it determines how much torque it takes to rotate the body. The moment of inertia is usually computed automatically from the mass and the shapes, but this property allows you to set a custom value.  
         *  If set to `0`, inertia is automatically computed (default value).  
         *      
         *  **Note:** This value does not change when inertia is automatically computed. Use [PhysicsServer2D] to get the computed inertia.  
         *    
         */
        get inertia(): float64
        set inertia(value: float64)
        
        /** If `true`, the body will not move and will not calculate forces until woken up by another body through, for example, a collision, or by using the [method apply_impulse] or [method apply_force] methods. */
        get sleeping(): boolean
        set sleeping(value: boolean)
        
        /** If `true`, the body can enter sleep mode when there is no movement. See [member sleeping]. */
        get can_sleep(): boolean
        set can_sleep(value: boolean)
        
        /** If `true`, the body cannot rotate. Gravity and forces only apply linear movement. */
        get lock_rotation(): boolean
        set lock_rotation(value: boolean)
        
        /** If `true`, the body is frozen. Gravity and forces are not applied anymore.  
         *  See [member freeze_mode] to set the body's behavior when frozen.  
         *      
         *  **Note:** For a body that is always frozen, use [StaticBody2D] or [AnimatableBody2D] instead.  
         */
        get freeze(): boolean
        set freeze(value: boolean)
        
        /** The body's freeze mode. Determines the body's behavior when [member freeze] is `true`.  
         *      
         *  **Note:** For a body that is always frozen, use [StaticBody2D] or [AnimatableBody2D] instead.  
         */
        get freeze_mode(): int64
        set freeze_mode(value: int64)
        
        /** If `true`, the standard force integration (like gravity or damping) will be disabled for this body. Other than collision response, the body will only move as determined by the [method _integrate_forces] method, if that virtual method is overridden.  
         *  Setting this property will call the method [method PhysicsServer2D.body_set_omit_force_integration] internally.  
         */
        get custom_integrator(): boolean
        set custom_integrator(value: boolean)
        
        /** Continuous collision detection mode.  
         *  Continuous collision detection tries to predict where a moving body will collide instead of moving it and correcting its movement after collision. Continuous collision detection is slower, but more precise and misses fewer collisions with small, fast-moving objects. Raycasting and shapecasting methods are available.  
         */
        get continuous_cd(): int64
        set continuous_cd(value: int64)
        
        /** If `true`, the RigidBody2D will emit signals when it collides with another body.  
         *      
         *  **Note:** By default the maximum contacts reported is set to 0, meaning nothing will be recorded, see [member max_contacts_reported].  
         */
        get contact_monitor(): boolean
        set contact_monitor(value: boolean)
        
        /** The maximum number of contacts that will be recorded. Requires a value greater than 0 and [member contact_monitor] to be set to `true` to start to register contacts. Use [method get_contact_count] to retrieve the count or [method get_colliding_bodies] to retrieve bodies that have been collided with.  
         *      
         *  **Note:** The number of contacts is different from the number of collisions. Collisions between parallel edges will result in two contacts (one at each end), and collisions between parallel faces will result in four contacts (one at each corner).  
         */
        get max_contacts_reported(): int64
        set max_contacts_reported(value: int64)
        
        /** The body's linear velocity in pixels per second. Can be used sporadically, but **don't set this every frame**, because physics may run in another thread and runs at a different granularity. Use [method _integrate_forces] as your process loop for precise control of the body state. */
        get linear_velocity(): Vector2
        set linear_velocity(value: Vector2)
        
        /** Defines how [member linear_damp] is applied. */
        get linear_damp_mode(): int64
        set linear_damp_mode(value: int64)
        
        /** Damps the body's movement. By default, the body will use the [member ProjectSettings.physics/2d/default_linear_damp] setting or any value override set by an [Area2D] the body is in. Depending on [member linear_damp_mode], you can set [member linear_damp] to be added to or to replace the body's damping value.  
         *  See [member ProjectSettings.physics/2d/default_linear_damp] for more details about damping.  
         */
        get linear_damp(): float64
        set linear_damp(value: float64)
        
        /** The body's rotational velocity in  *radians*  per second. */
        get angular_velocity(): float64
        set angular_velocity(value: float64)
        
        /** Defines how [member angular_damp] is applied. */
        get angular_damp_mode(): int64
        set angular_damp_mode(value: int64)
        
        /** Damps the body's rotation. By default, the body will use the [member ProjectSettings.physics/2d/default_angular_damp] setting or any value override set by an [Area2D] the body is in. Depending on [member angular_damp_mode], you can set [member angular_damp] to be added to or to replace the body's damping value.  
         *  See [member ProjectSettings.physics/2d/default_angular_damp] for more details about damping.  
         */
        get angular_damp(): float64
        set angular_damp(value: float64)
        
        /** The body's total constant positional forces applied during each physics update.  
         *  See [method add_constant_force] and [method add_constant_central_force].  
         */
        get constant_force(): Vector2
        set constant_force(value: Vector2)
        
        /** The body's total constant rotational forces applied during each physics update.  
         *  See [method add_constant_torque].  
         */
        get constant_torque(): float64
        set constant_torque(value: float64)
        
        /** Emitted when one of this RigidBody2D's [Shape2D]s collides with another [PhysicsBody2D] or [TileMap]'s [Shape2D]s. Requires [member contact_monitor] to be set to `true` and [member max_contacts_reported] to be set high enough to detect all the collisions. [TileMap]s are detected if the [TileSet] has Collision [Shape2D]s.  
         *  [param body_rid] the [RID] of the other [PhysicsBody2D] or [TileSet]'s [CollisionObject2D] used by the [PhysicsServer2D].  
         *  [param body] the [Node], if it exists in the tree, of the other [PhysicsBody2D] or [TileMap].  
         *  [param body_shape_index] the index of the [Shape2D] of the other [PhysicsBody2D] or [TileMap] used by the [PhysicsServer2D]. Get the [CollisionShape2D] node with `body.shape_owner_get_owner(body.shape_find_owner(body_shape_index))`.  
         *  [param local_shape_index] the index of the [Shape2D] of this RigidBody2D used by the [PhysicsServer2D]. Get the [CollisionShape2D] node with `self.shape_owner_get_owner(self.shape_find_owner(local_shape_index))`.  
         */
        readonly body_shape_entered: Signal<(body_rid: RID, body: Node, body_shape_index: int64, local_shape_index: int64) => void>
        
        /** Emitted when the collision between one of this RigidBody2D's [Shape2D]s and another [PhysicsBody2D] or [TileMap]'s [Shape2D]s ends. Requires [member contact_monitor] to be set to `true` and [member max_contacts_reported] to be set high enough to detect all the collisions. [TileMap]s are detected if the [TileSet] has Collision [Shape2D]s.  
         *  [param body_rid] the [RID] of the other [PhysicsBody2D] or [TileSet]'s [CollisionObject2D] used by the [PhysicsServer2D].  
         *  [param body] the [Node], if it exists in the tree, of the other [PhysicsBody2D] or [TileMap].  
         *  [param body_shape_index] the index of the [Shape2D] of the other [PhysicsBody2D] or [TileMap] used by the [PhysicsServer2D]. Get the [CollisionShape2D] node with `body.shape_owner_get_owner(body.shape_find_owner(body_shape_index))`.  
         *  [param local_shape_index] the index of the [Shape2D] of this RigidBody2D used by the [PhysicsServer2D]. Get the [CollisionShape2D] node with `self.shape_owner_get_owner(self.shape_find_owner(local_shape_index))`.  
         */
        readonly body_shape_exited: Signal<(body_rid: RID, body: Node, body_shape_index: int64, local_shape_index: int64) => void>
        
        /** Emitted when a collision with another [PhysicsBody2D] or [TileMap] occurs. Requires [member contact_monitor] to be set to `true` and [member max_contacts_reported] to be set high enough to detect all the collisions. [TileMap]s are detected if the [TileSet] has Collision [Shape2D]s.  
         *  [param body] the [Node], if it exists in the tree, of the other [PhysicsBody2D] or [TileMap].  
         */
        readonly body_entered: Signal<(body: Node) => void>
        
        /** Emitted when the collision with another [PhysicsBody2D] or [TileMap] ends. Requires [member contact_monitor] to be set to `true` and [member max_contacts_reported] to be set high enough to detect all the collisions. [TileMap]s are detected if the [TileSet] has Collision [Shape2D]s.  
         *  [param body] the [Node], if it exists in the tree, of the other [PhysicsBody2D] or [TileMap].  
         */
        readonly body_exited: Signal<(body: Node) => void>
        
        /** Emitted when the physics engine changes the body's sleeping state.  
         *      
         *  **Note:** Changing the value [member sleeping] will not trigger this signal. It is only emitted if the sleeping state is changed by the physics engine or `emit_signal("sleeping_state_changed")` is used.  
         */
        readonly sleeping_state_changed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapRigidBody2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapRigidBody2D;
    }
    namespace RigidBody3D {
        enum FreezeMode {
            /** Static body freeze mode (default). The body is not affected by gravity and forces. It can be only moved by user code and doesn't collide with other bodies along its path. */
            FREEZE_MODE_STATIC = 0,
            
            /** Kinematic body freeze mode. Similar to [constant FREEZE_MODE_STATIC], but collides with other bodies along its path when moved. Useful for a frozen body that needs to be animated. */
            FREEZE_MODE_KINEMATIC = 1,
        }
        enum CenterOfMassMode {
            /** In this mode, the body's center of mass is calculated automatically based on its shapes. This assumes that the shapes' origins are also their center of mass. */
            CENTER_OF_MASS_MODE_AUTO = 0,
            
            /** In this mode, the body's center of mass is set through [member center_of_mass]. Defaults to the body's origin position. */
            CENTER_OF_MASS_MODE_CUSTOM = 1,
        }
        enum DampMode {
            /** In this mode, the body's damping value is added to any value set in areas or the default value. */
            DAMP_MODE_COMBINE = 0,
            
            /** In this mode, the body's damping value replaces any value set in areas or the default value. */
            DAMP_MODE_REPLACE = 1,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapRigidBody3D extends __RPCMapPhysicsBody3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapRigidBody3D extends __NameMapPhysicsBody3D {
    }
    /** A 3D physics body that is moved by a physics simulation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_rigidbody3d.html  
     */
    class RigidBody3D<Map extends NodePathMap = any> extends PhysicsBody3D<Map> {
        constructor(identifier?: any)
        /** Called during physics processing, allowing you to read and safely modify the simulation state for the object. By default, it is called before the standard force integration, but the [member custom_integrator] property allows you to disable the standard force integration and do fully custom force integration for a body. */
        /* gdvirtual */ _integrate_forces(state: PhysicsDirectBodyState3D): void
        
        /** Returns the inverse inertia tensor basis. This is used to calculate the angular acceleration resulting from a torque applied to the [RigidBody3D]. */
        get_inverse_inertia_tensor(): Basis
        
        /** Returns the number of contacts this body has with other bodies. By default, this returns 0 unless bodies are configured to monitor contacts (see [member contact_monitor]).  
         *      
         *  **Note:** To retrieve the colliding bodies, use [method get_colliding_bodies].  
         */
        get_contact_count(): int64
        
        /** Sets an axis velocity. The velocity in the given vector axis will be set as the given vector length. This is useful for jumping behavior. */
        set_axis_velocity(axis_velocity: Vector3): void
        
        /** Applies a directional impulse without affecting rotation.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         *  This is equivalent to using [method apply_impulse] at the body's center of mass.  
         */
        apply_central_impulse(impulse: Vector3): void
        
        /** Applies a positioned impulse to the body.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         *  [param position] is the offset from the body origin in global coordinates.  
         */
        apply_impulse(impulse: Vector3, position?: Vector3 /* = new Vector3(0, 0, 0) */): void
        
        /** Applies a rotational impulse to the body without affecting the position.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         *      
         *  **Note:** [member inertia] is required for this to work. To have [member inertia], an active [CollisionShape3D] must be a child of the node, or you can manually set [member inertia].  
         */
        apply_torque_impulse(impulse: Vector3): void
        
        /** Applies a directional force without affecting rotation. A force is time dependent and meant to be applied every physics update.  
         *  This is equivalent to using [method apply_force] at the body's center of mass.  
         */
        apply_central_force(force: Vector3): void
        
        /** Applies a positioned force to the body. A force is time dependent and meant to be applied every physics update.  
         *  [param position] is the offset from the body origin in global coordinates.  
         */
        apply_force(force: Vector3, position?: Vector3 /* = new Vector3(0, 0, 0) */): void
        
        /** Applies a rotational force without affecting position. A force is time dependent and meant to be applied every physics update.  
         *      
         *  **Note:** [member inertia] is required for this to work. To have [member inertia], an active [CollisionShape3D] must be a child of the node, or you can manually set [member inertia].  
         */
        apply_torque(torque: Vector3): void
        
        /** Adds a constant directional force without affecting rotation that keeps being applied over time until cleared with `constant_force = Vector3(0, 0, 0)`.  
         *  This is equivalent to using [method add_constant_force] at the body's center of mass.  
         */
        add_constant_central_force(force: Vector3): void
        
        /** Adds a constant positioned force to the body that keeps being applied over time until cleared with `constant_force = Vector3(0, 0, 0)`.  
         *  [param position] is the offset from the body origin in global coordinates.  
         */
        add_constant_force(force: Vector3, position?: Vector3 /* = new Vector3(0, 0, 0) */): void
        
        /** Adds a constant rotational force without affecting position that keeps being applied over time until cleared with `constant_torque = Vector3(0, 0, 0)`. */
        add_constant_torque(torque: Vector3): void
        
        /** Returns a list of the bodies colliding with this one. Requires [member contact_monitor] to be set to `true` and [member max_contacts_reported] to be set high enough to detect all the collisions.  
         *      
         *  **Note:** The result of this test is not immediate after moving objects. For performance, list of collisions is updated once per frame and before the physics step. Consider using signals instead.  
         */
        get_colliding_bodies(): GArray<Node3D>
        
        /** The body's mass. */
        get mass(): float64
        set mass(value: float64)
        
        /** The physics material override for the body.  
         *  If a material is assigned to this property, it will be used instead of any other physics material, such as an inherited one.  
         */
        get physics_material_override(): null | PhysicsMaterial
        set physics_material_override(value: null | PhysicsMaterial)
        
        /** This is multiplied by [member ProjectSettings.physics/3d/default_gravity] to produce this body's gravity. For example, a value of `1.0` will apply normal gravity, `2.0` will apply double the gravity, and `0.5` will apply half the gravity to this body. */
        get gravity_scale(): float64
        set gravity_scale(value: float64)
        
        /** Defines the way the body's center of mass is set. */
        get center_of_mass_mode(): int64
        set center_of_mass_mode(value: int64)
        
        /** The body's custom center of mass, relative to the body's origin position, when [member center_of_mass_mode] is set to [constant CENTER_OF_MASS_MODE_CUSTOM]. This is the balanced point of the body, where applied forces only cause linear acceleration. Applying forces outside of the center of mass causes angular acceleration.  
         *  When [member center_of_mass_mode] is set to [constant CENTER_OF_MASS_MODE_AUTO] (default value), the center of mass is automatically determined, but this does not update the value of [member center_of_mass].  
         */
        get center_of_mass(): Vector3
        set center_of_mass(value: Vector3)
        
        /** The body's moment of inertia. This is like mass, but for rotation: it determines how much torque it takes to rotate the body on each axis. The moment of inertia is usually computed automatically from the mass and the shapes, but this property allows you to set a custom value.  
         *  If set to [constant Vector3.ZERO], inertia is automatically computed (default value).  
         *      
         *  **Note:** This value does not change when inertia is automatically computed. Use [PhysicsServer3D] to get the computed inertia.  
         *    
         */
        get inertia(): Vector3
        set inertia(value: Vector3)
        
        /** If `true`, the body will not move and will not calculate forces until woken up by another body through, for example, a collision, or by using the [method apply_impulse] or [method apply_force] methods. */
        get sleeping(): boolean
        set sleeping(value: boolean)
        
        /** If `true`, the body can enter sleep mode when there is no movement. See [member sleeping]. */
        get can_sleep(): boolean
        set can_sleep(value: boolean)
        
        /** If `true`, the body cannot rotate. Gravity and forces only apply linear movement. */
        get lock_rotation(): boolean
        set lock_rotation(value: boolean)
        
        /** If `true`, the body is frozen. Gravity and forces are not applied anymore.  
         *  See [member freeze_mode] to set the body's behavior when frozen.  
         *      
         *  **Note:** For a body that is always frozen, use [StaticBody3D] or [AnimatableBody3D] instead.  
         */
        get freeze(): boolean
        set freeze(value: boolean)
        
        /** The body's freeze mode. Determines the body's behavior when [member freeze] is `true`.  
         *      
         *  **Note:** For a body that is always frozen, use [StaticBody3D] or [AnimatableBody3D] instead.  
         */
        get freeze_mode(): int64
        set freeze_mode(value: int64)
        
        /** If `true`, the standard force integration (like gravity or damping) will be disabled for this body. Other than collision response, the body will only move as determined by the [method _integrate_forces] method, if that virtual method is overridden.  
         *  Setting this property will call the method [method PhysicsServer3D.body_set_omit_force_integration] internally.  
         */
        get custom_integrator(): boolean
        set custom_integrator(value: boolean)
        
        /** If `true`, continuous collision detection is used.  
         *  Continuous collision detection tries to predict where a moving body will collide, instead of moving it and correcting its movement if it collided. Continuous collision detection is more precise, and misses fewer impacts by small, fast-moving objects. Not using continuous collision detection is faster to compute, but can miss small, fast-moving objects.  
         */
        get continuous_cd(): boolean
        set continuous_cd(value: boolean)
        
        /** If `true`, the RigidBody3D will emit signals when it collides with another body.  
         *      
         *  **Note:** By default the maximum contacts reported is set to 0, meaning nothing will be recorded, see [member max_contacts_reported].  
         */
        get contact_monitor(): boolean
        set contact_monitor(value: boolean)
        
        /** The maximum number of contacts that will be recorded. Requires a value greater than 0 and [member contact_monitor] to be set to `true` to start to register contacts. Use [method get_contact_count] to retrieve the count or [method get_colliding_bodies] to retrieve bodies that have been collided with.  
         *      
         *  **Note:** The number of contacts is different from the number of collisions. Collisions between parallel edges will result in two contacts (one at each end), and collisions between parallel faces will result in four contacts (one at each corner).  
         */
        get max_contacts_reported(): int64
        set max_contacts_reported(value: int64)
        
        /** The body's linear velocity in units per second. Can be used sporadically, but **don't set this every frame**, because physics may run in another thread and runs at a different granularity. Use [method _integrate_forces] as your process loop for precise control of the body state. */
        get linear_velocity(): Vector3
        set linear_velocity(value: Vector3)
        
        /** Defines how [member linear_damp] is applied. */
        get linear_damp_mode(): int64
        set linear_damp_mode(value: int64)
        
        /** Damps the body's movement. By default, the body will use the [member ProjectSettings.physics/3d/default_linear_damp] project setting or any value override set by an [Area3D] the body is in. Depending on [member linear_damp_mode], you can set [member linear_damp] to be added to or to replace the body's damping value.  
         *  See [member ProjectSettings.physics/3d/default_linear_damp] for more details about damping.  
         */
        get linear_damp(): float64
        set linear_damp(value: float64)
        
        /** The RigidBody3D's rotational velocity in  *radians*  per second. */
        get angular_velocity(): Vector3
        set angular_velocity(value: Vector3)
        
        /** Defines how [member angular_damp] is applied. */
        get angular_damp_mode(): int64
        set angular_damp_mode(value: int64)
        
        /** Damps the body's rotation. By default, the body will use the [member ProjectSettings.physics/3d/default_angular_damp] project setting or any value override set by an [Area3D] the body is in. Depending on [member angular_damp_mode], you can set [member angular_damp] to be added to or to replace the body's damping value.  
         *  See [member ProjectSettings.physics/3d/default_angular_damp] for more details about damping.  
         */
        get angular_damp(): float64
        set angular_damp(value: float64)
        
        /** The body's total constant positional forces applied during each physics update.  
         *  See [method add_constant_force] and [method add_constant_central_force].  
         */
        get constant_force(): Vector3
        set constant_force(value: Vector3)
        
        /** The body's total constant rotational forces applied during each physics update.  
         *  See [method add_constant_torque].  
         */
        get constant_torque(): Vector3
        set constant_torque(value: Vector3)
        
        /** Emitted when one of this RigidBody3D's [Shape3D]s collides with another [PhysicsBody3D] or [GridMap]'s [Shape3D]s. Requires [member contact_monitor] to be set to `true` and [member max_contacts_reported] to be set high enough to detect all the collisions. [GridMap]s are detected if the [MeshLibrary] has Collision [Shape3D]s.  
         *  [param body_rid] the [RID] of the other [PhysicsBody3D] or [MeshLibrary]'s [CollisionObject3D] used by the [PhysicsServer3D].  
         *  [param body] the [Node], if it exists in the tree, of the other [PhysicsBody3D] or [GridMap].  
         *  [param body_shape_index] the index of the [Shape3D] of the other [PhysicsBody3D] or [GridMap] used by the [PhysicsServer3D]. Get the [CollisionShape3D] node with `body.shape_owner_get_owner(body.shape_find_owner(body_shape_index))`.  
         *  [param local_shape_index] the index of the [Shape3D] of this RigidBody3D used by the [PhysicsServer3D]. Get the [CollisionShape3D] node with `self.shape_owner_get_owner(self.shape_find_owner(local_shape_index))`.  
         */
        readonly body_shape_entered: Signal<(body_rid: RID, body: Node, body_shape_index: int64, local_shape_index: int64) => void>
        
        /** Emitted when the collision between one of this RigidBody3D's [Shape3D]s and another [PhysicsBody3D] or [GridMap]'s [Shape3D]s ends. Requires [member contact_monitor] to be set to `true` and [member max_contacts_reported] to be set high enough to detect all the collisions. [GridMap]s are detected if the [MeshLibrary] has Collision [Shape3D]s.  
         *  [param body_rid] the [RID] of the other [PhysicsBody3D] or [MeshLibrary]'s [CollisionObject3D] used by the [PhysicsServer3D]. [GridMap]s are detected if the Meshes have [Shape3D]s.  
         *  [param body] the [Node], if it exists in the tree, of the other [PhysicsBody3D] or [GridMap].  
         *  [param body_shape_index] the index of the [Shape3D] of the other [PhysicsBody3D] or [GridMap] used by the [PhysicsServer3D]. Get the [CollisionShape3D] node with `body.shape_owner_get_owner(body.shape_find_owner(body_shape_index))`.  
         *  [param local_shape_index] the index of the [Shape3D] of this RigidBody3D used by the [PhysicsServer3D]. Get the [CollisionShape3D] node with `self.shape_owner_get_owner(self.shape_find_owner(local_shape_index))`.  
         */
        readonly body_shape_exited: Signal<(body_rid: RID, body: Node, body_shape_index: int64, local_shape_index: int64) => void>
        
        /** Emitted when a collision with another [PhysicsBody3D] or [GridMap] occurs. Requires [member contact_monitor] to be set to `true` and [member max_contacts_reported] to be set high enough to detect all the collisions. [GridMap]s are detected if the [MeshLibrary] has Collision [Shape3D]s.  
         *  [param body] the [Node], if it exists in the tree, of the other [PhysicsBody3D] or [GridMap].  
         */
        readonly body_entered: Signal<(body: Node) => void>
        
        /** Emitted when the collision with another [PhysicsBody3D] or [GridMap] ends. Requires [member contact_monitor] to be set to `true` and [member max_contacts_reported] to be set high enough to detect all the collisions. [GridMap]s are detected if the [MeshLibrary] has Collision [Shape3D]s.  
         *  [param body] the [Node], if it exists in the tree, of the other [PhysicsBody3D] or [GridMap].  
         */
        readonly body_exited: Signal<(body: Node) => void>
        
        /** Emitted when the physics engine changes the body's sleeping state.  
         *      
         *  **Note:** Changing the value [member sleeping] will not trigger this signal. It is only emitted if the sleeping state is changed by the physics engine or `emit_signal("sleeping_state_changed")` is used.  
         */
        readonly sleeping_state_changed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapRigidBody3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapRigidBody3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapRootMotionView extends __RPCMapVisualInstance3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapRootMotionView extends __NameMapVisualInstance3D {
    }
    /** Editor-only helper for setting up root motion in [AnimationMixer].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_rootmotionview.html  
     */
    class RootMotionView<Map extends NodePathMap = any> extends VisualInstance3D<Map> {
        constructor(identifier?: any)
        /** Path to an [AnimationMixer] node to use as a basis for root motion. */
        get animation_path(): NodePath
        set animation_path(value: NodePath | string)
        
        /** The grid's color. */
        get color(): Color
        set color(value: Color)
        
        /** The grid's cell size in 3D units. */
        get cell_size(): float64
        set cell_size(value: float64)
        
        /** The grid's radius in 3D units. The grid's opacity will fade gradually as the distance from the origin increases until this [member radius] is reached. */
        get radius(): float64
        set radius(value: float64)
        
        /** If `true`, the grid's points will all be on the same Y coordinate ( *local*  Y = 0). If `false`, the points' original Y coordinate is preserved. */
        get zero_y(): boolean
        set zero_y(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapRootMotionView;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapRootMotionView;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSceneMultiplayer extends __RPCMapMultiplayerAPI {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSceneMultiplayer extends __NameMapMultiplayerAPI {
    }
    /** High-level multiplayer API implementation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_scenemultiplayer.html  
     */
    class SceneMultiplayer extends MultiplayerAPI {
        constructor(identifier?: any)
        /** Clears the current SceneMultiplayer network state (you shouldn't call this unless you know what you are doing). */
        clear(): void
        
        /** Disconnects the peer identified by [param id], removing it from the list of connected peers, and closing the underlying connection with it. */
        disconnect_peer(id: int64): void
        
        /** Returns the IDs of the peers currently trying to authenticate with this [MultiplayerAPI]. */
        get_authenticating_peers(): PackedInt32Array
        
        /** Sends the specified [param data] to the remote peer identified by [param id] as part of an authentication message. This can be used to authenticate peers, and control when [signal MultiplayerAPI.peer_connected] is emitted (and the remote peer accepted as one of the connected peers). */
        send_auth(id: int64, data: PackedByteArray | byte[] | ArrayBuffer): Error
        
        /** Mark the authentication step as completed for the remote peer identified by [param id]. The [signal MultiplayerAPI.peer_connected] signal will be emitted for this peer once the remote side also completes the authentication. No further authentication messages are expected to be received from this peer.  
         *  If a peer disconnects before completing authentication, either due to a network issue, the [member auth_timeout] expiring, or manually calling [method disconnect_peer], the [signal peer_authentication_failed] signal will be emitted instead of [signal MultiplayerAPI.peer_disconnected].  
         */
        complete_auth(id: int64): Error
        
        /** Sends the given raw [param bytes] to a specific peer identified by [param id] (see [method MultiplayerPeer.set_target_peer]). Default ID is `0`, i.e. broadcast to all peers. */
        send_bytes(bytes: PackedByteArray | byte[] | ArrayBuffer, id?: int64 /* = 0 */, mode?: MultiplayerPeer.TransferMode /* = 2 */, channel?: int64 /* = 0 */): Error
        
        /** The root path to use for RPCs and replication. Instead of an absolute path, a relative path will be used to find the node upon which the RPC should be executed.  
         *  This effectively allows to have different branches of the scene tree to be managed by different MultiplayerAPI, allowing for example to run both client and server in the same scene.  
         */
        get root_path(): NodePath
        set root_path(value: NodePath | string)
        
        /** The callback to execute when receiving authentication data sent via [method send_auth]. If the [Callable] is empty (default), peers will be automatically accepted as soon as they connect. */
        get auth_callback(): Callable
        set auth_callback(value: Callable)
        
        /** If set to a value greater than `0.0`, the maximum duration in seconds peers can stay in the authenticating state, after which the authentication will automatically fail. See the [signal peer_authenticating] and [signal peer_authentication_failed] signals. */
        get auth_timeout(): float64
        set auth_timeout(value: float64)
        
        /** If `true`, the MultiplayerAPI will allow encoding and decoding of object during RPCs.  
         *  **Warning:** Deserialized objects can contain code which gets executed. Do not use this option if the serialized object comes from untrusted sources to avoid potential security threat such as remote code execution.  
         */
        get allow_object_decoding(): boolean
        set allow_object_decoding(value: boolean)
        
        /** If `true`, the MultiplayerAPI's [member MultiplayerAPI.multiplayer_peer] refuses new incoming connections. */
        get refuse_new_connections(): boolean
        set refuse_new_connections(value: boolean)
        
        /** Enable or disable the server feature that notifies clients of other peers' connection/disconnection, and relays messages between them. When this option is `false`, clients won't be automatically notified of other peers and won't be able to send them packets through the server.  
         *      
         *  **Note:** Changing this option while other peers are connected may lead to unexpected behaviors.  
         *      
         *  **Note:** Support for this feature may depend on the current [MultiplayerPeer] configuration. See [method MultiplayerPeer.is_server_relay_supported].  
         */
        get server_relay(): boolean
        set server_relay(value: boolean)
        
        /** Maximum size of each synchronization packet. Higher values increase the chance of receiving full updates in a single frame, but also the chance of packet loss. See [MultiplayerSynchronizer]. */
        get max_sync_packet_size(): int64
        set max_sync_packet_size(value: int64)
        
        /** Maximum size of each delta packet. Higher values increase the chance of receiving full updates in a single frame, but also the chance of causing networking congestion (higher latency, disconnections). See [MultiplayerSynchronizer]. */
        get max_delta_packet_size(): int64
        set max_delta_packet_size(value: int64)
        
        /** Emitted when this MultiplayerAPI's [member MultiplayerAPI.multiplayer_peer] connects to a new peer and a valid [member auth_callback] is set. In this case, the [signal MultiplayerAPI.peer_connected] will not be emitted until [method complete_auth] is called with given peer [param id]. While in this state, the peer will not be included in the list returned by [method MultiplayerAPI.get_peers] (but in the one returned by [method get_authenticating_peers]), and only authentication data will be sent or received. See [method send_auth] for sending authentication data. */
        readonly peer_authenticating: Signal<(id: int64) => void>
        
        /** Emitted when this MultiplayerAPI's [member MultiplayerAPI.multiplayer_peer] disconnects from a peer for which authentication had not yet completed. See [signal peer_authenticating]. */
        readonly peer_authentication_failed: Signal<(id: int64) => void>
        
        /** Emitted when this MultiplayerAPI's [member MultiplayerAPI.multiplayer_peer] receives a [param packet] with custom data (see [method send_bytes]). ID is the peer ID of the peer that sent the packet. */
        readonly peer_packet: Signal<(id: int64, packet: PackedByteArray) => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSceneMultiplayer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSceneMultiplayer;
    }
    namespace SceneReplicationConfig {
        enum ReplicationMode {
            /** Do not keep the given property synchronized. */
            REPLICATION_MODE_NEVER = 0,
            
            /** Replicate the given property on process by constantly sending updates using unreliable transfer mode. */
            REPLICATION_MODE_ALWAYS = 1,
            
            /** Replicate the given property on process by sending updates using reliable transfer mode when its value changes. */
            REPLICATION_MODE_ON_CHANGE = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSceneReplicationConfig extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSceneReplicationConfig extends __NameMapResource {
    }
    /** Configuration for properties to synchronize with a [MultiplayerSynchronizer].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_scenereplicationconfig.html  
     */
    class SceneReplicationConfig extends Resource {
        constructor(identifier?: any)
        /** Returns a list of synchronized property [NodePath]s. */
        get_properties(): GArray<NodePath>
        
        /** Adds the property identified by the given [param path] to the list of the properties being synchronized, optionally passing an [param index].  
         *      
         *  **Note:** For details on restrictions and limitations on property synchronization, see [MultiplayerSynchronizer].  
         */
        add_property(path: NodePath | string, index?: int64 /* = -1 */): void
        
        /** Returns `true` if the given [param path] is configured for synchronization. */
        has_property(path: NodePath | string): boolean
        
        /** Removes the property identified by the given [param path] from the configuration. */
        remove_property(path: NodePath | string): void
        
        /** Finds the index of the given [param path]. */
        property_get_index(path: NodePath | string): int64
        
        /** Returns `true` if the property identified by the given [param path] is configured to be synchronized on spawn. */
        property_get_spawn(path: NodePath | string): boolean
        
        /** Sets whether the property identified by the given [param path] is configured to be synchronized on spawn. */
        property_set_spawn(path: NodePath | string, enabled: boolean): void
        
        /** Returns the replication mode for the property identified by the given [param path]. */
        property_get_replication_mode(path: NodePath | string): SceneReplicationConfig.ReplicationMode
        
        /** Sets the synchronization mode for the property identified by the given [param path]. */
        property_set_replication_mode(path: NodePath | string, mode: SceneReplicationConfig.ReplicationMode): void
        
        /** Returns `true` if the property identified by the given [param path] is configured to be synchronized on process. */
        property_get_sync(path: NodePath | string): boolean
        
        /** Sets whether the property identified by the given [param path] is configured to be synchronized on process. */
        property_set_sync(path: NodePath | string, enabled: boolean): void
        
        /** Returns `true` if the property identified by the given [param path] is configured to be reliably synchronized when changes are detected on process. */
        property_get_watch(path: NodePath | string): boolean
        
        /** Sets whether the property identified by the given [param path] is configured to be reliably synchronized when changes are detected on process. */
        property_set_watch(path: NodePath | string, enabled: boolean): void
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSceneReplicationConfig;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSceneReplicationConfig;
    }
    namespace SceneState {
        enum GenEditState {
            /** If passed to [method PackedScene.instantiate], blocks edits to the scene state. */
            GEN_EDIT_STATE_DISABLED = 0,
            
            /** If passed to [method PackedScene.instantiate], provides inherited scene resources to the local scene.  
             *      
             *  **Note:** Only available in editor builds.  
             */
            GEN_EDIT_STATE_INSTANCE = 1,
            
            /** If passed to [method PackedScene.instantiate], provides local scene resources to the local scene. Only the main scene should receive the main edit state.  
             *      
             *  **Note:** Only available in editor builds.  
             */
            GEN_EDIT_STATE_MAIN = 2,
            
            /** If passed to [method PackedScene.instantiate], it's similar to [constant GEN_EDIT_STATE_MAIN], but for the case where the scene is being instantiated to be the base of another one.  
             *      
             *  **Note:** Only available in editor builds.  
             */
            GEN_EDIT_STATE_MAIN_INHERITED = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSceneState extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSceneState extends __NameMapRefCounted {
    }
    /** Provides access to a scene file's information.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_scenestate.html  
     */
    class SceneState extends RefCounted {
        constructor(identifier?: any)
        /** Returns the resource path to the represented [PackedScene]. */
        get_path(): string
        
        /** Returns the [SceneState] of the scene that this scene inherits from, or `null` if it doesn't inherit from any scene. */
        get_base_scene_state(): null | SceneState
        
        /** Returns the number of nodes in the scene.  
         *  The `idx` argument used to query node data in other `get_node_*` methods in the interval `[0, get_node_count() - 1]`.  
         */
        get_node_count(): int64
        
        /** Returns the type of the node at [param idx]. */
        get_node_type(idx: int64): StringName
        
        /** Returns the name of the node at [param idx]. */
        get_node_name(idx: int64): StringName
        
        /** Returns the path to the node at [param idx].  
         *  If [param for_parent] is `true`, returns the path of the [param idx] node's parent instead.  
         */
        get_node_path(idx: int64, for_parent?: boolean /* = false */): NodePath
        
        /** Returns the path to the owner of the node at [param idx], relative to the root node. */
        get_node_owner_path(idx: int64): NodePath
        
        /** Returns `true` if the node at [param idx] is an [InstancePlaceholder]. */
        is_node_instance_placeholder(idx: int64): boolean
        
        /** Returns the path to the represented scene file if the node at [param idx] is an [InstancePlaceholder]. */
        get_node_instance_placeholder(idx: int64): string
        
        /** Returns a [PackedScene] for the node at [param idx] (i.e. the whole branch starting at this node, with its child nodes and resources), or `null` if the node is not an instance. */
        get_node_instance(idx: int64): null | PackedScene
        
        /** Returns the list of group names associated with the node at [param idx]. */
        get_node_groups(idx: int64): PackedStringArray
        
        /** Returns the node's index, which is its position relative to its siblings. This is only relevant and saved in scenes for cases where new nodes are added to an instantiated or inherited scene among siblings from the base scene. Despite the name, this index is not related to the [param idx] argument used here and in other methods. */
        get_node_index(idx: int64): int64
        
        /** Returns the number of exported or overridden properties for the node at [param idx].  
         *  The `prop_idx` argument used to query node property data in other `get_node_property_*` methods in the interval `[0, get_node_property_count() - 1]`.  
         */
        get_node_property_count(idx: int64): int64
        
        /** Returns the name of the property at [param prop_idx] for the node at [param idx]. */
        get_node_property_name(idx: int64, prop_idx: int64): StringName
        
        /** Returns the value of the property at [param prop_idx] for the node at [param idx]. */
        get_node_property_value(idx: int64, prop_idx: int64): any
        
        /** Returns the number of signal connections in the scene.  
         *  The `idx` argument used to query connection metadata in other `get_connection_*` methods in the interval `[0, get_connection_count() - 1]`.  
         */
        get_connection_count(): int64
        
        /** Returns the path to the node that owns the signal at [param idx], relative to the root node. */
        get_connection_source(idx: int64): NodePath
        
        /** Returns the name of the signal at [param idx]. */
        get_connection_signal(idx: int64): StringName
        
        /** Returns the path to the node that owns the method connected to the signal at [param idx], relative to the root node. */
        get_connection_target(idx: int64): NodePath
        
        /** Returns the method connected to the signal at [param idx]. */
        get_connection_method(idx: int64): StringName
        
        /** Returns the connection flags for the signal at [param idx]. See [enum Object.ConnectFlags] constants. */
        get_connection_flags(idx: int64): int64
        
        /** Returns the list of bound parameters for the signal at [param idx]. */
        get_connection_binds(idx: int64): GArray
        
        /** Returns the number of unbound parameters for the signal at [param idx]. */
        get_connection_unbinds(idx: int64): int64
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSceneState;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSceneState;
    }
    namespace SceneTree {
        enum GroupCallFlags {
            /** Call nodes within a group with no special behavior (default). */
            GROUP_CALL_DEFAULT = 0,
            
            /** Call nodes within a group in reverse tree hierarchy order (all nested children are called before their respective parent nodes). */
            GROUP_CALL_REVERSE = 1,
            
            /** Call nodes within a group at the end of the current frame (can be either process or physics frame), similar to [method Object.call_deferred]. */
            GROUP_CALL_DEFERRED = 2,
            
            /** Call nodes within a group only once, even if the call is executed many times in the same frame. Must be combined with [constant GROUP_CALL_DEFERRED] to work.  
             *      
             *  **Note:** Different arguments are not taken into account. Therefore, when the same call is executed with different arguments, only the first call will be performed.  
             */
            GROUP_CALL_UNIQUE = 4,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSceneTree extends __RPCMapMainLoop {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSceneTree extends __NameMapMainLoop {
    }
    /** Manages the game loop via a hierarchy of nodes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_scenetree.html  
     */
    class SceneTree extends MainLoop {
        constructor(identifier?: any)
        /** Returns `true` if a node added to the given group [param name] exists in the tree. */
        has_group(name: StringName): boolean
        
        /** Returns `true` if accessibility features are enabled, and accessibility information updates are actively processed. */
        is_accessibility_enabled(): boolean
        
        /** Returns `true` if accessibility features are supported by the OS and enabled in project settings. */
        is_accessibility_supported(): boolean
        
        /** Returns a new [SceneTreeTimer]. After [param time_sec] in seconds have passed, the timer will emit [signal SceneTreeTimer.timeout] and will be automatically freed.  
         *  If [param process_always] is `false`, the timer will be paused when setting [member SceneTree.paused] to `true`.  
         *  If [param process_in_physics] is `true`, the timer will update at the end of the physics frame, instead of the process frame.  
         *  If [param ignore_time_scale] is `true`, the timer will ignore [member Engine.time_scale] and update with the real, elapsed time.  
         *  This method is commonly used to create a one-shot delay timer, as in the following example:  
         *    
         *      
         *  **Note:** The timer is always updated  *after*  all of the nodes in the tree. A node's [method Node._process] method would be called before the timer updates (or [method Node._physics_process] if [param process_in_physics] is set to `true`).  
         */
        create_timer(time_sec: float64, process_always?: boolean /* = true */, process_in_physics?: boolean /* = false */, ignore_time_scale?: boolean /* = false */): SceneTreeTimer
        
        /** Creates and returns a new [Tween] processed in this tree. The Tween will start automatically on the next process frame or physics frame (depending on its [enum Tween.TweenProcessMode]).  
         *      
         *  **Note:** A [Tween] created using this method is not bound to any [Node]. It may keep working until there is nothing left to animate. If you want the [Tween] to be automatically killed when the [Node] is freed, use [method Node.create_tween] or [method Tween.bind_node].  
         */
        create_tween(): Tween
        
        /** Returns an [Array] of currently existing [Tween]s in the tree, including paused tweens. */
        get_processed_tweens(): GArray<Tween>
        
        /** Returns the number of nodes inside this tree. */
        get_node_count(): int64
        
        /** Returns how many physics process steps have been processed, since the application started. This is  *not*  a measurement of elapsed time. See also [signal physics_frame]. For the number of frames rendered, see [method Engine.get_process_frames]. */
        get_frame(): int64
        
        /** Quits the application at the end of the current iteration, with the given [param exit_code].  
         *  By convention, an exit code of `0` indicates success, whereas any other exit code indicates an error. For portability reasons, it should be between `0` and `125` (inclusive).  
         *      
         *  **Note:** On iOS this method doesn't work. Instead, as recommended by the [url=https://developer.apple.com/library/archive/qa/qa1561/_index.html]iOS Human Interface Guidelines[/url], the user is expected to close apps via the Home button.  
         */
        quit(exit_code?: int64 /* = 0 */): void
        
        /** Queues the given [param obj] to be deleted, calling its [method Object.free] at the end of the current frame. This method is similar to [method Node.queue_free]. */
        queue_delete(obj: Object): void
        
        /** Calls the given [param method] on each node inside this tree added to the given [param group]. Use [param flags] to customize this method's behavior (see [enum GroupCallFlags]). Additional arguments for [param method] can be passed at the end of this method. Nodes that cannot call [param method] (either because the method doesn't exist or the arguments do not match) are ignored.  
         *    
         *      
         *  **Note:** In C#, [param method] must be in snake_case when referring to built-in Godot methods. Prefer using the names exposed in the `MethodName` class to avoid allocating a new [StringName] on each call.  
         */
        call_group_flags(flags: int64, group: StringName, method: StringName, ...varargs: any[]): void
        
        /** Calls [method Object.notification] with the given [param notification] to all nodes inside this tree added to the [param group]. Use [param call_flags] to customize this method's behavior (see [enum GroupCallFlags]). */
        notify_group_flags(call_flags: int64, group: StringName, notification: int64): void
        
        /** Sets the given [param property] to [param value] on all nodes inside this tree added to the given [param group]. Nodes that do not have the [param property] are ignored. Use [param call_flags] to customize this method's behavior (see [enum GroupCallFlags]).  
         *      
         *  **Note:** In C#, [param property] must be in snake_case when referring to built-in Godot properties. Prefer using the names exposed in the `PropertyName` class to avoid allocating a new [StringName] on each call.  
         */
        set_group_flags(call_flags: int64, group: StringName, property: string, value: any): void
        
        /** Calls [param method] on each node inside this tree added to the given [param group]. You can pass arguments to [param method] by specifying them at the end of this method call. Nodes that cannot call [param method] (either because the method doesn't exist or the arguments do not match) are ignored. See also [method set_group] and [method notify_group].  
         *      
         *  **Note:** This method acts immediately on all selected nodes at once, which may cause stuttering in some performance-intensive situations.  
         *      
         *  **Note:** In C#, [param method] must be in snake_case when referring to built-in Godot methods. Prefer using the names exposed in the `MethodName` class to avoid allocating a new [StringName] on each call.  
         */
        call_group(group: StringName, method: StringName, ...varargs: any[]): void
        
        /** Calls [method Object.notification] with the given [param notification] to all nodes inside this tree added to the [param group]. See also [url=https://docs.godotengine.org/en/4.6/tutorials/best_practices/godot_notifications.html]Godot notifications[/url] and [method call_group] and [method set_group].  
         *      
         *  **Note:** This method acts immediately on all selected nodes at once, which may cause stuttering in some performance-intensive situations.  
         */
        notify_group(group: StringName, notification: int64): void
        
        /** Sets the given [param property] to [param value] on all nodes inside this tree added to the given [param group]. Nodes that do not have the [param property] are ignored. See also [method call_group] and [method notify_group].  
         *      
         *  **Note:** This method acts immediately on all selected nodes at once, which may cause stuttering in some performance-intensive situations.  
         *      
         *  **Note:** In C#, [param property] must be in snake_case when referring to built-in Godot properties. Prefer using the names exposed in the `PropertyName` class to avoid allocating a new [StringName] on each call.  
         */
        set_group(group: StringName, property: string, value: any): void
        
        /** Returns an [Array] containing all nodes inside this tree, that have been added to the given [param group], in scene hierarchy order. */
        get_nodes_in_group(group: StringName): GArray<Node>
        
        /** Returns the first [Node] found inside the tree, that has been added to the given [param group], in scene hierarchy order. Returns `null` if no match is found. See also [method get_nodes_in_group]. */
        get_first_node_in_group(group: StringName): null | Node
        
        /** Returns the number of nodes assigned to the given group. */
        get_node_count_in_group(group: StringName): int64
        
        /** Changes the running scene to the one at the given [param path], after loading it into a [PackedScene] and creating a new instance.  
         *  Returns [constant OK] on success, [constant ERR_CANT_OPEN] if the [param path] cannot be loaded into a [PackedScene], or [constant ERR_CANT_CREATE] if that scene cannot be instantiated.  
         *      
         *  **Note:** See [method change_scene_to_node] for details on the order of operations.  
         */
        change_scene_to_file(path: string): Error
        
        /** Changes the running scene to a new instance of the given [PackedScene] (which must be valid).  
         *  Returns [constant OK] on success, [constant ERR_CANT_CREATE] if the scene cannot be instantiated, or [constant ERR_INVALID_PARAMETER] if the scene is invalid.  
         *      
         *  **Note:** See [method change_scene_to_node] for details on the order of operations.  
         */
        change_scene_to_packed(packed_scene: PackedScene): Error
        
        /** Changes the running scene to the provided [Node]. Useful when you want to set up the new scene before changing.  
         *  Returns [constant OK] on success, [constant ERR_INVALID_PARAMETER] if the [param node] is `null`, or [constant ERR_UNCONFIGURED] if the [param node] is already inside the scene tree.  
         *      
         *  **Note:** Operations happen in the following order when [method change_scene_to_node] is called:  
         *  1. The current scene node is immediately removed from the tree. From that point, [method Node.get_tree] called on the current (outgoing) scene will return `null`. [member current_scene] will be `null` too, because the new scene is not available yet.  
         *  2. At the end of the frame, the formerly current scene, already removed from the tree, will be deleted (freed from memory) and then the new scene node will be added to the tree. [method Node.get_tree] and [member current_scene] will be back to working as usual.  
         *  This ensures that both scenes aren't running at the same time, while still freeing the previous scene in a safe way similar to [method Node.queue_free].  
         *  If you want to reliably access the new scene, await the [signal scene_changed] signal.  
         *  **Warning:** After using this method, the [SceneTree] will take ownership of the node and will free it automatically when changing scene again. Any references you had to that node will become invalid.  
         */
        change_scene_to_node(node: Node): Error
        
        /** Reloads the currently active scene, replacing [member current_scene] with a new instance of its original [PackedScene].  
         *  Returns [constant OK] on success, [constant ERR_UNCONFIGURED] if no [member current_scene] is defined, [constant ERR_CANT_OPEN] if [member current_scene] cannot be loaded into a [PackedScene], or [constant ERR_CANT_CREATE] if the scene cannot be instantiated.  
         */
        reload_current_scene(): Error
        
        /** If a current scene is loaded, calling this method will unload it. */
        unload_current_scene(): void
        
        /** Sets a custom [MultiplayerAPI] with the given [param root_path] (controlling also the relative subpaths), or override the default one if [param root_path] is empty.  
         *      
         *  **Note:** No [MultiplayerAPI] must be configured for the subpath containing [param root_path], nested custom multiplayers are not allowed. I.e. if one is configured for `"/root/Foo"` setting one for `"/root/Foo/Bar"` will cause an error.  
         *      
         *  **Note:** [method set_multiplayer] should be called  *before*  the child nodes are ready at the given [param root_path]. If multiplayer nodes like [MultiplayerSpawner] or [MultiplayerSynchronizer] are added to the tree before the custom multiplayer API is set, they will not work.  
         */
        set_multiplayer(multiplayer: MultiplayerAPI, root_path?: NodePath | string /* = '' */): void
        
        /** Searches for the [MultiplayerAPI] configured for the given path, if one does not exist it searches the parent paths until one is found. If the path is empty, or none is found, the default one is returned. See [method set_multiplayer]. */
        get_multiplayer(for_path?: NodePath | string /* = '' */): null | MultiplayerAPI
        
        /** If `true`, the application automatically accepts quitting requests.  
         *  For mobile platforms, see [member quit_on_go_back].  
         */
        get auto_accept_quit(): boolean
        set auto_accept_quit(value: boolean)
        
        /** If `true`, the application quits automatically when navigating back (e.g. using the system "Back" button on Android).  
         *  To handle 'Go Back' button when this option is disabled, use [constant DisplayServer.WINDOW_EVENT_GO_BACK_REQUEST].  
         */
        get quit_on_go_back(): boolean
        set quit_on_go_back(value: boolean)
        
        /** If `true`, collision shapes will be visible when running the game from the editor for debugging purposes.  
         *      
         *  **Note:** This property is not designed to be changed at run-time. Changing the value of [member debug_collisions_hint] while the project is running will not have the desired effect.  
         */
        get debug_collisions_hint(): boolean
        set debug_collisions_hint(value: boolean)
        
        /** If `true`, curves from [Path2D] and [Path3D] nodes will be visible when running the game from the editor for debugging purposes.  
         *      
         *  **Note:** This property is not designed to be changed at run-time. Changing the value of [member debug_paths_hint] while the project is running will not have the desired effect.  
         */
        get debug_paths_hint(): boolean
        set debug_paths_hint(value: boolean)
        
        /** If `true`, navigation polygons will be visible when running the game from the editor for debugging purposes.  
         *      
         *  **Note:** This property is not designed to be changed at run-time. Changing the value of [member debug_navigation_hint] while the project is running will not have the desired effect.  
         */
        get debug_navigation_hint(): boolean
        set debug_navigation_hint(value: boolean)
        
        /** If `true`, the scene tree is considered paused. This causes the following behavior:  
         *  - 2D and 3D physics will be stopped, as well as collision detection and related signals.  
         *  - Depending on each node's [member Node.process_mode], their [method Node._process], [method Node._physics_process] and [method Node._input] callback methods may not called anymore.  
         */
        get paused(): boolean
        set paused(value: boolean)
        
        /** The root of the scene currently being edited in the editor. This is usually a direct child of [member root].  
         *      
         *  **Note:** This property does nothing in release builds.  
         */
        get edited_scene_root(): null | Node
        set edited_scene_root(value: null | Node)
        
        /** The root node of the currently loaded main scene, usually as a direct child of [member root]. See also [method change_scene_to_file], [method change_scene_to_packed], and [method reload_current_scene].  
         *  **Warning:** Setting this property directly may not work as expected, as it does  *not*  add or remove any nodes from this tree.  
         */
        get current_scene(): null | Node
        set current_scene(value: null | Node)
        
        /** The tree's root [Window]. This is top-most [Node] of the scene tree, and is always present. An absolute [NodePath] always starts from this node. Children of the root node may include the loaded [member current_scene], as well as any [url=https://docs.godotengine.org/en/4.6/tutorials/scripting/singletons_autoload.html]AutoLoad[/url] configured in the Project Settings.  
         *  **Warning:** Do not delete this node. This will result in unstable behavior, followed by a crash.  
         */
        get root(): null | Node
        
        /** If `true` (default value), enables automatic polling of the [MultiplayerAPI] for this SceneTree during [signal process_frame].  
         *  If `false`, you need to manually call [method MultiplayerAPI.poll] to process network packets and deliver RPCs. This allows running RPCs in a different loop (e.g. physics, thread, specific time step) and for manual [Mutex] protection when accessing the [MultiplayerAPI] from threads.  
         */
        get multiplayer_poll(): boolean
        set multiplayer_poll(value: boolean)
        
        /** If `true`, the renderer will interpolate the transforms of objects (both physics and non-physics) between the last two transforms, so that smooth motion is seen even when physics ticks do not coincide with rendered frames.  
         *  The default value of this property is controlled by [member ProjectSettings.physics/common/physics_interpolation].  
         *      
         *  **Note:** Although this is a global setting, finer control of individual branches of the [SceneTree] is possible using [member Node.physics_interpolation_mode].  
         */
        get physics_interpolation(): boolean
        set physics_interpolation(value: boolean)
        
        /** Emitted any time the tree's hierarchy changes (nodes being moved, renamed, etc.). */
        readonly tree_changed: Signal<() => void>
        
        /** Emitted after the new scene is added to scene tree and initialized. Can be used to reliably access [member current_scene] when changing scenes.  
         *    
         */
        readonly scene_changed: Signal<() => void>
        
        /** Emitted when the [member Node.process_mode] of any node inside the tree is changed. Only emitted in the editor, to update the visibility of disabled nodes. */
        readonly tree_process_mode_changed: Signal<() => void>
        
        /** Emitted when the [param node] enters this tree. */
        readonly node_added: Signal<(node: Node) => void>
        
        /** Emitted when the [param node] exits this tree. */
        readonly node_removed: Signal<(node: Node) => void>
        
        /** Emitted when the [param node]'s [member Node.name] is changed. */
        readonly node_renamed: Signal<(node: Node) => void>
        
        /** Emitted when the [param node]'s [method Node.update_configuration_warnings] is called. Only emitted in the editor. */
        readonly node_configuration_warning_changed: Signal<(node: Node) => void>
        
        /** Emitted immediately before [method Node._process] is called on every node in this tree. */
        readonly process_frame: Signal<() => void>
        
        /** Emitted immediately before [method Node._physics_process] is called on every node in this tree. */
        readonly physics_frame: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSceneTree;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSceneTree;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSceneTreeTimer extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSceneTreeTimer extends __NameMapRefCounted {
    }
    /** One-shot timer.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_scenetreetimer.html  
     */
    class SceneTreeTimer extends RefCounted {
        constructor(identifier?: any)
        /** The time remaining (in seconds). */
        get time_left(): float64
        set time_left(value: float64)
        
        /** Emitted when the timer reaches 0. */
        readonly timeout: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSceneTreeTimer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSceneTreeTimer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapScript extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapScript extends __NameMapResource {
    }
    /** A class stored as a resource.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_script.html  
     */
    class Script extends Resource {
        constructor(identifier?: any)
        /** Returns `true` if the script can be instantiated. */
        can_instantiate(): boolean
        
        /** Returns `true` if [param base_object] is an instance of this script. */
        instance_has(base_object: Object): boolean
        
        /** Returns `true` if the script contains non-empty source code.  
         *      
         *  **Note:** If a script does not have source code, this does not mean that it is invalid or unusable. For example, a [GDScript] that was exported with binary tokenization has no source code, but still behaves as expected and could be instantiated. This can be checked with [method can_instantiate].  
         */
        has_source_code(): boolean
        
        /** Reloads the script's class implementation. Returns an error code. */
        reload(keep_state?: boolean /* = false */): Error
        
        /** Returns the script directly inherited by this script. */
        get_base_script(): null | Script
        
        /** Returns the script's base type. */
        get_instance_base_type(): StringName
        
        /** Returns the class name associated with the script, if there is one. Returns an empty string otherwise.  
         *  To give the script a global name, you can use the `class_name` keyword in GDScript and the `[GlobalClass]` attribute in C#.  
         *    
         */
        get_global_name(): StringName
        
        /** Returns `true` if the script, or a base class, defines a signal with the given name. */
        has_script_signal(signal_name: StringName): boolean
        
        /** Returns the list of properties in this [Script].  
         *      
         *  **Note:** The dictionaries returned by this method are formatted identically to those returned by [method Object.get_property_list].  
         */
        get_script_property_list(): GArray<GDictionary>
        
        /** Returns the list of methods in this [Script].  
         *      
         *  **Note:** The dictionaries returned by this method are formatted identically to those returned by [method Object.get_method_list].  
         */
        get_script_method_list(): GArray<GDictionary>
        
        /** Returns the list of signals defined in this [Script].  
         *      
         *  **Note:** The dictionaries returned by this method are formatted identically to those returned by [method Object.get_signal_list].  
         */
        get_script_signal_list(): GArray<GDictionary>
        
        /** Returns a dictionary containing constant names and their values. */
        get_script_constant_map(): GDictionary
        
        /** Returns the default value of the specified property. */
        get_property_default_value(property: StringName): any
        
        /** Returns `true` if the script is a tool script. A tool script can run in the editor. */
        is_tool(): boolean
        
        /** Returns `true` if the script is an abstract script. An abstract script does not have a constructor and cannot be instantiated. */
        is_abstract(): boolean
        
        /** Returns a [Dictionary] mapping method names to their RPC configuration defined by this script. */
        get_rpc_config(): any
        
        /** The script source code or an empty string if source code is not available. When set, does not reload the class implementation automatically. */
        get source_code(): string
        set source_code(value: string)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapScript;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapScript;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapScriptBacktrace extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapScriptBacktrace extends __NameMapRefCounted {
    }
    /** A captured backtrace of a specific script language.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_scriptbacktrace.html  
     */
    class ScriptBacktrace extends RefCounted {
        constructor(identifier?: any)
        /** Returns the name of the script language that this backtrace was captured from. */
        get_language_name(): string
        
        /** Returns `true` if the backtrace has no stack frames. */
        is_empty(): boolean
        
        /** Returns the number of stack frames in the backtrace. */
        get_frame_count(): int64
        
        /** Returns the name of the function called at the stack frame at the specified index. */
        get_frame_function(index: int64): string
        
        /** Returns the file name of the call site represented by the stack frame at the specified index. */
        get_frame_file(index: int64): string
        
        /** Returns the line number of the call site represented by the stack frame at the specified index. */
        get_frame_line(index: int64): int64
        
        /** Returns the number of global variables (e.g. autoload singletons) in the backtrace.  
         *      
         *  **Note:** This will be non-zero only if the `include_variables` parameter was `true` when capturing the backtrace with [method Engine.capture_script_backtraces].  
         */
        get_global_variable_count(): int64
        
        /** Returns the name of the global variable at the specified index. */
        get_global_variable_name(variable_index: int64): string
        
        /** Returns the value of the global variable at the specified index.  
         *  **Warning:** With GDScript backtraces, the returned [Variant] will be the variable's actual value, including any object references. This means that storing the returned [Variant] will prevent any such object from being deallocated, so it's generally recommended not to do so.  
         */
        get_global_variable_value(variable_index: int64): any
        
        /** Returns the number of local variables in the stack frame at the specified index.  
         *      
         *  **Note:** This will be non-zero only if the `include_variables` parameter was `true` when capturing the backtrace with [method Engine.capture_script_backtraces].  
         */
        get_local_variable_count(frame_index: int64): int64
        
        /** Returns the name of the local variable at the specified [param variable_index] in the stack frame at the specified [param frame_index]. */
        get_local_variable_name(frame_index: int64, variable_index: int64): string
        
        /** Returns the value of the local variable at the specified [param variable_index] in the stack frame at the specified [param frame_index].  
         *  **Warning:** With GDScript backtraces, the returned [Variant] will be the variable's actual value, including any object references. This means that storing the returned [Variant] will prevent any such object from being deallocated, so it's generally recommended not to do so.  
         */
        get_local_variable_value(frame_index: int64, variable_index: int64): any
        
        /** Returns the number of member variables in the stack frame at the specified index.  
         *      
         *  **Note:** This will be non-zero only if the `include_variables` parameter was `true` when capturing the backtrace with [method Engine.capture_script_backtraces].  
         */
        get_member_variable_count(frame_index: int64): int64
        
        /** Returns the name of the member variable at the specified [param variable_index] in the stack frame at the specified [param frame_index]. */
        get_member_variable_name(frame_index: int64, variable_index: int64): string
        
        /** Returns the value of the member variable at the specified [param variable_index] in the stack frame at the specified [param frame_index].  
         *  **Warning:** With GDScript backtraces, the returned [Variant] will be the variable's actual value, including any object references. This means that storing the returned [Variant] will prevent any such object from being deallocated, so it's generally recommended not to do so.  
         */
        get_member_variable_value(frame_index: int64, variable_index: int64): any
        
        /** Converts the backtrace to a [String], where the entire string will be indented by [param indent_all] number of spaces, and the individual stack frames will be additionally indented by [param indent_frames] number of spaces.  
         *      
         *  **Note:** Calling [method Object.to_string] on a [ScriptBacktrace] will produce the same output as calling [method format] with all parameters left at their default values.  
         */
        format(indent_all?: int64 /* = 0 */, indent_frames?: int64 /* = 4 */): string
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapScriptBacktrace;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapScriptBacktrace;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapScriptCreateDialog extends __RPCMapConfirmationDialog {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapScriptCreateDialog extends __NameMapConfirmationDialog {
    }
    /** Godot editor's popup dialog for creating new [Script] files.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_scriptcreatedialog.html  
     */
    class ScriptCreateDialog<Map extends NodePathMap = any> extends ConfirmationDialog<Map> {
        constructor(identifier?: any)
        /** Prefills required fields to configure the ScriptCreateDialog for use. */
        config(inherits: string, path: string, built_in_enabled?: boolean /* = true */, load_enabled?: boolean /* = true */): void
        
        /** Emitted when the user clicks the OK button. */
        readonly script_created: Signal<(script: Script) => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapScriptCreateDialog;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapScriptCreateDialog;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapScriptEditor extends __RPCMapPanelContainer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapScriptEditor extends __NameMapPanelContainer {
    }
    /** Godot editor's script editor.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_scripteditor.html  
     */
    class ScriptEditor<Map extends NodePathMap = any> extends PanelContainer<Map> {
        constructor(identifier?: any)
        _help_tab_goto(_unnamed_arg0: string, _unnamed_arg1: string): boolean
        
        /** Returns the [ScriptEditorBase] object that the user is currently editing. */
        get_current_editor(): null | ScriptEditorBase
        
        /** Returns an array with all [ScriptEditorBase] objects which are currently open in editor. */
        get_open_script_editors(): GArray<ScriptEditorBase>
        
        /** Returns array of breakpoints. */
        get_breakpoints(): PackedStringArray
        
        /** Registers the [EditorSyntaxHighlighter] to the editor, the [EditorSyntaxHighlighter] will be available on all open scripts.  
         *      
         *  **Note:** Does not apply to scripts that are already opened.  
         */
        register_syntax_highlighter(syntax_highlighter: EditorSyntaxHighlighter): void
        
        /** Unregisters the [EditorSyntaxHighlighter] from the editor.  
         *      
         *  **Note:** The [EditorSyntaxHighlighter] will still be applied to scripts that are already opened.  
         */
        unregister_syntax_highlighter(syntax_highlighter: EditorSyntaxHighlighter): void
        
        /** Goes to the specified line in the current script. */
        goto_line(line_number: int64): void
        
        /** Returns a [Script] that is currently active in editor. */
        get_current_script(): null | Script
        
        /** Returns an array with all [Script] objects which are currently open in editor. */
        get_open_scripts(): GArray<Script>
        
        /** Opens the script create dialog. The script will extend [param base_name]. The file extension can be omitted from [param base_path]. It will be added based on the selected scripting language. */
        open_script_create_dialog(base_name: string, base_path: string): void
        
        /** Opens help for the given topic. The [param topic] is an encoded string that controls which class, method, constant, signal, annotation, property, or theme item should be focused.  
         *  The supported [param topic] formats include `class_name:class`, `class_method:class:method`, `class_constant:class:constant`, `class_signal:class:signal`, `class_annotation:class:@annotation`, `class_property:class:property`, and `class_theme_item:class:item`, where `class` is the class name, `method` is the method name, `constant` is the constant name, `signal` is the signal name, `annotation` is the annotation name, `property` is the property name, and `item` is the theme item.  
         *    
         */
        goto_help(topic: string): void
        
        /** Updates the documentation for the given [param script].  
         *      
         *  **Note:** This should be called whenever the script is changed to keep the open documentation state up to date.  
         */
        update_docs_from_script(script: Script): void
        
        /** Removes the documentation for the given [param script].  
         *      
         *  **Note:** This should be called whenever the script is changed to keep the open documentation state up to date.  
         */
        clear_docs_from_script(script: Script): void
        
        /** Emitted when user changed active script. Argument is a freshly activated [Script]. */
        readonly editor_script_changed: Signal<(script: Script) => void>
        
        /** Emitted when editor is about to close the active script. Argument is a [Script] that is going to be closed. */
        readonly script_close: Signal<(script: Script) => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapScriptEditor;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapScriptEditor;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapScriptEditorBase extends __RPCMapVBoxContainer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapScriptEditorBase extends __NameMapVBoxContainer {
    }
    /** Base editor for editing scripts in the [ScriptEditor].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_scripteditorbase.html  
     */
    class ScriptEditorBase<Map extends NodePathMap = any> extends VBoxContainer<Map> {
        constructor(identifier?: any)
        /** Returns the underlying [Control] used for editing scripts. For text scripts, this is a [CodeEdit]. */
        get_base_editor(): null | Control
        
        /** Adds an [EditorSyntaxHighlighter] to the open script. */
        add_syntax_highlighter(highlighter: EditorSyntaxHighlighter): void
        
        /** Emitted after script validation or when the edited resource has changed. */
        readonly name_changed: Signal<() => void>
        
        /** Emitted after script validation. */
        readonly edited_script_changed: Signal<() => void>
        
        /** Emitted when the user requests contextual help. */
        readonly request_help: Signal<(topic: string) => void>
        
        /** Emitted when the user requests to view a specific line of a script, similar to [signal go_to_method]. */
        readonly request_open_script_at_line: Signal<(script: Object, line: int64) => void>
        
        /** Emitted when the user contextual goto and the item is in the same script. */
        readonly request_save_history: Signal<() => void>
        
        /** Emitted when the user changes current script or moves caret by 10 or more columns within the same script. */
        readonly request_save_previous_state: Signal<(state: GDictionary) => void>
        
        /** Emitted when the user requests a specific documentation page. */
        readonly go_to_help: Signal<(what: string) => void>
        
        /** Emitted when the user request to search text in the file system. */
        readonly search_in_files_requested: Signal<(text: string) => void>
        
        /** Emitted when the user request to find and replace text in the file system. */
        readonly replace_in_files_requested: Signal<(text: string) => void>
        
        /** Emitted when the user requests to view a specific method of a script, similar to [signal request_open_script_at_line]. */
        readonly go_to_method: Signal<(script: Object, method: string) => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapScriptEditorBase;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapScriptEditorBase;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapScriptExtension extends __RPCMapScript {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapScriptExtension extends __NameMapScript {
    }
    /** @link https://docs.godotengine.org/en/4.6/classes/class_scriptextension.html */
    class ScriptExtension extends Script {
        constructor(identifier?: any)
        /* gdvirtual */ _editor_can_reload_from_file(): boolean
        /* gdvirtual */ _placeholder_erased(placeholder: int64): void
        /* gdvirtual */ _can_instantiate(): boolean
        /* gdvirtual */ _get_base_script(): null | Script
        /* gdvirtual */ _get_global_name(): StringName
        /* gdvirtual */ _inherits_script(script: Script): boolean
        /* gdvirtual */ _get_instance_base_type(): StringName
        /* gdvirtual */ _instance_create(for_object: Object): int64
        /* gdvirtual */ _placeholder_instance_create(for_object: Object): int64
        /* gdvirtual */ _instance_has(object: Object): boolean
        /* gdvirtual */ _has_source_code(): boolean
        /* gdvirtual */ _get_source_code(): string
        /* gdvirtual */ _set_source_code(code: string): void
        /* gdvirtual */ _reload(keep_state: boolean): Error
        /* gdvirtual */ _get_doc_class_name(): StringName
        /* gdvirtual */ _get_documentation(): GArray<GDictionary>
        /* gdvirtual */ _get_class_icon_path(): string
        /* gdvirtual */ _has_method(method: StringName): boolean
        /* gdvirtual */ _has_static_method(method: StringName): boolean
        
        /** Return the expected argument count for the given [param method], or `null` if it can't be determined (which will then fall back to the default behavior). */
        /* gdvirtual */ _get_script_method_argument_count(method: StringName): any
        /* gdvirtual */ _get_method_info(method: StringName): GDictionary
        /* gdvirtual */ _is_tool(): boolean
        /* gdvirtual */ _is_valid(): boolean
        
        /** Returns `true` if the script is an abstract script. Abstract scripts cannot be instantiated directly, instead other scripts should inherit them. Abstract scripts will be either unselectable or hidden in the Create New Node dialog (unselectable if there are non-abstract classes inheriting it, otherwise hidden). */
        /* gdvirtual */ _is_abstract(): boolean
        /* gdvirtual */ _get_language(): null | ScriptLanguage
        /* gdvirtual */ _has_script_signal(signal: StringName): boolean
        /* gdvirtual */ _get_script_signal_list(): GArray<GDictionary>
        /* gdvirtual */ _has_property_default_value(property: StringName): boolean
        /* gdvirtual */ _get_property_default_value(property: StringName): any
        /* gdvirtual */ _update_exports(): void
        /* gdvirtual */ _get_script_method_list(): GArray<GDictionary>
        /* gdvirtual */ _get_script_property_list(): GArray<GDictionary>
        /* gdvirtual */ _get_member_line(member: StringName): int64
        /* gdvirtual */ _get_constants(): GDictionary
        /* gdvirtual */ _get_members(): GArray<StringName>
        /* gdvirtual */ _is_placeholder_fallback_enabled(): boolean
        /* gdvirtual */ _get_rpc_config(): any
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapScriptExtension;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapScriptExtension;
    }
    namespace ScriptLanguage {
        enum ScriptNameCasing {
            SCRIPT_NAME_CASING_AUTO = 0,
            SCRIPT_NAME_CASING_PASCAL_CASE = 1,
            SCRIPT_NAME_CASING_SNAKE_CASE = 2,
            SCRIPT_NAME_CASING_KEBAB_CASE = 3,
            SCRIPT_NAME_CASING_CAMEL_CASE = 4,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapScriptLanguage extends __RPCMapObject {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapScriptLanguage extends __NameMapObject {
    }
    /** @link https://docs.godotengine.org/en/4.6/classes/class_scriptlanguage.html */
    class ScriptLanguage extends Object {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapScriptLanguage;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapScriptLanguage;
    }
    namespace ScriptLanguageExtension {
        enum LookupResultType {
            LOOKUP_RESULT_SCRIPT_LOCATION = 0,
            LOOKUP_RESULT_CLASS = 1,
            LOOKUP_RESULT_CLASS_CONSTANT = 2,
            LOOKUP_RESULT_CLASS_PROPERTY = 3,
            LOOKUP_RESULT_CLASS_METHOD = 4,
            LOOKUP_RESULT_CLASS_SIGNAL = 5,
            LOOKUP_RESULT_CLASS_ENUM = 6,
            LOOKUP_RESULT_CLASS_TBD_GLOBALSCOPE = 7,
            LOOKUP_RESULT_CLASS_ANNOTATION = 8,
            LOOKUP_RESULT_LOCAL_CONSTANT = 9,
            LOOKUP_RESULT_LOCAL_VARIABLE = 10,
            LOOKUP_RESULT_MAX = 11,
        }
        enum CodeCompletionLocation {
            /** The option is local to the location of the code completion query - e.g. a local variable. Subsequent value of location represent options from the outer class, the exact value represent how far they are (in terms of inner classes). */
            LOCATION_LOCAL = 0,
            
            /** The option is from the containing class or a parent class, relative to the location of the code completion query. Perform a bitwise OR with the class depth (e.g. `0` for the local class, `1` for the parent, `2` for the grandparent, etc.) to store the depth of an option in the class or a parent class. */
            LOCATION_PARENT_MASK = 256,
            
            /** The option is from user code which is not local and not in a derived class (e.g. Autoload Singletons). */
            LOCATION_OTHER_USER_CODE = 512,
            
            /** The option is from other engine code, not covered by the other enum constants - e.g. built-in classes. */
            LOCATION_OTHER = 1024,
        }
        enum CodeCompletionKind {
            CODE_COMPLETION_KIND_CLASS = 0,
            CODE_COMPLETION_KIND_FUNCTION = 1,
            CODE_COMPLETION_KIND_SIGNAL = 2,
            CODE_COMPLETION_KIND_VARIABLE = 3,
            CODE_COMPLETION_KIND_MEMBER = 4,
            CODE_COMPLETION_KIND_ENUM = 5,
            CODE_COMPLETION_KIND_CONSTANT = 6,
            CODE_COMPLETION_KIND_NODE_PATH = 7,
            CODE_COMPLETION_KIND_FILE_PATH = 8,
            CODE_COMPLETION_KIND_PLAIN_TEXT = 9,
            CODE_COMPLETION_KIND_MAX = 10,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapScriptLanguageExtension extends __RPCMapScriptLanguage {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapScriptLanguageExtension extends __NameMapScriptLanguage {
    }
    /** @link https://docs.godotengine.org/en/4.6/classes/class_scriptlanguageextension.html */
    class ScriptLanguageExtension extends ScriptLanguage {
        constructor(identifier?: any)
        /* gdvirtual */ _get_name(): string
        /* gdvirtual */ _init(): void
        /* gdvirtual */ _get_type(): string
        /* gdvirtual */ _get_extension(): string
        /* gdvirtual */ _finish(): void
        /* gdvirtual */ _get_reserved_words(): PackedStringArray
        /* gdvirtual */ _is_control_flow_keyword(keyword: string): boolean
        /* gdvirtual */ _get_comment_delimiters(): PackedStringArray
        /* gdvirtual */ _get_doc_comment_delimiters(): PackedStringArray
        /* gdvirtual */ _get_string_delimiters(): PackedStringArray
        /* gdvirtual */ _make_template(template: string, class_name: string, base_class_name: string): null | Script
        /* gdvirtual */ _get_built_in_templates(object: StringName): GArray<GDictionary>
        /* gdvirtual */ _is_using_templates(): boolean
        /* gdvirtual */ _validate(script: string, path: string, validate_functions: boolean, validate_errors: boolean, validate_warnings: boolean, validate_safe_lines: boolean): GDictionary
        /* gdvirtual */ _validate_path(path: string): string
        /* gdvirtual */ _create_script(): null | Object
        /* gdvirtual */ _has_named_classes(): boolean
        /* gdvirtual */ _supports_builtin_mode(): boolean
        /* gdvirtual */ _supports_documentation(): boolean
        /* gdvirtual */ _can_inherit_from_file(): boolean
        
        /** Returns the line where the function is defined in the code, or `-1` if the function is not present. */
        /* gdvirtual */ _find_function(function_: string, code: string): int64
        /* gdvirtual */ _make_function(class_name: string, function_name: string, function_args: PackedStringArray | string[]): string
        /* gdvirtual */ _can_make_function(): boolean
        /* gdvirtual */ _open_in_external_editor(script: Script, line: int64, column: int64): Error
        /* gdvirtual */ _overrides_external_editor(): boolean
        /* gdvirtual */ _preferred_file_name_casing(): ScriptLanguage.ScriptNameCasing
        /* gdvirtual */ _complete_code(code: string, path: string, owner: Object): GDictionary
        /* gdvirtual */ _lookup_code(code: string, symbol: string, path: string, owner: Object): GDictionary
        /* gdvirtual */ _auto_indent_code(code: string, from_line: int64, to_line: int64): string
        /* gdvirtual */ _add_global_constant(name: StringName, value: any): void
        /* gdvirtual */ _add_named_global_constant(name: StringName, value: any): void
        /* gdvirtual */ _remove_named_global_constant(name: StringName): void
        /* gdvirtual */ _thread_enter(): void
        /* gdvirtual */ _thread_exit(): void
        /* gdvirtual */ _debug_get_error(): string
        /* gdvirtual */ _debug_get_stack_level_count(): int64
        /* gdvirtual */ _debug_get_stack_level_line(level: int64): int64
        /* gdvirtual */ _debug_get_stack_level_function(level: int64): string
        
        /** Returns the source associated with a given debug stack position. */
        /* gdvirtual */ _debug_get_stack_level_source(level: int64): string
        /* gdvirtual */ _debug_get_stack_level_locals(level: int64, max_subitems: int64, max_depth: int64): GDictionary
        /* gdvirtual */ _debug_get_stack_level_members(level: int64, max_subitems: int64, max_depth: int64): GDictionary
        /* gdvirtual */ _debug_get_stack_level_instance(level: int64): int64
        /* gdvirtual */ _debug_get_globals(max_subitems: int64, max_depth: int64): GDictionary
        /* gdvirtual */ _debug_parse_stack_level_expression(level: int64, expression: string, max_subitems: int64, max_depth: int64): string
        /* gdvirtual */ _debug_get_current_stack_info(): GArray<GDictionary>
        /* gdvirtual */ _reload_all_scripts(): void
        /* gdvirtual */ _reload_scripts(scripts: GArray, soft_reload: boolean): void
        /* gdvirtual */ _reload_tool_script(script: Script, soft_reload: boolean): void
        /* gdvirtual */ _get_recognized_extensions(): PackedStringArray
        /* gdvirtual */ _get_public_functions(): GArray<GDictionary>
        /* gdvirtual */ _get_public_constants(): GDictionary
        /* gdvirtual */ _get_public_annotations(): GArray<GDictionary>
        /* gdvirtual */ _profiling_start(): void
        /* gdvirtual */ _profiling_stop(): void
        /* gdvirtual */ _profiling_set_save_native_calls(enable: boolean): void
        /* gdvirtual */ _profiling_get_accumulated_data(info_array: int64, info_max: int64): int64
        /* gdvirtual */ _profiling_get_frame_data(info_array: int64, info_max: int64): int64
        /* gdvirtual */ _frame(): void
        /* gdvirtual */ _handles_global_class_type(type: string): boolean
        /* gdvirtual */ _get_global_class_name(path: string): GDictionary
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapScriptLanguageExtension;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapScriptLanguageExtension;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapScrollBar extends __RPCMapRange {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapScrollBar extends __NameMapRange {
    }
    /** Abstract base class for scrollbars.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_scrollbar.html  
     */
    class ScrollBar<Map extends NodePathMap = any> extends Range<Map> {
        constructor(identifier?: any)
        /** Overrides the step used when clicking increment and decrement buttons or when using arrow keys when the [ScrollBar] is focused. */
        get custom_step(): float64
        set custom_step(value: float64)
        
        /** Emitted when the scrollbar is being scrolled. */
        readonly scrolling: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapScrollBar;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapScrollBar;
    }
    namespace ScrollContainer {
        enum ScrollMode {
            /** Scrolling disabled, scrollbar will be invisible. */
            SCROLL_MODE_DISABLED = 0,
            
            /** Scrolling enabled, scrollbar will be visible only if necessary, i.e. container's content is bigger than the container. */
            SCROLL_MODE_AUTO = 1,
            
            /** Scrolling enabled, scrollbar will be always visible. */
            SCROLL_MODE_SHOW_ALWAYS = 2,
            
            /** Scrolling enabled, scrollbar will be hidden. */
            SCROLL_MODE_SHOW_NEVER = 3,
            
            /** Combines [constant SCROLL_MODE_AUTO] and [constant SCROLL_MODE_SHOW_ALWAYS]. The scrollbar is only visible if necessary, but the content size is adjusted as if it was always visible. It's useful for ensuring that content size stays the same regardless if the scrollbar is visible. */
            SCROLL_MODE_RESERVE = 4,
        }
        enum ScrollHintMode {
            /** Scroll hints will never be shown. */
            SCROLL_HINT_MODE_DISABLED = 0,
            
            /** Scroll hints will be shown at the top and bottom (if vertical), or left and right (if horizontal). */
            SCROLL_HINT_MODE_ALL = 1,
            
            /** Scroll hints will be shown at the top (if vertical), or the left (if horizontal). */
            SCROLL_HINT_MODE_TOP_AND_LEFT = 2,
            
            /** Scroll hints will be shown at the bottom (if horizontal), or the right (if horizontal). */
            SCROLL_HINT_MODE_BOTTOM_AND_RIGHT = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapScrollContainer extends __RPCMapContainer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapScrollContainer extends __NameMapContainer {
    }
    /** A container used to provide scrollbars to a child control when needed.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_scrollcontainer.html  
     */
    class ScrollContainer<Map extends NodePathMap = any> extends Container<Map> {
        constructor(identifier?: any)
        /** Returns the horizontal scrollbar [HScrollBar] of this [ScrollContainer].  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to disable or hide a scrollbar, you can use [member horizontal_scroll_mode].  
         */
        get_h_scroll_bar(): null | HScrollBar
        
        /** Returns the vertical scrollbar [VScrollBar] of this [ScrollContainer].  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to disable or hide a scrollbar, you can use [member vertical_scroll_mode].  
         */
        get_v_scroll_bar(): null | VScrollBar
        
        /** Ensures the given [param control] is visible (must be a direct or indirect child of the ScrollContainer). Used by [member follow_focus].  
         *      
         *  **Note:** This will not work on a node that was just added during the same frame. If you want to scroll to a newly added child, you must wait until the next frame using [signal SceneTree.process_frame]:  
         *    
         */
        ensure_control_visible(control: Control): void
        
        /** If `true`, the ScrollContainer will automatically scroll to focused children (including indirect children) to make sure they are fully visible. */
        get follow_focus(): boolean
        set follow_focus(value: boolean)
        
        /** If `true`, [theme_item focus] is drawn when the ScrollContainer or one of its descendant nodes is focused. */
        get draw_focus_border(): boolean
        set draw_focus_border(value: boolean)
        
        /** The current horizontal scroll value.  
         *      
         *  **Note:** If you are setting this value in the [method Node._ready] function or earlier, it needs to be wrapped with [method Object.set_deferred], since scroll bar's [member Range.max_value] is not initialized yet.  
         *    
         */
        get scroll_horizontal(): int64
        set scroll_horizontal(value: int64)
        
        /** The current vertical scroll value.  
         *      
         *  **Note:** Setting it early needs to be deferred, just like in [member scroll_horizontal].  
         *    
         */
        get scroll_vertical(): int64
        set scroll_vertical(value: int64)
        
        /** Overrides the [member ScrollBar.custom_step] used when clicking the internal scroll bar's horizontal increment and decrement buttons or when using arrow keys when the [ScrollBar] is focused. */
        get scroll_horizontal_custom_step(): float64
        set scroll_horizontal_custom_step(value: float64)
        
        /** Overrides the [member ScrollBar.custom_step] used when clicking the internal scroll bar's vertical increment and decrement buttons or when using arrow keys when the [ScrollBar] is focused. */
        get scroll_vertical_custom_step(): float64
        set scroll_vertical_custom_step(value: float64)
        
        /** Controls whether horizontal scrollbar can be used and when it should be visible. */
        get horizontal_scroll_mode(): int64
        set horizontal_scroll_mode(value: int64)
        
        /** Controls whether vertical scrollbar can be used and when it should be visible. */
        get vertical_scroll_mode(): int64
        set vertical_scroll_mode(value: int64)
        
        /** Deadzone for touch scrolling. Lower deadzone makes the scrolling more sensitive. */
        get scroll_deadzone(): int64
        set scroll_deadzone(value: int64)
        
        /** The way which scroll hints (indicators that show that the content can still be scrolled in a certain direction) will be shown.  
         *      
         *  **Note:** Hints won't be shown if the content can be scrolled both vertically and horizontally.  
         */
        get scroll_hint_mode(): int64
        set scroll_hint_mode(value: int64)
        
        /** If `true`, the scroll hint texture will be tiled instead of stretched. See [member scroll_hint_mode]. */
        get tile_scroll_hint(): boolean
        set tile_scroll_hint(value: boolean)
        
        /** Emitted when scrolling starts when dragging the scrollable area w *ith a touch event* . This signal is  *not*  emitted when scrolling by dragging the scrollbar, scrolling with the mouse wheel or scrolling with keyboard/gamepad events.  
         *      
         *  **Note:** This signal is only emitted on Android or iOS, or on desktop/web platforms when [member ProjectSettings.input_devices/pointing/emulate_touch_from_mouse] is enabled.  
         */
        readonly scroll_started: Signal<() => void>
        
        /** Emitted when scrolling stops when dragging the scrollable area  *with a touch event* . This signal is  *not*  emitted when scrolling by dragging the scrollbar, scrolling with the mouse wheel or scrolling with keyboard/gamepad events.  
         *      
         *  **Note:** This signal is only emitted on Android or iOS, or on desktop/web platforms when [member ProjectSettings.input_devices/pointing/emulate_touch_from_mouse] is enabled.  
         */
        readonly scroll_ended: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapScrollContainer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapScrollContainer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSegmentShape2D extends __RPCMapShape2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSegmentShape2D extends __NameMapShape2D {
    }
    /** A 2D line segment shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_segmentshape2d.html  
     */
    class SegmentShape2D extends Shape2D {
        constructor(identifier?: any)
        /** The segment's first point position. */
        get a(): Vector2
        set a(value: Vector2)
        
        /** The segment's second point position. */
        get b(): Vector2
        set b(value: Vector2)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSegmentShape2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSegmentShape2D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSeparationRayShape2D extends __RPCMapShape2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSeparationRayShape2D extends __NameMapShape2D {
    }
    /** A 2D ray shape used for physics collision that tries to separate itself from any collider.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_separationrayshape2d.html  
     */
    class SeparationRayShape2D extends Shape2D {
        constructor(identifier?: any)
        /** The ray's length. */
        get length(): float64
        set length(value: float64)
        
        /** If `false` (default), the shape always separates and returns a normal along its own direction.  
         *  If `true`, the shape can return the correct normal and separate in any direction, allowing sliding motion on slopes.  
         */
        get slide_on_slope(): boolean
        set slide_on_slope(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSeparationRayShape2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSeparationRayShape2D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSeparationRayShape3D extends __RPCMapShape3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSeparationRayShape3D extends __NameMapShape3D {
    }
    /** A 3D ray shape used for physics collision that tries to separate itself from any collider.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_separationrayshape3d.html  
     */
    class SeparationRayShape3D extends Shape3D {
        constructor(identifier?: any)
        /** The ray's length. */
        get length(): float64
        set length(value: float64)
        
        /** If `false` (default), the shape always separates and returns a normal along its own direction.  
         *  If `true`, the shape can return the correct normal and separate in any direction, allowing sliding motion on slopes.  
         */
        get slide_on_slope(): boolean
        set slide_on_slope(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSeparationRayShape3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSeparationRayShape3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSeparator extends __RPCMapControl {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSeparator extends __NameMapControl {
    }
    /** Abstract base class for separators.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_separator.html  
     */
    class Separator<Map extends NodePathMap = any> extends Control<Map> {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSeparator;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSeparator;
    }
    namespace Shader {
        enum Mode {
            /** Mode used to draw all 3D objects. */
            MODE_SPATIAL = 0,
            
            /** Mode used to draw all 2D objects. */
            MODE_CANVAS_ITEM = 1,
            
            /** Mode used to calculate particle information on a per-particle basis. Not used for drawing. */
            MODE_PARTICLES = 2,
            
            /** Mode used for drawing skies. Only works with shaders attached to [Sky] objects. */
            MODE_SKY = 3,
            
            /** Mode used for setting the color and density of volumetric fog effect. */
            MODE_FOG = 4,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapShader extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapShader extends __NameMapResource {
    }
    /** A shader implemented in the Godot shading language.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_shader.html  
     */
    class Shader extends Resource {
        constructor(identifier?: any)
        /** Returns the shader mode for the shader. */
        get_mode(): Shader.Mode
        
        /** Sets the default texture to be used with a texture uniform. The default is used if a texture is not set in the [ShaderMaterial].  
         *      
         *  **Note:** [param name] must match the name of the uniform in the code exactly.  
         *      
         *  **Note:** If the sampler array is used use [param index] to access the specified texture.  
         */
        set_default_texture_parameter(name: StringName, texture: Texture, index?: int64 /* = 0 */): void
        
        /** Returns the texture that is set as default for the specified parameter.  
         *      
         *  **Note:** [param name] must match the name of the uniform in the code exactly.  
         *      
         *  **Note:** If the sampler array is used use [param index] to access the specified texture.  
         */
        get_default_texture_parameter(name: StringName, index?: int64 /* = 0 */): null | Texture
        
        /** Returns the list of shader uniforms that can be assigned to a [ShaderMaterial], for use with [method ShaderMaterial.set_shader_parameter] and [method ShaderMaterial.get_shader_parameter]. The parameters returned are contained in dictionaries in a similar format to the ones returned by [method Object.get_property_list].  
         *  If argument [param get_groups] is `true`, parameter grouping hints are also included in the list.  
         */
        get_shader_uniform_list(get_groups?: boolean /* = false */): GArray
        
        /** Only available when running in the editor. Opens a popup that visualizes the generated shader code, including all variants and internal shader code. See also [method Material.inspect_native_shader_code]. */
        inspect_native_shader_code(): void
        
        /** Returns the shader's code as the user has written it, not the full generated code used internally. */
        get code(): string
        set code(value: string)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapShader;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapShader;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapShaderGlobalsOverride extends __RPCMapNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapShaderGlobalsOverride extends __NameMapNode {
    }
    /** A node used to override global shader parameters' values in a scene.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_shaderglobalsoverride.html  
     */
    class ShaderGlobalsOverride<Map extends NodePathMap = any> extends Node<Map> {
        constructor(identifier?: any)
        _activate(): void
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapShaderGlobalsOverride;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapShaderGlobalsOverride;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapShaderInclude extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapShaderInclude extends __NameMapResource {
    }
    /** A snippet of shader code to be included in a [Shader] with `#include`.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_shaderinclude.html  
     */
    class ShaderInclude extends Resource {
        constructor(identifier?: any)
        /** Returns the code of the shader include file. The returned text is what the user has written, not the full generated code used internally. */
        get code(): string
        set code(value: string)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapShaderInclude;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapShaderInclude;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapShaderIncludeDB extends __RPCMapObject {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapShaderIncludeDB extends __NameMapObject {
    }
    /** Internal database of built in shader include files.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_shaderincludedb.html  
     */
    class ShaderIncludeDB extends Object {
        constructor(identifier?: any)
        /** Returns a list of built-in include files that are currently registered. */
        static list_built_in_include_files(): PackedStringArray
        
        /** Returns `true` if an include file with this name exists. */
        static has_built_in_include_file(filename: string): boolean
        
        /** Returns the code for the built-in shader fragment. You can also access this in your shader code through `#include "filename"`. */
        static get_built_in_include_file(filename: string): string
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapShaderIncludeDB;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapShaderIncludeDB;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapShaderMaterial extends __RPCMapMaterial {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapShaderMaterial extends __NameMapMaterial {
    }
    /** A material defined by a custom [Shader] program and the values of its shader parameters.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_shadermaterial.html  
     */
    class ShaderMaterial extends Material {
        constructor(identifier?: any)
        /** Changes the value set for this material of a uniform in the shader.  
         *      
         *  **Note:** [param param] is case-sensitive and must match the name of the uniform in the code exactly (not the capitalized name in the inspector).  
         *      
         *  **Note:** Changes to the shader uniform will be effective on all instances using this [ShaderMaterial]. To prevent this, use per-instance uniforms with [method CanvasItem.set_instance_shader_parameter], [method GeometryInstance3D.set_instance_shader_parameter] or duplicate the [ShaderMaterial] resource using [method Resource.duplicate]. Per-instance uniforms allow for better shader reuse and are therefore faster, so they should be preferred over duplicating the [ShaderMaterial] when possible.  
         */
        set_shader_parameter(param: StringName, value: any): void
        
        /** Returns the current value set for this material of a uniform in the shader. */
        get_shader_parameter(param: StringName): any
        
        /** The [Shader] program used to render this material. */
        get shader(): null | Shader
        set shader(value: null | Shader)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapShaderMaterial;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapShaderMaterial;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapShape2D extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapShape2D extends __NameMapResource {
    }
    /** Abstract base class for 2D shapes used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_shape2d.html  
     */
    class Shape2D extends Resource {
        constructor(identifier?: any)
        /** Returns `true` if this shape is colliding with another.  
         *  This method needs the transformation matrix for this shape ([param local_xform]), the shape to check collisions with ([param with_shape]), and the transformation matrix of that shape ([param shape_xform]).  
         */
        collide(local_xform: Transform2D, with_shape: Shape2D, shape_xform: Transform2D): boolean
        
        /** Returns whether this shape would collide with another, if a given movement was applied.  
         *  This method needs the transformation matrix for this shape ([param local_xform]), the movement to test on this shape ([param local_motion]), the shape to check collisions with ([param with_shape]), the transformation matrix of that shape ([param shape_xform]), and the movement to test onto the other object ([param shape_motion]).  
         */
        collide_with_motion(local_xform: Transform2D, local_motion: Vector2, with_shape: Shape2D, shape_xform: Transform2D, shape_motion: Vector2): boolean
        
        /** Returns a list of contact point pairs where this shape touches another.  
         *  If there are no collisions, the returned list is empty. Otherwise, the returned list contains contact points arranged in pairs, with entries alternating between points on the boundary of this shape and points on the boundary of [param with_shape].  
         *  A collision pair A, B can be used to calculate the collision normal with `(B - A).normalized()`, and the collision depth with `(B - A).length()`. This information is typically used to separate shapes, particularly in collision solvers.  
         *  This method needs the transformation matrix for this shape ([param local_xform]), the shape to check collisions with ([param with_shape]), and the transformation matrix of that shape ([param shape_xform]).  
         */
        collide_and_get_contacts(local_xform: Transform2D, with_shape: Shape2D, shape_xform: Transform2D): PackedVector2Array
        
        /** Returns a list of contact point pairs where this shape would touch another, if a given movement was applied.  
         *  If there would be no collisions, the returned list is empty. Otherwise, the returned list contains contact points arranged in pairs, with entries alternating between points on the boundary of this shape and points on the boundary of [param with_shape].  
         *  A collision pair A, B can be used to calculate the collision normal with `(B - A).normalized()`, and the collision depth with `(B - A).length()`. This information is typically used to separate shapes, particularly in collision solvers.  
         *  This method needs the transformation matrix for this shape ([param local_xform]), the movement to test on this shape ([param local_motion]), the shape to check collisions with ([param with_shape]), the transformation matrix of that shape ([param shape_xform]), and the movement to test onto the other object ([param shape_motion]).  
         */
        collide_with_motion_and_get_contacts(local_xform: Transform2D, local_motion: Vector2, with_shape: Shape2D, shape_xform: Transform2D, shape_motion: Vector2): PackedVector2Array
        
        /** Draws a solid shape onto a [CanvasItem] with the [RenderingServer] API filled with the specified [param color]. The exact drawing method is specific for each shape and cannot be configured. */
        draw(canvas_item: RID, color: Color): void
        
        /** Returns a [Rect2] representing the shapes boundary. */
        get_rect(): Rect2
        
        /** The shape's custom solver bias. Defines how much bodies react to enforce contact separation when this shape is involved.  
         *  When set to `0`, the default value from [member ProjectSettings.physics/2d/solver/default_contact_bias] is used.  
         */
        get custom_solver_bias(): float64
        set custom_solver_bias(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapShape2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapShape2D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapShape3D extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapShape3D extends __NameMapResource {
    }
    /** Abstract base class for 3D shapes used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_shape3d.html  
     */
    class Shape3D extends Resource {
        constructor(identifier?: any)
        /** Returns the [ArrayMesh] used to draw the debug collision for this [Shape3D]. */
        get_debug_mesh(): null | ArrayMesh
        
        /** The shape's custom solver bias. Defines how much bodies react to enforce contact separation when this shape is involved.  
         *  When set to `0`, the default value from [member ProjectSettings.physics/3d/solver/default_contact_bias] is used.  
         */
        get custom_solver_bias(): float64
        set custom_solver_bias(value: float64)
        
        /** The collision margin for the shape. This is not used in Godot Physics.  
         *  Collision margins allow collision detection to be more efficient by adding an extra shell around shapes. Collision algorithms are more expensive when objects overlap by more than their margin, so a higher value for margins is better for performance, at the cost of accuracy around edges as it makes them less sharp.  
         */
        get margin(): float64
        set margin(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapShape3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapShape3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapShapeCast2D extends __RPCMapNode2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapShapeCast2D extends __NameMapNode2D {
    }
    /** A 2D shape that sweeps a region of space to detect [CollisionObject2D]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_shapecast2d.html  
     */
    class ShapeCast2D<Map extends NodePathMap = any> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Returns whether any object is intersecting with the shape's vector (considering the vector length). */
        is_colliding(): boolean
        
        /** The number of collisions detected at the point of impact. Use this to iterate over multiple collisions as provided by [method get_collider], [method get_collider_shape], [method get_collision_point], and [method get_collision_normal] methods. */
        get_collision_count(): int64
        
        /** Updates the collision information for the shape immediately, without waiting for the next `_physics_process` call. Use this method, for example, when the shape or its parent has changed state.  
         *      
         *  **Note:** Setting [member enabled] to `true` is not required for this to work.  
         */
        force_shapecast_update(): void
        
        /** Returns the collided [Object] of one of the multiple collisions at [param index], or `null` if no object is intersecting the shape (i.e. [method is_colliding] returns `false`). */
        get_collider(index: int64): null | Object
        
        /** Returns the [RID] of the collided object of one of the multiple collisions at [param index]. */
        get_collider_rid(index: int64): RID
        
        /** Returns the shape ID of the colliding shape of one of the multiple collisions at [param index], or `0` if no object is intersecting the shape (i.e. [method is_colliding] returns `false`). */
        get_collider_shape(index: int64): int64
        
        /** Returns the collision point of one of the multiple collisions at [param index] where the shape intersects the colliding object.  
         *      
         *  **Note:** This point is in the **global** coordinate system.  
         */
        get_collision_point(index: int64): Vector2
        
        /** Returns the normal of one of the multiple collisions at [param index] of the intersecting object. */
        get_collision_normal(index: int64): Vector2
        
        /** Returns the fraction from this cast's origin to its [member target_position] of how far the shape can move without triggering a collision, as a value between `0.0` and `1.0`. */
        get_closest_collision_safe_fraction(): float64
        
        /** Returns the fraction from this cast's origin to its [member target_position] of how far the shape must move to trigger a collision, as a value between `0.0` and `1.0`.  
         *  In ideal conditions this would be the same as [method get_closest_collision_safe_fraction], however shape casting is calculated in discrete steps, so the precise point of collision can occur between two calculated positions.  
         */
        get_closest_collision_unsafe_fraction(): float64
        
        /** Adds a collision exception so the shape does not report collisions with the specified [RID]. */
        add_exception_rid(rid: RID): void
        
        /** Adds a collision exception so the shape does not report collisions with the specified node. */
        add_exception(node: CollisionObject2D): void
        
        /** Removes a collision exception so the shape does report collisions with the specified [RID]. */
        remove_exception_rid(rid: RID): void
        
        /** Removes a collision exception so the shape does report collisions with the specified node. */
        remove_exception(node: CollisionObject2D): void
        
        /** Removes all collision exceptions for this shape. */
        clear_exceptions(): void
        
        /** Based on [param value], enables or disables the specified layer in the [member collision_mask], given a [param layer_number] between 1 and 32. */
        set_collision_mask_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member collision_mask] is enabled, given a [param layer_number] between 1 and 32. */
        get_collision_mask_value(layer_number: int64): boolean
        
        /** If `true`, collisions will be reported. */
        get enabled(): boolean
        set enabled(value: boolean)
        
        /** The shape to be used for collision queries. */
        get shape(): null | Shape2D
        set shape(value: null | Shape2D)
        
        /** If `true`, the parent node will be excluded from collision detection. */
        get exclude_parent(): boolean
        set exclude_parent(value: boolean)
        
        /** The shape's destination point, relative to this node's [member Node2D.position]. */
        get target_position(): Vector2
        set target_position(value: Vector2)
        
        /** The collision margin for the shape. A larger margin helps detecting collisions more consistently, at the cost of precision. */
        get margin(): float64
        set margin(value: float64)
        
        /** The number of intersections can be limited with this parameter, to reduce the processing time. */
        get max_results(): int64
        set max_results(value: int64)
        
        /** The shape's collision mask. Only objects in at least one collision layer enabled in the mask will be detected. See [url=https://docs.godotengine.org/en/4.6/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information. */
        get collision_mask(): int64
        set collision_mask(value: int64)
        
        /** Returns the complete collision information from the collision sweep. The data returned is the same as in the [method PhysicsDirectSpaceState2D.get_rest_info] method. */
        get collision_result(): GArray
        
        /** If `true`, collisions with [Area2D]s will be reported. */
        get collide_with_areas(): boolean
        set collide_with_areas(value: boolean)
        
        /** If `true`, collisions with [PhysicsBody2D]s will be reported. */
        get collide_with_bodies(): boolean
        set collide_with_bodies(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapShapeCast2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapShapeCast2D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapShapeCast3D extends __RPCMapNode3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapShapeCast3D extends __NameMapNode3D {
    }
    /** A 3D shape that sweeps a region of space to detect [CollisionObject3D]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_shapecast3d.html  
     */
    class ShapeCast3D<Map extends NodePathMap = any> extends Node3D<Map> {
        constructor(identifier?: any)
        /** This method does nothing. */
        resource_changed(resource: Resource): void
        
        /** Returns whether any object is intersecting with the shape's vector (considering the vector length). */
        is_colliding(): boolean
        
        /** The number of collisions detected at the point of impact. Use this to iterate over multiple collisions as provided by [method get_collider], [method get_collider_shape], [method get_collision_point], and [method get_collision_normal] methods. */
        get_collision_count(): int64
        
        /** Updates the collision information for the shape immediately, without waiting for the next `_physics_process` call. Use this method, for example, when the shape or its parent has changed state.  
         *      
         *  **Note:** Setting [member enabled] to `true` is not required for this to work.  
         */
        force_shapecast_update(): void
        
        /** Returns the collided [Object] of one of the multiple collisions at [param index], or `null` if no object is intersecting the shape (i.e. [method is_colliding] returns `false`). */
        get_collider(index: int64): null | Object
        
        /** Returns the [RID] of the collided object of one of the multiple collisions at [param index]. */
        get_collider_rid(index: int64): RID
        
        /** Returns the shape ID of the colliding shape of one of the multiple collisions at [param index], or `0` if no object is intersecting the shape (i.e. [method is_colliding] returns `false`). */
        get_collider_shape(index: int64): int64
        
        /** Returns the collision point of one of the multiple collisions at [param index] where the shape intersects the colliding object.  
         *      
         *  **Note:** This point is in the **global** coordinate system.  
         */
        get_collision_point(index: int64): Vector3
        
        /** Returns the normal of one of the multiple collisions at [param index] of the intersecting object. */
        get_collision_normal(index: int64): Vector3
        
        /** Returns the fraction from this cast's origin to its [member target_position] of how far the shape can move without triggering a collision, as a value between `0.0` and `1.0`. */
        get_closest_collision_safe_fraction(): float64
        
        /** Returns the fraction from this cast's origin to its [member target_position] of how far the shape must move to trigger a collision, as a value between `0.0` and `1.0`.  
         *  In ideal conditions this would be the same as [method get_closest_collision_safe_fraction], however shape casting is calculated in discrete steps, so the precise point of collision can occur between two calculated positions.  
         */
        get_closest_collision_unsafe_fraction(): float64
        
        /** Adds a collision exception so the shape does not report collisions with the specified [RID]. */
        add_exception_rid(rid: RID): void
        
        /** Adds a collision exception so the shape does not report collisions with the specified node. */
        add_exception(node: CollisionObject3D): void
        
        /** Removes a collision exception so the shape does report collisions with the specified [RID]. */
        remove_exception_rid(rid: RID): void
        
        /** Removes a collision exception so the shape does report collisions with the specified node. */
        remove_exception(node: CollisionObject3D): void
        
        /** Removes all collision exceptions for this shape. */
        clear_exceptions(): void
        
        /** Based on [param value], enables or disables the specified layer in the [member collision_mask], given a [param layer_number] between 1 and 32. */
        set_collision_mask_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member collision_mask] is enabled, given a [param layer_number] between 1 and 32. */
        get_collision_mask_value(layer_number: int64): boolean
        
        /** If `true`, collisions will be reported. */
        get enabled(): boolean
        set enabled(value: boolean)
        
        /** The shape to be used for collision queries. */
        get shape(): null | Shape3D
        set shape(value: null | Shape3D)
        
        /** If `true`, the parent node will be excluded from collision detection. */
        get exclude_parent(): boolean
        set exclude_parent(value: boolean)
        
        /** The shape's destination point, relative to this node's [member Node3D.position]. */
        get target_position(): Vector3
        set target_position(value: Vector3)
        
        /** The collision margin for the shape. A larger margin helps detecting collisions more consistently, at the cost of precision. */
        get margin(): float64
        set margin(value: float64)
        
        /** The number of intersections can be limited with this parameter, to reduce the processing time. */
        get max_results(): int64
        set max_results(value: int64)
        
        /** The shape's collision mask. Only objects in at least one collision layer enabled in the mask will be detected. See [url=https://docs.godotengine.org/en/4.6/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information. */
        get collision_mask(): int64
        set collision_mask(value: int64)
        
        /** Returns the complete collision information from the collision sweep. The data returned is the same as in the [method PhysicsDirectSpaceState3D.get_rest_info] method. */
        get collision_result(): GArray
        
        /** If `true`, collisions with [Area3D]s will be reported. */
        get collide_with_areas(): boolean
        set collide_with_areas(value: boolean)
        
        /** If `true`, collisions with [PhysicsBody3D]s will be reported. */
        get collide_with_bodies(): boolean
        set collide_with_bodies(value: boolean)
        
        /** The custom color to use to draw the shape in the editor and at run-time if **Visible Collision Shapes** is enabled in the **Debug** menu. This color will be highlighted at run-time if the [ShapeCast3D] is colliding with something.  
         *  If set to `Color(0.0, 0.0, 0.0)` (by default), the color set in [member ProjectSettings.debug/shapes/collision/shape_color] is used.  
         */
        get debug_shape_custom_color(): Color
        set debug_shape_custom_color(value: Color)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapShapeCast3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapShapeCast3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapShortcut extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapShortcut extends __NameMapResource {
    }
    /** A shortcut for binding input.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_shortcut.html  
     */
    class Shortcut extends Resource {
        constructor(identifier?: any)
        /** Returns whether [member events] contains an [InputEvent] which is valid. */
        has_valid_event(): boolean
        
        /** Returns whether any [InputEvent] in [member events] equals [param event]. This uses [method InputEvent.is_match] to compare events. */
        matches_event(event: InputEvent): boolean
        
        /** Returns the shortcut's first valid [InputEvent] as a [String]. */
        get_as_text(): string
        
        /** The shortcut's [InputEvent] array.  
         *  Generally the [InputEvent] used is an [InputEventKey], though it can be any [InputEvent], including an [InputEventAction].  
         */
        get events(): GArray<InputEvent>
        set events(value: GArray<InputEvent>)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapShortcut;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapShortcut;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSkeleton2D extends __RPCMapNode2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSkeleton2D extends __NameMapNode2D {
    }
    /** The parent of a hierarchy of [Bone2D]s, used to create a 2D skeletal animation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_skeleton2d.html  
     */
    class Skeleton2D<Map extends NodePathMap = any> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Returns the number of [Bone2D] nodes in the node hierarchy parented by Skeleton2D. */
        get_bone_count(): int64
        
        /** Returns a [Bone2D] from the node hierarchy parented by Skeleton2D. The object to return is identified by the parameter [param idx]. Bones are indexed by descending the node hierarchy from top to bottom, adding the children of each branch before moving to the next sibling. */
        get_bone(idx: int64): null | Bone2D
        
        /** Returns the [RID] of a Skeleton2D instance. */
        get_skeleton(): RID
        
        /** Sets the [SkeletonModificationStack2D] attached to this skeleton. */
        set_modification_stack(modification_stack: SkeletonModificationStack2D): void
        
        /** Returns the [SkeletonModificationStack2D] attached to this skeleton, if one exists. */
        get_modification_stack(): null | SkeletonModificationStack2D
        
        /** Executes all the modifications on the [SkeletonModificationStack2D], if the Skeleton2D has one assigned. */
        execute_modifications(delta: float64, execution_mode: int64): void
        
        /** Sets the local pose transform, [param override_pose], for the bone at [param bone_idx].  
         *  [param strength] is the interpolation strength that will be used when applying the pose, and [param persistent] determines if the applied pose will remain.  
         *      
         *  **Note:** The pose transform needs to be a local transform relative to the [Bone2D] node at [param bone_idx]!  
         */
        set_bone_local_pose_override(bone_idx: int64, override_pose: Transform2D, strength: float64, persistent: boolean): void
        
        /** Returns the local pose override transform for [param bone_idx]. */
        get_bone_local_pose_override(bone_idx: int64): Transform2D
        
        /** Emitted when the [Bone2D] setup attached to this skeletons changes. This is primarily used internally within the skeleton. */
        readonly bone_setup_changed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSkeleton2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSkeleton2D;
    }
    namespace Skeleton3D {
        enum ModifierCallbackModeProcess {
            /** Set a flag to process modification during physics frames (see [constant Node.NOTIFICATION_INTERNAL_PHYSICS_PROCESS]). */
            MODIFIER_CALLBACK_MODE_PROCESS_PHYSICS = 0,
            
            /** Set a flag to process modification during process frames (see [constant Node.NOTIFICATION_INTERNAL_PROCESS]). */
            MODIFIER_CALLBACK_MODE_PROCESS_IDLE = 1,
            
            /** Do not process modification. Use [method advance] to process the modification manually. */
            MODIFIER_CALLBACK_MODE_PROCESS_MANUAL = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSkeleton3D extends __RPCMapNode3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSkeleton3D extends __NameMapNode3D {
    }
    /** A node containing a bone hierarchy, used to create a 3D skeletal animation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_skeleton3d.html  
     */
    class Skeleton3D<Map extends NodePathMap = any> extends Node3D<Map> {
        /** Notification received when this skeleton's pose needs to be updated. In that case, this is called only once per frame in a deferred process. */
        static readonly NOTIFICATION_UPDATE_SKELETON = 50
        constructor(identifier?: any)
        
        /** Adds a new bone with the given name. Returns the new bone's index, or `-1` if this method fails.  
         *      
         *  **Note:** Bone names should be unique, non empty, and cannot include the `:` and `/` characters.  
         */
        add_bone(name: string): int64
        
        /** Returns the bone index that matches [param name] as its name. Returns `-1` if no bone with this name exists. */
        find_bone(name: string): int64
        
        /** Returns the name of the bone at index [param bone_idx]. */
        get_bone_name(bone_idx: int64): string
        
        /** Sets the bone name, [param name], for the bone at [param bone_idx]. */
        set_bone_name(bone_idx: int64, name: string): void
        
        /** Returns the metadata with the given [param key] for the bone at index [param bone_idx]. */
        get_bone_meta(bone_idx: int64, key: StringName): any
        
        /** Returns the list of all metadata keys for the bone at index [param bone_idx]. */
        get_bone_meta_list(bone_idx: int64): GArray<StringName>
        
        /** Returns `true` if the bone at index [param bone_idx] has metadata with the given [param key]. */
        has_bone_meta(bone_idx: int64, key: StringName): boolean
        
        /** Sets the metadata with the given [param key] to [param value] for the bone at index [param bone_idx]. */
        set_bone_meta(bone_idx: int64, key: StringName, value: any): void
        
        /** Returns all bone names concatenated with commas (`,`) as a single [StringName].  
         *  It is useful to set it as a hint for the enum property.  
         */
        get_concatenated_bone_names(): StringName
        
        /** Returns the bone index which is the parent of the bone at [param bone_idx]. If -1, then bone has no parent.  
         *      
         *  **Note:** The parent bone returned will always be less than [param bone_idx].  
         */
        get_bone_parent(bone_idx: int64): int64
        
        /** Sets the bone index [param parent_idx] as the parent of the bone at [param bone_idx]. If -1, then bone has no parent.  
         *      
         *  **Note:** [param parent_idx] must be less than [param bone_idx].  
         */
        set_bone_parent(bone_idx: int64, parent_idx: int64): void
        
        /** Returns the number of bones in the skeleton. */
        get_bone_count(): int64
        
        /** Returns the number of times the bone hierarchy has changed within this skeleton, including renames.  
         *  The Skeleton version is not serialized: only use within a single instance of Skeleton3D.  
         *  Use for invalidating caches in IK solvers and other nodes which process bones.  
         */
        get_version(): int64
        
        /** Unparents the bone at [param bone_idx] and sets its rest position to that of its parent prior to being reset. */
        unparent_bone_and_rest(bone_idx: int64): void
        
        /** Returns an array containing the bone indexes of all the child node of the passed in bone, [param bone_idx]. */
        get_bone_children(bone_idx: int64): PackedInt32Array
        
        /** Returns an array with all of the bones that are parentless. Another way to look at this is that it returns the indexes of all the bones that are not dependent or modified by other bones in the Skeleton. */
        get_parentless_bones(): PackedInt32Array
        
        /** Returns the rest transform for a bone [param bone_idx]. */
        get_bone_rest(bone_idx: int64): Transform3D
        
        /** Sets the rest transform for bone [param bone_idx]. */
        set_bone_rest(bone_idx: int64, rest: Transform3D): void
        
        /** Returns the global rest transform for [param bone_idx]. */
        get_bone_global_rest(bone_idx: int64): Transform3D
        create_skin_from_rest_transforms(): Skin
        
        /** Binds the given Skin to the Skeleton. */
        register_skin(skin: Skin): null | SkinReference
        
        /** Returns all bones in the skeleton to their rest poses. */
        localize_rests(): void
        
        /** Clear all the bones in this skeleton. */
        clear_bones(): void
        
        /** Returns the pose transform of the specified bone.  
         *      
         *  **Note:** This is the pose you set to the skeleton in the process, the final pose can get overridden by modifiers in the deferred process, if you want to access the final pose, use [signal SkeletonModifier3D.modification_processed].  
         */
        get_bone_pose(bone_idx: int64): Transform3D
        
        /** Sets the pose transform, [param pose], for the bone at [param bone_idx]. */
        set_bone_pose(bone_idx: int64, pose: Transform3D): void
        
        /** Sets the pose position of the bone at [param bone_idx] to [param position]. [param position] is a [Vector3] describing a position local to the [Skeleton3D] node. */
        set_bone_pose_position(bone_idx: int64, position: Vector3): void
        
        /** Sets the pose rotation of the bone at [param bone_idx] to [param rotation]. [param rotation] is a [Quaternion] describing a rotation in the bone's local coordinate space with respect to the rotation of any parent bones. */
        set_bone_pose_rotation(bone_idx: int64, rotation: Quaternion): void
        
        /** Sets the pose scale of the bone at [param bone_idx] to [param scale]. */
        set_bone_pose_scale(bone_idx: int64, scale: Vector3): void
        
        /** Returns the pose position of the bone at [param bone_idx]. The returned [Vector3] is in the local coordinate space of the [Skeleton3D] node. */
        get_bone_pose_position(bone_idx: int64): Vector3
        
        /** Returns the pose rotation of the bone at [param bone_idx]. The returned [Quaternion] is local to the bone with respect to the rotation of any parent bones. */
        get_bone_pose_rotation(bone_idx: int64): Quaternion
        
        /** Returns the pose scale of the bone at [param bone_idx]. */
        get_bone_pose_scale(bone_idx: int64): Vector3
        
        /** Sets the bone pose to rest for [param bone_idx]. */
        reset_bone_pose(bone_idx: int64): void
        
        /** Sets all bone poses to rests. */
        reset_bone_poses(): void
        
        /** Returns whether the bone pose for the bone at [param bone_idx] is enabled. */
        is_bone_enabled(bone_idx: int64): boolean
        
        /** Disables the pose for the bone at [param bone_idx] if `false`, enables the bone pose if `true`. */
        set_bone_enabled(bone_idx: int64, enabled?: boolean /* = true */): void
        
        /** Returns the overall transform of the specified bone, with respect to the skeleton. Being relative to the skeleton frame, this is not the actual "global" transform of the bone.  
         *      
         *  **Note:** This is the global pose you set to the skeleton in the process, the final global pose can get overridden by modifiers in the deferred process, if you want to access the final global pose, use [signal SkeletonModifier3D.modification_processed].  
         */
        get_bone_global_pose(bone_idx: int64): Transform3D
        
        /** Sets the global pose transform, [param pose], for the bone at [param bone_idx].  
         *      
         *  **Note:** If other bone poses have been changed, this method executes a dirty poses recalculation and will cause performance to deteriorate. If you know that multiple global poses will be applied, consider using [method set_bone_pose] with precalculation.  
         */
        set_bone_global_pose(bone_idx: int64, pose: Transform3D): void
        
        /** Force updates the bone transforms/poses for all bones in the skeleton. */
        force_update_all_bone_transforms(): void
        
        /** Force updates the bone transform for the bone at [param bone_idx] and all of its children. */
        force_update_bone_child_transform(bone_idx: int64): void
        
        /** Manually advance the child [SkeletonModifier3D]s by the specified time (in seconds).  
         *      
         *  **Note:** The [param delta] is temporarily accumulated in the [Skeleton3D], and the deferred process uses the accumulated value to process the modification.  
         */
        advance(delta: float64): void
        
        /** Removes the global pose override on all bones in the skeleton. */
        clear_bones_global_pose_override(): void
        
        /** Sets the global pose transform, [param pose], for the bone at [param bone_idx].  
         *  [param amount] is the interpolation strength that will be used when applying the pose, and [param persistent] determines if the applied pose will remain.  
         *      
         *  **Note:** The pose transform needs to be a global pose! To convert a world transform from a [Node3D] to a global bone pose, multiply the [method Transform3D.affine_inverse] of the node's [member Node3D.global_transform] by the desired world transform.  
         */
        set_bone_global_pose_override(bone_idx: int64, pose: Transform3D, amount: float64, persistent?: boolean /* = false */): void
        
        /** Returns the global pose override transform for [param bone_idx]. */
        get_bone_global_pose_override(bone_idx: int64): Transform3D
        
        /** Returns the overall transform of the specified bone, with respect to the skeleton, but without any global pose overrides. Being relative to the skeleton frame, this is not the actual "global" transform of the bone. */
        get_bone_global_pose_no_override(bone_idx: int64): Transform3D
        
        /** Tells the [PhysicalBone3D] nodes in the Skeleton to stop simulating. */
        physical_bones_stop_simulation(): void
        
        /** Tells the [PhysicalBone3D] nodes in the Skeleton to start simulating and reacting to the physics world.  
         *  Optionally, a list of bone names can be passed-in, allowing only the passed-in bones to be simulated.  
         */
        physical_bones_start_simulation(bones?: GArray<StringName>): void
        
        /** Adds a collision exception to the physical bone.  
         *  Works just like the [RigidBody3D] node.  
         */
        physical_bones_add_collision_exception(exception: RID): void
        
        /** Removes a collision exception to the physical bone.  
         *  Works just like the [RigidBody3D] node.  
         */
        physical_bones_remove_collision_exception(exception: RID): void
        
        /** Multiplies the 3D position track animation.  
         *      
         *  **Note:** Unless this value is `1.0`, the key value in animation will not match the actual position value.  
         */
        get motion_scale(): float64
        set motion_scale(value: float64)
        
        /** If `true`, forces the bones in their default rest pose, regardless of their values. In the editor, this also prevents the bones from being edited. */
        get show_rest_only(): boolean
        set show_rest_only(value: boolean)
        
        /** Sets the processing timing for the Modifier. */
        get modifier_callback_mode_process(): int64
        set modifier_callback_mode_process(value: int64)
        
        /** If you follow the recommended workflow and explicitly have [PhysicalBoneSimulator3D] as a child of [Skeleton3D], you can control whether it is affected by raycasting without running [method physical_bones_start_simulation], by its [member SkeletonModifier3D.active].  
         *  However, for old (deprecated) configurations, [Skeleton3D] has an internal virtual [PhysicalBoneSimulator3D] for compatibility. This property controls the internal virtual [PhysicalBoneSimulator3D]'s [member SkeletonModifier3D.active].  
         */
        get animate_physical_bones(): boolean
        set animate_physical_bones(value: boolean)
        
        /** Emitted when the rest is updated. */
        readonly rest_updated: Signal<() => void>
        
        /** Emitted when the pose is updated.  
         *      
         *  **Note:** During the update process, this signal is not fired, so modification by [SkeletonModifier3D] is not detected.  
         */
        readonly pose_updated: Signal<() => void>
        
        /** Emitted when the final pose has been calculated will be applied to the skin in the update process.  
         *  This means that all [SkeletonModifier3D] processing is complete. In order to detect the completion of the processing of each [SkeletonModifier3D], use [signal SkeletonModifier3D.modification_processed].  
         */
        readonly skeleton_updated: Signal<() => void>
        
        /** Emitted when the bone at [param bone_idx] is toggled with [method set_bone_enabled]. Use [method is_bone_enabled] to check the new value. */
        readonly bone_enabled_changed: Signal<(bone_idx: int64) => void>
        
        /** Emitted when the list of bones changes, such as when calling [method add_bone], [method set_bone_parent], [method unparent_bone_and_rest], or [method clear_bones]. */
        readonly bone_list_changed: Signal<() => void>
        
        /** Emitted when the value of [member show_rest_only] changes. */
        readonly show_rest_only_changed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSkeleton3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSkeleton3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSkeletonIK3D extends __RPCMapSkeletonModifier3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSkeletonIK3D extends __NameMapSkeletonModifier3D {
    }
    /** A node used to rotate all bones of a [Skeleton3D] bone chain a way that places the end bone at a desired 3D position.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_skeletonik3d.html  
     */
    class SkeletonIK3D<Map extends NodePathMap = any> extends SkeletonModifier3D<Map> {
        constructor(identifier?: any)
        /** Returns the parent [Skeleton3D] node that was present when SkeletonIK entered the scene tree. Returns `null` if the parent node was not a [Skeleton3D] node when SkeletonIK3D entered the scene tree. */
        get_parent_skeleton(): null | Skeleton3D
        
        /** Returns `true` if SkeletonIK is applying IK effects on continues frames to the [Skeleton3D] bones. Returns `false` if SkeletonIK is stopped or [method start] was used with the `one_time` parameter set to `true`. */
        is_running(): boolean
        
        /** Starts applying IK effects on each frame to the [Skeleton3D] bones but will only take effect starting on the next frame. If [param one_time] is `true`, this will take effect immediately but also reset on the next frame. */
        start(one_time?: boolean /* = false */): void
        
        /** Stops applying IK effects on each frame to the [Skeleton3D] bones and also calls [method Skeleton3D.clear_bones_global_pose_override] to remove existing overrides on all bones. */
        stop(): void
        
        /** The name of the current root bone, the first bone in the IK chain. */
        get root_bone(): StringName
        set root_bone(value: StringName)
        
        /** The name of the current tip bone, the last bone in the IK chain placed at the [member target] transform (or [member target_node] if defined). */
        get tip_bone(): StringName
        set tip_bone(value: StringName)
        
        /** First target of the IK chain where the tip bone is placed and, if [member override_tip_basis] is `true`, how the tip bone is rotated. If a [member target_node] path is available the nodes transform is used instead and this property is ignored. */
        get target(): Transform3D
        set target(value: Transform3D)
        
        /** If `true` overwrites the rotation of the tip bone with the rotation of the [member target] (or [member target_node] if defined). */
        get override_tip_basis(): boolean
        set override_tip_basis(value: boolean)
        
        /** If `true`, instructs the IK solver to consider the secondary magnet target (pole target) when calculating the bone chain. Use the magnet position (pole target) to control the bending of the IK chain. */
        get use_magnet(): boolean
        set use_magnet(value: boolean)
        
        /** Secondary target position (first is [member target] property or [member target_node]) for the IK chain. Use magnet position (pole target) to control the bending of the IK chain. Only works if the bone chain has more than 2 bones. The middle chain bone position will be linearly interpolated with the magnet position. */
        get magnet(): Vector3
        set magnet(value: Vector3)
        
        /** Target node [NodePath] for the IK chain. If available, the node's current [Transform3D] is used instead of the [member target] property. */
        get target_node(): NodePath
        set target_node(value: NodePath | string)
        
        /** The minimum distance between bone and goal target. If the distance is below this value, the IK solver stops further iterations. */
        get min_distance(): float64
        set min_distance(value: float64)
        
        /** Number of iteration loops used by the IK solver to produce more accurate (and elegant) bone chain results. */
        get max_iterations(): int64
        set max_iterations(value: int64)
        
        /** Interpolation value for how much the IK results are applied to the current skeleton bone chain. A value of `1.0` will overwrite all skeleton bone transforms completely while a value of `0.0` will visually disable the SkeletonIK. */
        get interpolation(): float64
        set interpolation(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSkeletonIK3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSkeletonIK3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSkeletonModification2D extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSkeletonModification2D extends __NameMapResource {
    }
    /** Base class for resources that operate on [Bone2D]s in a [Skeleton2D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_skeletonmodification2d.html  
     */
    class SkeletonModification2D extends Resource {
        constructor(identifier?: any)
        /** Executes the given modification. This is where the modification performs whatever function it is designed to do. */
        /* gdvirtual */ _execute(delta: float64): void
        
        /** Called when the modification is setup. This is where the modification performs initialization. */
        /* gdvirtual */ _setup_modification(modification_stack: SkeletonModificationStack2D): void
        
        /** Used for drawing **editor-only** modification gizmos. This function will only be called in the Godot editor and can be overridden to draw custom gizmos.  
         *      
         *  **Note:** You will need to use the Skeleton2D from [method SkeletonModificationStack2D.get_skeleton] and it's draw functions, as the [SkeletonModification2D] resource cannot draw on its own.  
         */
        /* gdvirtual */ _draw_editor_gizmo(): void
        
        /** Returns the [SkeletonModificationStack2D] that this modification is bound to. Through the modification stack, you can access the Skeleton2D the modification is operating on. */
        get_modification_stack(): null | SkeletonModificationStack2D
        
        /** Manually allows you to set the setup state of the modification. This function should only rarely be used, as the [SkeletonModificationStack2D] the modification is bound to should handle setting the modification up. */
        set_is_setup(is_setup: boolean): void
        
        /** Returns whether this modification has been successfully setup or not. */
        get_is_setup(): boolean
        
        /** Takes an angle and clamps it so it is within the passed-in [param min] and [param max] range. [param invert] will inversely clamp the angle, clamping it to the range outside of the given bounds. */
        clamp_angle(angle: float64, min: float64, max: float64, invert: boolean): float64
        
        /** Sets whether this modification will call [method _draw_editor_gizmo] in the Godot editor to draw modification-specific gizmos. */
        set_editor_draw_gizmo(draw_gizmo: boolean): void
        
        /** Returns whether this modification will call [method _draw_editor_gizmo] in the Godot editor to draw modification-specific gizmos. */
        get_editor_draw_gizmo(): boolean
        
        /** If `true`, the modification's [method _execute] function will be called by the [SkeletonModificationStack2D]. */
        get enabled(): boolean
        set enabled(value: boolean)
        
        /** The execution mode for the modification. This tells the modification stack when to execute the modification. Some modifications have settings that are only available in certain execution modes. */
        get execution_mode(): int64
        set execution_mode(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSkeletonModification2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSkeletonModification2D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSkeletonModification2DCCDIK extends __RPCMapSkeletonModification2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSkeletonModification2DCCDIK extends __NameMapSkeletonModification2D {
    }
    /** A modification that uses CCDIK to manipulate a series of bones to reach a target in 2D.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_skeletonmodification2dccdik.html  
     */
    class SkeletonModification2DCCDIK extends SkeletonModification2D {
        constructor(identifier?: any)
        /** Sets the [Bone2D] node assigned to the CCDIK joint at [param joint_idx]. */
        set_ccdik_joint_bone2d_node(joint_idx: int64, bone2d_nodepath: NodePath | string): void
        
        /** Returns the [Bone2D] node assigned to the CCDIK joint at [param joint_idx]. */
        get_ccdik_joint_bone2d_node(joint_idx: int64): NodePath
        
        /** Sets the bone index, [param bone_idx], of the CCDIK joint at [param joint_idx]. When possible, this will also update the `bone2d_node` of the CCDIK joint based on data provided by the linked skeleton. */
        set_ccdik_joint_bone_index(joint_idx: int64, bone_idx: int64): void
        
        /** Returns the index of the [Bone2D] node assigned to the CCDIK joint at [param joint_idx]. */
        get_ccdik_joint_bone_index(joint_idx: int64): int64
        
        /** Sets whether the joint at [param joint_idx] is set to rotate from the joint, `true`, or to rotate from the tip, `false`. */
        set_ccdik_joint_rotate_from_joint(joint_idx: int64, rotate_from_joint: boolean): void
        
        /** Returns whether the joint at [param joint_idx] is set to rotate from the joint, `true`, or to rotate from the tip, `false`. The default is to rotate from the tip. */
        get_ccdik_joint_rotate_from_joint(joint_idx: int64): boolean
        
        /** Determines whether angle constraints on the CCDIK joint at [param joint_idx] are enabled. When `true`, constraints will be enabled and taken into account when solving. */
        set_ccdik_joint_enable_constraint(joint_idx: int64, enable_constraint: boolean): void
        
        /** Returns whether angle constraints on the CCDIK joint at [param joint_idx] are enabled. */
        get_ccdik_joint_enable_constraint(joint_idx: int64): boolean
        
        /** Sets the minimum angle constraint for the joint at [param joint_idx]. */
        set_ccdik_joint_constraint_angle_min(joint_idx: int64, angle_min: float64): void
        
        /** Returns the minimum angle constraint for the joint at [param joint_idx]. */
        get_ccdik_joint_constraint_angle_min(joint_idx: int64): float64
        
        /** Sets the maximum angle constraint for the joint at [param joint_idx]. */
        set_ccdik_joint_constraint_angle_max(joint_idx: int64, angle_max: float64): void
        
        /** Returns the maximum angle constraint for the joint at [param joint_idx]. */
        get_ccdik_joint_constraint_angle_max(joint_idx: int64): float64
        
        /** Sets whether the CCDIK joint at [param joint_idx] uses an inverted joint constraint.  
         *  An inverted joint constraint only constraints the CCDIK joint to the angles  *outside of*  the inputted minimum and maximum angles. For this reason, it is referred to as an inverted joint constraint, as it constraints the joint to the outside of the inputted values.  
         */
        set_ccdik_joint_constraint_angle_invert(joint_idx: int64, invert: boolean): void
        
        /** Returns whether the CCDIK joint at [param joint_idx] uses an inverted joint constraint. See [method set_ccdik_joint_constraint_angle_invert] for details. */
        get_ccdik_joint_constraint_angle_invert(joint_idx: int64): boolean
        
        /** The NodePath to the node that is the target for the CCDIK modification. This node is what the CCDIK chain will attempt to rotate the bone chain to. */
        get target_nodepath(): NodePath
        set target_nodepath(value: NodePath | string)
        
        /** The end position of the CCDIK chain. Typically, this should be a child of a [Bone2D] node attached to the final [Bone2D] in the CCDIK chain. */
        get tip_nodepath(): NodePath
        set tip_nodepath(value: NodePath | string)
        
        /** The number of CCDIK joints in the CCDIK modification. */
        get ccdik_data_chain_length(): int64
        set ccdik_data_chain_length(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSkeletonModification2DCCDIK;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSkeletonModification2DCCDIK;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSkeletonModification2DFABRIK extends __RPCMapSkeletonModification2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSkeletonModification2DFABRIK extends __NameMapSkeletonModification2D {
    }
    /** A modification that uses FABRIK to manipulate a series of [Bone2D] nodes to reach a target.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_skeletonmodification2dfabrik.html  
     */
    class SkeletonModification2DFABRIK extends SkeletonModification2D {
        constructor(identifier?: any)
        /** Sets the [Bone2D] node assigned to the FABRIK joint at [param joint_idx]. */
        set_fabrik_joint_bone2d_node(joint_idx: int64, bone2d_nodepath: NodePath | string): void
        
        /** Returns the [Bone2D] node assigned to the FABRIK joint at [param joint_idx]. */
        get_fabrik_joint_bone2d_node(joint_idx: int64): NodePath
        
        /** Sets the bone index, [param bone_idx], of the FABRIK joint at [param joint_idx]. When possible, this will also update the `bone2d_node` of the FABRIK joint based on data provided by the linked skeleton. */
        set_fabrik_joint_bone_index(joint_idx: int64, bone_idx: int64): void
        
        /** Returns the index of the [Bone2D] node assigned to the FABRIK joint at [param joint_idx]. */
        get_fabrik_joint_bone_index(joint_idx: int64): int64
        
        /** Sets the magnet position vector for the joint at [param joint_idx]. */
        set_fabrik_joint_magnet_position(joint_idx: int64, magnet_position: Vector2): void
        
        /** Returns the magnet position vector for the joint at [param joint_idx]. */
        get_fabrik_joint_magnet_position(joint_idx: int64): Vector2
        
        /** Sets whether the joint at [param joint_idx] will use the target node's rotation rather than letting FABRIK rotate the node.  
         *      
         *  **Note:** This option only works for the tip/final joint in the chain. For all other nodes, this option will be ignored.  
         */
        set_fabrik_joint_use_target_rotation(joint_idx: int64, use_target_rotation: boolean): void
        
        /** Returns whether the joint is using the target's rotation rather than allowing FABRIK to rotate the joint. This option only applies to the tip/final joint in the chain. */
        get_fabrik_joint_use_target_rotation(joint_idx: int64): boolean
        
        /** The NodePath to the node that is the target for the FABRIK modification. This node is what the FABRIK chain will attempt to rotate the bone chain to. */
        get target_nodepath(): NodePath
        set target_nodepath(value: NodePath | string)
        
        /** The number of FABRIK joints in the FABRIK modification. */
        get fabrik_data_chain_length(): int64
        set fabrik_data_chain_length(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSkeletonModification2DFABRIK;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSkeletonModification2DFABRIK;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSkeletonModification2DJiggle extends __RPCMapSkeletonModification2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSkeletonModification2DJiggle extends __NameMapSkeletonModification2D {
    }
    /** A modification that jiggles [Bone2D] nodes as they move towards a target.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_skeletonmodification2djiggle.html  
     */
    class SkeletonModification2DJiggle extends SkeletonModification2D {
        constructor(identifier?: any)
        /** If `true`, the Jiggle modifier will take colliders into account, keeping them from entering into these collision objects. */
        set_use_colliders(use_colliders: boolean): void
        
        /** Returns whether the jiggle modifier is taking physics colliders into account when solving. */
        get_use_colliders(): boolean
        
        /** Sets the collision mask that the Jiggle modifier will use when reacting to colliders, if the Jiggle modifier is set to take colliders into account. */
        set_collision_mask(collision_mask: int64): void
        
        /** Returns the collision mask used by the Jiggle modifier when collisions are enabled. */
        get_collision_mask(): int64
        
        /** Sets the [Bone2D] node assigned to the Jiggle joint at [param joint_idx]. */
        set_jiggle_joint_bone2d_node(joint_idx: int64, bone2d_node: NodePath | string): void
        
        /** Returns the [Bone2D] node assigned to the Jiggle joint at [param joint_idx]. */
        get_jiggle_joint_bone2d_node(joint_idx: int64): NodePath
        
        /** Sets the bone index, [param bone_idx], of the Jiggle joint at [param joint_idx]. When possible, this will also update the `bone2d_node` of the Jiggle joint based on data provided by the linked skeleton. */
        set_jiggle_joint_bone_index(joint_idx: int64, bone_idx: int64): void
        
        /** Returns the index of the [Bone2D] node assigned to the Jiggle joint at [param joint_idx]. */
        get_jiggle_joint_bone_index(joint_idx: int64): int64
        
        /** Sets whether the Jiggle joint at [param joint_idx] should override the default Jiggle joint settings. Setting this to `true` will make the joint use its own settings rather than the default ones attached to the modification. */
        set_jiggle_joint_override(joint_idx: int64, override: boolean): void
        
        /** Returns a boolean that indicates whether the joint at [param joint_idx] is overriding the default Jiggle joint data defined in the modification. */
        get_jiggle_joint_override(joint_idx: int64): boolean
        
        /** Sets the of stiffness of the Jiggle joint at [param joint_idx]. */
        set_jiggle_joint_stiffness(joint_idx: int64, stiffness: float64): void
        
        /** Returns the stiffness of the Jiggle joint at [param joint_idx]. */
        get_jiggle_joint_stiffness(joint_idx: int64): float64
        
        /** Sets the of mass of the Jiggle joint at [param joint_idx]. */
        set_jiggle_joint_mass(joint_idx: int64, mass: float64): void
        
        /** Returns the amount of mass of the jiggle joint at [param joint_idx]. */
        get_jiggle_joint_mass(joint_idx: int64): float64
        
        /** Sets the amount of damping of the Jiggle joint at [param joint_idx]. */
        set_jiggle_joint_damping(joint_idx: int64, damping: float64): void
        
        /** Returns the amount of damping of the Jiggle joint at [param joint_idx]. */
        get_jiggle_joint_damping(joint_idx: int64): float64
        
        /** Sets whether the Jiggle joint at [param joint_idx] should use gravity. */
        set_jiggle_joint_use_gravity(joint_idx: int64, use_gravity: boolean): void
        
        /** Returns a boolean that indicates whether the joint at [param joint_idx] is using gravity or not. */
        get_jiggle_joint_use_gravity(joint_idx: int64): boolean
        
        /** Sets the gravity vector of the Jiggle joint at [param joint_idx]. */
        set_jiggle_joint_gravity(joint_idx: int64, gravity: Vector2): void
        
        /** Returns a [Vector2] representing the amount of gravity the Jiggle joint at [param joint_idx] is influenced by. */
        get_jiggle_joint_gravity(joint_idx: int64): Vector2
        
        /** The NodePath to the node that is the target for the Jiggle modification. This node is what the Jiggle chain will attempt to rotate the bone chain to. */
        get target_nodepath(): NodePath
        set target_nodepath(value: NodePath | string)
        
        /** The amount of Jiggle joints in the Jiggle modification. */
        get jiggle_data_chain_length(): int64
        set jiggle_data_chain_length(value: int64)
        
        /** The default amount of stiffness assigned to the Jiggle joints, if they are not overridden. Higher values act more like springs, quickly moving into the correct position. */
        get stiffness(): float64
        set stiffness(value: float64)
        
        /** The default amount of mass assigned to the Jiggle joints, if they are not overridden. Higher values lead to faster movements and more overshooting. */
        get mass(): float64
        set mass(value: float64)
        
        /** The default amount of damping applied to the Jiggle joints, if they are not overridden. Higher values lead to more of the calculated velocity being applied. */
        get damping(): float64
        set damping(value: float64)
        
        /** Whether the gravity vector, [member gravity], should be applied to the Jiggle joints, assuming they are not overriding the default settings. */
        get use_gravity(): boolean
        set use_gravity(value: boolean)
        
        /** The default amount of gravity applied to the Jiggle joints, if they are not overridden. */
        get gravity(): Vector2
        set gravity(value: Vector2)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSkeletonModification2DJiggle;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSkeletonModification2DJiggle;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSkeletonModification2DLookAt extends __RPCMapSkeletonModification2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSkeletonModification2DLookAt extends __NameMapSkeletonModification2D {
    }
    /** A modification that rotates a [Bone2D] node to look at a target.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_skeletonmodification2dlookat.html  
     */
    class SkeletonModification2DLookAt extends SkeletonModification2D {
        constructor(identifier?: any)
        /** Sets the amount of additional rotation that is to be applied after executing the modification. This allows for offsetting the results by the inputted rotation amount. */
        set_additional_rotation(rotation: float64): void
        
        /** Returns the amount of additional rotation that is applied after the LookAt modification executes. */
        get_additional_rotation(): float64
        
        /** Sets whether this modification will use constraints or not. When `true`, constraints will be applied when solving the LookAt modification. */
        set_enable_constraint(enable_constraint: boolean): void
        
        /** Returns `true` if the LookAt modification is using constraints. */
        get_enable_constraint(): boolean
        
        /** Sets the constraint's minimum allowed angle. */
        set_constraint_angle_min(angle_min: float64): void
        
        /** Returns the constraint's minimum allowed angle. */
        get_constraint_angle_min(): float64
        
        /** Sets the constraint's maximum allowed angle. */
        set_constraint_angle_max(angle_max: float64): void
        
        /** Returns the constraint's maximum allowed angle. */
        get_constraint_angle_max(): float64
        
        /** When `true`, the modification will use an inverted joint constraint.  
         *  An inverted joint constraint only constraints the [Bone2D] to the angles  *outside of*  the inputted minimum and maximum angles. For this reason, it is referred to as an inverted joint constraint, as it constraints the joint to the outside of the inputted values.  
         */
        set_constraint_angle_invert(invert: boolean): void
        
        /** Returns whether the constraints to this modification are inverted or not. */
        get_constraint_angle_invert(): boolean
        
        /** The index of the [Bone2D] node that the modification will operate on. */
        get bone_index(): int64
        set bone_index(value: int64)
        
        /** The [Bone2D] node that the modification will operate on. */
        get bone2d_node(): NodePath
        set bone2d_node(value: NodePath | string)
        
        /** The NodePath to the node that is the target for the LookAt modification. This node is what the modification will rotate the [Bone2D] to. */
        get target_nodepath(): NodePath
        set target_nodepath(value: NodePath | string)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSkeletonModification2DLookAt;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSkeletonModification2DLookAt;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSkeletonModification2DPhysicalBones extends __RPCMapSkeletonModification2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSkeletonModification2DPhysicalBones extends __NameMapSkeletonModification2D {
    }
    /** A modification that applies the transforms of [PhysicalBone2D] nodes to [Bone2D] nodes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_skeletonmodification2dphysicalbones.html  
     */
    class SkeletonModification2DPhysicalBones extends SkeletonModification2D {
        constructor(identifier?: any)
        /** Sets the [PhysicalBone2D] node at [param joint_idx].  
         *      
         *  **Note:** This is just the index used for this modification, not the bone index used in the [Skeleton2D].  
         */
        set_physical_bone_node(joint_idx: int64, physicalbone2d_node: NodePath | string): void
        
        /** Returns the [PhysicalBone2D] node at [param joint_idx]. */
        get_physical_bone_node(joint_idx: int64): NodePath
        
        /** Empties the list of [PhysicalBone2D] nodes and populates it with all [PhysicalBone2D] nodes that are children of the [Skeleton2D]. */
        fetch_physical_bones(): void
        
        /** Tell the [PhysicalBone2D] nodes to start simulating and interacting with the physics world.  
         *  Optionally, an array of bone names can be passed to this function, and that will cause only [PhysicalBone2D] nodes with those names to start simulating.  
         */
        start_simulation(bones?: GArray<StringName>): void
        
        /** Tell the [PhysicalBone2D] nodes to stop simulating and interacting with the physics world.  
         *  Optionally, an array of bone names can be passed to this function, and that will cause only [PhysicalBone2D] nodes with those names to stop simulating.  
         */
        stop_simulation(bones?: GArray<StringName>): void
        
        /** The number of [PhysicalBone2D] nodes linked in this modification. */
        get physical_bone_chain_length(): int64
        set physical_bone_chain_length(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSkeletonModification2DPhysicalBones;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSkeletonModification2DPhysicalBones;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSkeletonModification2DStackHolder extends __RPCMapSkeletonModification2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSkeletonModification2DStackHolder extends __NameMapSkeletonModification2D {
    }
    /** A modification that holds and executes a [SkeletonModificationStack2D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_skeletonmodification2dstackholder.html  
     */
    class SkeletonModification2DStackHolder extends SkeletonModification2D {
        constructor(identifier?: any)
        /** Sets the [SkeletonModificationStack2D] that this modification is holding. This modification stack will then be executed when this modification is executed. */
        set_held_modification_stack(held_modification_stack: SkeletonModificationStack2D): void
        
        /** Returns the [SkeletonModificationStack2D] that this modification is holding. */
        get_held_modification_stack(): null | SkeletonModificationStack2D
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSkeletonModification2DStackHolder;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSkeletonModification2DStackHolder;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSkeletonModification2DTwoBoneIK extends __RPCMapSkeletonModification2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSkeletonModification2DTwoBoneIK extends __NameMapSkeletonModification2D {
    }
    /** A modification that rotates two bones using the law of cosines to reach the target.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_skeletonmodification2dtwoboneik.html  
     */
    class SkeletonModification2DTwoBoneIK extends SkeletonModification2D {
        constructor(identifier?: any)
        /** Sets the [Bone2D] node that is being used as the first bone in the TwoBoneIK modification. */
        set_joint_one_bone2d_node(bone2d_node: NodePath | string): void
        
        /** Returns the [Bone2D] node that is being used as the first bone in the TwoBoneIK modification. */
        get_joint_one_bone2d_node(): NodePath
        
        /** Sets the index of the [Bone2D] node that is being used as the first bone in the TwoBoneIK modification. */
        set_joint_one_bone_idx(bone_idx: int64): void
        
        /** Returns the index of the [Bone2D] node that is being used as the first bone in the TwoBoneIK modification. */
        get_joint_one_bone_idx(): int64
        
        /** Sets the [Bone2D] node that is being used as the second bone in the TwoBoneIK modification. */
        set_joint_two_bone2d_node(bone2d_node: NodePath | string): void
        
        /** Returns the [Bone2D] node that is being used as the second bone in the TwoBoneIK modification. */
        get_joint_two_bone2d_node(): NodePath
        
        /** Sets the index of the [Bone2D] node that is being used as the second bone in the TwoBoneIK modification. */
        set_joint_two_bone_idx(bone_idx: int64): void
        
        /** Returns the index of the [Bone2D] node that is being used as the second bone in the TwoBoneIK modification. */
        get_joint_two_bone_idx(): int64
        
        /** The NodePath to the node that is the target for the TwoBoneIK modification. This node is what the modification will use when bending the [Bone2D] nodes. */
        get target_nodepath(): NodePath
        set target_nodepath(value: NodePath | string)
        
        /** The minimum distance the target can be at. If the target is closer than this distance, the modification will solve as if it's at this minimum distance. When set to `0`, the modification will solve without distance constraints. */
        get target_minimum_distance(): float64
        set target_minimum_distance(value: float64)
        
        /** The maximum distance the target can be at. If the target is farther than this distance, the modification will solve as if it's at this maximum distance. When set to `0`, the modification will solve without distance constraints. */
        get target_maximum_distance(): float64
        set target_maximum_distance(value: float64)
        
        /** If `true`, the bones in the modification will bend outward as opposed to inwards when contracting. If `false`, the bones will bend inwards when contracting. */
        get flip_bend_direction(): boolean
        set flip_bend_direction(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSkeletonModification2DTwoBoneIK;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSkeletonModification2DTwoBoneIK;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSkeletonModificationStack2D extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSkeletonModificationStack2D extends __NameMapResource {
    }
    /** A resource that holds a stack of [SkeletonModification2D]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_skeletonmodificationstack2d.html  
     */
    class SkeletonModificationStack2D extends Resource {
        constructor(identifier?: any)
        /** Sets up the modification stack so it can execute. This function should be called by [Skeleton2D] and shouldn't be manually called unless you know what you are doing. */
        setup(): void
        
        /** Executes all of the [SkeletonModification2D]s in the stack that use the same execution mode as the passed-in [param execution_mode], starting from index `0` to [member modification_count].  
         *      
         *  **Note:** The order of the modifications can matter depending on the modifications. For example, modifications on a spine should operate before modifications on the arms in order to get proper results.  
         */
        execute(delta: float64, execution_mode: int64): void
        
        /** Enables all [SkeletonModification2D]s in the stack. */
        enable_all_modifications(enabled: boolean): void
        
        /** Returns the [SkeletonModification2D] at the passed-in index, [param mod_idx]. */
        get_modification(mod_idx: int64): null | SkeletonModification2D
        
        /** Adds the passed-in [SkeletonModification2D] to the stack. */
        add_modification(modification: SkeletonModification2D): void
        
        /** Deletes the [SkeletonModification2D] at the index position [param mod_idx], if it exists. */
        delete_modification(mod_idx: int64): void
        
        /** Sets the modification at [param mod_idx] to the passed-in modification, [param modification]. */
        set_modification(mod_idx: int64, modification: SkeletonModification2D): void
        
        /** Returns a boolean that indicates whether the modification stack is setup and can execute. */
        get_is_setup(): boolean
        
        /** Returns the [Skeleton2D] node that the SkeletonModificationStack2D is bound to. */
        get_skeleton(): null | Skeleton2D
        
        /** If `true`, the modification's in the stack will be called. This is handled automatically through the [Skeleton2D] node. */
        get enabled(): boolean
        set enabled(value: boolean)
        
        /** The interpolation strength of the modifications in stack. A value of `0` will make it where the modifications are not applied, a strength of `0.5` will be half applied, and a strength of `1` will allow the modifications to be fully applied and override the [Skeleton2D] [Bone2D] poses. */
        get strength(): float64
        set strength(value: float64)
        
        /** The number of modifications in the stack. */
        get modification_count(): int64
        set modification_count(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSkeletonModificationStack2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSkeletonModificationStack2D;
    }
    namespace SkeletonModifier3D {
        enum BoneAxis {
            /** Enumerated value for the +X axis. */
            BONE_AXIS_PLUS_X = 0,
            
            /** Enumerated value for the -X axis. */
            BONE_AXIS_MINUS_X = 1,
            
            /** Enumerated value for the +Y axis. */
            BONE_AXIS_PLUS_Y = 2,
            
            /** Enumerated value for the -Y axis. */
            BONE_AXIS_MINUS_Y = 3,
            
            /** Enumerated value for the +Z axis. */
            BONE_AXIS_PLUS_Z = 4,
            
            /** Enumerated value for the -Z axis. */
            BONE_AXIS_MINUS_Z = 5,
        }
        enum BoneDirection {
            /** Enumerated value for the +X axis. */
            BONE_DIRECTION_PLUS_X = 0,
            
            /** Enumerated value for the -X axis. */
            BONE_DIRECTION_MINUS_X = 1,
            
            /** Enumerated value for the +Y axis. */
            BONE_DIRECTION_PLUS_Y = 2,
            
            /** Enumerated value for the -Y axis. */
            BONE_DIRECTION_MINUS_Y = 3,
            
            /** Enumerated value for the +Z axis. */
            BONE_DIRECTION_PLUS_Z = 4,
            
            /** Enumerated value for the -Z axis. */
            BONE_DIRECTION_MINUS_Z = 5,
            
            /** Enumerated value for the axis from a parent bone to the child bone. */
            BONE_DIRECTION_FROM_PARENT = 6,
        }
        enum SecondaryDirection {
            /** Enumerated value for the case when the axis is undefined. */
            SECONDARY_DIRECTION_NONE = 0,
            
            /** Enumerated value for the +X axis. */
            SECONDARY_DIRECTION_PLUS_X = 1,
            
            /** Enumerated value for the -X axis. */
            SECONDARY_DIRECTION_MINUS_X = 2,
            
            /** Enumerated value for the +Y axis. */
            SECONDARY_DIRECTION_PLUS_Y = 3,
            
            /** Enumerated value for the -Y axis. */
            SECONDARY_DIRECTION_MINUS_Y = 4,
            
            /** Enumerated value for the +Z axis. */
            SECONDARY_DIRECTION_PLUS_Z = 5,
            
            /** Enumerated value for the -Z axis. */
            SECONDARY_DIRECTION_MINUS_Z = 6,
            
            /** Enumerated value for an optional axis. */
            SECONDARY_DIRECTION_CUSTOM = 7,
        }
        enum RotationAxis {
            /** Enumerated value for the rotation of the X axis. */
            ROTATION_AXIS_X = 0,
            
            /** Enumerated value for the rotation of the Y axis. */
            ROTATION_AXIS_Y = 1,
            
            /** Enumerated value for the rotation of the Z axis. */
            ROTATION_AXIS_Z = 2,
            
            /** Enumerated value for the unconstrained rotation. */
            ROTATION_AXIS_ALL = 3,
            
            /** Enumerated value for an optional rotation axis. */
            ROTATION_AXIS_CUSTOM = 4,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSkeletonModifier3D extends __RPCMapNode3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSkeletonModifier3D extends __NameMapNode3D {
    }
    /** A node that may modify a Skeleton3D's bones.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_skeletonmodifier3d.html  
     */
    class SkeletonModifier3D<Map extends NodePathMap = any> extends Node3D<Map> {
        constructor(identifier?: any)
        /** Override this virtual method to implement a custom skeleton modifier. You should do things like get the [Skeleton3D]'s current pose and apply the pose here.  
         *  [method _process_modification_with_delta] must not apply [member influence] to bone poses because the [Skeleton3D] automatically applies influence to all bone poses set by the modifier.  
         *  [param delta] is passed from parent [Skeleton3D]. See also [method Skeleton3D.advance].  
         *      
         *  **Note:** This method may be called outside [method Node._process] and [method Node._physics_process] with [param delta] is `0.0`, since the modification should be processed immediately after initialization of the [Skeleton3D].  
         */
        /* gdvirtual */ _process_modification_with_delta(delta: float64): void
        
        /** Override this virtual method to implement a custom skeleton modifier. You should do things like get the [Skeleton3D]'s current pose and apply the pose here.  
         *  [method _process_modification] must not apply [member influence] to bone poses because the [Skeleton3D] automatically applies influence to all bone poses set by the modifier.  
         */
        /* gdvirtual */ _process_modification(): void
        
        /** Called when the skeleton is changed. */
        /* gdvirtual */ _skeleton_changed(old_skeleton: Skeleton3D, new_skeleton: Skeleton3D): void
        
        /** Called when bone names and indices need to be validated, such as when entering the scene tree or changing skeleton. */
        /* gdvirtual */ _validate_bone_names(): void
        
        /** Returns the parent [Skeleton3D] node if it exists. Otherwise, returns `null`. */
        get_skeleton(): null | Skeleton3D
        
        /** If `true`, the [SkeletonModifier3D] will be processing. */
        get active(): boolean
        set active(value: boolean)
        
        /** Sets the influence of the modification.  
         *      
         *  **Note:** This value is used by [Skeleton3D] to blend, so the [SkeletonModifier3D] should always apply only 100% of the result without interpolation.  
         */
        get influence(): float64
        set influence(value: float64)
        
        /** Notifies when the modification have been finished.  
         *      
         *  **Note:** If you want to get the modified bone pose by the modifier, you must use [method Skeleton3D.get_bone_pose] or [method Skeleton3D.get_bone_global_pose] at the moment this signal is fired.  
         */
        readonly modification_processed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSkeletonModifier3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSkeletonModifier3D;
    }
    namespace SkeletonProfile {
        enum TailDirection {
            /** Direction to the average coordinates of bone children. */
            TAIL_DIRECTION_AVERAGE_CHILDREN = 0,
            
            /** Direction to the coordinates of specified bone child. */
            TAIL_DIRECTION_SPECIFIC_CHILD = 1,
            
            /** Direction is not calculated. */
            TAIL_DIRECTION_END = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSkeletonProfile extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSkeletonProfile extends __NameMapResource {
    }
    /** Base class for a profile of a virtual skeleton used as a target for retargeting.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_skeletonprofile.html  
     */
    class SkeletonProfile extends Resource {
        constructor(identifier?: any)
        /** Returns the name of the group at [param group_idx] that will be the drawing group in the [BoneMap] editor. */
        get_group_name(group_idx: int64): StringName
        
        /** Sets the name of the group at [param group_idx] that will be the drawing group in the [BoneMap] editor. */
        set_group_name(group_idx: int64, group_name: StringName): void
        
        /** Returns the texture of the group at [param group_idx] that will be the drawing group background image in the [BoneMap] editor. */
        get_texture(group_idx: int64): null | Texture2D
        
        /** Sets the texture of the group at [param group_idx] that will be the drawing group background image in the [BoneMap] editor. */
        set_texture(group_idx: int64, texture: Texture2D): void
        
        /** Returns the bone index that matches [param bone_name] as its name. */
        find_bone(bone_name: StringName): int64
        
        /** Returns the name of the bone at [param bone_idx] that will be the key name in the [BoneMap].  
         *  In the retargeting process, the returned bone name is the bone name of the target skeleton.  
         */
        get_bone_name(bone_idx: int64): StringName
        
        /** Sets the name of the bone at [param bone_idx] that will be the key name in the [BoneMap].  
         *  In the retargeting process, the setting bone name is the bone name of the target skeleton.  
         */
        set_bone_name(bone_idx: int64, bone_name: StringName): void
        
        /** Returns the name of the bone which is the parent to the bone at [param bone_idx]. The result is empty if the bone has no parent. */
        get_bone_parent(bone_idx: int64): StringName
        
        /** Sets the bone with name [param bone_parent] as the parent of the bone at [param bone_idx]. If an empty string is passed, then the bone has no parent. */
        set_bone_parent(bone_idx: int64, bone_parent: StringName): void
        
        /** Returns the tail direction of the bone at [param bone_idx]. */
        get_tail_direction(bone_idx: int64): SkeletonProfile.TailDirection
        
        /** Sets the tail direction of the bone at [param bone_idx].  
         *      
         *  **Note:** This only specifies the method of calculation. The actual coordinates required should be stored in an external skeleton, so the calculation itself needs to be done externally.  
         */
        set_tail_direction(bone_idx: int64, tail_direction: SkeletonProfile.TailDirection): void
        
        /** Returns the name of the bone which is the tail of the bone at [param bone_idx]. */
        get_bone_tail(bone_idx: int64): StringName
        
        /** Sets the bone with name [param bone_tail] as the tail of the bone at [param bone_idx]. */
        set_bone_tail(bone_idx: int64, bone_tail: StringName): void
        
        /** Returns the reference pose transform for bone [param bone_idx]. */
        get_reference_pose(bone_idx: int64): Transform3D
        
        /** Sets the reference pose transform for bone [param bone_idx]. */
        set_reference_pose(bone_idx: int64, bone_name: Transform3D): void
        
        /** Returns the offset of the bone at [param bone_idx] that will be the button position in the [BoneMap] editor.  
         *  This is the offset with origin at the top left corner of the square.  
         */
        get_handle_offset(bone_idx: int64): Vector2
        
        /** Sets the offset of the bone at [param bone_idx] that will be the button position in the [BoneMap] editor.  
         *  This is the offset with origin at the top left corner of the square.  
         */
        set_handle_offset(bone_idx: int64, handle_offset: Vector2): void
        
        /** Returns the group of the bone at [param bone_idx]. */
        get_group(bone_idx: int64): StringName
        
        /** Sets the group of the bone at [param bone_idx]. */
        set_group(bone_idx: int64, group: StringName): void
        
        /** Returns whether the bone at [param bone_idx] is required for retargeting.  
         *  This value is used by the bone map editor. If this method returns `true`, and no bone is assigned, the handle color will be red on the bone map editor.  
         */
        is_required(bone_idx: int64): boolean
        
        /** Sets the required status for bone [param bone_idx] to [param required]. */
        set_required(bone_idx: int64, required: boolean): void
        
        /** A bone name that will be used as the root bone in [AnimationTree]. This should be the bone of the parent of hips that exists at the world origin. */
        get root_bone(): StringName
        set root_bone(value: StringName)
        
        /** A bone name which will use model's height as the coefficient for normalization. For example, [SkeletonProfileHumanoid] defines it as `Hips`. */
        get scale_base_bone(): StringName
        set scale_base_bone(value: StringName)
        
        /** The amount of groups of bones in retargeting section's [BoneMap] editor. For example, [SkeletonProfileHumanoid] has 4 groups.  
         *  This property exists to separate the bone list into several sections in the editor.  
         */
        get group_size(): int64
        set group_size(value: int64)
        
        /** The amount of bones in retargeting section's [BoneMap] editor. For example, [SkeletonProfileHumanoid] has 56 bones.  
         *  The size of elements in [BoneMap] updates when changing this property in it's assigned [SkeletonProfile].  
         */
        get bone_size(): int64
        set bone_size(value: int64)
        
        /** This signal is emitted when change the value in profile. This is used to update key name in the [BoneMap] and to redraw the [BoneMap] editor.  
         *      
         *  **Note:** This signal is not connected directly to editor to simplify the reference, instead it is passed on to editor through the [BoneMap].  
         */
        readonly profile_updated: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSkeletonProfile;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSkeletonProfile;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSkeletonProfileHumanoid extends __RPCMapSkeletonProfile {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSkeletonProfileHumanoid extends __NameMapSkeletonProfile {
    }
    /** A humanoid [SkeletonProfile] preset.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_skeletonprofilehumanoid.html  
     */
    class SkeletonProfileHumanoid extends SkeletonProfile {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSkeletonProfileHumanoid;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSkeletonProfileHumanoid;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSkin extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSkin extends __NameMapResource {
    }
    /** @link https://docs.godotengine.org/en/4.6/classes/class_skin.html */
    class Skin extends Resource {
        constructor(identifier?: any)
        set_bind_count(bind_count: int64): void
        get_bind_count(): int64
        add_bind(bone: int64, pose: Transform3D): void
        add_named_bind(name: string, pose: Transform3D): void
        set_bind_pose(bind_index: int64, pose: Transform3D): void
        get_bind_pose(bind_index: int64): Transform3D
        set_bind_name(bind_index: int64, name: StringName): void
        get_bind_name(bind_index: int64): StringName
        set_bind_bone(bind_index: int64, bone: int64): void
        get_bind_bone(bind_index: int64): int64
        clear_binds(): void
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSkin;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSkin;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSkinReference extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSkinReference extends __NameMapRefCounted {
    }
    /** A reference-counted holder object for a skeleton RID used in the [RenderingServer].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_skinreference.html  
     */
    class SkinReference extends RefCounted {
        constructor(identifier?: any)
        /** Returns the [RID] owned by this SkinReference, as returned by [method RenderingServer.skeleton_create]. */
        get_skeleton(): RID
        
        /** Returns the [Skin] connected to this SkinReference. In the case of [MeshInstance3D] with no [member MeshInstance3D.skin] assigned, this will reference an internal default [Skin] owned by that [MeshInstance3D].  
         *  Note that a single [Skin] may have more than one [SkinReference] in the case that it is shared by meshes across multiple [Skeleton3D] nodes.  
         */
        get_skin(): null | Skin
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSkinReference;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSkinReference;
    }
    namespace Sky {
        enum RadianceSize {
            /** Radiance texture size is 32×32 pixels. */
            RADIANCE_SIZE_32 = 0,
            
            /** Radiance texture size is 64×64 pixels. */
            RADIANCE_SIZE_64 = 1,
            
            /** Radiance texture size is 128×128 pixels. */
            RADIANCE_SIZE_128 = 2,
            
            /** Radiance texture size is 256×256 pixels. */
            RADIANCE_SIZE_256 = 3,
            
            /** Radiance texture size is 512×512 pixels. */
            RADIANCE_SIZE_512 = 4,
            
            /** Radiance texture size is 1024×1024 pixels. */
            RADIANCE_SIZE_1024 = 5,
            
            /** Radiance texture size is 2048×2048 pixels. */
            RADIANCE_SIZE_2048 = 6,
            
            /** Represents the size of the [enum RadianceSize] enum. */
            RADIANCE_SIZE_MAX = 7,
        }
        enum ProcessMode {
            /** Automatically selects the appropriate process mode based on your sky shader. If your shader uses `TIME` or `POSITION`, this will use [constant PROCESS_MODE_REALTIME]. If your shader uses any of the `LIGHT_*` variables or any custom uniforms, this uses [constant PROCESS_MODE_INCREMENTAL]. Otherwise, this defaults to [constant PROCESS_MODE_QUALITY]. */
            PROCESS_MODE_AUTOMATIC = 0,
            
            /** Uses high quality importance sampling to process the radiance map. In general, this results in much higher quality than [constant PROCESS_MODE_REALTIME] but takes much longer to generate. This should not be used if you plan on changing the sky at runtime. If you are finding that the reflection is not blurry enough and is showing sparkles or fireflies, try increasing [member ProjectSettings.rendering/reflections/sky_reflections/ggx_samples]. */
            PROCESS_MODE_QUALITY = 1,
            
            /** Uses the same high quality importance sampling to process the radiance map as [constant PROCESS_MODE_QUALITY], but updates over several frames. The number of frames is determined by [member ProjectSettings.rendering/reflections/sky_reflections/roughness_layers]. Use this when you need highest quality radiance maps, but have a sky that updates slowly. */
            PROCESS_MODE_INCREMENTAL = 2,
            
            /** Uses the fast filtering algorithm to process the radiance map. In general this results in lower quality, but substantially faster run times. If you need better quality, but still need to update the sky every frame, consider turning on [member ProjectSettings.rendering/reflections/sky_reflections/fast_filter_high_quality].  
             *      
             *  **Note:** The fast filtering algorithm is limited to 256×256 cubemaps, so [member radiance_size] must be set to [constant RADIANCE_SIZE_256]. Otherwise, a warning is printed and the overridden radiance size is ignored.  
             */
            PROCESS_MODE_REALTIME = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSky extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSky extends __NameMapResource {
    }
    /** Defines a 3D environment's background by using a [Material].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_sky.html  
     */
    class Sky extends Resource {
        constructor(identifier?: any)
        /** [Material] used to draw the background. Can be [PanoramaSkyMaterial], [ProceduralSkyMaterial], [PhysicalSkyMaterial], or even a [ShaderMaterial] if you want to use your own custom shader. */
        get sky_material(): null | PanoramaSkyMaterial | ProceduralSkyMaterial | PhysicalSkyMaterial | ShaderMaterial
        set sky_material(value: null | PanoramaSkyMaterial | ProceduralSkyMaterial | PhysicalSkyMaterial | ShaderMaterial)
        
        /** The method for generating the radiance map from the sky. The radiance map is a cubemap with increasingly blurry versions of the sky corresponding to different levels of roughness. Radiance maps can be expensive to calculate. */
        get process_mode(): int64
        set process_mode(value: int64)
        
        /** The [Sky]'s radiance map size. The higher the radiance map size, the more detailed the lighting from the [Sky] will be.  
         *      
         *  **Note:** Some hardware will have trouble with higher radiance sizes, especially [constant RADIANCE_SIZE_512] and above. Only use such high values on high-end hardware.  
         */
        get radiance_size(): int64
        set radiance_size(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSky;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSky;
    }
    namespace Slider {
        enum TickPosition {
            /** Places the ticks at the bottom of the [HSlider], or right of the [VSlider]. */
            TICK_POSITION_BOTTOM_RIGHT = 0,
            
            /** Places the ticks at the top of the [HSlider], or left of the [VSlider]. */
            TICK_POSITION_TOP_LEFT = 1,
            
            /** Places the ticks at the both sides of the slider. */
            TICK_POSITION_BOTH = 2,
            
            /** Places the ticks at the center of the slider. */
            TICK_POSITION_CENTER = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSlider extends __RPCMapRange {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSlider extends __NameMapRange {
    }
    /** Abstract base class for sliders.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_slider.html  
     */
    class Slider<Map extends NodePathMap = any> extends Range<Map> {
        constructor(identifier?: any)
        /** If `true`, the slider can be interacted with. If `false`, the value can be changed only by code. */
        get editable(): boolean
        set editable(value: boolean)
        
        /** If `true`, the value can be changed using the mouse wheel. */
        get scrollable(): boolean
        set scrollable(value: boolean)
        
        /** Number of ticks displayed on the slider, including border ticks. Ticks are uniformly-distributed value markers. */
        get tick_count(): int64
        set tick_count(value: int64)
        
        /** If `true`, the slider will display ticks for minimum and maximum values. */
        get ticks_on_borders(): boolean
        set ticks_on_borders(value: boolean)
        
        /** Sets the position of the ticks. See [enum TickPosition] for details. */
        get ticks_position(): int64
        set ticks_position(value: int64)
        
        /** Emitted when the grabber starts being dragged. This is emitted before the corresponding [signal Range.value_changed] signal. */
        readonly drag_started: Signal<() => void>
        
        /** Emitted when the grabber stops being dragged. If [param value_changed] is `true`, [member Range.value] is different from the value when the dragging was started. */
        readonly drag_ended: Signal<(value_changed: boolean) => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSlider;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSlider;
    }
    namespace SliderJoint3D {
        enum Param {
            /** Constant for accessing [member linear_limit/upper_distance]. The maximum difference between the pivot points on their X axis before damping happens. */
            PARAM_LINEAR_LIMIT_UPPER = 0,
            
            /** Constant for accessing [member linear_limit/lower_distance]. The minimum difference between the pivot points on their X axis before damping happens. */
            PARAM_LINEAR_LIMIT_LOWER = 1,
            
            /** Constant for accessing [member linear_limit/softness]. A factor applied to the movement across the slider axis once the limits get surpassed. The lower, the slower the movement. */
            PARAM_LINEAR_LIMIT_SOFTNESS = 2,
            
            /** Constant for accessing [member linear_limit/restitution]. The amount of restitution once the limits are surpassed. The lower, the more velocity-energy gets lost. */
            PARAM_LINEAR_LIMIT_RESTITUTION = 3,
            
            /** Constant for accessing [member linear_limit/damping]. The amount of damping once the slider limits are surpassed. */
            PARAM_LINEAR_LIMIT_DAMPING = 4,
            
            /** Constant for accessing [member linear_motion/softness]. A factor applied to the movement across the slider axis as long as the slider is in the limits. The lower, the slower the movement. */
            PARAM_LINEAR_MOTION_SOFTNESS = 5,
            
            /** Constant for accessing [member linear_motion/restitution]. The amount of restitution inside the slider limits. */
            PARAM_LINEAR_MOTION_RESTITUTION = 6,
            
            /** Constant for accessing [member linear_motion/damping]. The amount of damping inside the slider limits. */
            PARAM_LINEAR_MOTION_DAMPING = 7,
            
            /** Constant for accessing [member linear_ortho/softness]. A factor applied to the movement across axes orthogonal to the slider. */
            PARAM_LINEAR_ORTHOGONAL_SOFTNESS = 8,
            
            /** Constant for accessing [member linear_motion/restitution]. The amount of restitution when movement is across axes orthogonal to the slider. */
            PARAM_LINEAR_ORTHOGONAL_RESTITUTION = 9,
            
            /** Constant for accessing [member linear_motion/damping]. The amount of damping when movement is across axes orthogonal to the slider. */
            PARAM_LINEAR_ORTHOGONAL_DAMPING = 10,
            
            /** Constant for accessing [member angular_limit/upper_angle]. The upper limit of rotation in the slider. */
            PARAM_ANGULAR_LIMIT_UPPER = 11,
            
            /** Constant for accessing [member angular_limit/lower_angle]. The lower limit of rotation in the slider. */
            PARAM_ANGULAR_LIMIT_LOWER = 12,
            
            /** Constant for accessing [member angular_limit/softness]. A factor applied to the all rotation once the limit is surpassed. */
            PARAM_ANGULAR_LIMIT_SOFTNESS = 13,
            
            /** Constant for accessing [member angular_limit/restitution]. The amount of restitution of the rotation when the limit is surpassed. */
            PARAM_ANGULAR_LIMIT_RESTITUTION = 14,
            
            /** Constant for accessing [member angular_limit/damping]. The amount of damping of the rotation when the limit is surpassed. */
            PARAM_ANGULAR_LIMIT_DAMPING = 15,
            
            /** Constant for accessing [member angular_motion/softness]. A factor applied to the all rotation in the limits. */
            PARAM_ANGULAR_MOTION_SOFTNESS = 16,
            
            /** Constant for accessing [member angular_motion/restitution]. The amount of restitution of the rotation in the limits. */
            PARAM_ANGULAR_MOTION_RESTITUTION = 17,
            
            /** Constant for accessing [member angular_motion/damping]. The amount of damping of the rotation in the limits. */
            PARAM_ANGULAR_MOTION_DAMPING = 18,
            
            /** Constant for accessing [member angular_ortho/softness]. A factor applied to the all rotation across axes orthogonal to the slider. */
            PARAM_ANGULAR_ORTHOGONAL_SOFTNESS = 19,
            
            /** Constant for accessing [member angular_ortho/restitution]. The amount of restitution of the rotation across axes orthogonal to the slider. */
            PARAM_ANGULAR_ORTHOGONAL_RESTITUTION = 20,
            
            /** Constant for accessing [member angular_ortho/damping]. The amount of damping of the rotation across axes orthogonal to the slider. */
            PARAM_ANGULAR_ORTHOGONAL_DAMPING = 21,
            
            /** Represents the size of the [enum Param] enum. */
            PARAM_MAX = 22,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSliderJoint3D extends __RPCMapJoint3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSliderJoint3D extends __NameMapJoint3D {
    }
    /** A physics joint that restricts the movement of a 3D physics body along an axis relative to another physics body.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_sliderjoint3d.html  
     */
    class SliderJoint3D<Map extends NodePathMap = any> extends Joint3D<Map> {
        constructor(identifier?: any)
        /** Assigns [param value] to the given parameter. */
        set_param(param: SliderJoint3D.Param, value: float64): void
        
        /** Returns the value of the given parameter. */
        get_param(param: SliderJoint3D.Param): float64
        
        /** The maximum difference between the pivot points on their X axis before damping happens. */
        get "linear_limit/upper_distance"(): float64
        set "linear_limit/upper_distance"(value: float64)
        
        /** The minimum difference between the pivot points on their X axis before damping happens. */
        get "linear_limit/lower_distance"(): float64
        set "linear_limit/lower_distance"(value: float64)
        
        /** A factor applied to the movement across the slider axis once the limits get surpassed. The lower, the slower the movement. */
        get "linear_limit/softness"(): float64
        set "linear_limit/softness"(value: float64)
        
        /** The amount of restitution once the limits are surpassed. The lower, the more velocity-energy gets lost. */
        get "linear_limit/restitution"(): float64
        set "linear_limit/restitution"(value: float64)
        
        /** The amount of damping that happens once the limit defined by [member linear_limit/lower_distance] and [member linear_limit/upper_distance] is surpassed. */
        get "linear_limit/damping"(): float64
        set "linear_limit/damping"(value: float64)
        
        /** A factor applied to the movement across the slider axis as long as the slider is in the limits. The lower, the slower the movement. */
        get "linear_motion/softness"(): float64
        set "linear_motion/softness"(value: float64)
        
        /** The amount of restitution inside the slider limits. */
        get "linear_motion/restitution"(): float64
        set "linear_motion/restitution"(value: float64)
        
        /** The amount of damping inside the slider limits. */
        get "linear_motion/damping"(): float64
        set "linear_motion/damping"(value: float64)
        
        /** A factor applied to the movement across axes orthogonal to the slider. */
        get "linear_ortho/softness"(): float64
        set "linear_ortho/softness"(value: float64)
        
        /** The amount of restitution when movement is across axes orthogonal to the slider. */
        get "linear_ortho/restitution"(): float64
        set "linear_ortho/restitution"(value: float64)
        
        /** The amount of damping when movement is across axes orthogonal to the slider. */
        get "linear_ortho/damping"(): float64
        set "linear_ortho/damping"(value: float64)
        
        /** The upper limit of rotation in the slider. */
        get "angular_limit/upper_angle"(): float64
        set "angular_limit/upper_angle"(value: float64)
        
        /** The lower limit of rotation in the slider. */
        get "angular_limit/lower_angle"(): float64
        set "angular_limit/lower_angle"(value: float64)
        
        /** A factor applied to the all rotation once the limit is surpassed.  
         *  Makes all rotation slower when between 0 and 1.  
         */
        get "angular_limit/softness"(): float64
        set "angular_limit/softness"(value: float64)
        
        /** The amount of restitution of the rotation when the limit is surpassed.  
         *  Does not affect damping.  
         */
        get "angular_limit/restitution"(): float64
        set "angular_limit/restitution"(value: float64)
        
        /** The amount of damping of the rotation when the limit is surpassed.  
         *  A lower damping value allows a rotation initiated by body A to travel to body B slower.  
         */
        get "angular_limit/damping"(): float64
        set "angular_limit/damping"(value: float64)
        
        /** A factor applied to the all rotation in the limits. */
        get "angular_motion/softness"(): float64
        set "angular_motion/softness"(value: float64)
        
        /** The amount of restitution of the rotation in the limits. */
        get "angular_motion/restitution"(): float64
        set "angular_motion/restitution"(value: float64)
        
        /** The amount of damping of the rotation in the limits. */
        get "angular_motion/damping"(): float64
        set "angular_motion/damping"(value: float64)
        
        /** A factor applied to the all rotation across axes orthogonal to the slider. */
        get "angular_ortho/softness"(): float64
        set "angular_ortho/softness"(value: float64)
        
        /** The amount of restitution of the rotation across axes orthogonal to the slider. */
        get "angular_ortho/restitution"(): float64
        set "angular_ortho/restitution"(value: float64)
        
        /** The amount of damping of the rotation across axes orthogonal to the slider. */
        get "angular_ortho/damping"(): float64
        set "angular_ortho/damping"(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSliderJoint3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSliderJoint3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSocketServer extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSocketServer extends __NameMapRefCounted {
    }
    /** An abstract class for servers based on sockets.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_socketserver.html  
     */
    class SocketServer extends RefCounted {
        constructor(identifier?: any)
        /** Returns `true` if a connection is available for taking. */
        is_connection_available(): boolean
        
        /** Returns `true` if the server is currently listening for connections. */
        is_listening(): boolean
        
        /** Stops listening. */
        stop(): void
        
        /** If a connection is available, returns a StreamPeerSocket with the connection. */
        take_socket_connection(): null | StreamPeerSocket
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSocketServer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSocketServer;
    }
    namespace SoftBody3D {
        enum DisableMode {
            /** When [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED], remove from the physics simulation to stop all physics interactions with this [SoftBody3D].  
             *  Automatically re-added to the physics simulation when the [Node] is processed again.  
             */
            DISABLE_MODE_REMOVE = 0,
            
            /** When [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED], do not affect the physics simulation. */
            DISABLE_MODE_KEEP_ACTIVE = 1,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSoftBody3D extends __RPCMapMeshInstance3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSoftBody3D extends __NameMapMeshInstance3D {
    }
    /** A deformable 3D physics mesh.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_softbody3d.html  
     */
    class SoftBody3D<Map extends NodePathMap = any> extends MeshInstance3D<Map> {
        constructor(identifier?: any)
        /** Returns the internal [RID] used by the [PhysicsServer3D] for this body. */
        get_physics_rid(): RID
        
        /** Based on [param value], enables or disables the specified layer in the [member collision_mask], given a [param layer_number] between 1 and 32. */
        set_collision_mask_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member collision_mask] is enabled, given a [param layer_number] between 1 and 32. */
        get_collision_mask_value(layer_number: int64): boolean
        
        /** Based on [param value], enables or disables the specified layer in the [member collision_layer], given a [param layer_number] between 1 and 32. */
        set_collision_layer_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member collision_layer] is enabled, given a [param layer_number] between 1 and 32. */
        get_collision_layer_value(layer_number: int64): boolean
        
        /** Returns an array of nodes that were added as collision exceptions for this body. */
        get_collision_exceptions(): GArray<PhysicsBody3D>
        
        /** Adds a body to the list of bodies that this body can't collide with. */
        add_collision_exception_with(body: Node): void
        
        /** Removes a body from the list of bodies that this body can't collide with. */
        remove_collision_exception_with(body: Node): void
        
        /** Returns local translation of a vertex in the surface array. */
        get_point_transform(point_index: int64): Vector3
        
        /** Applies an impulse to a point.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         */
        apply_impulse(point_index: int64, impulse: Vector3): void
        
        /** Applies a force to a point. A force is time dependent and meant to be applied every physics update. */
        apply_force(point_index: int64, force: Vector3): void
        
        /** Distributes and applies an impulse to all points.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         */
        apply_central_impulse(impulse: Vector3): void
        
        /** Distributes and applies a force to all points. A force is time dependent and meant to be applied every physics update. */
        apply_central_force(force: Vector3): void
        
        /** Sets the pinned state of a surface vertex. When set to `true`, the optional [param attachment_path] can define a [Node3D] the pinned vertex will be attached to. */
        set_point_pinned(point_index: int64, pinned: boolean, attachment_path?: NodePath | string /* = '' */, insert_at?: int64 /* = -1 */): void
        
        /** Returns `true` if vertex is set to pinned. */
        is_point_pinned(point_index: int64): boolean
        
        /** The physics layers this SoftBody3D **is in**. Collision objects can exist in one or more of 32 different layers. See also [member collision_mask].  
         *      
         *  **Note:** Object A can detect a contact with object B only if object B is in any of the layers that object A scans. See [url=https://docs.godotengine.org/en/4.6/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information.  
         */
        get collision_layer(): int64
        set collision_layer(value: int64)
        
        /** The physics layers this SoftBody3D **scans**. Collision objects can scan one or more of 32 different layers. See also [member collision_layer].  
         *      
         *  **Note:** Object A can detect a contact with object B only if object B is in any of the layers that object A scans. See [url=https://docs.godotengine.org/en/4.6/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information.  
         */
        get collision_mask(): int64
        set collision_mask(value: int64)
        
        /** [NodePath] to a [CollisionObject3D] this SoftBody3D should avoid clipping. */
        get parent_collision_ignore(): NodePath
        set parent_collision_ignore(value: NodePath | string)
        
        /** Increasing this value will improve the resulting simulation, but can affect performance. Use with care. */
        get simulation_precision(): int64
        set simulation_precision(value: int64)
        
        /** The SoftBody3D's mass.  
         *      
         *  **Note:** When using Jolt Physics, the default value of this property will instead be `0.0`, which will cause the body to automatically calculate the mass to 1 kg per point. This is a bug, which will be fixed in Godot 4.7.  
         */
        get total_mass(): float64
        set total_mass(value: float64)
        
        /** Higher values will result in a stiffer body, while lower values will increase the body's ability to bend. The value can be between `0.0` and `1.0` (inclusive). */
        get linear_stiffness(): float64
        set linear_stiffness(value: float64)
        
        /** Scales the rest lengths of [SoftBody3D]'s edge constraints. Positive values shrink the mesh, while negative values expand it. For example, a value of `0.1` shortens the edges of the mesh by 10%, while `-0.1` expands the edges by 10%.  
         *      
         *  **Note:** [member shrinking_factor] is best used on surface meshes with pinned points.  
         */
        get shrinking_factor(): float64
        set shrinking_factor(value: float64)
        
        /** The pressure coefficient of this soft body. Simulate pressure build-up from inside this body. Higher values increase the strength of this effect. */
        get pressure_coefficient(): float64
        set pressure_coefficient(value: float64)
        
        /** The body's damping coefficient. Higher values will slow down the body more noticeably when forces are applied. */
        get damping_coefficient(): float64
        set damping_coefficient(value: float64)
        
        /** The body's drag coefficient. Higher values increase this body's air resistance.  
         *      
         *  **Note:** This value is currently unused by Godot's default physics implementation.  
         */
        get drag_coefficient(): float64
        set drag_coefficient(value: float64)
        
        /** If `true`, the [SoftBody3D] will respond to [RayCast3D]s. */
        get ray_pickable(): boolean
        set ray_pickable(value: boolean)
        
        /** Defines the behavior in physics when [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED]. */
        get disable_mode(): int64
        set disable_mode(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSoftBody3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSoftBody3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSphereMesh extends __RPCMapPrimitiveMesh {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSphereMesh extends __NameMapPrimitiveMesh {
    }
    /** Class representing a spherical [PrimitiveMesh].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_spheremesh.html  
     */
    class SphereMesh extends PrimitiveMesh {
        constructor(identifier?: any)
        /** Radius of sphere. */
        get radius(): float64
        set radius(value: float64)
        
        /** Full height of the sphere. */
        get height(): float64
        set height(value: float64)
        
        /** Number of radial segments on the sphere. */
        get radial_segments(): int64
        set radial_segments(value: int64)
        
        /** Number of segments along the height of the sphere. */
        get rings(): int64
        set rings(value: int64)
        
        /** If `true`, a hemisphere is created rather than a full sphere.  
         *      
         *  **Note:** To get a regular hemisphere, the height and radius of the sphere must be equal.  
         */
        get is_hemisphere(): boolean
        set is_hemisphere(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSphereMesh;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSphereMesh;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSphereOccluder3D extends __RPCMapOccluder3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSphereOccluder3D extends __NameMapOccluder3D {
    }
    /** Spherical shape for use with occlusion culling in [OccluderInstance3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_sphereoccluder3d.html  
     */
    class SphereOccluder3D extends Occluder3D {
        constructor(identifier?: any)
        /** The sphere's radius in 3D units. */
        get radius(): float64
        set radius(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSphereOccluder3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSphereOccluder3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSphereShape3D extends __RPCMapShape3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSphereShape3D extends __NameMapShape3D {
    }
    /** A 3D sphere shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_sphereshape3d.html  
     */
    class SphereShape3D extends Shape3D {
        constructor(identifier?: any)
        /** The sphere's radius. The shape's diameter is double the radius. */
        get radius(): float64
        set radius(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSphereShape3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSphereShape3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSpinBox extends __RPCMapRange {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSpinBox extends __NameMapRange {
    }
    /** An input field for numbers.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_spinbox.html  
     */
    class SpinBox<Map extends NodePathMap = any> extends Range<Map> {
        constructor(identifier?: any)
        /** Applies the current value of this [SpinBox]. This is equivalent to pressing [kbd]Enter[/kbd] while editing the [LineEdit] used by the [SpinBox]. This will cause [signal LineEdit.text_submitted] to be emitted and its currently contained expression to be evaluated. */
        apply(): void
        
        /** Returns the [LineEdit] instance from this [SpinBox]. You can use it to access properties and methods of [LineEdit].  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member CanvasItem.visible] property.  
         */
        get_line_edit(): null | LineEdit
        
        /** Changes the alignment of the underlying [LineEdit]. */
        get alignment(): int64
        set alignment(value: int64)
        
        /** If `true`, the [SpinBox] will be editable. Otherwise, it will be read only. */
        get editable(): boolean
        set editable(value: boolean)
        
        /** Sets the value of the [Range] for this [SpinBox] when the [LineEdit] text is  *changed*  instead of  *submitted* . See [signal LineEdit.text_changed] and [signal LineEdit.text_submitted].  
         *      
         *  **Note:** If set to `true`, this will interfere with entering mathematical expressions in the [SpinBox]. The [SpinBox] will try to evaluate the expression as you type, which means symbols like a trailing `+` are removed immediately by the expression being evaluated.  
         */
        get update_on_text_changed(): boolean
        set update_on_text_changed(value: boolean)
        
        /** Adds the specified prefix string before the numerical value of the [SpinBox]. */
        get prefix(): string
        set prefix(value: string)
        
        /** Adds the specified suffix string after the numerical value of the [SpinBox]. */
        get suffix(): string
        set suffix(value: string)
        
        /** If not `0`, sets the step when interacting with the arrow buttons of the [SpinBox].  
         *      
         *  **Note:** [member Range.value] will still be rounded to a multiple of [member Range.step].  
         */
        get custom_arrow_step(): float64
        set custom_arrow_step(value: float64)
        
        /** If `true`, the value will be rounded to a multiple of [member custom_arrow_step] when interacting with the arrow buttons. Otherwise, increments the value by [member custom_arrow_step] and then rounds it according to [member Range.step]. */
        get custom_arrow_round(): boolean
        set custom_arrow_round(value: boolean)
        
        /** If `true`, the [SpinBox] will select the whole text when the [LineEdit] gains focus. Clicking the up and down arrows won't trigger this behavior. */
        get select_all_on_focus(): boolean
        set select_all_on_focus(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSpinBox;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSpinBox;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSplineIK3D extends __RPCMapChainIK3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSplineIK3D extends __NameMapChainIK3D {
    }
    /** A [SkeletonModifier3D] for aligning bones along a [Path3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_splineik3d.html  
     */
    class SplineIK3D<Map extends NodePathMap = any> extends ChainIK3D<Map> {
        constructor(identifier?: any)
        /** Sets the node path of the [Path3D] which is describing the path. */
        set_path_3d(index: int64, path_3d: NodePath | string): void
        
        /** Returns the node path of the [Path3D] which is describing the path. */
        get_path_3d(index: int64): NodePath
        
        /** Sets if the tilt property of the [Curve3D] should affect the bone twist. */
        set_tilt_enabled(index: int64, enabled: boolean): void
        
        /** Returns if the tilt property of the [Curve3D] affects the bone twist. */
        is_tilt_enabled(index: int64): boolean
        
        /** If [param size] is greater than `0`, the tilt is interpolated between [param size] start bones from the start point of the [Curve3D] when they are apart.  
         *  If [param size] is equal `0`, the tilts between the root bone head and the start point of the [Curve3D] are unified with a tilt of the start point of the [Curve3D].  
         *  If [param size] is less than `0`, the tilts between the root bone and the start point of the [Curve3D] are `0.0`.  
         */
        set_tilt_fade_in(index: int64, size: int64): void
        
        /** Returns the tilt interpolation method used between the root bone and the start point of the [Curve3D] when they are apart. See also [method set_tilt_fade_in]. */
        get_tilt_fade_in(index: int64): int64
        
        /** If [param size] is greater than `0`, the tilt is interpolated between [param size] end bones from the end point of the [Curve3D] when they are apart.  
         *  If [param size] is equal `0`, the tilts between the end bone tail and the end point of the [Curve3D] are unified with a tilt of the end point of the [Curve3D].  
         *  If [param size] is less than `0`, the tilts between the end bone and the end point of the [Curve3D] are `0.0`.  
         */
        set_tilt_fade_out(index: int64, size: int64): void
        
        /** Returns the tilt interpolation method used between the end bone and the end point of the [Curve3D] when they are apart. See also [method set_tilt_fade_out]. */
        get_tilt_fade_out(index: int64): int64
        
        /** The number of settings. */
        get setting_count(): int64
        set setting_count(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSplineIK3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSplineIK3D;
    }
    namespace SplitContainer {
        enum DraggerVisibility {
            /** The split dragger icon is always visible when [theme_item autohide] is `false`, otherwise visible only when the cursor hovers it.  
             *  The size of the grabber icon determines the minimum [theme_item separation].  
             *  The dragger icon is automatically hidden if the length of the grabber icon is longer than the split bar.  
             */
            DRAGGER_VISIBLE = 0,
            
            /** The split dragger icon is never visible regardless of the value of [theme_item autohide].  
             *  The size of the grabber icon determines the minimum [theme_item separation].  
             */
            DRAGGER_HIDDEN = 1,
            
            /** The split dragger icon is not visible, and the split bar is collapsed to zero thickness. */
            DRAGGER_HIDDEN_COLLAPSED = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSplitContainer extends __RPCMapContainer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSplitContainer extends __NameMapContainer {
    }
    /** A container that arranges child controls horizontally or vertically and provides grabbers for adjusting the split ratios between them.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_splitcontainer.html  
     */
    class SplitContainer<Map extends NodePathMap = any> extends Container<Map> {
        constructor(identifier?: any)
        /** Clamps the [member split_offsets] values to ensure they are within valid ranges and do not overlap with each other. When overlaps occur, this method prioritizes one split offset (at index [param priority_index]) by clamping any overlapping split offsets to it. */
        clamp_split_offset(priority_index?: int64 /* = 0 */): void
        
        /** Returns an [Array] of the drag area [Control]s. These are the interactable [Control] nodes between each child. For example, this can be used to add a pre-configured button to a drag area [Control] so that it rides along with the split bar. Try setting the [Button] anchors to `center` prior to the [method Node.reparent] call.  
         *    
         *      
         *  **Note:** The drag area [Control]s are drawn over the [SplitContainer]'s children, so [CanvasItem] draw objects called from a drag area and children added to it will also appear over the [SplitContainer]'s children. Try setting [member Control.mouse_filter] of custom children to [constant Control.MOUSE_FILTER_IGNORE] to prevent blocking the mouse from dragging if desired.  
         *  **Warning:** These are required internal nodes, removing or freeing them may cause a crash.  
         */
        get_drag_area_controls(): GArray<Control>
        
        /** Returns the drag area [Control]. For example, you can move a pre-configured button into the drag area [Control] so that it rides along with the split bar. Try setting the [Button] anchors to `center` prior to the `reparent()` call.  
         *    
         *      
         *  **Note:** The drag area [Control] is drawn over the [SplitContainer]'s children, so [CanvasItem] draw objects called from the [Control] and children added to the [Control] will also appear over the [SplitContainer]'s children. Try setting [member Control.mouse_filter] of custom children to [constant Control.MOUSE_FILTER_IGNORE] to prevent blocking the mouse from dragging if desired.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash.  
         */
        get_drag_area_control(): null | Control
        
        /** Offsets for each dragger in pixels. Each one is the offset of the split between the [Control] nodes before and after the dragger, with `0` being the default position. The default position is based on the [Control] nodes expand flags and minimum sizes. See [member Control.size_flags_horizontal], [member Control.size_flags_vertical], and [member Control.size_flags_stretch_ratio].  
         *  If none of the [Control] nodes before the dragger are expanded, the default position will be at the start of the [SplitContainer]. If none of the [Control] nodes after the dragger are expanded, the default position will be at the end of the [SplitContainer]. If the dragger is in between expanded [Control] nodes, the default position will be in the middle, based on the [member Control.size_flags_stretch_ratio]s and minimum sizes.  
         *      
         *  **Note:** If the split offsets cause [Control] nodes to overlap, the first split will take priority when resolving the positions.  
         */
        get split_offsets(): PackedInt32Array
        set split_offsets(value: PackedInt32Array | int32[])
        
        /** If `true`, the draggers will be disabled and the children will be sized as if all [member split_offsets] were `0`. */
        get collapsed(): boolean
        set collapsed(value: boolean)
        
        /** Enables or disables split dragging. */
        get dragging_enabled(): boolean
        set dragging_enabled(value: boolean)
        
        /** Determines the dragger's visibility. This property does not determine whether dragging is enabled or not. Use [member dragging_enabled] for that. */
        get dragger_visibility(): int64
        set dragger_visibility(value: int64)
        
        /** If `true`, the [SplitContainer] will arrange its children vertically, rather than horizontally.  
         *  Can't be changed when using [HSplitContainer] and [VSplitContainer].  
         */
        get vertical(): boolean
        set vertical(value: boolean)
        
        /** If `true`, a touch-friendly drag handle will be enabled for better usability on smaller screens. Unlike the standard grabber, this drag handle overlaps the [SplitContainer]'s children and does not affect their minimum separation. The standard grabber will no longer be drawn when this option is enabled. */
        get touch_dragger_enabled(): boolean
        set touch_dragger_enabled(value: boolean)
        
        /** Reduces the size of the drag area and split bar [theme_item split_bar_background] at the beginning of the container. */
        get drag_area_margin_begin(): int64
        set drag_area_margin_begin(value: int64)
        
        /** Reduces the size of the drag area and split bar [theme_item split_bar_background] at the end of the container. */
        get drag_area_margin_end(): int64
        set drag_area_margin_end(value: int64)
        
        /** Shifts the drag area in the axis of the container to prevent the drag area from overlapping the [ScrollBar] or other selectable [Control] of a child node. */
        get drag_area_offset(): int64
        set drag_area_offset(value: int64)
        
        /** Highlights the drag area [Rect2] so you can see where it is during development. The drag area is gold if [member dragging_enabled] is `true`, and red if `false`. */
        get drag_area_highlight_in_editor(): boolean
        set drag_area_highlight_in_editor(value: boolean)
        
        /** The first element of [member split_offsets]. */
        get split_offset(): int64
        set split_offset(value: int64)
        
        /** Emitted when any dragger is dragged by user. */
        readonly dragged: Signal<(offset: int64) => void>
        
        /** Emitted when the user starts dragging. */
        readonly drag_started: Signal<() => void>
        
        /** Emitted when the user ends dragging. */
        readonly drag_ended: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSplitContainer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSplitContainer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSpotLight3D extends __RPCMapLight3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSpotLight3D extends __NameMapLight3D {
    }
    /** A spotlight, such as a reflector spotlight or a lantern.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_spotlight3d.html  
     */
    class SpotLight3D<Map extends NodePathMap = any> extends Light3D<Map> {
        constructor(identifier?: any)
        /** The maximal range that can be reached by the spotlight. Note that the effectively lit area may appear to be smaller depending on the [member spot_attenuation] in use. No matter the [member spot_attenuation] in use, the light will never reach anything outside this range.  
         *      
         *  **Note:** [member spot_range] is not affected by [member Node3D.scale] (the light's scale or its parent's scale).  
         */
        get spot_range(): float64
        set spot_range(value: float64)
        
        /** Controls the distance attenuation function for spotlights.  
         *  A value of `0.0` will maintain a constant brightness through most of the range, but smoothly attenuate the light at the edge of the range. Use a value of `2.0` for physically accurate lights as it results in the proper inverse square attenutation.  
         *      
         *  **Note:** Setting attenuation to `2.0` or higher may result in distant objects receiving minimal light, even within range. For example, with a range of `4096`, an object at `100` units is attenuated by a factor of `0.0001`. With a default brightness of `1`, the light would not be visible at that distance.  
         *      
         *  **Note:** Using negative or values higher than `10.0` may lead to unexpected results.  
         */
        get spot_attenuation(): float64
        set spot_attenuation(value: float64)
        
        /** The spotlight's angle in degrees. This is the angular radius, meaning the angle from the -Z axis, the cone's center, to the edge of the cone. The default angular radius of 45 degrees corresponds to a cone with an angular diameter of 90 degrees.  
         *      
         *  **Note:** [member spot_angle] is not affected by [member Node3D.scale] (the light's scale or its parent's scale).  
         */
        get spot_angle(): float64
        set spot_angle(value: float64)
        
        /** The spotlight's  *angular*  attenuation curve. See also [member spot_attenuation]. */
        get spot_angle_attenuation(): float64
        set spot_angle_attenuation(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSpotLight3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSpotLight3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSpringArm3D extends __RPCMapNode3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSpringArm3D extends __NameMapNode3D {
    }
    /** A 3D raycast that dynamically moves its children near the collision point.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_springarm3d.html  
     */
    class SpringArm3D<Map extends NodePathMap = any> extends Node3D<Map> {
        constructor(identifier?: any)
        /** Returns the spring arm's current length. */
        get_hit_length(): float64
        
        /** Adds the [PhysicsBody3D] object with the given [RID] to the list of [PhysicsBody3D] objects excluded from the collision check. */
        add_excluded_object(RID: RID): void
        
        /** Removes the given [RID] from the list of [PhysicsBody3D] objects excluded from the collision check. */
        remove_excluded_object(RID: RID): boolean
        
        /** Clears the list of [PhysicsBody3D] objects excluded from the collision check. */
        clear_excluded_objects(): void
        
        /** The layers against which the collision check will be done. See [url=https://docs.godotengine.org/en/4.6/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information. */
        get collision_mask(): int64
        set collision_mask(value: int64)
        
        /** The [Shape3D] to use for the SpringArm3D.  
         *  When the shape is set, the SpringArm3D will cast the [Shape3D] on its z axis instead of performing a ray cast.  
         */
        get shape(): null | Shape3D
        set shape(value: null | Shape3D)
        
        /** The maximum extent of the SpringArm3D. This is used as a length for both the ray and the shape cast used internally to calculate the desired position of the SpringArm3D's child nodes.  
         *  To know more about how to perform a shape cast or a ray cast, please consult the [PhysicsDirectSpaceState3D] documentation.  
         */
        get spring_length(): float64
        set spring_length(value: float64)
        
        /** When the collision check is made, a candidate length for the SpringArm3D is given.  
         *  The margin is then subtracted to this length and the translation is applied to the child objects of the SpringArm3D.  
         *  This margin is useful for when the SpringArm3D has a [Camera3D] as a child node: without the margin, the [Camera3D] would be placed on the exact point of collision, while with the margin the [Camera3D] would be placed close to the point of collision.  
         */
        get margin(): float64
        set margin(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSpringArm3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSpringArm3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSpringBoneCollision3D extends __RPCMapNode3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSpringBoneCollision3D extends __NameMapNode3D {
    }
    /** A base class of the collision that interacts with [SpringBoneSimulator3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_springbonecollision3d.html  
     */
    class SpringBoneCollision3D<Map extends NodePathMap = any> extends Node3D<Map> {
        constructor(identifier?: any)
        /** Get parent [Skeleton3D] node of the parent [SpringBoneSimulator3D] if found. */
        get_skeleton(): null | Skeleton3D
        
        /** The name of the attached bone. */
        get bone_name(): StringName
        set bone_name(value: StringName)
        
        /** The index of the attached bone. */
        get bone(): int64
        set bone(value: int64)
        
        /** The offset of the position from [Skeleton3D]'s [member bone] pose position. */
        get position_offset(): Vector3
        set position_offset(value: Vector3)
        
        /** The offset of the rotation from [Skeleton3D]'s [member bone] pose rotation. */
        get rotation_offset(): Quaternion
        set rotation_offset(value: Quaternion)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSpringBoneCollision3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSpringBoneCollision3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSpringBoneCollisionCapsule3D extends __RPCMapSpringBoneCollision3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSpringBoneCollisionCapsule3D extends __NameMapSpringBoneCollision3D {
    }
    /** A capsule shape collision that interacts with [SpringBoneSimulator3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_springbonecollisioncapsule3d.html  
     */
    class SpringBoneCollisionCapsule3D<Map extends NodePathMap = any> extends SpringBoneCollision3D<Map> {
        constructor(identifier?: any)
        /** The capsule's radius.  
         *      
         *  **Note:** The [member radius] of a capsule cannot be greater than half of its [member height]. Otherwise, the capsule becomes a sphere. If the [member radius] is greater than half of the [member height], the properties adjust to a valid value.  
         */
        get radius(): float64
        set radius(value: float64)
        
        /** The capsule's full height, including the hemispheres.  
         *      
         *  **Note:** The [member height] of a capsule must be at least twice its [member radius]. Otherwise, the capsule becomes a sphere. If the [member height] is less than twice the [member radius], the properties adjust to a valid value.  
         */
        get height(): float64
        set height(value: float64)
        
        /** The capsule's height, excluding the hemispheres. This is the height of the central cylindrical part in the middle of the capsule, and is the distance between the centers of the two hemispheres. This is a wrapper for [member height]. */
        get mid_height(): float64
        set mid_height(value: float64)
        
        /** If `true`, the collision acts to trap the joint within the collision. */
        get inside(): boolean
        set inside(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSpringBoneCollisionCapsule3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSpringBoneCollisionCapsule3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSpringBoneCollisionPlane3D extends __RPCMapSpringBoneCollision3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSpringBoneCollisionPlane3D extends __NameMapSpringBoneCollision3D {
    }
    /** An infinite plane collision that interacts with [SpringBoneSimulator3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_springbonecollisionplane3d.html  
     */
    class SpringBoneCollisionPlane3D<Map extends NodePathMap = any> extends SpringBoneCollision3D<Map> {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSpringBoneCollisionPlane3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSpringBoneCollisionPlane3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSpringBoneCollisionSphere3D extends __RPCMapSpringBoneCollision3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSpringBoneCollisionSphere3D extends __NameMapSpringBoneCollision3D {
    }
    /** A sphere shape collision that interacts with [SpringBoneSimulator3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_springbonecollisionsphere3d.html  
     */
    class SpringBoneCollisionSphere3D<Map extends NodePathMap = any> extends SpringBoneCollision3D<Map> {
        constructor(identifier?: any)
        /** The sphere's radius. */
        get radius(): float64
        set radius(value: float64)
        
        /** If `true`, the collision acts to trap the joint within the collision. */
        get inside(): boolean
        set inside(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSpringBoneCollisionSphere3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSpringBoneCollisionSphere3D;
    }
    namespace SpringBoneSimulator3D {
        enum CenterFrom {
            /** The world origin is defined as center. */
            CENTER_FROM_WORLD_ORIGIN = 0,
            
            /** The [Node3D] specified by [method set_center_node] is defined as center.  
             *  If [Node3D] is not found, the parent [Skeleton3D] is treated as center.  
             */
            CENTER_FROM_NODE = 1,
            
            /** The bone pose origin of the parent [Skeleton3D] specified by [method set_center_bone] is defined as center.  
             *  If [Node3D] is not found, the parent [Skeleton3D] is treated as center.  
             */
            CENTER_FROM_BONE = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSpringBoneSimulator3D extends __RPCMapSkeletonModifier3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSpringBoneSimulator3D extends __NameMapSkeletonModifier3D {
    }
    /** A [SkeletonModifier3D] to apply inertial wavering to bone chains.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_springbonesimulator3d.html  
     */
    class SpringBoneSimulator3D<Map extends NodePathMap = any> extends SkeletonModifier3D<Map> {
        constructor(identifier?: any)
        /** Sets the root bone name of the bone chain. */
        set_root_bone_name(index: int64, bone_name: string): void
        
        /** Returns the root bone name of the bone chain. */
        get_root_bone_name(index: int64): string
        
        /** Sets the root bone index of the bone chain. */
        set_root_bone(index: int64, bone: int64): void
        
        /** Returns the root bone index of the bone chain. */
        get_root_bone(index: int64): int64
        
        /** Sets the end bone name of the bone chain.  
         *      
         *  **Note:** End bone must be the root bone or a child of the root bone. If they are the same, the tail must be extended by [method set_extend_end_bone] to jiggle the bone.  
         */
        set_end_bone_name(index: int64, bone_name: string): void
        
        /** Returns the end bone name of the bone chain. */
        get_end_bone_name(index: int64): string
        
        /** Sets the end bone index of the bone chain. */
        set_end_bone(index: int64, bone: int64): void
        
        /** Returns the end bone index of the bone chain. */
        get_end_bone(index: int64): int64
        
        /** If [param enabled] is `true`, the end bone is extended to have a tail.  
         *  The extended tail config is allocated to the last element in the joint list. In other words, if you set [param enabled] to `false`, the config of the last element in the joint list has no effect in the simulated result.  
         */
        set_extend_end_bone(index: int64, enabled: boolean): void
        
        /** Returns `true` if the end bone is extended to have a tail. */
        is_end_bone_extended(index: int64): boolean
        
        /** Sets the end bone tail direction of the bone chain when [method is_end_bone_extended] is `true`. */
        set_end_bone_direction(index: int64, bone_direction: SkeletonModifier3D.BoneDirection): void
        
        /** Returns the tail direction of the end bone of the bone chain when [method is_end_bone_extended] is `true`. */
        get_end_bone_direction(index: int64): SkeletonModifier3D.BoneDirection
        
        /** Sets the end bone tail length of the bone chain when [method is_end_bone_extended] is `true`. */
        set_end_bone_length(index: int64, length: float64): void
        
        /** Returns the end bone tail length of the bone chain when [method is_end_bone_extended] is `true`. */
        get_end_bone_length(index: int64): float64
        
        /** Sets what the center originates from in the bone chain.  
         *  Bone movement is calculated based on the difference in relative distance between center and bone in the previous and next frames.  
         *  For example, if the parent [Skeleton3D] is used as the center, the bones are considered to have not moved if the [Skeleton3D] moves in the world.  
         *  In this case, only a change in the bone pose is considered to be a bone movement.  
         */
        set_center_from(index: int64, center_from: SpringBoneSimulator3D.CenterFrom): void
        
        /** Returns what the center originates from in the bone chain. */
        get_center_from(index: int64): SpringBoneSimulator3D.CenterFrom
        
        /** Sets the center node path of the bone chain. */
        set_center_node(index: int64, node_path: NodePath | string): void
        
        /** Returns the center node path of the bone chain. */
        get_center_node(index: int64): NodePath
        
        /** Sets the center bone name of the bone chain. */
        set_center_bone_name(index: int64, bone_name: string): void
        
        /** Returns the center bone name of the bone chain. */
        get_center_bone_name(index: int64): string
        
        /** Sets the center bone index of the bone chain. */
        set_center_bone(index: int64, bone: int64): void
        
        /** Returns the center bone index of the bone chain. */
        get_center_bone(index: int64): int64
        
        /** Sets the joint radius of the bone chain. It is used to move and slide with the [SpringBoneCollision3D] in the collision list.  
         *  The value is scaled by [method set_radius_damping_curve] and cached in each joint setting in the joint list.  
         */
        set_radius(index: int64, radius: float64): void
        
        /** Returns the joint radius of the bone chain. */
        get_radius(index: int64): float64
        
        /** Sets the rotation axis of the bone chain. If set to a specific axis, it acts like a hinge joint. The value is cached in each joint setting in the joint list.  
         *  The axes are based on the [method Skeleton3D.get_bone_rest]'s space, if [param axis] is [constant SkeletonModifier3D.ROTATION_AXIS_CUSTOM], you can specify any axis.  
         *      
         *  **Note:** The rotation axis vector and the forward vector shouldn't be colinear to avoid unintended rotation since [SpringBoneSimulator3D] does not factor in twisting forces.  
         */
        set_rotation_axis(index: int64, axis: SkeletonModifier3D.RotationAxis): void
        
        /** Returns the rotation axis of the bone chain. */
        get_rotation_axis(index: int64): SkeletonModifier3D.RotationAxis
        
        /** Sets the rotation axis vector of the bone chain. The value is cached in each joint setting in the joint list.  
         *  This vector is normalized by an internal process and represents the axis around which the bone chain can rotate.  
         *  If the vector length is `0`, it is considered synonymous with [constant SkeletonModifier3D.ROTATION_AXIS_ALL].  
         */
        set_rotation_axis_vector(index: int64, vector: Vector3): void
        
        /** Returns the rotation axis vector of the bone chain. This vector represents the axis around which the bone chain can rotate. It is determined based on the rotation axis set for the bone chain.  
         *  If [method get_rotation_axis] is [constant SkeletonModifier3D.ROTATION_AXIS_ALL], this method returns `Vector3(0, 0, 0)`.  
         */
        get_rotation_axis_vector(index: int64): Vector3
        
        /** Sets the joint radius damping curve of the bone chain. */
        set_radius_damping_curve(index: int64, curve: Curve): void
        
        /** Returns the joint radius damping curve of the bone chain. */
        get_radius_damping_curve(index: int64): null | Curve
        
        /** Sets the stiffness force of the bone chain. The greater the value, the faster it recovers to its initial pose.  
         *  If [param stiffness] is `0`, the modified pose will not return to the original pose.  
         *  The value is scaled by [method set_stiffness_damping_curve] and cached in each joint setting in the joint list.  
         */
        set_stiffness(index: int64, stiffness: float64): void
        
        /** Returns the stiffness force of the bone chain. */
        get_stiffness(index: int64): float64
        
        /** Sets the stiffness force damping curve of the bone chain. */
        set_stiffness_damping_curve(index: int64, curve: Curve): void
        
        /** Returns the stiffness force damping curve of the bone chain. */
        get_stiffness_damping_curve(index: int64): null | Curve
        
        /** Sets the drag force of the bone chain. The greater the value, the more suppressed the wiggling.  
         *  The value is scaled by [method set_drag_damping_curve] and cached in each joint setting in the joint list.  
         */
        set_drag(index: int64, drag: float64): void
        
        /** Returns the drag force damping curve of the bone chain. */
        get_drag(index: int64): float64
        
        /** Sets the drag force damping curve of the bone chain. */
        set_drag_damping_curve(index: int64, curve: Curve): void
        
        /** Returns the drag force damping curve of the bone chain. */
        get_drag_damping_curve(index: int64): null | Curve
        
        /** Sets the gravity amount of the bone chain. This value is not an acceleration, but a constant velocity of movement in [method set_gravity_direction].  
         *  If [param gravity] is not `0`, the modified pose will not return to the original pose since it is always affected by gravity.  
         *  The value is scaled by [method set_gravity_damping_curve] and cached in each joint setting in the joint list.  
         */
        set_gravity(index: int64, gravity: float64): void
        
        /** Returns the gravity amount of the bone chain. */
        get_gravity(index: int64): float64
        
        /** Sets the gravity amount damping curve of the bone chain. */
        set_gravity_damping_curve(index: int64, curve: Curve): void
        
        /** Returns the gravity amount damping curve of the bone chain. */
        get_gravity_damping_curve(index: int64): null | Curve
        
        /** Sets the gravity direction of the bone chain. This value is internally normalized and then multiplied by [method set_gravity].  
         *  The value is cached in each joint setting in the joint list.  
         */
        set_gravity_direction(index: int64, gravity_direction: Vector3): void
        
        /** Returns the gravity direction of the bone chain. */
        get_gravity_direction(index: int64): Vector3
        
        /** Clears all settings. */
        clear_settings(): void
        
        /** If [param enabled] is `true`, the config can be edited individually for each joint. */
        set_individual_config(index: int64, enabled: boolean): void
        
        /** Returns `true` if the config can be edited individually for each joint. */
        is_config_individual(index: int64): boolean
        
        /** Returns the bone name at [param joint] in the bone chain's joint list. */
        get_joint_bone_name(index: int64, joint: int64): string
        
        /** Returns the bone index at [param joint] in the bone chain's joint list. */
        get_joint_bone(index: int64, joint: int64): int64
        
        /** Sets the rotation axis at [param joint] in the bone chain's joint list when [method is_config_individual] is `true`.  
         *  The axes are based on the [method Skeleton3D.get_bone_rest]'s space, if [param axis] is [constant SkeletonModifier3D.ROTATION_AXIS_CUSTOM], you can specify any axis.  
         *      
         *  **Note:** The rotation axis and the forward vector shouldn't be colinear to avoid unintended rotation since [SpringBoneSimulator3D] does not factor in twisting forces.  
         */
        set_joint_rotation_axis(index: int64, joint: int64, axis: SkeletonModifier3D.RotationAxis): void
        
        /** Returns the rotation axis at [param joint] in the bone chain's joint list. */
        get_joint_rotation_axis(index: int64, joint: int64): SkeletonModifier3D.RotationAxis
        
        /** Sets the rotation axis vector for the specified joint in the bone chain.  
         *  This vector is normalized by an internal process and represents the axis around which the bone chain can rotate.  
         *  If the vector length is `0`, it is considered synonymous with [constant SkeletonModifier3D.ROTATION_AXIS_ALL].  
         */
        set_joint_rotation_axis_vector(index: int64, joint: int64, vector: Vector3): void
        
        /** Returns the rotation axis vector for the specified joint in the bone chain. This vector represents the axis around which the joint can rotate. It is determined based on the rotation axis set for the joint.  
         *  If [method get_joint_rotation_axis] is [constant SkeletonModifier3D.ROTATION_AXIS_ALL], this method returns `Vector3(0, 0, 0)`.  
         */
        get_joint_rotation_axis_vector(index: int64, joint: int64): Vector3
        
        /** Sets the joint radius at [param joint] in the bone chain's joint list when [method is_config_individual] is `true`. */
        set_joint_radius(index: int64, joint: int64, radius: float64): void
        
        /** Returns the radius at [param joint] in the bone chain's joint list. */
        get_joint_radius(index: int64, joint: int64): float64
        
        /** Sets the stiffness force at [param joint] in the bone chain's joint list when [method is_config_individual] is `true`. */
        set_joint_stiffness(index: int64, joint: int64, stiffness: float64): void
        
        /** Returns the stiffness force at [param joint] in the bone chain's joint list. */
        get_joint_stiffness(index: int64, joint: int64): float64
        
        /** Sets the drag force at [param joint] in the bone chain's joint list when [method is_config_individual] is `true`. */
        set_joint_drag(index: int64, joint: int64, drag: float64): void
        
        /** Returns the drag force at [param joint] in the bone chain's joint list. */
        get_joint_drag(index: int64, joint: int64): float64
        
        /** Sets the gravity amount at [param joint] in the bone chain's joint list when [method is_config_individual] is `true`. */
        set_joint_gravity(index: int64, joint: int64, gravity: float64): void
        
        /** Returns the gravity amount at [param joint] in the bone chain's joint list. */
        get_joint_gravity(index: int64, joint: int64): float64
        
        /** Sets the gravity direction at [param joint] in the bone chain's joint list when [method is_config_individual] is `true`. */
        set_joint_gravity_direction(index: int64, joint: int64, gravity_direction: Vector3): void
        
        /** Returns the gravity direction at [param joint] in the bone chain's joint list. */
        get_joint_gravity_direction(index: int64, joint: int64): Vector3
        
        /** Returns the joint count of the bone chain's joint list. */
        get_joint_count(index: int64): int64
        
        /** If [param enabled] is `true`, all child [SpringBoneCollision3D]s are colliding and [method set_exclude_collision_path] is enabled as an exclusion list at [param index] in the settings.  
         *  If [param enabled] is `false`, you need to manually register all valid collisions with [method set_collision_path].  
         */
        set_enable_all_child_collisions(index: int64, enabled: boolean): void
        
        /** Returns `true` if all child [SpringBoneCollision3D]s are contained in the collision list at [param index] in the settings. */
        are_all_child_collisions_enabled(index: int64): boolean
        
        /** Sets the node path of the [SpringBoneCollision3D] at [param collision] in the bone chain's exclude collision list when [method are_all_child_collisions_enabled] is `true`. */
        set_exclude_collision_path(index: int64, collision: int64, node_path: NodePath | string): void
        
        /** Returns the node path of the [SpringBoneCollision3D] at [param collision] in the bone chain's exclude collision list when [method are_all_child_collisions_enabled] is `true`. */
        get_exclude_collision_path(index: int64, collision: int64): NodePath
        
        /** Sets the number of exclude collisions in the exclude collision list at [param index] in the settings when [method are_all_child_collisions_enabled] is `true`. */
        set_exclude_collision_count(index: int64, count: int64): void
        
        /** Returns the exclude collision count of the bone chain's exclude collision list when [method are_all_child_collisions_enabled] is `true`. */
        get_exclude_collision_count(index: int64): int64
        
        /** Clears all exclude collisions from the collision list at [param index] in the settings when [method are_all_child_collisions_enabled] is `true`. */
        clear_exclude_collisions(index: int64): void
        
        /** Sets the node path of the [SpringBoneCollision3D] at [param collision] in the bone chain's collision list when [method are_all_child_collisions_enabled] is `false`. */
        set_collision_path(index: int64, collision: int64, node_path: NodePath | string): void
        
        /** Returns the node path of the [SpringBoneCollision3D] at [param collision] in the bone chain's collision list when [method are_all_child_collisions_enabled] is `false`. */
        get_collision_path(index: int64, collision: int64): NodePath
        
        /** Sets the number of collisions in the collision list at [param index] in the settings when [method are_all_child_collisions_enabled] is `false`. */
        set_collision_count(index: int64, count: int64): void
        
        /** Returns the collision count of the bone chain's collision list when [method are_all_child_collisions_enabled] is `false`. */
        get_collision_count(index: int64): int64
        
        /** Clears all collisions from the collision list at [param index] in the settings when [method are_all_child_collisions_enabled] is `false`. */
        clear_collisions(index: int64): void
        
        /** Resets a simulating state with respect to the current bone pose.  
         *  It is useful to prevent the simulation result getting violent. For example, calling this immediately after a call to [method AnimationPlayer.play] without a fading, or within the previous [signal SkeletonModifier3D.modification_processed] signal if it's condition changes significantly.  
         */
        reset(): void
        
        /** The constant force that always affected bones. It is equal to the result when the parent [Skeleton3D] moves at this speed in the opposite direction.  
         *  This is useful for effects such as wind and anti-gravity.  
         */
        get external_force(): Vector3
        set external_force(value: Vector3)
        
        /** If `true`, the solver retrieves the bone axis from the bone pose every frame.  
         *  If `false`, the solver retrieves the bone axis from the bone rest and caches it, which increases performance slightly, but position changes in the bone pose made before processing this [SpringBoneSimulator3D] are ignored.  
         */
        get mutable_bone_axes(): boolean
        set mutable_bone_axes(value: boolean)
        
        /** The number of settings. */
        get setting_count(): int64
        set setting_count(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSpringBoneSimulator3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSpringBoneSimulator3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSprite2D extends __RPCMapNode2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSprite2D extends __NameMapNode2D {
    }
    /** General-purpose sprite node.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_sprite2d.html  
     */
    class Sprite2D<Map extends NodePathMap = any> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Returns `true` if the pixel at the given position is opaque, `false` otherwise. Also returns `false` if the given position is out of bounds or this sprite's [member texture] is `null`. [param pos] is in local coordinates. */
        is_pixel_opaque(pos: Vector2): boolean
        
        /** Returns a [Rect2] representing the Sprite2D's boundary in local coordinates.  
         *  **Example:** Detect if the Sprite2D was clicked:  
         *    
         */
        get_rect(): Rect2
        
        /** [Texture2D] object to draw. */
        get texture(): null | Texture2D
        set texture(value: null | Texture2D)
        
        /** If `true`, texture is centered.  
         *      
         *  **Note:** For games with a pixel art aesthetic, textures may appear deformed when centered. This is caused by their position being between pixels. To prevent this, set this property to `false`, or consider enabling [member ProjectSettings.rendering/2d/snap/snap_2d_vertices_to_pixel] and [member ProjectSettings.rendering/2d/snap/snap_2d_transforms_to_pixel].  
         */
        get centered(): boolean
        set centered(value: boolean)
        
        /** The texture's drawing offset.  
         *      
         *  **Note:** When you increase [member offset].y in Sprite2D, the sprite moves downward on screen (i.e., +Y is down).  
         */
        get offset(): Vector2
        set offset(value: Vector2)
        
        /** If `true`, texture is flipped horizontally. */
        get flip_h(): boolean
        set flip_h(value: boolean)
        
        /** If `true`, texture is flipped vertically. */
        get flip_v(): boolean
        set flip_v(value: boolean)
        
        /** The number of columns in the sprite sheet. When this property is changed, [member frame] is adjusted so that the same visual frame is maintained (same row and column). If that's impossible, [member frame] is reset to `0`. */
        get hframes(): int64
        set hframes(value: int64)
        
        /** The number of rows in the sprite sheet. When this property is changed, [member frame] is adjusted so that the same visual frame is maintained (same row and column). If that's impossible, [member frame] is reset to `0`. */
        get vframes(): int64
        set vframes(value: int64)
        
        /** Current frame to display from sprite sheet. [member hframes] or [member vframes] must be greater than 1. This property is automatically adjusted when [member hframes] or [member vframes] are changed to keep pointing to the same visual frame (same column and row). If that's impossible, this value is reset to `0`. */
        get frame(): int64
        set frame(value: int64)
        
        /** Coordinates of the frame to display from sprite sheet. This is as an alias for the [member frame] property. [member hframes] or [member vframes] must be greater than 1. */
        get frame_coords(): Vector2i
        set frame_coords(value: Vector2i)
        
        /** If `true`, texture is cut from a larger atlas texture. See [member region_rect].  
         *      
         *  **Note:** When using a custom [Shader] on a [Sprite2D], the `UV` shader built-in will refer to the entire texture space. Use the `REGION_RECT` built-in to get the currently visible region defined in [member region_rect] instead. See [url=https://docs.godotengine.org/en/4.6/tutorials/shaders/shader_reference/canvas_item_shader.html]CanvasItem shaders[/url] for details.  
         */
        get region_enabled(): boolean
        set region_enabled(value: boolean)
        
        /** The region of the atlas texture to display. [member region_enabled] must be `true`. */
        get region_rect(): Rect2
        set region_rect(value: Rect2)
        
        /** If `true`, the area outside of the [member region_rect] is clipped to avoid bleeding of the surrounding texture pixels. [member region_enabled] must be `true`. */
        get region_filter_clip_enabled(): boolean
        set region_filter_clip_enabled(value: boolean)
        
        /** Emitted when the [member frame] changes. */
        readonly frame_changed: Signal<() => void>
        
        /** Emitted when the [member texture] changes. */
        readonly texture_changed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSprite2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSprite2D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSprite3D extends __RPCMapSpriteBase3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSprite3D extends __NameMapSpriteBase3D {
    }
    /** 2D sprite node in a 3D world.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_sprite3d.html  
     */
    class Sprite3D<Map extends NodePathMap = any> extends SpriteBase3D<Map> {
        constructor(identifier?: any)
        /** [Texture2D] object to draw. If [member GeometryInstance3D.material_override] is used, this will be overridden. The size information is still used. */
        get texture(): null | Texture2D
        set texture(value: null | Texture2D)
        
        /** The number of columns in the sprite sheet. When this property is changed, [member frame] is adjusted so that the same visual frame is maintained (same row and column). If that's impossible, [member frame] is reset to `0`. */
        get hframes(): int64
        set hframes(value: int64)
        
        /** The number of rows in the sprite sheet. When this property is changed, [member frame] is adjusted so that the same visual frame is maintained (same row and column). If that's impossible, [member frame] is reset to `0`. */
        get vframes(): int64
        set vframes(value: int64)
        
        /** Current frame to display from sprite sheet. [member hframes] or [member vframes] must be greater than 1. This property is automatically adjusted when [member hframes] or [member vframes] are changed to keep pointing to the same visual frame (same column and row). If that's impossible, this value is reset to `0`. */
        get frame(): int64
        set frame(value: int64)
        
        /** Coordinates of the frame to display from sprite sheet. This is as an alias for the [member frame] property. [member hframes] or [member vframes] must be greater than 1. */
        get frame_coords(): Vector2i
        set frame_coords(value: Vector2i)
        
        /** If `true`, the sprite will use [member region_rect] and display only the specified part of its texture. */
        get region_enabled(): boolean
        set region_enabled(value: boolean)
        
        /** The region of the atlas texture to display. [member region_enabled] must be `true`. */
        get region_rect(): Rect2
        set region_rect(value: Rect2)
        
        /** Emitted when the [member frame] changes. */
        readonly frame_changed: Signal<() => void>
        
        /** Emitted when the [member texture] changes. */
        readonly texture_changed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSprite3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSprite3D;
    }
    namespace SpriteBase3D {
        enum DrawFlags {
            /** If set, the texture's transparency and the opacity are used to make those parts of the sprite invisible. */
            FLAG_TRANSPARENT = 0,
            
            /** If set, lights in the environment affect the sprite. */
            FLAG_SHADED = 1,
            
            /** If set, texture can be seen from the back as well. If not, the texture is invisible when looking at it from behind. */
            FLAG_DOUBLE_SIDED = 2,
            
            /** Disables the depth test, so this object is drawn on top of all others. However, objects drawn after it in the draw order may cover it. */
            FLAG_DISABLE_DEPTH_TEST = 3,
            
            /** Label is scaled by depth so that it always appears the same size on screen. */
            FLAG_FIXED_SIZE = 4,
            
            /** Represents the size of the [enum DrawFlags] enum. */
            FLAG_MAX = 5,
        }
        enum AlphaCutMode {
            /** This mode performs standard alpha blending. It can display translucent areas, but transparency sorting issues may be visible when multiple transparent materials are overlapping. */
            ALPHA_CUT_DISABLED = 0,
            
            /** This mode only allows fully transparent or fully opaque pixels. Harsh edges will be visible unless some form of screen-space antialiasing is enabled (see [member ProjectSettings.rendering/anti_aliasing/quality/screen_space_aa]). On the bright side, this mode doesn't suffer from transparency sorting issues when multiple transparent materials are overlapping. This mode is also known as  *alpha testing*  or  *1-bit transparency* . */
            ALPHA_CUT_DISCARD = 1,
            
            /** This mode draws fully opaque pixels in the depth prepass. This is slower than [constant ALPHA_CUT_DISABLED] or [constant ALPHA_CUT_DISCARD], but it allows displaying translucent areas and smooth edges while using proper sorting. */
            ALPHA_CUT_OPAQUE_PREPASS = 2,
            
            /** This mode draws cuts off all values below a spatially-deterministic threshold, the rest will remain opaque. */
            ALPHA_CUT_HASH = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSpriteBase3D extends __RPCMapGeometryInstance3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSpriteBase3D extends __NameMapGeometryInstance3D {
    }
    /** 2D sprite node in 3D environment.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_spritebase3d.html  
     */
    class SpriteBase3D<Map extends NodePathMap = any> extends GeometryInstance3D<Map> {
        constructor(identifier?: any)
        /** If `true`, the specified flag will be enabled. */
        set_draw_flag(flag: SpriteBase3D.DrawFlags, enabled: boolean): void
        
        /** Returns the value of the specified flag. */
        get_draw_flag(flag: SpriteBase3D.DrawFlags): boolean
        
        /** Returns the rectangle representing this sprite. */
        get_item_rect(): Rect2
        
        /** Returns a [TriangleMesh] with the sprite's vertices following its current configuration (such as its [member axis] and [member pixel_size]). */
        generate_triangle_mesh(): null | TriangleMesh
        
        /** If `true`, texture will be centered. */
        get centered(): boolean
        set centered(value: boolean)
        
        /** The texture's drawing offset.  
         *      
         *  **Note:** When you increase [member offset].y in Sprite3D, the sprite moves upward in world space (i.e., +Y is up).  
         */
        get offset(): Vector2
        set offset(value: Vector2)
        
        /** If `true`, texture is flipped horizontally. */
        get flip_h(): boolean
        set flip_h(value: boolean)
        
        /** If `true`, texture is flipped vertically. */
        get flip_v(): boolean
        set flip_v(value: boolean)
        
        /** A color value used to  *multiply*  the texture's colors. Can be used for mood-coloring or to simulate the color of ambient light.  
         *      
         *  **Note:** Unlike [member CanvasItem.modulate] for 2D, colors with values above `1.0` (overbright) are not supported.  
         *      
         *  **Note:** If a [member GeometryInstance3D.material_override] is defined on the [SpriteBase3D], the material override must be configured to take vertex colors into account for albedo. Otherwise, the color defined in [member modulate] will be ignored. For a [BaseMaterial3D], [member BaseMaterial3D.vertex_color_use_as_albedo] must be `true`. For a [ShaderMaterial], `ALBEDO *= COLOR.rgb;` must be inserted in the shader's `fragment()` function.  
         */
        get modulate(): Color
        set modulate(value: Color)
        
        /** The size of one pixel's width on the sprite to scale it in 3D. */
        get pixel_size(): float64
        set pixel_size(value: float64)
        
        /** The direction in which the front of the texture faces. */
        get axis(): int64
        set axis(value: int64)
        
        /** The billboard mode to use for the sprite.  
         *      
         *  **Note:** When billboarding is enabled and the material also casts shadows, billboards will face **the** camera in the scene when rendering shadows. In scenes with multiple cameras, the intended shadow cannot be determined and this will result in undefined behavior. See [url=https://github.com/godotengine/godot/pull/72638]GitHub Pull Request #72638[/url] for details.  
         */
        get billboard(): int64
        set billboard(value: int64)
        
        /** If `true`, the texture's transparency and the opacity are used to make those parts of the sprite invisible. */
        get transparent(): boolean
        set transparent(value: boolean)
        
        /** If `true`, the [Light3D] in the [Environment] has effects on the sprite. */
        get shaded(): boolean
        set shaded(value: boolean)
        
        /** If `true`, texture can be seen from the back as well, if `false`, it is invisible when looking at it from behind. */
        get double_sided(): boolean
        set double_sided(value: boolean)
        
        /** If `true`, depth testing is disabled and the object will be drawn in render order. */
        get no_depth_test(): boolean
        set no_depth_test(value: boolean)
        
        /** If `true`, the texture is rendered at the same size regardless of distance. The texture's size on screen is the same as if the camera was `1.0` units away from the texture's origin, regardless of the actual distance from the camera. The [Camera3D]'s field of view (or [member Camera3D.size] when in orthogonal/frustum mode) still affects the size the sprite is drawn at. */
        get fixed_size(): boolean
        set fixed_size(value: boolean)
        
        /** The alpha cutting mode to use for the sprite. */
        get alpha_cut(): int64
        set alpha_cut(value: int64)
        
        /** Threshold at which the alpha scissor will discard values. */
        get alpha_scissor_threshold(): float64
        set alpha_scissor_threshold(value: float64)
        
        /** The hashing scale for Alpha Hash. Recommended values between `0` and `2`. */
        get alpha_hash_scale(): float64
        set alpha_hash_scale(value: float64)
        
        /** The type of alpha antialiasing to apply. */
        get alpha_antialiasing_mode(): int64
        set alpha_antialiasing_mode(value: int64)
        
        /** Threshold at which antialiasing will be applied on the alpha channel. */
        get alpha_antialiasing_edge(): float64
        set alpha_antialiasing_edge(value: float64)
        
        /** Filter flags for the texture.  
         *      
         *  **Note:** Linear filtering may cause artifacts around the edges, which are especially noticeable on opaque textures. To prevent this, use textures with transparent or identical colors around the edges.  
         */
        get texture_filter(): int64
        set texture_filter(value: int64)
        
        /** Sets the render priority for the sprite. Higher priority objects will be sorted in front of lower priority objects.  
         *      
         *  **Note:** This only applies if [member alpha_cut] is set to [constant ALPHA_CUT_DISABLED] (default value).  
         *      
         *  **Note:** This only applies to sorting of transparent objects. This will not impact how transparent objects are sorted relative to opaque objects. This is because opaque objects are not sorted, while transparent objects are sorted from back to front (subject to priority).  
         */
        get render_priority(): int64
        set render_priority(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSpriteBase3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSpriteBase3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSpriteFrames extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSpriteFrames extends __NameMapResource {
    }
    /** Sprite frame library for AnimatedSprite2D and AnimatedSprite3D.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_spriteframes.html  
     */
    class SpriteFrames extends Resource {
        constructor(identifier?: any)
        /** Adds a new [param anim] animation to the library. */
        add_animation(anim: StringName): void
        
        /** Returns `true` if the [param anim] animation exists. */
        has_animation(anim: StringName): boolean
        
        /** Duplicates the animation [param anim_from] to a new animation named [param anim_to]. Fails if [param anim_to] already exists, or if [param anim_from] does not exist. */
        duplicate_animation(anim_from: StringName, anim_to: StringName): void
        
        /** Removes the [param anim] animation. */
        remove_animation(anim: StringName): void
        
        /** Changes the [param anim] animation's name to [param newname]. */
        rename_animation(anim: StringName, newname: StringName): void
        
        /** Returns an array containing the names associated to each animation. Values are placed in alphabetical order. */
        get_animation_names(): PackedStringArray
        
        /** Sets the speed for the [param anim] animation in frames per second. */
        set_animation_speed(anim: StringName, fps: float64): void
        
        /** Returns the speed in frames per second for the [param anim] animation. */
        get_animation_speed(anim: StringName): float64
        
        /** If [param loop] is `true`, the [param anim] animation will loop when it reaches the end, or the start if it is played in reverse. */
        set_animation_loop(anim: StringName, loop: boolean): void
        
        /** Returns `true` if the given animation is configured to loop when it finishes playing. Otherwise, returns `false`. */
        get_animation_loop(anim: StringName): boolean
        
        /** Adds a frame to the [param anim] animation. If [param at_position] is `-1`, the frame will be added to the end of the animation. [param duration] specifies the relative duration, see [method get_frame_duration] for details. */
        add_frame(anim: StringName, texture: Texture2D, duration?: float64 /* = 1 */, at_position?: int64 /* = -1 */): void
        
        /** Sets the [param texture] and the [param duration] of the frame [param idx] in the [param anim] animation. [param duration] specifies the relative duration, see [method get_frame_duration] for details. */
        set_frame(anim: StringName, idx: int64, texture: Texture2D, duration?: float64 /* = 1 */): void
        
        /** Removes the [param anim] animation's frame [param idx]. */
        remove_frame(anim: StringName, idx: int64): void
        
        /** Returns the number of frames for the [param anim] animation. */
        get_frame_count(anim: StringName): int64
        
        /** Returns the texture of the frame [param idx] in the [param anim] animation. */
        get_frame_texture(anim: StringName, idx: int64): null | Texture2D
        
        /** Returns a relative duration of the frame [param idx] in the [param anim] animation (defaults to `1.0`). For example, a frame with a duration of `2.0` is displayed twice as long as a frame with a duration of `1.0`. You can calculate the absolute duration (in seconds) of a frame using the following formula:  
         *    
         *  In this example, `playing_speed` refers to either [method AnimatedSprite2D.get_playing_speed] or [method AnimatedSprite3D.get_playing_speed].  
         */
        get_frame_duration(anim: StringName, idx: int64): float64
        
        /** Removes all frames from the [param anim] animation. */
        clear(anim: StringName): void
        
        /** Removes all animations. An empty `default` animation will be created. */
        clear_all(): void
        get animations(): GArray
        set animations(value: GArray)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSpriteFrames;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSpriteFrames;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapStandardMaterial3D extends __RPCMapBaseMaterial3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapStandardMaterial3D extends __NameMapBaseMaterial3D {
    }
    /** A PBR (Physically Based Rendering) material to be used on 3D objects.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_standardmaterial3d.html  
     */
    class StandardMaterial3D extends BaseMaterial3D {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapStandardMaterial3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapStandardMaterial3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapStaticBody2D extends __RPCMapPhysicsBody2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapStaticBody2D extends __NameMapPhysicsBody2D {
    }
    /** A 2D physics body that can't be moved by external forces. When moved manually, it doesn't affect other bodies in its path.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_staticbody2d.html  
     */
    class StaticBody2D<Map extends NodePathMap = any> extends PhysicsBody2D<Map> {
        constructor(identifier?: any)
        /** The physics material override for the body.  
         *  If a material is assigned to this property, it will be used instead of any other physics material, such as an inherited one.  
         */
        get physics_material_override(): null | PhysicsMaterial
        set physics_material_override(value: null | PhysicsMaterial)
        
        /** The body's constant linear velocity. This does not move the body, but affects touching bodies, as if it were moving. */
        get constant_linear_velocity(): Vector2
        set constant_linear_velocity(value: Vector2)
        
        /** The body's constant angular velocity. This does not rotate the body, but affects touching bodies, as if it were rotating. */
        get constant_angular_velocity(): float64
        set constant_angular_velocity(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapStaticBody2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapStaticBody2D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapStaticBody3D extends __RPCMapPhysicsBody3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapStaticBody3D extends __NameMapPhysicsBody3D {
    }
    /** A 3D physics body that can't be moved by external forces. When moved manually, it doesn't affect other bodies in its path.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_staticbody3d.html  
     */
    class StaticBody3D<Map extends NodePathMap = any> extends PhysicsBody3D<Map> {
        constructor(identifier?: any)
        /** The physics material override for the body.  
         *  If a material is assigned to this property, it will be used instead of any other physics material, such as an inherited one.  
         */
        get physics_material_override(): null | PhysicsMaterial
        set physics_material_override(value: null | PhysicsMaterial)
        
        /** The body's constant linear velocity. This does not move the body, but affects touching bodies, as if it were moving. */
        get constant_linear_velocity(): Vector3
        set constant_linear_velocity(value: Vector3)
        
        /** The body's constant angular velocity. This does not rotate the body, but affects touching bodies, as if it were rotating. */
        get constant_angular_velocity(): Vector3
        set constant_angular_velocity(value: Vector3)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapStaticBody3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapStaticBody3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapStatusIndicator extends __RPCMapNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapStatusIndicator extends __NameMapNode {
    }
    /** Application status indicator (aka notification area icon).  
     *      
     *  **Note:** Status indicator is implemented on macOS and Windows.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_statusindicator.html  
     */
    class StatusIndicator<Map extends NodePathMap = any> extends Node<Map> {
        constructor(identifier?: any)
        /** Returns the status indicator rectangle in screen coordinates. If this status indicator is not visible, returns an empty [Rect2]. */
        get_rect(): Rect2
        
        /** Status indicator tooltip. */
        get tooltip(): string
        set tooltip(value: string)
        
        /** Status indicator icon. */
        get icon(): null | Texture2D
        set icon(value: null | Texture2D)
        
        /** Status indicator native popup menu. If this is set, the [signal pressed] signal is not emitted.  
         *      
         *  **Note:** Native popup is only supported if [NativeMenu] supports [constant NativeMenu.FEATURE_POPUP_MENU] feature.  
         */
        get menu(): NodePath
        set menu(value: NodePath | string)
        
        /** If `true`, the status indicator is visible. */
        get visible(): boolean
        set visible(value: boolean)
        
        /** Emitted when the status indicator is pressed. */
        readonly pressed: Signal<(mouse_button: int64, mouse_position: Vector2i) => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapStatusIndicator;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapStatusIndicator;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapStreamPeer extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapStreamPeer extends __NameMapRefCounted {
    }
    /** Abstract base class for interacting with streams.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_streampeer.html  
     */
    class StreamPeer extends RefCounted {
        constructor(identifier?: any)
        /** Sends a chunk of data through the connection, blocking if necessary until the data is done sending. This function returns an [enum Error] code. */
        put_data(data: PackedByteArray | byte[] | ArrayBuffer): Error
        
        /** Sends a chunk of data through the connection. If all the data could not be sent at once, only part of it will. This function returns two values, an [enum Error] code and an integer, describing how much data was actually sent. */
        put_partial_data(data: PackedByteArray | byte[] | ArrayBuffer): GArray
        
        /** Returns a chunk data with the received bytes, as an [Array] containing two elements: an [enum Error] constant and a [PackedByteArray]. [param bytes] is the number of bytes to be received. If not enough bytes are available, the function will block until the desired amount is received. */
        get_data(bytes: int64): GArray
        
        /** Returns a chunk data with the received bytes, as an [Array] containing two elements: an [enum Error] constant and a [PackedByteArray]. [param bytes] is the number of bytes to be received. If not enough bytes are available, the function will return how many were actually received. */
        get_partial_data(bytes: int64): GArray
        
        /** Returns the number of bytes this [StreamPeer] has available. */
        get_available_bytes(): int64
        
        /** Puts a signed byte into the stream. */
        put_8(value: int64): void
        
        /** Puts an unsigned byte into the stream. */
        put_u8(value: int64): void
        
        /** Puts a signed 16-bit value into the stream. */
        put_16(value: int64): void
        
        /** Puts an unsigned 16-bit value into the stream. */
        put_u16(value: int64): void
        
        /** Puts a signed 32-bit value into the stream. */
        put_32(value: int64): void
        
        /** Puts an unsigned 32-bit value into the stream. */
        put_u32(value: int64): void
        
        /** Puts a signed 64-bit value into the stream. */
        put_64(value: int64): void
        
        /** Puts an unsigned 64-bit value into the stream. */
        put_u64(value: int64): void
        
        /** Puts a half-precision float into the stream. */
        put_half(value: float64): void
        
        /** Puts a single-precision float into the stream. */
        put_float(value: float64): void
        
        /** Puts a double-precision float into the stream. */
        put_double(value: float64): void
        
        /** Puts a zero-terminated ASCII string into the stream prepended by a 32-bit unsigned integer representing its size.  
         *      
         *  **Note:** To put an ASCII string without prepending its size, you can use [method put_data]:  
         *    
         */
        put_string(value: string): void
        
        /** Puts a zero-terminated UTF-8 string into the stream prepended by a 32 bits unsigned integer representing its size.  
         *      
         *  **Note:** To put a UTF-8 string without prepending its size, you can use [method put_data]:  
         *    
         */
        put_utf8_string(value: string): void
        
        /** Puts a Variant into the stream. If [param full_objects] is `true` encoding objects is allowed (and can potentially include code).  
         *  Internally, this uses the same encoding mechanism as the [method @GlobalScope.var_to_bytes] method.  
         */
        put_var(value: any, full_objects?: boolean /* = false */): void
        
        /** Gets a signed byte from the stream. */
        get_8(): int64
        
        /** Gets an unsigned byte from the stream. */
        get_u8(): int64
        
        /** Gets a signed 16-bit value from the stream. */
        get_16(): int64
        
        /** Gets an unsigned 16-bit value from the stream. */
        get_u16(): int64
        
        /** Gets a signed 32-bit value from the stream. */
        get_32(): int64
        
        /** Gets an unsigned 32-bit value from the stream. */
        get_u32(): int64
        
        /** Gets a signed 64-bit value from the stream. */
        get_64(): int64
        
        /** Gets an unsigned 64-bit value from the stream. */
        get_u64(): int64
        
        /** Gets a half-precision float from the stream. */
        get_half(): float64
        
        /** Gets a single-precision float from the stream. */
        get_float(): float64
        
        /** Gets a double-precision float from the stream. */
        get_double(): float64
        
        /** Gets an ASCII string with byte-length [param bytes] from the stream. If [param bytes] is negative (default) the length will be read from the stream using the reverse process of [method put_string]. */
        get_string(bytes?: int64 /* = -1 */): string
        
        /** Gets a UTF-8 string with byte-length [param bytes] from the stream (this decodes the string sent as UTF-8). If [param bytes] is negative (default) the length will be read from the stream using the reverse process of [method put_utf8_string]. */
        get_utf8_string(bytes?: int64 /* = -1 */): string
        
        /** Gets a Variant from the stream. If [param allow_objects] is `true`, decoding objects is allowed.  
         *  Internally, this uses the same decoding mechanism as the [method @GlobalScope.bytes_to_var] method.  
         *  **Warning:** Deserialized objects can contain code which gets executed. Do not use this option if the serialized object comes from untrusted sources to avoid potential security threats such as remote code execution.  
         */
        get_var(allow_objects?: boolean /* = false */): any
        
        /** If `true`, this [StreamPeer] will using big-endian format for encoding and decoding. */
        get big_endian(): boolean
        set big_endian(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapStreamPeer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapStreamPeer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapStreamPeerBuffer extends __RPCMapStreamPeer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapStreamPeerBuffer extends __NameMapStreamPeer {
    }
    /** A stream peer used to handle binary data streams.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_streampeerbuffer.html  
     */
    class StreamPeerBuffer extends StreamPeer {
        constructor(identifier?: any)
        /** Moves the cursor to the specified position. [param position] must be a valid index of [member data_array]. */
        seek(position: int64): void
        
        /** Returns the size of [member data_array]. */
        get_size(): int64
        
        /** Returns the current cursor position. */
        get_position(): int64
        
        /** Resizes the [member data_array]. This  *doesn't*  update the cursor. */
        resize(size: int64): void
        
        /** Clears the [member data_array] and resets the cursor. */
        clear(): void
        
        /** Returns a new [StreamPeerBuffer] with the same [member data_array] content. */
        duplicate(): null | StreamPeerBuffer
        
        /** The underlying data buffer. Setting this value resets the cursor. */
        get data_array(): PackedByteArray
        set data_array(value: PackedByteArray | byte[] | ArrayBuffer)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapStreamPeerBuffer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapStreamPeerBuffer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapStreamPeerExtension extends __RPCMapStreamPeer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapStreamPeerExtension extends __NameMapStreamPeer {
    }
    /** @link https://docs.godotengine.org/en/4.6/classes/class_streampeerextension.html */
    class StreamPeerExtension extends StreamPeer {
        constructor(identifier?: any)
        /* gdvirtual */ _get_data(r_buffer: int64, r_bytes: int64, r_received: int64): Error
        /* gdvirtual */ _get_partial_data(r_buffer: int64, r_bytes: int64, r_received: int64): Error
        /* gdvirtual */ _put_data(p_data: int64, p_bytes: int64, r_sent: int64): Error
        /* gdvirtual */ _put_partial_data(p_data: int64, p_bytes: int64, r_sent: int64): Error
        /* gdvirtual */ _get_available_bytes(): int64
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapStreamPeerExtension;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapStreamPeerExtension;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapStreamPeerGZIP extends __RPCMapStreamPeer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapStreamPeerGZIP extends __NameMapStreamPeer {
    }
    /** A stream peer that handles GZIP and deflate compression/decompression.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_streampeergzip.html  
     */
    class StreamPeerGZIP extends StreamPeer {
        constructor(identifier?: any)
        /** Start the stream in compression mode with the given [param buffer_size], if [param use_deflate] is `true` uses deflate instead of GZIP. */
        start_compression(use_deflate?: boolean /* = false */, buffer_size?: int64 /* = 65535 */): Error
        
        /** Start the stream in decompression mode with the given [param buffer_size], if [param use_deflate] is `true` uses deflate instead of GZIP. */
        start_decompression(use_deflate?: boolean /* = false */, buffer_size?: int64 /* = 65535 */): Error
        
        /** Finalizes the stream, compressing any buffered chunk left.  
         *  You must call it only when you are compressing.  
         */
        finish(): Error
        
        /** Clears this stream, resetting the internal state. */
        clear(): void
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapStreamPeerGZIP;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapStreamPeerGZIP;
    }
    namespace StreamPeerSocket {
        enum Status {
            /** The initial status of the [StreamPeerSocket]. This is also the status after disconnecting. */
            STATUS_NONE = 0,
            
            /** A status representing a [StreamPeerSocket] that is connecting to a host. */
            STATUS_CONNECTING = 1,
            
            /** A status representing a [StreamPeerSocket] that is connected to a host. */
            STATUS_CONNECTED = 2,
            
            /** A status representing a [StreamPeerSocket] in error state. */
            STATUS_ERROR = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapStreamPeerSocket extends __RPCMapStreamPeer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapStreamPeerSocket extends __NameMapStreamPeer {
    }
    /** Abstract base class for interacting with socket streams.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_streampeersocket.html  
     */
    class StreamPeerSocket extends StreamPeer {
        constructor(identifier?: any)
        /** Polls the socket, updating its state. See [method get_status]. */
        poll(): Error
        
        /** Returns the status of the connection. */
        get_status(): StreamPeerSocket.Status
        
        /** Disconnects from host. */
        disconnect_from_host(): void
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapStreamPeerSocket;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapStreamPeerSocket;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapStreamPeerTCP extends __RPCMapStreamPeerSocket {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapStreamPeerTCP extends __NameMapStreamPeerSocket {
    }
    /** A stream peer that handles TCP connections.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_streampeertcp.html  
     */
    class StreamPeerTCP extends StreamPeerSocket {
        constructor(identifier?: any)
        /** Opens the TCP socket, and binds it to the specified local address.  
         *  This method is generally not needed, and only used to force the subsequent call to [method connect_to_host] to use the specified [param host] and [param port] as source address. This can be desired in some NAT punchthrough techniques, or when forcing the source network interface.  
         */
        bind(port: int64, host?: string /* = '*' */): Error
        
        /** Connects to the specified `host:port` pair. A hostname will be resolved if valid. Returns [constant OK] on success. */
        connect_to_host(host: string, port: int64): Error
        
        /** Returns the IP of this peer. */
        get_connected_host(): string
        
        /** Returns the port of this peer. */
        get_connected_port(): int64
        
        /** Returns the local port to which this peer is bound. */
        get_local_port(): int64
        
        /** If [param enabled] is `true`, packets will be sent immediately. If [param enabled] is `false` (the default), packet transfers will be delayed and combined using [url=https://en.wikipedia.org/wiki/Nagle%27s_algorithm]Nagle's algorithm[/url].  
         *      
         *  **Note:** It's recommended to leave this disabled for applications that send large packets or need to transfer a lot of data, as enabling this can decrease the total available bandwidth.  
         */
        set_no_delay(enabled: boolean): void
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapStreamPeerTCP;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapStreamPeerTCP;
    }
    namespace StreamPeerTLS {
        enum Status {
            /** A status representing a [StreamPeerTLS] that is disconnected. */
            STATUS_DISCONNECTED = 0,
            
            /** A status representing a [StreamPeerTLS] during handshaking. */
            STATUS_HANDSHAKING = 1,
            
            /** A status representing a [StreamPeerTLS] that is connected to a host. */
            STATUS_CONNECTED = 2,
            
            /** A status representing a [StreamPeerTLS] in error state. */
            STATUS_ERROR = 3,
            
            /** An error status that shows a mismatch in the TLS certificate domain presented by the host and the domain requested for validation. */
            STATUS_ERROR_HOSTNAME_MISMATCH = 4,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapStreamPeerTLS extends __RPCMapStreamPeer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapStreamPeerTLS extends __NameMapStreamPeer {
    }
    /** A stream peer that handles TLS connections.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_streampeertls.html  
     */
    class StreamPeerTLS extends StreamPeer {
        constructor(identifier?: any)
        /** Poll the connection to check for incoming bytes. Call this right before [method StreamPeer.get_available_bytes] for it to work properly. */
        poll(): void
        
        /** Accepts a peer connection as a server using the given [param server_options]. See [method TLSOptions.server]. */
        accept_stream(stream: StreamPeer, server_options: TLSOptions): Error
        
        /** Connects to a peer using an underlying [StreamPeer] [param stream] and verifying the remote certificate is correctly signed for the given [param common_name]. You can pass the optional [param client_options] parameter to customize the trusted certification authorities, or disable the common name verification. See [method TLSOptions.client] and [method TLSOptions.client_unsafe]. */
        connect_to_stream(stream: StreamPeer, common_name: string, client_options?: TLSOptions): Error
        
        /** Returns the status of the connection. */
        get_status(): StreamPeerTLS.Status
        
        /** Returns the underlying [StreamPeer] connection, used in [method accept_stream] or [method connect_to_stream]. */
        get_stream(): null | StreamPeer
        
        /** Disconnects from host. */
        disconnect_from_stream(): void
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapStreamPeerTLS;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapStreamPeerTLS;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapStreamPeerUDS extends __RPCMapStreamPeerSocket {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapStreamPeerUDS extends __NameMapStreamPeerSocket {
    }
    /** A stream peer that handles UNIX Domain Socket (UDS) connections.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_streampeeruds.html  
     */
    class StreamPeerUDS extends StreamPeerSocket {
        constructor(identifier?: any)
        /** Opens the UDS socket, and binds it to the specified socket path.  
         *  This method is generally not needed, and only used to force the subsequent call to [method connect_to_host] to use the specified [param path] as the source address.  
         */
        bind(path: string): Error
        
        /** Connects to the specified UNIX Domain Socket path. Returns [constant OK] on success. */
        connect_to_host(path: string): Error
        
        /** Returns the socket path of this peer. */
        get_connected_path(): string
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapStreamPeerUDS;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapStreamPeerUDS;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapStyleBox extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapStyleBox extends __NameMapResource {
    }
    /** Abstract base class for defining stylized boxes for UI elements.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_stylebox.html  
     */
    class StyleBox extends Resource {
        constructor(identifier?: any)
        /* gdvirtual */ _draw(to_canvas_item: RID, rect: Rect2): void
        /* gdvirtual */ _get_draw_rect(rect: Rect2): Rect2
        
        /** Virtual method to be implemented by the user. Returns a custom minimum size that the stylebox must respect when drawing. By default [method get_minimum_size] only takes content margins into account. This method can be overridden to add another size restriction. A combination of the default behavior and the output of this method will be used, to account for both sizes. */
        /* gdvirtual */ _get_minimum_size(): Vector2
        /* gdvirtual */ _test_mask(point: Vector2, rect: Rect2): boolean
        
        /** Returns the minimum size that this stylebox can be shrunk to. */
        get_minimum_size(): Vector2
        
        /** Sets the default value of the specified [enum Side] to [param offset] pixels. */
        set_content_margin(margin: Side, offset: float64): void
        
        /** Sets the default margin to [param offset] pixels for all sides. */
        set_content_margin_all(offset: float64): void
        
        /** Returns the default margin of the specified [enum Side]. */
        get_content_margin(margin: Side): float64
        
        /** Returns the content margin offset for the specified [enum Side].  
         *  Positive values reduce size inwards, unlike [Control]'s margin values.  
         */
        get_margin(margin: Side): float64
        
        /** Returns the "offset" of a stylebox. This helper function returns a value equivalent to `Vector2(style.get_margin(MARGIN_LEFT), style.get_margin(MARGIN_TOP))`. */
        get_offset(): Vector2
        
        /** Draws this stylebox using a canvas item identified by the given [RID].  
         *  The [RID] value can either be the result of [method CanvasItem.get_canvas_item] called on an existing [CanvasItem]-derived node, or directly from creating a canvas item in the [RenderingServer] with [method RenderingServer.canvas_item_create].  
         */
        draw(canvas_item: RID, rect: Rect2): void
        
        /** Returns the [CanvasItem] that handles its [constant CanvasItem.NOTIFICATION_DRAW] or [method CanvasItem._draw] callback at this moment. */
        get_current_item_drawn(): null | CanvasItem
        
        /** Test a position in a rectangle, return whether it passes the mask test. */
        test_mask(point: Vector2, rect: Rect2): boolean
        
        /** The left margin for the contents of this style box. Increasing this value reduces the space available to the contents from the left.  
         *  Refer to [member content_margin_bottom] for extra considerations.  
         */
        get content_margin_left(): float64
        set content_margin_left(value: float64)
        
        /** The top margin for the contents of this style box. Increasing this value reduces the space available to the contents from the top.  
         *  Refer to [member content_margin_bottom] for extra considerations.  
         */
        get content_margin_top(): float64
        set content_margin_top(value: float64)
        
        /** The right margin for the contents of this style box. Increasing this value reduces the space available to the contents from the right.  
         *  Refer to [member content_margin_bottom] for extra considerations.  
         */
        get content_margin_right(): float64
        set content_margin_right(value: float64)
        
        /** The bottom margin for the contents of this style box. Increasing this value reduces the space available to the contents from the bottom.  
         *  If this value is negative, it is ignored and a child-specific margin is used instead. For example, for [StyleBoxFlat], the border thickness (if any) is used instead.  
         *  It is up to the code using this style box to decide what these contents are: for example, a [Button] respects this content margin for the textual contents of the button.  
         *  [method get_margin] should be used to fetch this value as consumer instead of reading these properties directly. This is because it correctly respects negative values and the fallback mentioned above.  
         */
        get content_margin_bottom(): float64
        set content_margin_bottom(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapStyleBox;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapStyleBox;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapStyleBoxEmpty extends __RPCMapStyleBox {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapStyleBoxEmpty extends __NameMapStyleBox {
    }
    /** An empty [StyleBox] (does not display anything).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_styleboxempty.html  
     */
    class StyleBoxEmpty extends StyleBox {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapStyleBoxEmpty;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapStyleBoxEmpty;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapStyleBoxFlat extends __RPCMapStyleBox {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapStyleBoxFlat extends __NameMapStyleBox {
    }
    /** A customizable [StyleBox] that doesn't use a texture.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_styleboxflat.html  
     */
    class StyleBoxFlat extends StyleBox {
        constructor(identifier?: any)
        /** Sets the border width to [param width] pixels for all sides. */
        set_border_width_all(width: int64): void
        
        /** Returns the smallest border width out of all four borders. */
        get_border_width_min(): int64
        
        /** Sets the specified [enum Side]'s border width to [param width] pixels. */
        set_border_width(margin: Side, width: int64): void
        
        /** Returns the specified [enum Side]'s border width. */
        get_border_width(margin: Side): int64
        
        /** Sets the corner radius to [param radius] pixels for all corners. */
        set_corner_radius_all(radius: int64): void
        
        /** Sets the corner radius to [param radius] pixels for the given [param corner]. */
        set_corner_radius(corner: Corner, radius: int64): void
        
        /** Returns the given [param corner]'s radius. */
        get_corner_radius(corner: Corner): int64
        
        /** Sets the expand margin to [param size] pixels for the specified [enum Side]. */
        set_expand_margin(margin: Side, size: float64): void
        
        /** Sets the expand margin to [param size] pixels for all sides. */
        set_expand_margin_all(size: float64): void
        
        /** Returns the size of the specified [enum Side]'s expand margin. */
        get_expand_margin(margin: Side): float64
        
        /** The background color of the stylebox. */
        get bg_color(): Color
        set bg_color(value: Color)
        
        /** Toggles drawing of the inner part of the stylebox. */
        get draw_center(): boolean
        set draw_center(value: boolean)
        
        /** If set to a non-zero value on either axis, [member skew] distorts the StyleBox horizontally and/or vertically. This can be used for "futuristic"-style UIs. Positive values skew the StyleBox towards the right (X axis) and upwards (Y axis), while negative values skew the StyleBox towards the left (X axis) and downwards (Y axis).  
         *      
         *  **Note:** To ensure text does not touch the StyleBox's edges, consider increasing the [StyleBox]'s content margin (see [member StyleBox.content_margin_bottom]). It is preferable to increase the content margin instead of the expand margin (see [member expand_margin_bottom]), as increasing the expand margin does not increase the size of the clickable area for [Control]s.  
         */
        get skew(): Vector2
        set skew(value: Vector2)
        
        /** Border width for the left border. */
        get border_width_left(): int64
        set border_width_left(value: int64)
        
        /** Border width for the top border. */
        get border_width_top(): int64
        set border_width_top(value: int64)
        
        /** Border width for the right border. */
        get border_width_right(): int64
        set border_width_right(value: int64)
        
        /** Border width for the bottom border. */
        get border_width_bottom(): int64
        set border_width_bottom(value: int64)
        
        /** Sets the color of the border. */
        get border_color(): Color
        set border_color(value: Color)
        
        /** If `true`, the border will fade into the background color. */
        get border_blend(): boolean
        set border_blend(value: boolean)
        
        /** The top-left corner's radius. If `0`, the corner is not rounded. */
        get corner_radius_top_left(): int64
        set corner_radius_top_left(value: int64)
        
        /** The top-right corner's radius. If `0`, the corner is not rounded. */
        get corner_radius_top_right(): int64
        set corner_radius_top_right(value: int64)
        
        /** The bottom-right corner's radius. If `0`, the corner is not rounded. */
        get corner_radius_bottom_right(): int64
        set corner_radius_bottom_right(value: int64)
        
        /** The bottom-left corner's radius. If `0`, the corner is not rounded. */
        get corner_radius_bottom_left(): int64
        set corner_radius_bottom_left(value: int64)
        
        /** This sets the number of vertices used for each corner. Higher values result in rounder corners but take more processing power to compute. When choosing a value, you should take the corner radius ([method set_corner_radius_all]) into account.  
         *  For corner radii less than 10, `4` or `5` should be enough. For corner radii less than 30, values between `8` and `12` should be enough.  
         *  A corner detail of `1` will result in chamfered corners instead of rounded corners, which is useful for some artistic effects.  
         */
        get corner_detail(): int64
        set corner_detail(value: int64)
        
        /** Expands the stylebox outside of the control rect on the left edge. Useful in combination with [member border_width_left] to draw a border outside the control rect.  
         *      
         *  **Note:** Unlike [member StyleBox.content_margin_left], [member expand_margin_left] does  *not*  affect the size of the clickable area for [Control]s. This can negatively impact usability if used wrong, as the user may try to click an area of the StyleBox that cannot actually receive clicks.  
         */
        get expand_margin_left(): float64
        set expand_margin_left(value: float64)
        
        /** Expands the stylebox outside of the control rect on the top edge. Useful in combination with [member border_width_top] to draw a border outside the control rect.  
         *      
         *  **Note:** Unlike [member StyleBox.content_margin_top], [member expand_margin_top] does  *not*  affect the size of the clickable area for [Control]s. This can negatively impact usability if used wrong, as the user may try to click an area of the StyleBox that cannot actually receive clicks.  
         */
        get expand_margin_top(): float64
        set expand_margin_top(value: float64)
        
        /** Expands the stylebox outside of the control rect on the right edge. Useful in combination with [member border_width_right] to draw a border outside the control rect.  
         *      
         *  **Note:** Unlike [member StyleBox.content_margin_right], [member expand_margin_right] does  *not*  affect the size of the clickable area for [Control]s. This can negatively impact usability if used wrong, as the user may try to click an area of the StyleBox that cannot actually receive clicks.  
         */
        get expand_margin_right(): float64
        set expand_margin_right(value: float64)
        
        /** Expands the stylebox outside of the control rect on the bottom edge. Useful in combination with [member border_width_bottom] to draw a border outside the control rect.  
         *      
         *  **Note:** Unlike [member StyleBox.content_margin_bottom], [member expand_margin_bottom] does  *not*  affect the size of the clickable area for [Control]s. This can negatively impact usability if used wrong, as the user may try to click an area of the StyleBox that cannot actually receive clicks.  
         */
        get expand_margin_bottom(): float64
        set expand_margin_bottom(value: float64)
        
        /** The color of the shadow. This has no effect if [member shadow_size] is lower than 1. */
        get shadow_color(): Color
        set shadow_color(value: Color)
        
        /** The shadow size in pixels. */
        get shadow_size(): int64
        set shadow_size(value: int64)
        
        /** The shadow offset in pixels. Adjusts the position of the shadow relatively to the stylebox. */
        get shadow_offset(): Vector2
        set shadow_offset(value: Vector2)
        
        /** Antialiasing draws a small ring around the edges, which fades to transparency. As a result, edges look much smoother. This is only noticeable when using rounded corners or [member skew].  
         *      
         *  **Note:** When using beveled corners with 45-degree angles ([member corner_detail] = 1), it is recommended to set [member anti_aliasing] to `false` to ensure crisp visuals and avoid possible visual glitches.  
         */
        get anti_aliasing(): boolean
        set anti_aliasing(value: boolean)
        
        /** This changes the size of the antialiasing effect. `1.0` is recommended for an optimal result at 100% scale, identical to how rounded rectangles are rendered in web browsers and most vector drawing software.  
         *      
         *  **Note:** Higher values may produce a blur effect but can also create undesired artifacts on small boxes with large-radius corners.  
         */
        get anti_aliasing_size(): float64
        set anti_aliasing_size(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapStyleBoxFlat;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapStyleBoxFlat;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapStyleBoxLine extends __RPCMapStyleBox {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapStyleBoxLine extends __NameMapStyleBox {
    }
    /** A [StyleBox] that displays a single line of a given color and thickness.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_styleboxline.html  
     */
    class StyleBoxLine extends StyleBox {
        constructor(identifier?: any)
        /** The line's color. */
        get color(): Color
        set color(value: Color)
        
        /** The number of pixels the line will extend before the [StyleBoxLine]'s bounds. If set to a negative value, the line will begin inside the [StyleBoxLine]'s bounds. */
        get grow_begin(): float64
        set grow_begin(value: float64)
        
        /** The number of pixels the line will extend past the [StyleBoxLine]'s bounds. If set to a negative value, the line will end inside the [StyleBoxLine]'s bounds. */
        get grow_end(): float64
        set grow_end(value: float64)
        
        /** The line's thickness in pixels. */
        get thickness(): int64
        set thickness(value: int64)
        
        /** If `true`, the line will be vertical. If `false`, the line will be horizontal. */
        get vertical(): boolean
        set vertical(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapStyleBoxLine;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapStyleBoxLine;
    }
    namespace StyleBoxTexture {
        enum AxisStretchMode {
            /** Stretch the stylebox's texture. This results in visible distortion unless the texture size matches the stylebox's size perfectly. */
            AXIS_STRETCH_MODE_STRETCH = 0,
            
            /** Repeats the stylebox's texture to match the stylebox's size according to the nine-patch system. */
            AXIS_STRETCH_MODE_TILE = 1,
            
            /** Repeats the stylebox's texture to match the stylebox's size according to the nine-patch system. Unlike [constant AXIS_STRETCH_MODE_TILE], the texture may be slightly stretched to make the nine-patch texture tile seamlessly. */
            AXIS_STRETCH_MODE_TILE_FIT = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapStyleBoxTexture extends __RPCMapStyleBox {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapStyleBoxTexture extends __NameMapStyleBox {
    }
    /** A texture-based nine-patch [StyleBox].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_styleboxtexture.html  
     */
    class StyleBoxTexture extends StyleBox {
        constructor(identifier?: any)
        /** Sets the margin to [param size] pixels for the specified [enum Side]. */
        set_texture_margin(margin: Side, size: float64): void
        
        /** Sets the margin to [param size] pixels for all sides. */
        set_texture_margin_all(size: float64): void
        
        /** Returns the margin size of the specified [enum Side]. */
        get_texture_margin(margin: Side): float64
        
        /** Sets the expand margin to [param size] pixels for the specified [enum Side]. */
        set_expand_margin(margin: Side, size: float64): void
        
        /** Sets the expand margin to [param size] pixels for all sides. */
        set_expand_margin_all(size: float64): void
        
        /** Returns the expand margin size of the specified [enum Side]. */
        get_expand_margin(margin: Side): float64
        
        /** The texture to use when drawing this style box. */
        get texture(): null | Texture2D
        set texture(value: null | Texture2D)
        
        /** Increases the left margin of the 3×3 texture box.  
         *  A higher value means more of the source texture is considered to be part of the left border of the 3×3 box.  
         *  This is also the value used as fallback for [member StyleBox.content_margin_left] if it is negative.  
         */
        get texture_margin_left(): float64
        set texture_margin_left(value: float64)
        
        /** Increases the top margin of the 3×3 texture box.  
         *  A higher value means more of the source texture is considered to be part of the top border of the 3×3 box.  
         *  This is also the value used as fallback for [member StyleBox.content_margin_top] if it is negative.  
         */
        get texture_margin_top(): float64
        set texture_margin_top(value: float64)
        
        /** Increases the right margin of the 3×3 texture box.  
         *  A higher value means more of the source texture is considered to be part of the right border of the 3×3 box.  
         *  This is also the value used as fallback for [member StyleBox.content_margin_right] if it is negative.  
         */
        get texture_margin_right(): float64
        set texture_margin_right(value: float64)
        
        /** Increases the bottom margin of the 3×3 texture box.  
         *  A higher value means more of the source texture is considered to be part of the bottom border of the 3×3 box.  
         *  This is also the value used as fallback for [member StyleBox.content_margin_bottom] if it is negative.  
         */
        get texture_margin_bottom(): float64
        set texture_margin_bottom(value: float64)
        
        /** Expands the left margin of this style box when drawing, causing it to be drawn larger than requested. */
        get expand_margin_left(): float64
        set expand_margin_left(value: float64)
        
        /** Expands the top margin of this style box when drawing, causing it to be drawn larger than requested. */
        get expand_margin_top(): float64
        set expand_margin_top(value: float64)
        
        /** Expands the right margin of this style box when drawing, causing it to be drawn larger than requested. */
        get expand_margin_right(): float64
        set expand_margin_right(value: float64)
        
        /** Expands the bottom margin of this style box when drawing, causing it to be drawn larger than requested. */
        get expand_margin_bottom(): float64
        set expand_margin_bottom(value: float64)
        
        /** Controls how the stylebox's texture will be stretched or tiled horizontally. */
        get axis_stretch_horizontal(): int64
        set axis_stretch_horizontal(value: int64)
        
        /** Controls how the stylebox's texture will be stretched or tiled vertically. */
        get axis_stretch_vertical(): int64
        set axis_stretch_vertical(value: int64)
        
        /** The region to use from the [member texture].  
         *  This is equivalent to first wrapping the [member texture] in an [AtlasTexture] with the same region.  
         *  If empty (`Rect2(0, 0, 0, 0)`), the whole [member texture] is used.  
         */
        get region_rect(): Rect2
        set region_rect(value: Rect2)
        
        /** Modulates the color of the texture when this style box is drawn. */
        get modulate_color(): Color
        set modulate_color(value: Color)
        
        /** If `true`, the nine-patch texture's center tile will be drawn. */
        get draw_center(): boolean
        set draw_center(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapStyleBoxTexture;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapStyleBoxTexture;
    }
    namespace SubViewport {
        enum ClearMode {
            /** Always clear the render target before drawing. */
            CLEAR_MODE_ALWAYS = 0,
            
            /** Never clear the render target. */
            CLEAR_MODE_NEVER = 1,
            
            /** Clear the render target on the next frame, then switch to [constant CLEAR_MODE_NEVER]. */
            CLEAR_MODE_ONCE = 2,
        }
        enum UpdateMode {
            /** Do not update the render target. */
            UPDATE_DISABLED = 0,
            
            /** Update the render target once, then switch to [constant UPDATE_DISABLED]. */
            UPDATE_ONCE = 1,
            
            /** Update the render target only when it is visible. This is the default value. */
            UPDATE_WHEN_VISIBLE = 2,
            
            /** Update the render target only when its parent is visible. */
            UPDATE_WHEN_PARENT_VISIBLE = 3,
            
            /** Always update the render target. */
            UPDATE_ALWAYS = 4,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSubViewport extends __RPCMapViewport {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSubViewport extends __NameMapViewport {
    }
    /** An interface to a game world that doesn't create a window or draw to the screen directly.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_subviewport.html  
     */
    class SubViewport<Map extends NodePathMap = any> extends Viewport<Map> {
        constructor(identifier?: any)
        /** The width and height of the sub-viewport. Must be set to a value greater than or equal to 2 pixels on both dimensions. Otherwise, nothing will be displayed.  
         *      
         *  **Note:** If the parent node is a [SubViewportContainer] and its [member SubViewportContainer.stretch] is `true`, the viewport size cannot be changed manually.  
         */
        get size(): Vector2i
        set size(value: Vector2i)
        
        /** The 2D size override of the sub-viewport. If either the width or height is `0`, the override is disabled. */
        get size_2d_override(): Vector2i
        set size_2d_override(value: Vector2i)
        
        /** If `true`, the 2D size override affects stretch as well. */
        get size_2d_override_stretch(): boolean
        set size_2d_override_stretch(value: boolean)
        
        /** The clear mode when the sub-viewport is used as a render target.  
         *      
         *  **Note:** This property is intended for 2D usage.  
         */
        get render_target_clear_mode(): int64
        set render_target_clear_mode(value: int64)
        
        /** The update mode when the sub-viewport is used as a render target. */
        get render_target_update_mode(): int64
        set render_target_update_mode(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSubViewport;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSubViewport;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSubViewportContainer extends __RPCMapContainer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSubViewportContainer extends __NameMapContainer {
    }
    /** A container used for displaying the contents of a [SubViewport].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_subviewportcontainer.html  
     */
    class SubViewportContainer<Map extends NodePathMap = any> extends Container<Map> {
        constructor(identifier?: any)
        /** Virtual method to be implemented by the user. If it returns `true`, the [param event] is propagated to [SubViewport] children. Propagation doesn't happen if it returns `false`. If the function is not implemented, all events are propagated to SubViewports. */
        /* gdvirtual */ _propagate_input_event(event: InputEvent): boolean
        
        /** If `true`, the sub-viewport will be automatically resized to the control's size.  
         *      
         *  **Note:** If `true`, this will prohibit changing [member SubViewport.size] of its children manually.  
         */
        get stretch(): boolean
        set stretch(value: boolean)
        
        /** Divides the sub-viewport's effective resolution by this value while preserving its scale. This can be used to speed up rendering.  
         *  For example, a 1280×720 sub-viewport with [member stretch_shrink] set to `2` will be rendered at 640×360 while occupying the same size in the container.  
         *      
         *  **Note:** [member stretch] must be `true` for this property to work.  
         */
        get stretch_shrink(): int64
        set stretch_shrink(value: int64)
        
        /** Configure, if either the [SubViewportContainer] or alternatively the [Control] nodes of its [SubViewport] children should be available as targets of mouse-related functionalities, like identifying the drop target in drag-and-drop operations or cursor shape of hovered [Control] node.  
         *  If `false`, the [Control] nodes inside its [SubViewport] children are considered as targets.  
         *  If `true`, the [SubViewportContainer] itself will be considered as a target.  
         */
        get mouse_target(): boolean
        set mouse_target(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSubViewportContainer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSubViewportContainer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSubtweenTweener extends __RPCMapTweener {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSubtweenTweener extends __NameMapTweener {
    }
    /** Runs a [Tween] nested within another [Tween].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_subtweentweener.html  
     */
    class SubtweenTweener extends Tweener {
        constructor(identifier?: any)
        /** Sets the time in seconds after which the [SubtweenTweener] will start running the subtween. By default there's no delay. */
        set_delay(delay: float64): null | SubtweenTweener
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSubtweenTweener;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSubtweenTweener;
    }
    namespace SurfaceTool {
        enum CustomFormat {
            /** Limits range of data passed to [method set_custom] to unsigned normalized 0 to 1 stored in 8 bits per channel. See [constant Mesh.ARRAY_CUSTOM_RGBA8_UNORM]. */
            CUSTOM_RGBA8_UNORM = 0,
            
            /** Limits range of data passed to [method set_custom] to signed normalized -1 to 1 stored in 8 bits per channel. See [constant Mesh.ARRAY_CUSTOM_RGBA8_SNORM]. */
            CUSTOM_RGBA8_SNORM = 1,
            
            /** Stores data passed to [method set_custom] as half precision floats, and uses only red and green color channels. See [constant Mesh.ARRAY_CUSTOM_RG_HALF]. */
            CUSTOM_RG_HALF = 2,
            
            /** Stores data passed to [method set_custom] as half precision floats and uses all color channels. See [constant Mesh.ARRAY_CUSTOM_RGBA_HALF]. */
            CUSTOM_RGBA_HALF = 3,
            
            /** Stores data passed to [method set_custom] as full precision floats, and uses only red color channel. See [constant Mesh.ARRAY_CUSTOM_R_FLOAT]. */
            CUSTOM_R_FLOAT = 4,
            
            /** Stores data passed to [method set_custom] as full precision floats, and uses only red and green color channels. See [constant Mesh.ARRAY_CUSTOM_RG_FLOAT]. */
            CUSTOM_RG_FLOAT = 5,
            
            /** Stores data passed to [method set_custom] as full precision floats, and uses only red, green and blue color channels. See [constant Mesh.ARRAY_CUSTOM_RGB_FLOAT]. */
            CUSTOM_RGB_FLOAT = 6,
            
            /** Stores data passed to [method set_custom] as full precision floats, and uses all color channels. See [constant Mesh.ARRAY_CUSTOM_RGBA_FLOAT]. */
            CUSTOM_RGBA_FLOAT = 7,
            
            /** Used to indicate a disabled custom channel. */
            CUSTOM_MAX = 8,
        }
        enum SkinWeightCount {
            /** Each individual vertex can be influenced by only 4 bone weights. */
            SKIN_4_WEIGHTS = 0,
            
            /** Each individual vertex can be influenced by up to 8 bone weights. */
            SKIN_8_WEIGHTS = 1,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSurfaceTool extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSurfaceTool extends __NameMapRefCounted {
    }
    /** Helper tool to create geometry.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_surfacetool.html  
     */
    class SurfaceTool extends RefCounted {
        constructor(identifier?: any)
        /** Set to [constant SKIN_8_WEIGHTS] to indicate that up to 8 bone influences per vertex may be used.  
         *  By default, only 4 bone influences are used ([constant SKIN_4_WEIGHTS]).  
         *      
         *  **Note:** This function takes an enum, not the exact number of weights.  
         */
        set_skin_weight_count(count: SurfaceTool.SkinWeightCount): void
        
        /** By default, returns [constant SKIN_4_WEIGHTS] to indicate only 4 bone influences per vertex are used.  
         *  Returns [constant SKIN_8_WEIGHTS] if up to 8 influences are used.  
         *      
         *  **Note:** This function returns an enum, not the exact number of weights.  
         */
        get_skin_weight_count(): SurfaceTool.SkinWeightCount
        
        /** Sets the color format for this custom [param channel_index]. Use [constant CUSTOM_MAX] to disable.  
         *  Must be invoked after [method begin] and should be set before [method commit] or [method commit_to_arrays].  
         */
        set_custom_format(channel_index: int64, format: SurfaceTool.CustomFormat): void
        
        /** Returns the format for custom [param channel_index] (currently up to 4). Returns [constant CUSTOM_MAX] if this custom channel is unused. */
        get_custom_format(channel_index: int64): SurfaceTool.CustomFormat
        
        /** Called before adding any vertices. Takes the primitive type as an argument (e.g. [constant Mesh.PRIMITIVE_TRIANGLES]). */
        begin(primitive: Mesh.PrimitiveType): void
        
        /** Specifies the position of current vertex. Should be called after specifying other vertex properties (e.g. Color, UV). */
        add_vertex(vertex: Vector3): void
        
        /** Specifies a [Color] to use for the  *next*  vertex. If every vertex needs to have this information set and you fail to submit it for the first vertex, this information may not be used at all.  
         *      
         *  **Note:** The material must have [member BaseMaterial3D.vertex_color_use_as_albedo] enabled for the vertex color to be visible.  
         */
        set_color(color: Color): void
        
        /** Specifies a normal to use for the  *next*  vertex. If every vertex needs to have this information set and you fail to submit it for the first vertex, this information may not be used at all. */
        set_normal(normal: Vector3): void
        
        /** Specifies a tangent to use for the  *next*  vertex. If every vertex needs to have this information set and you fail to submit it for the first vertex, this information may not be used at all.  
         *      
         *  **Note:** Even though [param tangent] is a [Plane], it does not directly represent the tangent plane. Its [member Plane.x], [member Plane.y], and [member Plane.z] represent the tangent vector and [member Plane.d] should be either `-1` or `1`. See also [constant Mesh.ARRAY_TANGENT].  
         */
        set_tangent(tangent: Plane): void
        
        /** Specifies a set of UV coordinates to use for the  *next*  vertex. If every vertex needs to have this information set and you fail to submit it for the first vertex, this information may not be used at all. */
        set_uv(uv: Vector2): void
        
        /** Specifies an optional second set of UV coordinates to use for the  *next*  vertex. If every vertex needs to have this information set and you fail to submit it for the first vertex, this information may not be used at all. */
        set_uv2(uv2: Vector2): void
        
        /** Specifies an array of bones to use for the  *next*  vertex. [param bones] must contain 4 integers. */
        set_bones(bones: PackedInt32Array | int32[]): void
        
        /** Specifies weight values to use for the  *next*  vertex. [param weights] must contain 4 values. If every vertex needs to have this information set and you fail to submit it for the first vertex, this information may not be used at all. */
        set_weights(weights: PackedFloat32Array | float32[]): void
        
        /** Sets the custom value on this vertex for [param channel_index].  
         *  [method set_custom_format] must be called first for this [param channel_index]. Formats which are not RGBA will ignore other color channels.  
         */
        set_custom(channel_index: int64, custom_color: Color): void
        
        /** Specifies the smooth group to use for the  *next*  vertex. If this is never called, all vertices will have the default smooth group of `0` and will be smoothed with adjacent vertices of the same group. To produce a mesh with flat normals, set the smooth group to `-1`.  
         *      
         *  **Note:** This function actually takes a `uint32_t`, so C# users should use `uint32.MaxValue` instead of `-1` to produce a mesh with flat normals.  
         */
        set_smooth_group(index: int64): void
        
        /** Inserts a triangle fan made of array data into [Mesh] being constructed.  
         *  Requires the primitive type be set to [constant Mesh.PRIMITIVE_TRIANGLES].  
         */
        add_triangle_fan(vertices: PackedVector3Array | Vector3[], uvs?: PackedVector2Array | Vector2[] /* = [] */, colors?: PackedColorArray | Color[] /* = [] */, uv2s?: PackedVector2Array | Vector2[] /* = [] */, normals?: PackedVector3Array | Vector3[] /* = [] */, tangents?: GArray<Plane>): void
        
        /** Adds a vertex to index array if you are using indexed vertices. Does not need to be called before adding vertices. */
        add_index(index: int64): void
        
        /** Shrinks the vertex array by creating an index array. This can improve performance by avoiding vertex reuse. */
        index(): void
        
        /** Removes the index array by expanding the vertex array. */
        deindex(): void
        
        /** Generates normals from vertices so you do not have to do it manually. If [param flip] is `true`, the resulting normals will be inverted. [method generate_normals] should be called  *after*  generating geometry and  *before*  committing the mesh using [method commit] or [method commit_to_arrays]. For correct display of normal-mapped surfaces, you will also have to generate tangents using [method generate_tangents].  
         *      
         *  **Note:** [method generate_normals] only works if the primitive type is set to [constant Mesh.PRIMITIVE_TRIANGLES].  
         *      
         *  **Note:** [method generate_normals] takes smooth groups into account. To generate smooth normals, set the smooth group to a value greater than or equal to `0` using [method set_smooth_group] or leave the smooth group at the default of `0`. To generate flat normals, set the smooth group to `-1` using [method set_smooth_group] prior to adding vertices.  
         */
        generate_normals(flip?: boolean /* = false */): void
        
        /** Generates a tangent vector for each vertex. Requires that each vertex already has UVs and normals set (see [method generate_normals]). */
        generate_tangents(): void
        
        /** Optimizes triangle sorting for performance. Requires that [method get_primitive_type] is [constant Mesh.PRIMITIVE_TRIANGLES]. */
        optimize_indices_for_cache(): void
        
        /** Returns the axis-aligned bounding box of the vertex positions. */
        get_aabb(): AABB
        
        /** Generates an LOD for a given [param nd_threshold] in linear units (square root of quadric error metric), using at most [param target_index_count] indices. */
        generate_lod(nd_threshold: float64, target_index_count?: int64 /* = 3 */): PackedInt32Array
        
        /** Sets [Material] to be used by the [Mesh] you are constructing. */
        set_material(material: Material): void
        
        /** Returns the type of mesh geometry, such as [constant Mesh.PRIMITIVE_TRIANGLES]. */
        get_primitive_type(): Mesh.PrimitiveType
        
        /** Clear all information passed into the surface tool so far. */
        clear(): void
        
        /** Creates a vertex array from an existing [Mesh]. */
        create_from(existing: Mesh, surface: int64): void
        
        /** Creates this SurfaceTool from existing vertex arrays such as returned by [method commit_to_arrays], [method Mesh.surface_get_arrays], [method Mesh.surface_get_blend_shape_arrays], [method ImporterMesh.get_surface_arrays], and [method ImporterMesh.get_surface_blend_shape_arrays]. [param primitive_type] controls the type of mesh data, defaulting to [constant Mesh.PRIMITIVE_TRIANGLES]. */
        create_from_arrays(arrays: GArray, primitive_type?: Mesh.PrimitiveType /* = 3 */): void
        
        /** Creates a vertex array from the specified blend shape of an existing [Mesh]. This can be used to extract a specific pose from a blend shape. */
        create_from_blend_shape(existing: Mesh, surface: int64, blend_shape: string): void
        
        /** Append vertices from a given [Mesh] surface onto the current vertex array with specified [Transform3D]. */
        append_from(existing: Mesh, surface: int64, transform: Transform3D): void
        
        /** Returns a constructed [ArrayMesh] from current information passed in. If an existing [ArrayMesh] is passed in as an argument, will add an extra surface to the existing [ArrayMesh].  
         *  The [param flags] argument can be the bitwise OR of [constant Mesh.ARRAY_FLAG_USE_DYNAMIC_UPDATE], [constant Mesh.ARRAY_FLAG_USE_8_BONE_WEIGHTS], or [constant Mesh.ARRAY_FLAG_USES_EMPTY_VERTEX_ARRAY].  
         */
        commit(existing?: ArrayMesh, flags?: int64 /* = 0 */): null | ArrayMesh
        
        /** Commits the data to the same format used by [method ArrayMesh.add_surface_from_arrays], [method ImporterMesh.add_surface], and [method create_from_arrays]. This way you can further process the mesh data using the [ArrayMesh] or [ImporterMesh] APIs. */
        commit_to_arrays(): GArray
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSurfaceTool;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSurfaceTool;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSyntaxHighlighter extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSyntaxHighlighter extends __NameMapResource {
    }
    /** Base class for syntax highlighters. Provides syntax highlighting data to a [TextEdit].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_syntaxhighlighter.html  
     */
    class SyntaxHighlighter extends Resource {
        constructor(identifier?: any)
        /** Virtual method which can be overridden to return syntax highlighting data.  
         *  See [method get_line_syntax_highlighting] for more details.  
         */
        /* gdvirtual */ _get_line_syntax_highlighting(line: int64): GDictionary
        
        /** Virtual method which can be overridden to clear any local caches. */
        /* gdvirtual */ _clear_highlighting_cache(): void
        
        /** Virtual method which can be overridden to update any local caches. */
        /* gdvirtual */ _update_cache(): void
        
        /** Returns the syntax highlighting data for the line at index [param line]. If the line is not cached, calls [method _get_line_syntax_highlighting] first to calculate the data.  
         *  Each entry is a column number containing a nested [Dictionary]. The column number denotes the start of a region, the region will end if another region is found, or at the end of the line. The nested [Dictionary] contains the data for that region. Currently only the key `"color"` is supported.  
         *  **Example:** Possible return value. This means columns `0` to `4` should be red, and columns `5` to the end of the line should be green:  
         *    
         */
        get_line_syntax_highlighting(line: int64): GDictionary
        
        /** Clears then updates the [SyntaxHighlighter] caches. Override [method _update_cache] for a callback.  
         *      
         *  **Note:** This is called automatically when the associated [TextEdit] node, updates its own cache.  
         */
        update_cache(): void
        
        /** Clears all cached syntax highlighting data.  
         *  Then calls overridable method [method _clear_highlighting_cache].  
         */
        clear_highlighting_cache(): void
        
        /** Returns the associated [TextEdit] node. */
        get_text_edit(): null | TextEdit
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSyntaxHighlighter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSyntaxHighlighter;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapSystemFont extends __RPCMapFont {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapSystemFont extends __NameMapFont {
    }
    /** A font loaded from a system font. Falls back to a default theme font if not implemented on the host OS.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_systemfont.html  
     */
    class SystemFont extends Font {
        constructor(identifier?: any)
        /** Array of font family names to search, first matching font found is used. */
        get font_names(): PackedStringArray
        set font_names(value: PackedStringArray | string[])
        
        /** If set to `true`, italic or oblique font is preferred. */
        get font_italic(): boolean
        set font_italic(value: boolean)
        
        /** Preferred weight (boldness) of the font. A value in the `100...999` range, normal font weight is `400`, bold font weight is `700`. */
        get font_weight(): int64
        set font_weight(value: int64)
        
        /** Preferred font stretch amount, compared to a normal width. A percentage value between `50%` and `200%`. */
        get font_stretch(): int64
        set font_stretch(value: int64)
        
        /** Font anti-aliasing mode. */
        get antialiasing(): int64
        set antialiasing(value: int64)
        
        /** If set to `true`, generate mipmaps for the font textures. */
        get generate_mipmaps(): boolean
        set generate_mipmaps(value: boolean)
        
        /** If set to `true`, embedded font bitmap loading is disabled (bitmap-only and color fonts ignore this property). */
        get disable_embedded_bitmaps(): boolean
        set disable_embedded_bitmaps(value: boolean)
        
        /** If set to `true`, system fonts can be automatically used as fallbacks. */
        get allow_system_fallback(): boolean
        set allow_system_fallback(value: boolean)
        
        /** If set to `true`, auto-hinting is supported and preferred over font built-in hinting. */
        get force_autohinter(): boolean
        set force_autohinter(value: boolean)
        
        /** If set to `true`, color modulation is applied when drawing colored glyphs, otherwise it's applied to the monochrome glyphs only. */
        get modulate_color_glyphs(): boolean
        set modulate_color_glyphs(value: boolean)
        
        /** Font hinting mode. */
        get hinting(): int64
        set hinting(value: int64)
        
        /** Font glyph subpixel positioning mode. Subpixel positioning provides shaper text and better kerning for smaller font sizes, at the cost of memory usage and font rasterization speed. Use [constant TextServer.SUBPIXEL_POSITIONING_AUTO] to automatically enable it based on the font size. */
        get subpixel_positioning(): int64
        set subpixel_positioning(value: int64)
        
        /** If set to `true`, when aligning glyphs to the pixel boundaries rounding remainders are accumulated to ensure more uniform glyph distribution. This setting has no effect if subpixel positioning is enabled. */
        get keep_rounding_remainders(): boolean
        set keep_rounding_remainders(value: boolean)
        
        /** If set to `true`, glyphs of all sizes are rendered using single multichannel signed distance field generated from the dynamic font vector data. */
        get multichannel_signed_distance_field(): boolean
        set multichannel_signed_distance_field(value: boolean)
        
        /** The width of the range around the shape between the minimum and maximum representable signed distance. If using font outlines, [member msdf_pixel_range] must be set to at least  *twice*  the size of the largest font outline. The default [member msdf_pixel_range] value of `16` allows outline sizes up to `8` to look correct. */
        get msdf_pixel_range(): int64
        set msdf_pixel_range(value: int64)
        
        /** Source font size used to generate MSDF textures. Higher values allow for more precision, but are slower to render and require more memory. Only increase this value if you notice a visible lack of precision in glyph rendering. */
        get msdf_size(): int64
        set msdf_size(value: int64)
        
        /** If set to a positive value, overrides the oversampling factor of the viewport this font is used in. See [member Viewport.oversampling]. This value doesn't override the [code skip-lint]oversampling` parameter of [code skip-lint]draw_*` methods. */
        get oversampling(): float64
        set oversampling(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapSystemFont;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapSystemFont;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTCPServer extends __RPCMapSocketServer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTCPServer extends __NameMapSocketServer {
    }
    /** A TCP server.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_tcpserver.html  
     */
    class TCPServer extends SocketServer {
        constructor(identifier?: any)
        /** Listen on the [param port] binding to [param bind_address].  
         *  If [param bind_address] is set as `"*"` (default), the server will listen on all available addresses (both IPv4 and IPv6).  
         *  If [param bind_address] is set as `"0.0.0.0"` (for IPv4) or `"::"` (for IPv6), the server will listen on all available addresses matching that IP type.  
         *  If [param bind_address] is set to any valid address (e.g. `"192.168.1.101"`, `"::1"`, etc.), the server will only listen on the interface with that address (or fail if no interface with the given address exists).  
         */
        listen(port: int64, bind_address?: string /* = '*' */): Error
        
        /** Returns the local port this server is listening to. */
        get_local_port(): int64
        
        /** If a connection is available, returns a StreamPeerTCP with the connection. */
        take_connection(): null | StreamPeerTCP
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTCPServer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTCPServer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTLSOptions extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTLSOptions extends __NameMapRefCounted {
    }
    /** TLS configuration for clients and servers.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_tlsoptions.html  
     */
    class TLSOptions extends RefCounted {
        constructor(identifier?: any)
        /** Creates a TLS client configuration which validates certificates and their common names (fully qualified domain names).  
         *  You can specify a custom [param trusted_chain] of certification authorities (the default CA list will be used if `null`), and optionally provide a [param common_name_override] if you expect the certificate to have a common name other than the server FQDN.  
         *      
         *  **Note:** On the Web platform, TLS verification is always enforced against the CA list of the web browser. This is considered a security feature.  
         */
        static client(trusted_chain?: X509Certificate, common_name_override?: string /* = '' */): null | TLSOptions
        
        /** Creates an **unsafe** TLS client configuration where certificate validation is optional. You can optionally provide a valid [param trusted_chain], but the common name of the certificates will never be checked. Using this configuration for purposes other than testing **is not recommended**.  
         *      
         *  **Note:** On the Web platform, TLS verification is always enforced against the CA list of the web browser. This is considered a security feature.  
         */
        static client_unsafe(trusted_chain?: X509Certificate): null | TLSOptions
        
        /** Creates a TLS server configuration using the provided [param key] and [param certificate].  
         *      
         *  **Note:** The [param certificate] should include the full certificate chain up to the signing CA (certificates file can be concatenated using a general purpose text editor).  
         */
        static server(key: CryptoKey, certificate: X509Certificate): null | TLSOptions
        
        /** Returns `true` if created with [method TLSOptions.server], `false` otherwise. */
        is_server(): boolean
        
        /** Returns `true` if created with [method TLSOptions.client_unsafe], `false` otherwise. */
        is_unsafe_client(): boolean
        
        /** Returns the common name (domain name) override specified when creating with [method TLSOptions.client]. */
        get_common_name_override(): string
        
        /** Returns the CA [X509Certificate] chain specified when creating with [method TLSOptions.client] or [method TLSOptions.client_unsafe]. */
        get_trusted_ca_chain(): null | X509Certificate
        
        /** Returns the [CryptoKey] specified when creating with [method TLSOptions.server]. */
        get_private_key(): null | CryptoKey
        
        /** Returns the [X509Certificate] specified when creating with [method TLSOptions.server]. */
        get_own_certificate(): null | X509Certificate
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTLSOptions;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTLSOptions;
    }
    namespace TabBar {
        enum AlignmentMode {
            /** Aligns tabs to the left. */
            ALIGNMENT_LEFT = 0,
            
            /** Aligns tabs in the middle. */
            ALIGNMENT_CENTER = 1,
            
            /** Aligns tabs to the right. */
            ALIGNMENT_RIGHT = 2,
            
            /** Represents the size of the [enum AlignmentMode] enum. */
            ALIGNMENT_MAX = 3,
        }
        enum CloseButtonDisplayPolicy {
            /** Never show the close buttons. */
            CLOSE_BUTTON_SHOW_NEVER = 0,
            
            /** Only show the close button on the currently active tab. */
            CLOSE_BUTTON_SHOW_ACTIVE_ONLY = 1,
            
            /** Show the close button on all tabs. */
            CLOSE_BUTTON_SHOW_ALWAYS = 2,
            
            /** Represents the size of the [enum CloseButtonDisplayPolicy] enum. */
            CLOSE_BUTTON_MAX = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTabBar extends __RPCMapControl {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTabBar extends __NameMapControl {
    }
    /** A control that provides a horizontal bar with tabs.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_tabbar.html  
     */
    class TabBar<Map extends NodePathMap = any> extends Control<Map> {
        constructor(identifier?: any)
        /** Returns the previously active tab index. */
        get_previous_tab(): int64
        
        /** Selects the first available tab with lower index than the currently selected. Returns `true` if tab selection changed. */
        select_previous_available(): boolean
        
        /** Selects the first available tab with greater index than the currently selected. Returns `true` if tab selection changed. */
        select_next_available(): boolean
        
        /** Sets a [param title] for the tab at index [param tab_idx]. */
        set_tab_title(tab_idx: int64, title: string): void
        
        /** Returns the title of the tab at index [param tab_idx]. */
        get_tab_title(tab_idx: int64): string
        
        /** Sets a [param tooltip] for tab at index [param tab_idx].  
         *      
         *  **Note:** By default, if the [param tooltip] is empty and the tab text is truncated (not all characters fit into the tab), the title will be displayed as a tooltip. To hide the tooltip, assign `" "` as the [param tooltip] text.  
         */
        set_tab_tooltip(tab_idx: int64, tooltip: string): void
        
        /** Returns the tooltip text of the tab at index [param tab_idx]. */
        get_tab_tooltip(tab_idx: int64): string
        
        /** Sets tab title base writing direction. */
        set_tab_text_direction(tab_idx: int64, direction: Control.TextDirection): void
        
        /** Returns tab title text base writing direction. */
        get_tab_text_direction(tab_idx: int64): Control.TextDirection
        
        /** Sets the language code of the title for the tab at index [param tab_idx] to [param language]. This is used for line-breaking and text shaping algorithms. If [param language] is empty, the current locale is used. */
        set_tab_language(tab_idx: int64, language: string): void
        
        /** Returns tab title language code. */
        get_tab_language(tab_idx: int64): string
        
        /** Sets an [param icon] for the tab at index [param tab_idx]. */
        set_tab_icon(tab_idx: int64, icon: Texture2D): void
        
        /** Returns the icon for the tab at index [param tab_idx] or `null` if the tab has no icon. */
        get_tab_icon(tab_idx: int64): null | Texture2D
        
        /** Sets the maximum allowed width of the icon for the tab at index [param tab_idx]. This limit is applied on top of the default size of the icon and on top of [theme_item icon_max_width]. The height is adjusted according to the icon's ratio. */
        set_tab_icon_max_width(tab_idx: int64, width: int64): void
        
        /** Returns the maximum allowed width of the icon for the tab at index [param tab_idx]. */
        get_tab_icon_max_width(tab_idx: int64): int64
        
        /** Sets an [param icon] for the button of the tab at index [param tab_idx] (located to the right, before the close button), making it visible and clickable (See [signal tab_button_pressed]). Giving it a `null` value will hide the button. */
        set_tab_button_icon(tab_idx: int64, icon: Texture2D): void
        
        /** Returns the icon for the right button of the tab at index [param tab_idx] or `null` if the right button has no icon. */
        get_tab_button_icon(tab_idx: int64): null | Texture2D
        
        /** If [param disabled] is `true`, disables the tab at index [param tab_idx], making it non-interactable. */
        set_tab_disabled(tab_idx: int64, disabled: boolean): void
        
        /** Returns `true` if the tab at index [param tab_idx] is disabled. */
        is_tab_disabled(tab_idx: int64): boolean
        
        /** If [param hidden] is `true`, hides the tab at index [param tab_idx], making it disappear from the tab area. */
        set_tab_hidden(tab_idx: int64, hidden: boolean): void
        
        /** Returns `true` if the tab at index [param tab_idx] is hidden. */
        is_tab_hidden(tab_idx: int64): boolean
        
        /** Sets the metadata value for the tab at index [param tab_idx], which can be retrieved later using [method get_tab_metadata]. */
        set_tab_metadata(tab_idx: int64, metadata: any): void
        
        /** Returns the metadata value set to the tab at index [param tab_idx] using [method set_tab_metadata]. If no metadata was previously set, returns `null` by default. */
        get_tab_metadata(tab_idx: int64): any
        
        /** Removes the tab at index [param tab_idx]. */
        remove_tab(tab_idx: int64): void
        
        /** Adds a new tab. */
        add_tab(title?: string /* = '' */, icon?: Texture2D): void
        
        /** Returns the index of the tab at local coordinates [param point]. Returns `-1` if the point is outside the control boundaries or if there's no tab at the queried position. */
        get_tab_idx_at_point(point: Vector2): int64
        
        /** Returns the number of hidden tabs offsetted to the left. */
        get_tab_offset(): int64
        
        /** Returns `true` if the offset buttons (the ones that appear when there's not enough space for all tabs) are visible. */
        get_offset_buttons_visible(): boolean
        
        /** Moves the scroll view to make the tab visible. */
        ensure_tab_visible(idx: int64): void
        
        /** Returns tab [Rect2] with local position and size. */
        get_tab_rect(tab_idx: int64): Rect2
        
        /** Moves a tab from [param from] to [param to]. */
        move_tab(from: int64, to: int64): void
        
        /** Clears all tabs. */
        clear_tabs(): void
        
        /** The index of the current selected tab. A value of `-1` means that no tab is selected and can only be set when [member deselect_enabled] is `true` or if all tabs are hidden or disabled. */
        get current_tab(): int64
        set current_tab(value: int64)
        
        /** The horizontal alignment of the tabs. */
        get tab_alignment(): int64
        set tab_alignment(value: int64)
        
        /** If `true`, tabs overflowing this node's width will be hidden, displaying two navigation buttons instead. Otherwise, this node's minimum size is updated so that all tabs are visible. */
        get clip_tabs(): boolean
        set clip_tabs(value: boolean)
        
        /** If `true`, middle-clicking on a tab will emit the [signal tab_close_pressed] signal. */
        get close_with_middle_mouse(): boolean
        set close_with_middle_mouse(value: boolean)
        
        /** When the close button will appear on the tabs. */
        get tab_close_display_policy(): int64
        set tab_close_display_policy(value: int64)
        
        /** Sets the maximum width which all tabs should be limited to. Unlimited if set to `0`. */
        get max_tab_width(): int64
        set max_tab_width(value: int64)
        
        /** if `true`, the mouse's scroll wheel can be used to navigate the scroll view. */
        get scrolling_enabled(): boolean
        set scrolling_enabled(value: boolean)
        
        /** If `true`, tabs can be rearranged with mouse drag. */
        get drag_to_rearrange_enabled(): boolean
        set drag_to_rearrange_enabled(value: boolean)
        
        /** If `true`, hovering over a tab while dragging something will switch to that tab. Does not have effect when hovering another tab to rearrange. The delay for when this happens is dictated by [theme_item hover_switch_wait_msec]. */
        get switch_on_drag_hover(): boolean
        set switch_on_drag_hover(value: boolean)
        
        /** [TabBar]s with the same rearrange group ID will allow dragging the tabs between them. Enable drag with [member drag_to_rearrange_enabled].  
         *  Setting this to `-1` will disable rearranging between [TabBar]s.  
         */
        get tabs_rearrange_group(): int64
        set tabs_rearrange_group(value: int64)
        
        /** If `true`, the tab offset will be changed to keep the currently selected tab visible. */
        get scroll_to_selected(): boolean
        set scroll_to_selected(value: boolean)
        
        /** If `true`, enables selecting a tab with the right mouse button. */
        get select_with_rmb(): boolean
        set select_with_rmb(value: boolean)
        
        /** If `true`, all tabs can be deselected so that no tab is selected. Click on the current tab to deselect it. */
        get deselect_enabled(): boolean
        set deselect_enabled(value: boolean)
        
        /** The number of tabs currently in the bar. */
        get tab_count(): int64
        set tab_count(value: int64)
        
        /** Emitted when a tab is selected via click, directional input, or script, even if it is the current tab. */
        readonly tab_selected: Signal<(tab: int64) => void>
        
        /** Emitted when switching to another tab. */
        readonly tab_changed: Signal<(tab: int64) => void>
        
        /** Emitted when a tab is clicked, even if it is the current tab. */
        readonly tab_clicked: Signal<(tab: int64) => void>
        
        /** Emitted when a tab is right-clicked. */
        readonly tab_rmb_clicked: Signal<(tab: int64) => void>
        
        /** Emitted when a tab's close button is pressed or, if [member close_with_middle_mouse] is `true`, when middle-clicking on a tab.  
         *      
         *  **Note:** Tabs are not removed automatically; this behavior needs to be coded manually. For example:  
         *    
         */
        readonly tab_close_pressed: Signal<(tab: int64) => void>
        
        /** Emitted when a tab's right button is pressed. See [method set_tab_button_icon]. */
        readonly tab_button_pressed: Signal<(tab: int64) => void>
        
        /** Emitted when a tab is hovered by the mouse. */
        readonly tab_hovered: Signal<(tab: int64) => void>
        
        /** Emitted when the active tab is rearranged via mouse drag. See [member drag_to_rearrange_enabled]. */
        readonly active_tab_rearranged: Signal<(idx_to: int64) => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTabBar;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTabBar;
    }
    namespace TabContainer {
        enum TabPosition {
            /** Places the tab bar at the top. */
            POSITION_TOP = 0,
            
            /** Places the tab bar at the bottom. The tab bar's [StyleBox] will be flipped vertically. */
            POSITION_BOTTOM = 1,
            
            /** Represents the size of the [enum TabPosition] enum. */
            POSITION_MAX = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTabContainer extends __RPCMapContainer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTabContainer extends __NameMapContainer {
    }
    /** A container that creates a tab for each child control, displaying only the active tab's control.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_tabcontainer.html  
     */
    class TabContainer<Map extends NodePathMap = any> extends Container<Map> {
        constructor(identifier?: any)
        /** Returns the number of tabs. */
        get_tab_count(): int64
        
        /** Returns the previously active tab index. */
        get_previous_tab(): int64
        
        /** Selects the first available tab with lower index than the currently selected. Returns `true` if tab selection changed. */
        select_previous_available(): boolean
        
        /** Selects the first available tab with greater index than the currently selected. Returns `true` if tab selection changed. */
        select_next_available(): boolean
        
        /** Returns the child [Control] node located at the active tab index. */
        get_current_tab_control(): null | Control
        
        /** Returns the [TabBar] contained in this container.  
         *  **Warning:** This is a required internal node, removing and freeing it or editing its tabs may cause a crash. If you wish to edit the tabs, use the methods provided in [TabContainer].  
         */
        get_tab_bar(): null | TabBar
        
        /** Returns the [Control] node from the tab at index [param tab_idx]. */
        get_tab_control(tab_idx: int64): null | Control
        
        /** Sets a custom title for the tab at index [param tab_idx] (tab titles default to the name of the indexed child node). Set it back to the child's name to make the tab default to it again. */
        set_tab_title(tab_idx: int64, title: string): void
        
        /** Returns the title of the tab at index [param tab_idx]. Tab titles default to the name of the indexed child node, but this can be overridden with [method set_tab_title]. */
        get_tab_title(tab_idx: int64): string
        
        /** Sets a custom tooltip text for tab at index [param tab_idx].  
         *      
         *  **Note:** By default, if the [param tooltip] is empty and the tab text is truncated (not all characters fit into the tab), the title will be displayed as a tooltip. To hide the tooltip, assign `" "` as the [param tooltip] text.  
         */
        set_tab_tooltip(tab_idx: int64, tooltip: string): void
        
        /** Returns the tooltip text of the tab at index [param tab_idx]. */
        get_tab_tooltip(tab_idx: int64): string
        
        /** Sets an icon for the tab at index [param tab_idx]. */
        set_tab_icon(tab_idx: int64, icon: Texture2D): void
        
        /** Returns the [Texture2D] for the tab at index [param tab_idx] or `null` if the tab has no [Texture2D]. */
        get_tab_icon(tab_idx: int64): null | Texture2D
        
        /** Sets the maximum allowed width of the icon for the tab at index [param tab_idx]. This limit is applied on top of the default size of the icon and on top of [theme_item icon_max_width]. The height is adjusted according to the icon's ratio. */
        set_tab_icon_max_width(tab_idx: int64, width: int64): void
        
        /** Returns the maximum allowed width of the icon for the tab at index [param tab_idx]. */
        get_tab_icon_max_width(tab_idx: int64): int64
        
        /** If [param disabled] is `true`, disables the tab at index [param tab_idx], making it non-interactable. */
        set_tab_disabled(tab_idx: int64, disabled: boolean): void
        
        /** Returns `true` if the tab at index [param tab_idx] is disabled. */
        is_tab_disabled(tab_idx: int64): boolean
        
        /** If [param hidden] is `true`, hides the tab at index [param tab_idx], making it disappear from the tab area. */
        set_tab_hidden(tab_idx: int64, hidden: boolean): void
        
        /** Returns `true` if the tab at index [param tab_idx] is hidden. */
        is_tab_hidden(tab_idx: int64): boolean
        
        /** Sets the metadata value for the tab at index [param tab_idx], which can be retrieved later using [method get_tab_metadata]. */
        set_tab_metadata(tab_idx: int64, metadata: any): void
        
        /** Returns the metadata value set to the tab at index [param tab_idx] using [method set_tab_metadata]. If no metadata was previously set, returns `null` by default. */
        get_tab_metadata(tab_idx: int64): any
        
        /** Sets the button icon from the tab at index [param tab_idx]. */
        set_tab_button_icon(tab_idx: int64, icon: Texture2D): void
        
        /** Returns the button icon from the tab at index [param tab_idx]. */
        get_tab_button_icon(tab_idx: int64): null | Texture2D
        
        /** Returns the index of the tab at local coordinates [param point]. Returns `-1` if the point is outside the control boundaries or if there's no tab at the queried position. */
        get_tab_idx_at_point(point: Vector2): int64
        
        /** Returns the index of the tab tied to the given [param control]. The control must be a child of the [TabContainer]. */
        get_tab_idx_from_control(control: Control): int64
        
        /** If set on a [Popup] node instance, a popup menu icon appears in the top-right corner of the [TabContainer] (setting it to `null` will make it go away). Clicking it will expand the [Popup] node. */
        set_popup(popup: Node): void
        
        /** Returns the [Popup] node instance if one has been set already with [method set_popup].  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member Window.visible] property.  
         */
        get_popup(): null | Popup
        
        /** The position at which tabs will be placed. */
        get tab_alignment(): int64
        set tab_alignment(value: int64)
        
        /** The current tab index. When set, this index's [Control] node's `visible` property is set to `true` and all others are set to `false`.  
         *  A value of `-1` means that no tab is selected.  
         */
        get current_tab(): int64
        set current_tab(value: int64)
        
        /** The horizontal alignment of the tabs. */
        get tabs_position(): int64
        set tabs_position(value: int64)
        
        /** If `true`, tabs overflowing this node's width will be hidden, displaying two navigation buttons instead. Otherwise, this node's minimum size is updated so that all tabs are visible. */
        get clip_tabs(): boolean
        set clip_tabs(value: boolean)
        
        /** If `true`, tabs are visible. If `false`, tabs' content and titles are hidden. */
        get tabs_visible(): boolean
        set tabs_visible(value: boolean)
        
        /** If `true`, all tabs are drawn in front of the panel. If `false`, inactive tabs are drawn behind the panel. */
        get all_tabs_in_front(): boolean
        set all_tabs_in_front(value: boolean)
        
        /** If `true`, hovering over a tab while dragging something will switch to that tab. Does not have effect when hovering another tab to rearrange. */
        get switch_on_drag_hover(): boolean
        set switch_on_drag_hover(value: boolean)
        
        /** If `true`, tabs can be rearranged with mouse drag. */
        get drag_to_rearrange_enabled(): boolean
        set drag_to_rearrange_enabled(value: boolean)
        
        /** [TabContainer]s with the same rearrange group ID will allow dragging the tabs between them. Enable drag with [member drag_to_rearrange_enabled].  
         *  Setting this to `-1` will disable rearranging between [TabContainer]s.  
         */
        get tabs_rearrange_group(): int64
        set tabs_rearrange_group(value: int64)
        
        /** If `true`, child [Control] nodes that are hidden have their minimum size take into account in the total, instead of only the currently visible one. */
        get use_hidden_tabs_for_min_size(): boolean
        set use_hidden_tabs_for_min_size(value: boolean)
        
        /** The focus access mode for the internal [TabBar] node. */
        get tab_focus_mode(): int64
        set tab_focus_mode(value: int64)
        
        /** If `true`, all tabs can be deselected so that no tab is selected. Click on the [member current_tab] to deselect it.  
         *  Only the tab header will be shown if no tabs are selected.  
         */
        get deselect_enabled(): boolean
        set deselect_enabled(value: boolean)
        
        /** Emitted when the active tab is rearranged via mouse drag. See [member drag_to_rearrange_enabled]. */
        readonly active_tab_rearranged: Signal<(idx_to: int64) => void>
        
        /** Emitted when switching to another tab. */
        readonly tab_changed: Signal<(tab: int64) => void>
        
        /** Emitted when a tab is clicked, even if it is the current tab. */
        readonly tab_clicked: Signal<(tab: int64) => void>
        
        /** Emitted when a tab is hovered by the mouse. */
        readonly tab_hovered: Signal<(tab: int64) => void>
        
        /** Emitted when a tab is selected via click, directional input, or script, even if it is the current tab. */
        readonly tab_selected: Signal<(tab: int64) => void>
        
        /** Emitted when the user clicks on the button icon on this tab. */
        readonly tab_button_pressed: Signal<(tab: int64) => void>
        
        /** Emitted when the [TabContainer]'s [Popup] button is clicked. See [method set_popup] for details. */
        readonly pre_popup_pressed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTabContainer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTabContainer;
    }
    namespace TextEdit {
        enum MenuItems {
            /** Cuts (copies and clears) the selected text. */
            MENU_CUT = 0,
            
            /** Copies the selected text. */
            MENU_COPY = 1,
            
            /** Pastes the clipboard text over the selected text (or at the cursor's position). */
            MENU_PASTE = 2,
            
            /** Erases the whole [TextEdit] text. */
            MENU_CLEAR = 3,
            
            /** Selects the whole [TextEdit] text. */
            MENU_SELECT_ALL = 4,
            
            /** Undoes the previous action. */
            MENU_UNDO = 5,
            
            /** Redoes the previous action. */
            MENU_REDO = 6,
            
            /** ID of "Text Writing Direction" submenu. */
            MENU_SUBMENU_TEXT_DIR = 7,
            
            /** Sets text direction to inherited. */
            MENU_DIR_INHERITED = 8,
            
            /** Sets text direction to automatic. */
            MENU_DIR_AUTO = 9,
            
            /** Sets text direction to left-to-right. */
            MENU_DIR_LTR = 10,
            
            /** Sets text direction to right-to-left. */
            MENU_DIR_RTL = 11,
            
            /** Toggles control character display. */
            MENU_DISPLAY_UCC = 12,
            
            /** ID of "Insert Control Character" submenu. */
            MENU_SUBMENU_INSERT_UCC = 13,
            
            /** Inserts left-to-right mark (LRM) character. */
            MENU_INSERT_LRM = 14,
            
            /** Inserts right-to-left mark (RLM) character. */
            MENU_INSERT_RLM = 15,
            
            /** Inserts start of left-to-right embedding (LRE) character. */
            MENU_INSERT_LRE = 16,
            
            /** Inserts start of right-to-left embedding (RLE) character. */
            MENU_INSERT_RLE = 17,
            
            /** Inserts start of left-to-right override (LRO) character. */
            MENU_INSERT_LRO = 18,
            
            /** Inserts start of right-to-left override (RLO) character. */
            MENU_INSERT_RLO = 19,
            
            /** Inserts pop direction formatting (PDF) character. */
            MENU_INSERT_PDF = 20,
            
            /** Inserts Arabic letter mark (ALM) character. */
            MENU_INSERT_ALM = 21,
            
            /** Inserts left-to-right isolate (LRI) character. */
            MENU_INSERT_LRI = 22,
            
            /** Inserts right-to-left isolate (RLI) character. */
            MENU_INSERT_RLI = 23,
            
            /** Inserts first strong isolate (FSI) character. */
            MENU_INSERT_FSI = 24,
            
            /** Inserts pop direction isolate (PDI) character. */
            MENU_INSERT_PDI = 25,
            
            /** Inserts zero width joiner (ZWJ) character. */
            MENU_INSERT_ZWJ = 26,
            
            /** Inserts zero width non-joiner (ZWNJ) character. */
            MENU_INSERT_ZWNJ = 27,
            
            /** Inserts word joiner (WJ) character. */
            MENU_INSERT_WJ = 28,
            
            /** Inserts soft hyphen (SHY) character. */
            MENU_INSERT_SHY = 29,
            
            /** Opens system emoji and symbol picker. */
            MENU_EMOJI_AND_SYMBOL = 30,
            
            /** Represents the size of the [enum MenuItems] enum. */
            MENU_MAX = 31,
        }
        enum EditAction {
            /** No current action. */
            ACTION_NONE = 0,
            
            /** A typing action. */
            ACTION_TYPING = 1,
            
            /** A backwards delete action. */
            ACTION_BACKSPACE = 2,
            
            /** A forward delete action. */
            ACTION_DELETE = 3,
        }
        enum SearchFlags {
            /** Match case when searching. */
            SEARCH_MATCH_CASE = 1,
            
            /** Match whole words when searching. */
            SEARCH_WHOLE_WORDS = 2,
            
            /** Search from end to beginning. */
            SEARCH_BACKWARDS = 4,
        }
        enum CaretType {
            /** Vertical line caret. */
            CARET_TYPE_LINE = 0,
            
            /** Block caret. */
            CARET_TYPE_BLOCK = 1,
        }
        enum SelectionMode {
            /** Not selecting. */
            SELECTION_MODE_NONE = 0,
            
            /** Select as if `shift` is pressed. */
            SELECTION_MODE_SHIFT = 1,
            
            /** Select single characters as if the user single clicked. */
            SELECTION_MODE_POINTER = 2,
            
            /** Select whole words as if the user double clicked. */
            SELECTION_MODE_WORD = 3,
            
            /** Select whole lines as if the user triple clicked. */
            SELECTION_MODE_LINE = 4,
        }
        enum LineWrappingMode {
            /** Line wrapping is disabled. */
            LINE_WRAPPING_NONE = 0,
            
            /** Line wrapping occurs at the control boundary, beyond what would normally be visible. */
            LINE_WRAPPING_BOUNDARY = 1,
        }
        enum GutterType {
            /** When a gutter is set to string using [method set_gutter_type], it is used to contain text set via the [method set_line_gutter_text] method. */
            GUTTER_TYPE_STRING = 0,
            
            /** When a gutter is set to icon using [method set_gutter_type], it is used to contain an icon set via the [method set_line_gutter_icon] method. */
            GUTTER_TYPE_ICON = 1,
            
            /** When a gutter is set to custom using [method set_gutter_type], it is used to contain custom visuals controlled by a callback method set via the [method set_gutter_custom_draw] method. */
            GUTTER_TYPE_CUSTOM = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapTextEdit extends __RPCMapControl {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapTextEdit extends __NameMapControl {
    }
    /** A multiline text editor.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_textedit.html  
     */
    class TextEdit<Map extends NodePathMap = any> extends Control<Map> {
        constructor(identifier?: any)
        /** Override this method to define what happens when the user types in the provided key [param unicode_char]. */
        /* gdvirtual */ _handle_unicode_input(unicode_char: int64, caret_index: int64): void
        
        /** Override this method to define what happens when the user presses the backspace key. */
        /* gdvirtual */ _backspace(caret_index: int64): void
        
        /** Override this method to define what happens when the user performs a cut operation. */
        /* gdvirtual */ _cut(caret_index: int64): void
        
        /** Override this method to define what happens when the user performs a copy operation. */
        /* gdvirtual */ _copy(caret_index: int64): void
        
        /** Override this method to define what happens when the user performs a paste operation. */
        /* gdvirtual */ _paste(caret_index: int64): void
        
        /** Override this method to define what happens when the user performs a paste operation with middle mouse button.  
         *      
         *  **Note:** This method is only implemented on Linux.  
         */
        /* gdvirtual */ _paste_primary_clipboard(caret_index: int64): void
        _set_text(text: string, emit_signal?: boolean /* = false */): void
        
        /** Returns `true` if the user has text in the [url=https://en.wikipedia.org/wiki/Input_method]Input Method Editor[/url] (IME). */
        has_ime_text(): boolean
        
        /** Closes the [url=https://en.wikipedia.org/wiki/Input_method]Input Method Editor[/url] (IME) if it is open. Any text in the IME will be lost. */
        cancel_ime(): void
        
        /** Applies text from the [url=https://en.wikipedia.org/wiki/Input_method]Input Method Editor[/url] (IME) to each caret and closes the IME if it is open. */
        apply_ime(): void
        
        /** Sets the tab size for the [TextEdit] to use. */
        set_tab_size(size: int64): void
        
        /** Returns the [TextEdit]'s' tab size. */
        get_tab_size(): int64
        
        /** If `true`, enables overtype mode. In this mode, typing overrides existing text instead of inserting text. The [member ProjectSettings.input/ui_text_toggle_insert_mode] action toggles overtype mode. See [method is_overtype_mode_enabled]. */
        set_overtype_mode_enabled(enabled: boolean): void
        
        /** Returns `true` if overtype mode is enabled. See [method set_overtype_mode_enabled]. */
        is_overtype_mode_enabled(): boolean
        
        /** Performs a full reset of [TextEdit], including undo history. */
        clear(): void
        
        /** Returns the number of lines in the text. */
        get_line_count(): int64
        
        /** Sets the text for a specific [param line].  
         *  Carets on the line will attempt to keep their visual x position.  
         */
        set_line(line: int64, new_text: string): void
        
        /** Returns the text of a specific line. */
        get_line(line: int64): string
        
        /** Returns line text as it is currently displayed, including IME composition string. */
        get_line_with_ime(line: int64): string
        
        /** Returns the width in pixels of the [param wrap_index] on [param line]. */
        get_line_width(line: int64, wrap_index?: int64 /* = -1 */): int64
        
        /** Returns the maximum value of the line height among all lines.  
         *      
         *  **Note:** The return value is influenced by [theme_item line_spacing] and [theme_item font_size]. And it will not be less than `1`.  
         */
        get_line_height(): int64
        
        /** Returns the indent level of the given line. This is the number of spaces and tabs at the beginning of the line, with the tabs taking the tab size into account (see [method get_tab_size]). */
        get_indent_level(line: int64): int64
        
        /** Returns the first column containing a non-whitespace character on the given line. If there is only whitespace, returns the number of characters. */
        get_first_non_whitespace_column(line: int64): int64
        
        /** Swaps the two lines. Carets will be swapped with the lines. */
        swap_lines(from_line: int64, to_line: int64): void
        
        /** Inserts a new line with [param text] at [param line]. */
        insert_line_at(line: int64, text: string): void
        
        /** Removes the line of text at [param line]. Carets on this line will attempt to match their previous visual x position.  
         *  If [param move_carets_down] is `true` carets will move to the next line down, otherwise carets will move up.  
         */
        remove_line_at(line: int64, move_carets_down?: boolean /* = true */): void
        
        /** Insert the specified text at the caret position. */
        insert_text_at_caret(text: string, caret_index?: int64 /* = -1 */): void
        
        /** Inserts the [param text] at [param line] and [param column].  
         *  If [param before_selection_begin] is `true`, carets and selections that begin at [param line] and [param column] will moved to the end of the inserted text, along with all carets after it.  
         *  If [param before_selection_end] is `true`, selections that end at [param line] and [param column] will be extended to the end of the inserted text. These parameters can be used to insert text inside of or outside of selections.  
         */
        insert_text(text: string, line: int64, column: int64, before_selection_begin?: boolean /* = true */, before_selection_end?: boolean /* = false */): void
        
        /** Removes text between the given positions. */
        remove_text(from_line: int64, from_column: int64, to_line: int64, to_column: int64): void
        
        /** Returns the last unhidden line in the entire [TextEdit]. */
        get_last_unhidden_line(): int64
        
        /** Returns the count to the next visible line from [param line] to `line + visible_amount`. Can also count backwards. For example if a [TextEdit] has 5 lines with lines 2 and 3 hidden, calling this with `line = 1, visible_amount = 1` would return 3. */
        get_next_visible_line_offset_from(line: int64, visible_amount: int64): int64
        
        /** Similar to [method get_next_visible_line_offset_from], but takes into account the line wrap indexes. In the returned vector, `x` is the line, `y` is the wrap index. */
        get_next_visible_line_index_offset_from(line: int64, wrap_index: int64, visible_amount: int64): Vector2i
        
        /** Called when the user presses the backspace key. Can be overridden with [method _backspace]. */
        backspace(caret_index?: int64 /* = -1 */): void
        
        /** Cut's the current selection. Can be overridden with [method _cut]. */
        cut(caret_index?: int64 /* = -1 */): void
        
        /** Copies the current text selection. Can be overridden with [method _copy]. */
        copy(caret_index?: int64 /* = -1 */): void
        
        /** Paste at the current location. Can be overridden with [method _paste]. */
        paste(caret_index?: int64 /* = -1 */): void
        
        /** Pastes the primary clipboard. */
        paste_primary_clipboard(caret_index?: int64 /* = -1 */): void
        
        /** Starts an action, will end the current action if [param action] is different.  
         *  An action will also end after a call to [method end_action], after [member ProjectSettings.gui/timers/text_edit_idle_detect_sec] is triggered or a new undoable step outside the [method start_action] and [method end_action] calls.  
         */
        start_action(action: TextEdit.EditAction): void
        
        /** Marks the end of steps in the current action started with [method start_action]. */
        end_action(): void
        
        /** Starts a multipart edit. All edits will be treated as one action until [method end_complex_operation] is called. */
        begin_complex_operation(): void
        
        /** Ends a multipart edit, started with [method begin_complex_operation]. If called outside a complex operation, the current operation is pushed onto the undo/redo stack. */
        end_complex_operation(): void
        
        /** Returns `true` if an "undo" action is available. */
        has_undo(): boolean
        
        /** Returns `true` if a "redo" action is available. */
        has_redo(): boolean
        
        /** Perform undo operation. */
        undo(): void
        
        /** Perform redo operation. */
        redo(): void
        
        /** Clears the undo history. */
        clear_undo_history(): void
        
        /** Tag the current version as saved. */
        tag_saved_version(): void
        
        /** Returns the current version of the [TextEdit]. The version is a count of recorded operations by the undo/redo history. */
        get_version(): int64
        
        /** Returns the last tagged saved version from [method tag_saved_version]. */
        get_saved_version(): int64
        
        /** Sets the search text. See [method set_search_flags]. */
        set_search_text(search_text: string): void
        
        /** Sets the search [param flags]. This is used with [method set_search_text] to highlight occurrences of the searched text. Search flags can be specified from the [enum SearchFlags] enum. */
        set_search_flags(flags: int64): void
        
        /** Perform a search inside the text. Search flags can be specified in the [enum SearchFlags] enum.  
         *  In the returned vector, `x` is the column, `y` is the line. If no results are found, both are equal to `-1`.  
         *    
         */
        search(text: string, flags: int64, from_line: int64, from_column: int64): Vector2i
        
        /** Provide custom tooltip text. The callback method must take the following args: `hovered_word: String`. */
        set_tooltip_request_func(callback: Callable): void
        
        /** Returns the local mouse position adjusted for the text direction. */
        get_local_mouse_pos(): Vector2
        
        /** Returns the word at [param position]. */
        get_word_at_pos(position: Vector2): string
        
        /** Returns the line and column at the given position. In the returned vector, `x` is the column and `y` is the line.  
         *  If [param clamp_line] is `false` and [param position] is below the last line, `Vector2i(-1, -1)` is returned.  
         *  If [param clamp_column] is `false` and [param position] is outside the column range of the line, `Vector2i(-1, -1)` is returned.  
         */
        get_line_column_at_pos(position: Vector2i, clamp_line?: boolean /* = true */, clamp_column?: boolean /* = true */): Vector2i
        
        /** Returns the local position for the given [param line] and [param column]. If `x` or `y` of the returned vector equal `-1`, the position is outside of the viewable area of the control.  
         *      
         *  **Note:** The Y position corresponds to the bottom side of the line. Use [method get_rect_at_line_column] to get the top side position.  
         */
        get_pos_at_line_column(line: int64, column: int64): Vector2i
        
        /** Returns the local position and size for the grapheme at the given [param line] and [param column]. If `x` or `y` position of the returned rect equal `-1`, the position is outside of the viewable area of the control.  
         *      
         *  **Note:** The Y position of the returned rect corresponds to the top side of the line, unlike [method get_pos_at_line_column] which returns the bottom side.  
         */
        get_rect_at_line_column(line: int64, column: int64): Rect2i
        
        /** Returns the equivalent minimap line at [param position]. */
        get_minimap_line_at_pos(position: Vector2i): int64
        
        /** Returns `true` if the user is dragging their mouse for scrolling, selecting, or text dragging. */
        is_dragging_cursor(): boolean
        
        /** Returns `true` if the mouse is over a selection. If [param edges] is `true`, the edges are considered part of the selection. */
        is_mouse_over_selection(edges: boolean, caret_index?: int64 /* = -1 */): boolean
        
        /** Adds a new caret at the given location. Returns the index of the new caret, or `-1` if the location is invalid. */
        add_caret(line: int64, column: int64): int64
        
        /** Removes the given caret index.  
         *      
         *  **Note:** This can result in adjustment of all other caret indices.  
         */
        remove_caret(caret: int64): void
        
        /** Removes all additional carets. */
        remove_secondary_carets(): void
        
        /** Returns the number of carets in this [TextEdit]. */
        get_caret_count(): int64
        
        /** Adds an additional caret above or below every caret. If [param below] is `true` the new caret will be added below and above otherwise. */
        add_caret_at_carets(below: boolean): void
        
        /** Returns the carets sorted by selection beginning from lowest line and column to highest (from top to bottom of text).  
         *  If [param include_ignored_carets] is `false`, carets from [method multicaret_edit_ignore_caret] will be ignored.  
         */
        get_sorted_carets(include_ignored_carets?: boolean /* = false */): PackedInt32Array
        
        /** Collapse all carets in the given range to the [param from_line] and [param from_column] position.  
         *  [param inclusive] applies to both ends.  
         *  If [method is_in_mulitcaret_edit] is `true`, carets that are collapsed will be `true` for [method multicaret_edit_ignore_caret].  
         *  [method merge_overlapping_carets] will be called if any carets were collapsed.  
         */
        collapse_carets(from_line: int64, from_column: int64, to_line: int64, to_column: int64, inclusive?: boolean /* = false */): void
        
        /** Merges any overlapping carets. Will favor the newest caret, or the caret with a selection.  
         *  If [method is_in_mulitcaret_edit] is `true`, the merge will be queued to happen at the end of the multicaret edit. See [method begin_multicaret_edit] and [method end_multicaret_edit].  
         *      
         *  **Note:** This is not called when a caret changes position but after certain actions, so it is possible to get into a state where carets overlap.  
         */
        merge_overlapping_carets(): void
        
        /** Starts an edit for multiple carets. The edit must be ended with [method end_multicaret_edit]. Multicaret edits can be used to edit text at multiple carets and delay merging the carets until the end, so the caret indexes aren't affected immediately. [method begin_multicaret_edit] and [method end_multicaret_edit] can be nested, and the merge will happen at the last [method end_multicaret_edit].  
         *    
         */
        begin_multicaret_edit(): void
        
        /** Ends an edit for multiple carets, that was started with [method begin_multicaret_edit]. If this was the last [method end_multicaret_edit] and [method merge_overlapping_carets] was called, carets will be merged. */
        end_multicaret_edit(): void
        
        /** Returns `true` if a [method begin_multicaret_edit] has been called and [method end_multicaret_edit] has not yet been called. */
        is_in_mulitcaret_edit(): boolean
        
        /** Returns `true` if the given [param caret_index] should be ignored as part of a multicaret edit. See [method begin_multicaret_edit] and [method end_multicaret_edit]. Carets that should be ignored are ones that were part of removed text and will likely be merged at the end of the edit, or carets that were added during the edit.  
         *  It is recommended to `continue` within a loop iterating on multiple carets if a caret should be ignored.  
         */
        multicaret_edit_ignore_caret(caret_index: int64): boolean
        
        /** Returns `true` if the caret is visible, `false` otherwise. A caret will be considered hidden if it is outside the scrollable area when scrolling is enabled.  
         *      
         *  **Note:** [method is_caret_visible] does not account for a caret being off-screen if it is still within the scrollable area. It will return `true` even if the caret is off-screen as long as it meets [TextEdit]'s own conditions for being visible. This includes uses of [member scroll_fit_content_width] and [member scroll_fit_content_height] that cause the [TextEdit] to expand beyond the viewport's bounds.  
         */
        is_caret_visible(caret_index?: int64 /* = 0 */): boolean
        
        /** Returns the caret pixel draw position. */
        get_caret_draw_pos(caret_index?: int64 /* = 0 */): Vector2
        
        /** Moves the caret to the specified [param line] index. The caret column will be moved to the same visual position it was at the last time [method set_caret_column] was called, or clamped to the end of the line.  
         *  If [param adjust_viewport] is `true`, the viewport will center at the caret position after the move occurs.  
         *  If [param can_be_hidden] is `true`, the specified [param line] can be hidden.  
         *  If [param wrap_index] is `-1`, the caret column will be clamped to the [param line]'s length. If [param wrap_index] is greater than `-1`, the column will be moved to attempt to match the visual x position on the line's [param wrap_index] to the position from the last time [method set_caret_column] was called.  
         *      
         *  **Note:** If supporting multiple carets this will not check for any overlap. See [method merge_overlapping_carets].  
         */
        set_caret_line(line: int64, adjust_viewport?: boolean /* = true */, can_be_hidden?: boolean /* = true */, wrap_index?: int64 /* = 0 */, caret_index?: int64 /* = 0 */): void
        
        /** Returns the line the editing caret is on. */
        get_caret_line(caret_index?: int64 /* = 0 */): int64
        
        /** Moves the caret to the specified [param column] index.  
         *  If [param adjust_viewport] is `true`, the viewport will center at the caret position after the move occurs.  
         *      
         *  **Note:** If supporting multiple carets this will not check for any overlap. See [method merge_overlapping_carets].  
         */
        set_caret_column(column: int64, adjust_viewport?: boolean /* = true */, caret_index?: int64 /* = 0 */): void
        
        /** Returns the column the editing caret is at. */
        get_caret_column(caret_index?: int64 /* = 0 */): int64
        
        /** Returns the correct column at the end of a composite character like ❤️‍🩹 (mending heart; Unicode: `U+2764 U+FE0F U+200D U+1FA79`) which is comprised of more than one Unicode code point, if the caret is at the start of the composite character. Also returns the correct column with the caret at mid grapheme and for non-composite characters.  
         *      
         *  **Note:** To check at caret location use `get_next_composite_character_column(get_caret_line(), get_caret_column())`  
         */
        get_next_composite_character_column(line: int64, column: int64): int64
        
        /** Returns the correct column at the start of a composite character like ❤️‍🩹 (mending heart; Unicode: `U+2764 U+FE0F U+200D U+1FA79`) which is comprised of more than one Unicode code point, if the caret is at the end of the composite character. Also returns the correct column with the caret at mid grapheme and for non-composite characters.  
         *      
         *  **Note:** To check at caret location use `get_previous_composite_character_column(get_caret_line(), get_caret_column())`  
         */
        get_previous_composite_character_column(line: int64, column: int64): int64
        
        /** Returns the wrap index the editing caret is on. */
        get_caret_wrap_index(caret_index?: int64 /* = 0 */): int64
        
        /** Returns a [String] text with the word under the caret's location. */
        get_word_under_caret(caret_index?: int64 /* = -1 */): string
        
        /** Sets the current selection mode. */
        set_selection_mode(mode: TextEdit.SelectionMode): void
        
        /** Returns the current selection mode. */
        get_selection_mode(): TextEdit.SelectionMode
        
        /** Select all the text.  
         *  If [member selecting_enabled] is `false`, no selection will occur.  
         */
        select_all(): void
        
        /** Selects the word under the caret. */
        select_word_under_caret(caret_index?: int64 /* = -1 */): void
        
        /** Adds a selection and a caret for the next occurrence of the current selection. If there is no active selection, selects word under caret. */
        add_selection_for_next_occurrence(): void
        
        /** Moves a selection and a caret for the next occurrence of the current selection. If there is no active selection, moves to the next occurrence of the word under caret. */
        skip_selection_for_next_occurrence(): void
        
        /** Selects text from [param origin_line] and [param origin_column] to [param caret_line] and [param caret_column] for the given [param caret_index]. This moves the selection origin and the caret. If the positions are the same, the selection will be deselected.  
         *  If [member selecting_enabled] is `false`, no selection will occur.  
         *      
         *  **Note:** If supporting multiple carets this will not check for any overlap. See [method merge_overlapping_carets].  
         */
        select(origin_line: int64, origin_column: int64, caret_line: int64, caret_column: int64, caret_index?: int64 /* = 0 */): void
        
        /** Returns `true` if the user has selected text. */
        has_selection(caret_index?: int64 /* = -1 */): boolean
        
        /** Returns the text inside the selection of a caret, or all the carets if [param caret_index] is its default value `-1`. */
        get_selected_text(caret_index?: int64 /* = -1 */): string
        
        /** Returns the caret index of the selection at the given [param line] and [param column], or `-1` if there is none.  
         *  If [param include_edges] is `false`, the position must be inside the selection and not at either end. If [param only_selections] is `false`, carets without a selection will also be considered.  
         */
        get_selection_at_line_column(line: int64, column: int64, include_edges?: boolean /* = true */, only_selections?: boolean /* = true */): int64
        
        /** Returns an [Array] of line ranges where `x` is the first line and `y` is the last line. All lines within these ranges will have a caret on them or be part of a selection. Each line will only be part of one line range, even if it has multiple carets on it.  
         *  If a selection's end column ([method get_selection_to_column]) is at column `0`, that line will not be included. If a selection begins on the line after another selection ends and [param merge_adjacent] is `true`, or they begin and end on the same line, one line range will include both selections.  
         */
        get_line_ranges_from_carets(only_selections?: boolean /* = false */, merge_adjacent?: boolean /* = true */): GArray<Vector2i>
        
        /** Returns the origin line of the selection. This is the opposite end from the caret. */
        get_selection_origin_line(caret_index?: int64 /* = 0 */): int64
        
        /** Returns the origin column of the selection. This is the opposite end from the caret. */
        get_selection_origin_column(caret_index?: int64 /* = 0 */): int64
        
        /** Sets the selection origin line to the [param line] for the given [param caret_index]. If the selection origin is moved to the caret position, the selection will deselect.  
         *  If [param can_be_hidden] is `false`, The line will be set to the nearest unhidden line below or above.  
         *  If [param wrap_index] is `-1`, the selection origin column will be clamped to the [param line]'s length. If [param wrap_index] is greater than `-1`, the column will be moved to attempt to match the visual x position on the line's [param wrap_index] to the position from the last time [method set_selection_origin_column] or [method select] was called.  
         */
        set_selection_origin_line(line: int64, can_be_hidden?: boolean /* = true */, wrap_index?: int64 /* = -1 */, caret_index?: int64 /* = 0 */): void
        
        /** Sets the selection origin column to the [param column] for the given [param caret_index]. If the selection origin is moved to the caret position, the selection will deselect. */
        set_selection_origin_column(column: int64, caret_index?: int64 /* = 0 */): void
        
        /** Returns the selection begin line. Returns the caret line if there is no selection. */
        get_selection_from_line(caret_index?: int64 /* = 0 */): int64
        
        /** Returns the selection begin column. Returns the caret column if there is no selection. */
        get_selection_from_column(caret_index?: int64 /* = 0 */): int64
        
        /** Returns the selection end line. Returns the caret line if there is no selection. */
        get_selection_to_line(caret_index?: int64 /* = 0 */): int64
        
        /** Returns the selection end column. Returns the caret column if there is no selection. */
        get_selection_to_column(caret_index?: int64 /* = 0 */): int64
        
        /** Returns `true` if the caret of the selection is after the selection origin. This can be used to determine the direction of the selection. */
        is_caret_after_selection_origin(caret_index?: int64 /* = 0 */): boolean
        
        /** Deselects the current selection. */
        deselect(caret_index?: int64 /* = -1 */): void
        
        /** Deletes the selected text. */
        delete_selection(caret_index?: int64 /* = -1 */): void
        
        /** Returns if the given line is wrapped. */
        is_line_wrapped(line: int64): boolean
        
        /** Returns the number of times the given line is wrapped. */
        get_line_wrap_count(line: int64): int64
        
        /** Returns the wrap index of the given column on the given line. This ranges from `0` to [method get_line_wrap_count]. */
        get_line_wrap_index_at_column(line: int64, column: int64): int64
        
        /** Returns an array of [String]s representing each wrapped index. */
        get_line_wrapped_text(line: int64): PackedStringArray
        
        /** Returns the [VScrollBar] of the [TextEdit]. */
        get_v_scroll_bar(): null | VScrollBar
        
        /** Returns the [HScrollBar] used by [TextEdit]. */
        get_h_scroll_bar(): null | HScrollBar
        
        /** Returns the scroll position for [param wrap_index] of [param line]. */
        get_scroll_pos_for_line(line: int64, wrap_index?: int64 /* = 0 */): float64
        
        /** Positions the [param wrap_index] of [param line] at the top of the viewport. */
        set_line_as_first_visible(line: int64, wrap_index?: int64 /* = 0 */): void
        
        /** Returns the first visible line. */
        get_first_visible_line(): int64
        
        /** Positions the [param wrap_index] of [param line] at the center of the viewport. */
        set_line_as_center_visible(line: int64, wrap_index?: int64 /* = 0 */): void
        
        /** Positions the [param wrap_index] of [param line] at the bottom of the viewport. */
        set_line_as_last_visible(line: int64, wrap_index?: int64 /* = 0 */): void
        
        /** Returns the last visible line. Use [method get_last_full_visible_line_wrap_index] for the wrap index. */
        get_last_full_visible_line(): int64
        
        /** Returns the last visible wrap index of the last visible line. */
        get_last_full_visible_line_wrap_index(): int64
        
        /** Returns the number of lines that can visually fit, rounded down, based on this control's height. */
        get_visible_line_count(): int64
        
        /** Returns the total number of lines between [param from_line] and [param to_line] (inclusive) in the text. This includes wrapped lines and excludes folded lines. If the range covers all lines it is equivalent to [method get_total_visible_line_count]. */
        get_visible_line_count_in_range(from_line: int64, to_line: int64): int64
        
        /** Returns the total number of lines in the text. This includes wrapped lines and excludes folded lines. If [member wrap_mode] is set to [constant LINE_WRAPPING_NONE] and no lines are folded (see [method CodeEdit.is_line_folded]) then this is equivalent to [method get_line_count]. See [method get_visible_line_count_in_range] for a limited range of lines. */
        get_total_visible_line_count(): int64
        
        /** Adjust the viewport so the caret is visible. */
        adjust_viewport_to_caret(caret_index?: int64 /* = 0 */): void
        
        /** Centers the viewport on the line the editing caret is at. This also resets the [member scroll_horizontal] value to `0`. */
        center_viewport_to_caret(caret_index?: int64 /* = 0 */): void
        
        /** Returns the number of lines that may be drawn on the minimap. */
        get_minimap_visible_lines(): int64
        
        /** Register a new gutter to this [TextEdit]. Use [param at] to have a specific gutter order. A value of `-1` appends the gutter to the right. */
        add_gutter(at?: int64 /* = -1 */): void
        
        /** Removes the gutter at the given index. */
        remove_gutter(gutter: int64): void
        
        /** Returns the number of gutters registered. */
        get_gutter_count(): int64
        
        /** Sets the name of the gutter at the given index. */
        set_gutter_name(gutter: int64, name: string): void
        
        /** Returns the name of the gutter at the given index. */
        get_gutter_name(gutter: int64): string
        
        /** Sets the type of gutter at the given index. Gutters can contain icons, text, or custom visuals. */
        set_gutter_type(gutter: int64, type: TextEdit.GutterType): void
        
        /** Returns the type of the gutter at the given index. Gutters can contain icons, text, or custom visuals. */
        get_gutter_type(gutter: int64): TextEdit.GutterType
        
        /** Set the width of the gutter at the given index. */
        set_gutter_width(gutter: int64, width: int64): void
        
        /** Returns the width of the gutter at the given index. */
        get_gutter_width(gutter: int64): int64
        
        /** If `true`, the gutter at the given index is drawn. The gutter type ([method set_gutter_type]) determines how it is drawn. See [method is_gutter_drawn]. */
        set_gutter_draw(gutter: int64, draw: boolean): void
        
        /** Returns `true` if the gutter at the given index is currently drawn. See [method set_gutter_draw]. */
        is_gutter_drawn(gutter: int64): boolean
        
        /** If `true`, the mouse cursor will change to a pointing hand ([constant Control.CURSOR_POINTING_HAND]) when hovering over the gutter at the given index. See [method is_gutter_clickable] and [method set_line_gutter_clickable]. */
        set_gutter_clickable(gutter: int64, clickable: boolean): void
        
        /** Returns `true` if the gutter at the given index is clickable. See [method set_gutter_clickable]. */
        is_gutter_clickable(gutter: int64): boolean
        
        /** If `true`, the line data of the gutter at the given index can be overridden when using [method merge_gutters]. See [method is_gutter_overwritable]. */
        set_gutter_overwritable(gutter: int64, overwritable: boolean): void
        
        /** Returns `true` if the gutter at the given index is overwritable. See [method set_gutter_overwritable]. */
        is_gutter_overwritable(gutter: int64): boolean
        
        /** Merge the gutters from [param from_line] into [param to_line]. Only overwritable gutters will be copied. See [method set_gutter_overwritable]. */
        merge_gutters(from_line: int64, to_line: int64): void
        
        /** Set a custom draw callback for the gutter at the given index. [param draw_callback] must take the following arguments: A line index [int], a gutter index [int], and an area [Rect2]. This callback only works when the gutter type is [constant GUTTER_TYPE_CUSTOM] (see [method set_gutter_type]). */
        set_gutter_custom_draw(column: int64, draw_callback: Callable): void
        
        /** Returns the total width of all gutters and internal padding. */
        get_total_gutter_width(): int64
        
        /** Sets the metadata for [param gutter] on [param line] to [param metadata]. */
        set_line_gutter_metadata(line: int64, gutter: int64, metadata: any): void
        
        /** Returns the metadata currently in [param gutter] at [param line]. */
        get_line_gutter_metadata(line: int64, gutter: int64): any
        
        /** Sets the text for [param gutter] on [param line] to [param text]. This only works when the gutter type is [constant GUTTER_TYPE_STRING] (see [method set_gutter_type]). */
        set_line_gutter_text(line: int64, gutter: int64, text: string): void
        
        /** Returns the text currently in [param gutter] at [param line]. This only works when the gutter type is [constant GUTTER_TYPE_STRING] (see [method set_gutter_type]). */
        get_line_gutter_text(line: int64, gutter: int64): string
        
        /** Sets the icon for [param gutter] on [param line] to [param icon]. This only works when the gutter type is [constant GUTTER_TYPE_ICON] (see [method set_gutter_type]). */
        set_line_gutter_icon(line: int64, gutter: int64, icon: Texture2D): void
        
        /** Returns the icon currently in [param gutter] at [param line]. This only works when the gutter type is [constant GUTTER_TYPE_ICON] (see [method set_gutter_type]). */
        get_line_gutter_icon(line: int64, gutter: int64): null | Texture2D
        
        /** Sets the color for [param gutter] on [param line] to [param color]. */
        set_line_gutter_item_color(line: int64, gutter: int64, color: Color): void
        
        /** Returns the color currently in [param gutter] at [param line]. */
        get_line_gutter_item_color(line: int64, gutter: int64): Color
        
        /** If [param clickable] is `true`, makes the [param gutter] on the given [param line] clickable. This is like [method set_gutter_clickable], but for a single line. If [method is_gutter_clickable] is `true`, this will not have any effect. See [method is_line_gutter_clickable] and [signal gutter_clicked]. */
        set_line_gutter_clickable(line: int64, gutter: int64, clickable: boolean): void
        
        /** Returns `true` if the gutter at the given index on the given line is clickable. See [method set_line_gutter_clickable]. */
        is_line_gutter_clickable(line: int64, gutter: int64): boolean
        
        /** Sets the custom background color of the given line. If transparent, this color is applied on top of the default background color (See [theme_item background_color]). If set to `Color(0, 0, 0, 0)`, no additional color is applied. */
        set_line_background_color(line: int64, color: Color): void
        
        /** Returns the custom background color of the given line. If no color is set, returns `Color(0, 0, 0, 0)`. */
        get_line_background_color(line: int64): Color
        
        /** Returns the [PopupMenu] of this [TextEdit]. By default, this menu is displayed when right-clicking on the [TextEdit].  
         *  You can add custom menu items or remove standard ones. Make sure your IDs don't conflict with the standard ones (see [enum MenuItems]). For example:  
         *    
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member Window.visible] property.  
         */
        get_menu(): null | PopupMenu
        
        /** Returns `true` if the menu is visible. Use this instead of `get_menu().visible` to improve performance (so the creation of the menu is avoided). See [method get_menu]. */
        is_menu_visible(): boolean
        
        /** Executes a given action as defined in the [enum MenuItems] enum. */
        menu_option(option: int64): void
        
        /** This method does nothing. */
        adjust_carets_after_edit(caret: int64, from_line: int64, from_col: int64, to_line: int64, to_col: int64): void
        
        /** Returns a list of caret indexes in their edit order, this done from bottom to top. Edit order refers to the way actions such as [method insert_text_at_caret] are applied. */
        get_caret_index_edit_order(): PackedInt32Array
        
        /** Returns the original start line of the selection. */
        get_selection_line(caret_index?: int64 /* = 0 */): int64
        
        /** Returns the original start column of the selection. */
        get_selection_column(caret_index?: int64 /* = 0 */): int64
        
        /** String value of the [TextEdit]. */
        get text(): string
        set text(value: string)
        
        /** Text shown when the [TextEdit] is empty. It is **not** the [TextEdit]'s default value (see [member text]). */
        get placeholder_text(): string
        set placeholder_text(value: string)
        
        /** If `false`, existing text cannot be modified and new text cannot be added. */
        get editable(): boolean
        set editable(value: boolean)
        
        /** If `true`, a right-click displays the context menu. */
        get context_menu_enabled(): boolean
        set context_menu_enabled(value: boolean)
        
        /** If `true`, "Emoji and Symbols" menu is enabled. */
        get emoji_menu_enabled(): boolean
        set emoji_menu_enabled(value: boolean)
        
        /** If `true` and [member caret_mid_grapheme] is `false`, backspace deletes an entire composite character such as ❤️‍🩹, instead of deleting part of the composite character. */
        get backspace_deletes_composite_character_enabled(): boolean
        set backspace_deletes_composite_character_enabled(value: boolean)
        
        /** If `true`, shortcut keys for context menu items are enabled, even if the context menu is disabled. */
        get shortcut_keys_enabled(): boolean
        set shortcut_keys_enabled(value: boolean)
        
        /** If `true`, text can be selected.  
         *  If `false`, text can not be selected by the user or by the [method select] or [method select_all] methods.  
         */
        get selecting_enabled(): boolean
        set selecting_enabled(value: boolean)
        
        /** If `true`, the selected text will be deselected when focus is lost. */
        get deselect_on_focus_loss_enabled(): boolean
        set deselect_on_focus_loss_enabled(value: boolean)
        
        /** If `true`, allow drag and drop of selected text. Text can still be dropped from other sources. */
        get drag_and_drop_selection_enabled(): boolean
        set drag_and_drop_selection_enabled(value: boolean)
        
        /** If `false`, using middle mouse button to paste clipboard will be disabled.  
         *      
         *  **Note:** This method is only implemented on Linux.  
         */
        get middle_mouse_paste_enabled(): boolean
        set middle_mouse_paste_enabled(value: boolean)
        
        /** If `true`, copying or cutting without a selection is performed on all lines with a caret. Otherwise, copy and cut require a selection. */
        get empty_selection_clipboard_enabled(): boolean
        set empty_selection_clipboard_enabled(value: boolean)
        
        /** Sets the line wrapping mode to use. */
        get wrap_mode(): int64
        set wrap_mode(value: int64)
        
        /** If [member wrap_mode] is set to [constant LINE_WRAPPING_BOUNDARY], sets text wrapping mode. */
        get autowrap_mode(): int64
        set autowrap_mode(value: int64)
        
        /** If `true`, all wrapped lines are indented to the same amount as the unwrapped line. */
        get indent_wrapped_lines(): boolean
        set indent_wrapped_lines(value: boolean)
        
        /** If `true`, [member ProjectSettings.input/ui_text_indent] input `Tab` character, otherwise it moves keyboard focus to the next [Control] in the scene. */
        get tab_input_mode(): boolean
        set tab_input_mode(value: boolean)
        
        /** If `true`, the native virtual keyboard is enabled on platforms that support it. */
        get virtual_keyboard_enabled(): boolean
        set virtual_keyboard_enabled(value: boolean)
        
        /** If `true`, the native virtual keyboard is shown on focus events on platforms that support it. */
        get virtual_keyboard_show_on_focus(): boolean
        set virtual_keyboard_show_on_focus(value: boolean)
        
        /** Scroll smoothly over the text rather than jumping to the next location. */
        get scroll_smooth(): boolean
        set scroll_smooth(value: boolean)
        
        /** Sets the scroll speed with the minimap or when [member scroll_smooth] is enabled. */
        get scroll_v_scroll_speed(): float64
        set scroll_v_scroll_speed(value: float64)
        
        /** Allow scrolling past the last line into "virtual" space. */
        get scroll_past_end_of_file(): boolean
        set scroll_past_end_of_file(value: boolean)
        
        /** If there is a vertical scrollbar, this determines the current vertical scroll value in line numbers, starting at 0 for the top line. */
        get scroll_vertical(): float64
        set scroll_vertical(value: float64)
        
        /** If there is a horizontal scrollbar, this determines the current horizontal scroll value in pixels. */
        get scroll_horizontal(): int64
        set scroll_horizontal(value: int64)
        
        /** If `true`, [TextEdit] will disable vertical scroll and fit minimum height to the number of visible lines. When both this property and [member scroll_fit_content_width] are `true`, no scrollbars will be displayed. */
        get scroll_fit_content_height(): boolean
        set scroll_fit_content_height(value: boolean)
        
        /** If `true`, [TextEdit] will disable horizontal scroll and fit minimum width to the widest line in the text. When both this property and [member scroll_fit_content_height] are `true`, no scrollbars will be displayed. */
        get scroll_fit_content_width(): boolean
        set scroll_fit_content_width(value: boolean)
        
        /** If `true`, a minimap is shown, providing an outline of your source code. The minimap uses a fixed-width text size. */
        get minimap_draw(): boolean
        set minimap_draw(value: boolean)
        
        /** The width, in pixels, of the minimap. */
        get minimap_width(): int64
        set minimap_width(value: int64)
        
        /** Set the type of caret to draw. */
        get caret_type(): int64
        set caret_type(value: int64)
        
        /** If `true`, makes the caret blink. */
        get caret_blink(): boolean
        set caret_blink(value: boolean)
        
        /** The interval at which the caret blinks (in seconds). */
        get caret_blink_interval(): float64
        set caret_blink_interval(value: float64)
        
        /** If `true`, caret will be visible when [member editable] is disabled. */
        get caret_draw_when_editable_disabled(): boolean
        set caret_draw_when_editable_disabled(value: boolean)
        
        /** If `true`, a right-click moves the caret at the mouse position before displaying the context menu.  
         *  If `false`, the context menu ignores mouse location.  
         */
        get caret_move_on_right_click(): boolean
        set caret_move_on_right_click(value: boolean)
        
        /** Allow moving caret, selecting and removing the individual composite character components.  
         *      
         *  **Note:** [kbd]Backspace[/kbd] is always removing individual composite character components.  
         */
        get caret_mid_grapheme(): boolean
        set caret_mid_grapheme(value: boolean)
        
        /** If `true`, multiple carets are allowed. Left-clicking with [kbd]Alt[/kbd] adds a new caret. See [method add_caret] and [method get_caret_count]. */
        get caret_multiple(): boolean
        set caret_multiple(value: boolean)
        
        /** If `false`, using [kbd]Ctrl + Left[/kbd] or [kbd]Ctrl + Right[/kbd] ([kbd]Cmd + Left[/kbd] or [kbd]Cmd + Right[/kbd] on macOS) bindings will stop moving caret only if a space or punctuation is detected. If `true`, it will also stop the caret if a character is part of `!"#$%&'()*+,-./:;<=>?@[\]^`{|}~`, the Unicode General Punctuation table, or the Unicode CJK Punctuation table. Useful for subword moving. This behavior also will be applied to the behavior of text selection. */
        get use_default_word_separators(): boolean
        set use_default_word_separators(value: boolean)
        
        /** If `false`, using [kbd]Ctrl + Left[/kbd] or [kbd]Ctrl + Right[/kbd] ([kbd]Cmd + Left[/kbd] or [kbd]Cmd + Right[/kbd] on macOS) bindings will use the behavior of [member use_default_word_separators]. If `true`, it will also stop the caret if a character within [member custom_word_separators] is detected. Useful for subword moving. This behavior also will be applied to the behavior of text selection. */
        get use_custom_word_separators(): boolean
        set use_custom_word_separators(value: boolean)
        
        /** The characters to consider as word delimiters if [member use_custom_word_separators] is `true`. The characters should be defined without separation, for example `#_!`. */
        get custom_word_separators(): string
        set custom_word_separators(value: string)
        
        /** The syntax highlighter to use.  
         *      
         *  **Note:** A [SyntaxHighlighter] instance should not be used across multiple [TextEdit] nodes.  
         */
        get syntax_highlighter(): null | SyntaxHighlighter
        set syntax_highlighter(value: null | SyntaxHighlighter)
        
        /** If `true`, all occurrences of the selected text will be highlighted. */
        get highlight_all_occurrences(): boolean
        set highlight_all_occurrences(value: boolean)
        
        /** If `true`, the line containing the cursor is highlighted. */
        get highlight_current_line(): boolean
        set highlight_current_line(value: boolean)
        
        /** If `true`, control characters are displayed. */
        get draw_control_chars(): boolean
        set draw_control_chars(value: boolean)
        
        /** If `true`, the "tab" character will have a visible representation. */
        get draw_tabs(): boolean
        set draw_tabs(value: boolean)
        
        /** If `true`, the "space" character will have a visible representation. */
        get draw_spaces(): boolean
        set draw_spaces(value: boolean)
        
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
        
        /** Emitted when [method clear] is called or [member text] is set. */
        readonly text_set: Signal<() => void>
        
        /** Emitted when the text changes. */
        readonly text_changed: Signal<() => void>
        
        /** Emitted immediately when the text changes.  
         *  When text is added [param from_line] will be less than [param to_line]. On a remove [param to_line] will be less than [param from_line].  
         */
        readonly lines_edited_from: Signal<(from_line: int64, to_line: int64) => void>
        
        /** Emitted when any caret changes position. */
        readonly caret_changed: Signal<() => void>
        
        /** Emitted when a gutter is clicked. */
        readonly gutter_clicked: Signal<(line: int64, gutter: int64) => void>
        
        /** Emitted when a gutter is added. */
        readonly gutter_added: Signal<() => void>
        
        /** Emitted when a gutter is removed. */
        readonly gutter_removed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapTextEdit;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapTextEdit;
    }
}
