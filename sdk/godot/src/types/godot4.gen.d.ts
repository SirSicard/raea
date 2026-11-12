// AUTO-GENERATED
declare module "godot" {
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGLTFAnimation extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGLTFAnimation extends __NameMapResource {
    }
    /** @link https://docs.godotengine.org/en/4.6/classes/class_gltfanimation.html */
    class GLTFAnimation extends Resource {
        constructor(identifier?: any)
        /** Gets additional arbitrary data in this [GLTFAnimation] instance. This can be used to keep per-node state data in [GLTFDocumentExtension] classes, which is important because they are stateless.  
         *  The argument should be the [GLTFDocumentExtension] name (does not have to match the extension name in the glTF file), and the return value can be anything you set. If nothing was set, the return value is `null`.  
         */
        get_additional_data(extension_name: StringName): any
        
        /** Sets additional arbitrary data in this [GLTFAnimation] instance. This can be used to keep per-node state data in [GLTFDocumentExtension] classes, which is important because they are stateless.  
         *  The first argument should be the [GLTFDocumentExtension] name (does not have to match the extension name in the glTF file), and the second argument can be anything you want.  
         */
        set_additional_data(extension_name: StringName, additional_data: any): void
        
        /** The original name of the animation. */
        get original_name(): string
        set original_name(value: string)
        get loop(): boolean
        set loop(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGLTFAnimation;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGLTFAnimation;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGLTFBufferView extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGLTFBufferView extends __NameMapResource {
    }
    /** Represents a glTF buffer view.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gltfbufferview.html  
     */
    class GLTFBufferView extends Resource {
        constructor(identifier?: any)
        /** Loads the buffer view data from the buffer referenced by this buffer view in the given [GLTFState]. Interleaved data with a byte stride is not yet supported by this method. The data is returned as a [PackedByteArray]. */
        load_buffer_view_data(state: GLTFState): PackedByteArray
        
        /** Creates a new GLTFBufferView instance by parsing the given [Dictionary]. */
        static from_dictionary(dictionary: GDictionary): null | GLTFBufferView
        
        /** Serializes this GLTFBufferView instance into a [Dictionary]. */
        to_dictionary(): GDictionary
        
        /** The index of the buffer this buffer view is referencing. If `-1`, this buffer view is not referencing any buffer. */
        get buffer(): int64
        set buffer(value: int64)
        
        /** The offset, in bytes, from the start of the buffer to the start of this buffer view. */
        get byte_offset(): int64
        set byte_offset(value: int64)
        
        /** The length, in bytes, of this buffer view. If `0`, this buffer view is empty. */
        get byte_length(): int64
        set byte_length(value: int64)
        
        /** The stride, in bytes, between interleaved data. If `-1`, this buffer view is not interleaved. */
        get byte_stride(): int64
        set byte_stride(value: int64)
        
        /** `true` if the GLTFBufferView's OpenGL GPU buffer type is an `ELEMENT_ARRAY_BUFFER` used for vertex indices (integer constant `34963`). `false` if the buffer type is any other value. See [url=https://github.com/KhronosGroup/glTF-Tutorials/blob/master/gltfTutorial/gltfTutorial_005_BuffersBufferViewsAccessors.md]Buffers, BufferViews, and Accessors[/url] for possible values. This property is set on import and used on export. */
        get indices(): boolean
        set indices(value: boolean)
        
        /** `true` if the GLTFBufferView's OpenGL GPU buffer type is an `ARRAY_BUFFER` used for vertex attributes (integer constant `34962`). `false` if the buffer type is any other value. See [url=https://github.com/KhronosGroup/glTF-Tutorials/blob/master/gltfTutorial/gltfTutorial_005_BuffersBufferViewsAccessors.md]Buffers, BufferViews, and Accessors[/url] for possible values. This property is set on import and used on export. */
        get vertex_attributes(): boolean
        set vertex_attributes(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGLTFBufferView;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGLTFBufferView;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGLTFCamera extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGLTFCamera extends __NameMapResource {
    }
    /** Represents a glTF camera.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gltfcamera.html  
     */
    class GLTFCamera extends Resource {
        constructor(identifier?: any)
        /** Create a new GLTFCamera instance from the given Godot [Camera3D] node. */
        static from_node(camera_node: Camera3D): null | GLTFCamera
        
        /** Converts this GLTFCamera instance into a Godot [Camera3D] node. */
        to_node(): null | Camera3D
        
        /** Creates a new GLTFCamera instance by parsing the given [Dictionary]. */
        static from_dictionary(dictionary: GDictionary): null | GLTFCamera
        
        /** Serializes this GLTFCamera instance into a [Dictionary]. */
        to_dictionary(): GDictionary
        
        /** If `true`, the camera is in perspective mode. Otherwise, the camera is in orthographic/orthogonal mode. This maps to glTF's camera `type` property. See [member Camera3D.projection] and the glTF spec for more information. */
        get perspective(): boolean
        set perspective(value: boolean)
        
        /** The FOV of the camera. This class and glTF define the camera FOV in radians, while Godot uses degrees. This maps to glTF's `yfov` property. This value is only used for perspective cameras, when [member perspective] is `true`. */
        get fov(): float64
        set fov(value: float64)
        
        /** The size of the camera. This class and glTF define the camera size magnitude as a radius in meters, while Godot defines it as a diameter in meters. This maps to glTF's `ymag` property. This value is only used for orthographic/orthogonal cameras, when [member perspective] is `false`. */
        get size_mag(): float64
        set size_mag(value: float64)
        
        /** The distance to the far culling boundary for this camera relative to its local Z axis, in meters. This maps to glTF's `zfar` property. */
        get depth_far(): float64
        set depth_far(value: float64)
        
        /** The distance to the near culling boundary for this camera relative to its local Z axis, in meters. This maps to glTF's `znear` property. */
        get depth_near(): float64
        set depth_near(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGLTFCamera;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGLTFCamera;
    }
    namespace GLTFDocument {
        enum RootNodeMode {
            /** Treat the Godot scene's root node as the root node of the glTF file, and mark it as the single root node via the `GODOT_single_root` glTF extension. This will be parsed the same as [constant ROOT_NODE_MODE_KEEP_ROOT] if the implementation does not support `GODOT_single_root`. */
            ROOT_NODE_MODE_SINGLE_ROOT = 0,
            
            /** Treat the Godot scene's root node as the root node of the glTF file, but do not mark it as anything special. An extra root node will be generated when importing into Godot. This uses only vanilla glTF features. This is equivalent to the behavior in Godot 4.1 and earlier. */
            ROOT_NODE_MODE_KEEP_ROOT = 1,
            
            /** Treat the Godot scene's root node as the name of the glTF scene, and add all of its children as root nodes of the glTF file. This uses only vanilla glTF features. This avoids an extra root node, but only the name of the Godot scene's root node will be preserved, as it will not be saved as a node. */
            ROOT_NODE_MODE_MULTI_ROOT = 2,
        }
        enum VisibilityMode {
            /** If the scene contains any non-visible nodes, include them, mark them as non-visible with `KHR_node_visibility`, and require that importers respect their non-visibility. Downside: If the importer does not support `KHR_node_visibility`, the file cannot be imported. */
            VISIBILITY_MODE_INCLUDE_REQUIRED = 0,
            
            /** If the scene contains any non-visible nodes, include them, mark them as non-visible with `KHR_node_visibility`, and do not impose any requirements on importers. Downside: If the importer does not support `KHR_node_visibility`, invisible objects will be visible. */
            VISIBILITY_MODE_INCLUDE_OPTIONAL = 1,
            
            /** If the scene contains any non-visible nodes, do not include them in the export. This is the same as the behavior in Godot 4.4 and earlier. Downside: Invisible nodes will not exist in the exported file. */
            VISIBILITY_MODE_EXCLUDE = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGLTFDocument extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGLTFDocument extends __NameMapResource {
    }
    /** Class for importing and exporting glTF files in and out of Godot.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gltfdocument.html  
     */
    class GLTFDocument extends Resource {
        constructor(identifier?: any)
        /** Takes a path to a glTF file and imports the data at that file path to the given [GLTFState] object through the [param state] parameter.  
         *      
         *  **Note:** The [param base_path] tells [method append_from_file] where to find dependencies and can be empty.  
         */
        append_from_file(path: string, state: GLTFState, flags?: int64 /* = 0 */, base_path?: string /* = '' */): Error
        
        /** Takes a [PackedByteArray] defining a glTF and imports the data to the given [GLTFState] object through the [param state] parameter.  
         *      
         *  **Note:** The [param base_path] tells [method append_from_buffer] where to find dependencies and can be empty.  
         */
        append_from_buffer(bytes: PackedByteArray | byte[] | ArrayBuffer, base_path: string, state: GLTFState, flags?: int64 /* = 0 */): Error
        
        /** Takes a Godot Engine scene node and exports it and its descendants to the given [GLTFState] object through the [param state] parameter. */
        append_from_scene(node: Node, state: GLTFState, flags?: int64 /* = 0 */): Error
        
        /** Takes a [GLTFState] object through the [param state] parameter and returns a Godot Engine scene node.  
         *  The [param bake_fps] parameter overrides the bake_fps in [param state].  
         */
        generate_scene(state: GLTFState, bake_fps?: float64 /* = 30 */, trimming?: boolean /* = false */, remove_immutable_tracks?: boolean /* = true */): null | Node
        
        /** Takes a [GLTFState] object through the [param state] parameter and returns a glTF [PackedByteArray]. */
        generate_buffer(state: GLTFState): PackedByteArray
        
        /** Takes a [GLTFState] object through the [param state] parameter and writes a glTF file to the filesystem.  
         *      
         *  **Note:** The extension of the glTF file determines if it is a .glb binary file or a .gltf text file.  
         */
        write_to_filesystem(state: GLTFState, path: string): Error
        
        /** Determines a mapping between the given glTF Object Model [param json_pointer] and the corresponding Godot node path(s) in the generated Godot scene. The details of this mapping are returned in a [GLTFObjectModelProperty] object. Additional mappings can be supplied via the [method GLTFDocumentExtension._export_object_model_property] callback method. */
        static import_object_model_property(state: GLTFState, json_pointer: string): null | GLTFObjectModelProperty
        
        /** Determines a mapping between the given Godot [param node_path] and the corresponding glTF Object Model JSON pointer(s) in the generated glTF file. The details of this mapping are returned in a [GLTFObjectModelProperty] object. Additional mappings can be supplied via the [method GLTFDocumentExtension._import_object_model_property] callback method. */
        static export_object_model_property(state: GLTFState, node_path: NodePath | string, godot_node: Node, gltf_node_index: int64): null | GLTFObjectModelProperty
        
        /** Registers the given [GLTFDocumentExtension] instance with GLTFDocument. If [param first_priority] is `true`, this extension will be run first. Otherwise, it will be run last.  
         *      
         *  **Note:** Like GLTFDocument itself, all GLTFDocumentExtension classes must be stateless in order to function properly. If you need to store data, use the `set_additional_data` and `get_additional_data` methods in [GLTFState] or [GLTFNode].  
         */
        static register_gltf_document_extension(extension: GLTFDocumentExtension, first_priority?: boolean /* = false */): void
        
        /** Unregisters the given [GLTFDocumentExtension] instance. */
        static unregister_gltf_document_extension(extension: GLTFDocumentExtension): void
        
        /** Returns a list of all support glTF extensions, including extensions supported directly by the engine, and extensions supported by user plugins registering [GLTFDocumentExtension] classes.  
         *      
         *  **Note:** If this method is run before a GLTFDocumentExtension is registered, its extensions won't be included in the list. Be sure to only run this method after all extensions are registered. If you run this when the engine starts, consider waiting a frame before calling this method to ensure all extensions are registered.  
         */
        static get_supported_gltf_extensions(): PackedStringArray
        
        /** The user-friendly name of the export image format. This is used when exporting the glTF file, including writing to a file and writing to a byte array.  
         *  By default, Godot allows the following options: "None", "PNG", "JPEG", "Lossless WebP", and "Lossy WebP". Support for more image formats can be added in [GLTFDocumentExtension] classes. A single extension class can provide multiple options for the specific format to use, or even an option that uses multiple formats at once.  
         */
        get image_format(): string
        set image_format(value: string)
        
        /** If [member image_format] is a lossy image format, this determines the lossy quality of the image. On a range of `0.0` to `1.0`, where `0.0` is the lowest quality and `1.0` is the highest quality. A lossy quality of `1.0` is not the same as lossless. */
        get lossy_quality(): float64
        set lossy_quality(value: float64)
        
        /** The user-friendly name of the fallback image format. This is used when exporting the glTF file, including writing to a file and writing to a byte array.  
         *  This property may only be one of "None", "PNG", or "JPEG", and is only used when the [member image_format] is not one of "None", "PNG", or "JPEG". If having multiple extension image formats is desired, that can be done using a [GLTFDocumentExtension] class - this property only covers the use case of providing a base glTF fallback image when using a custom image format.  
         */
        get fallback_image_format(): string
        set fallback_image_format(value: string)
        
        /** The quality of the fallback image, if any. For PNG files, this downscales the image on both dimensions by this factor. For JPEG files, this is the lossy quality of the image. A low value is recommended, since including multiple high quality images in a glTF file defeats the file size gains of using a more efficient image format. */
        get fallback_image_quality(): float64
        set fallback_image_quality(value: float64)
        
        /** How to process the root node during export. The default and recommended value is [constant ROOT_NODE_MODE_SINGLE_ROOT].  
         *      
         *  **Note:** Regardless of how the glTF file is exported, when importing, the root node type and name can be overridden in the scene import settings tab.  
         */
        get root_node_mode(): int64
        set root_node_mode(value: int64)
        
        /** How to deal with node visibility during export. This setting does nothing if all nodes are visible. The default and recommended value is [constant VISIBILITY_MODE_INCLUDE_REQUIRED], which uses the `KHR_node_visibility` extension. */
        get visibility_mode(): int64
        set visibility_mode(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGLTFDocument;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGLTFDocument;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGLTFDocumentExtension extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGLTFDocumentExtension extends __NameMapResource {
    }
    /** [GLTFDocument] extension class.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gltfdocumentextension.html  
     */
    class GLTFDocumentExtension extends Resource {
        constructor(identifier?: any)
        /** Part of the import process. This method is run first, before all other parts of the import process.  
         *  The return value is used to determine if this [GLTFDocumentExtension] instance should be used for importing a given glTF file. If [constant OK], the import will use this [GLTFDocumentExtension] instance. If not overridden, [constant OK] is returned.  
         */
        /* gdvirtual */ _import_preflight(state: GLTFState, extensions: PackedStringArray | string[]): Error
        
        /** Part of the import process. This method is run after [method _import_preflight] and before [method _parse_node_extensions].  
         *  Returns an array of the glTF extensions supported by this GLTFDocumentExtension class. This is used to validate if a glTF file with required extensions can be loaded.  
         */
        /* gdvirtual */ _get_supported_extensions(): PackedStringArray
        
        /** Part of the import process. This method is run after [method _get_supported_extensions] and before [method _import_post_parse].  
         *  Runs when parsing the node extensions of a GLTFNode. This method can be used to process the extension JSON data into a format that can be used by [method _generate_scene_node]. The return value should be a member of the [enum Error] enum.  
         */
        /* gdvirtual */ _parse_node_extensions(state: GLTFState, gltf_node: GLTFNode, extensions: GDictionary): Error
        
        /** Part of the import process. This method is run after [method _parse_node_extensions] and before [method _parse_texture_json].  
         *  Runs when parsing image data from a glTF file. The data could be sourced from a separate file, a URI, or a buffer, and then is passed as a byte array.  
         */
        /* gdvirtual */ _parse_image_data(state: GLTFState, image_data: PackedByteArray | byte[] | ArrayBuffer, mime_type: string, ret_image: Image): Error
        
        /** Returns the file extension to use for saving image data into, for example, `".png"`. If defined, when this extension is used to handle images, and the images are saved to a separate file, the image bytes will be copied to a file with this extension. If this is set, there should be a [ResourceImporter] class able to import the file. If not defined or empty, Godot will save the image into a PNG file. */
        /* gdvirtual */ _get_image_file_extension(): string
        
        /** Part of the import process. This method is run after [method _parse_image_data] and before [method _generate_scene_node].  
         *  Runs when parsing the texture JSON from the glTF textures array. This can be used to set the source image index to use as the texture.  
         */
        /* gdvirtual */ _parse_texture_json(state: GLTFState, texture_json: GDictionary, ret_gltf_texture: GLTFTexture): Error
        
        /** Part of the import process. Allows GLTFDocumentExtension classes to provide mappings for JSON pointers to glTF properties, as defined by the glTF object model, to properties of nodes in the Godot scene tree.  
         *  Returns a [GLTFObjectModelProperty] instance that defines how the property should be mapped. If your extension can't handle the property, return `null` or an instance without any NodePaths (see [method GLTFObjectModelProperty.has_node_paths]). You should use [method GLTFObjectModelProperty.set_types] to set the types, and [method GLTFObjectModelProperty.append_path_to_property] function is useful for most simple cases.  
         *  In many cases, [param partial_paths] will contain the start of a path, allowing the extension to complete the path. For example, for `/nodes/3/extensions/MY_ext/prop`, Godot will pass you a NodePath that leads to node 3, so the GLTFDocumentExtension class only needs to resolve the last `MY_ext/prop` part of the path. In this example, the extension should check `split.size() > 4 and split[0] == "nodes" and split[2] == "extensions" and split[3] == "MY_ext"` at the start of the function to check if this JSON pointer applies to it, then it can use [param partial_paths] and handle `split[4]`.  
         */
        /* gdvirtual */ _import_object_model_property(state: GLTFState, split_json_pointer: PackedStringArray | string[], partial_paths: GArray<NodePath>): null | GLTFObjectModelProperty
        
        /** Part of the import process. This method is run after [method _parse_node_extensions] and before [method _import_pre_generate].  
         *  This method can be used to modify any of the data imported so far after parsing each node, but before generating the scene or any of its nodes.  
         */
        /* gdvirtual */ _import_post_parse(state: GLTFState): Error
        
        /** Part of the import process. This method is run after [method _import_post_parse] and before [method _generate_scene_node].  
         *  This method can be used to modify or read from any of the processed data structures, before generating the nodes and then running the final per-node import step.  
         */
        /* gdvirtual */ _import_pre_generate(state: GLTFState): Error
        
        /** Part of the import process. This method is run after [method _import_pre_generate] and before [method _import_node].  
         *  Runs when generating a Godot scene node from a GLTFNode. The returned node will be added to the scene tree. Multiple nodes can be generated in this step if they are added as a child of the returned node.  
         *      
         *  **Note:** The [param scene_parent] parameter may be `null` if this is the single root node.  
         */
        /* gdvirtual */ _generate_scene_node(state: GLTFState, gltf_node: GLTFNode, scene_parent: Node): null | Node3D
        
        /** Part of the import process. This method is run after [method _generate_scene_node] and before [method _import_post].  
         *  This method can be used to make modifications to each of the generated Godot scene nodes.  
         */
        /* gdvirtual */ _import_node(state: GLTFState, gltf_node: GLTFNode, json: GDictionary, node: Node): Error
        
        /** Part of the import process. This method is run last, after all other parts of the import process.  
         *  This method can be used to modify the final Godot scene generated by the import process.  
         */
        /* gdvirtual */ _import_post(state: GLTFState, root: Node): Error
        
        /** Part of the export process. This method is run first, before all other parts of the export process.  
         *  The return value is used to determine if this [GLTFDocumentExtension] instance should be used for exporting a given glTF file. If [constant OK], the export will use this [GLTFDocumentExtension] instance. If not overridden, [constant OK] is returned.  
         */
        /* gdvirtual */ _export_preflight(state: GLTFState, root: Node): Error
        
        /** Part of the export process. This method is run after [method _export_preflight] and before [method _export_post_convert].  
         *  Runs when converting the data from a Godot scene node. This method can be used to process the Godot scene node data into a format that can be used by [method _export_node].  
         */
        /* gdvirtual */ _convert_scene_node(state: GLTFState, gltf_node: GLTFNode, scene_node: Node): void
        
        /** Part of the export process. This method is run after [method _convert_scene_node] and before [method _export_preserialize].  
         *  This method can be used to modify the converted node data structures before serialization with any additional data from the scene tree.  
         */
        /* gdvirtual */ _export_post_convert(state: GLTFState, root: Node): Error
        
        /** Part of the export process. This method is run after [method _export_post_convert] and before [method _get_saveable_image_formats].  
         *  This method can be used to alter the state before performing serialization. It runs every time when generating a buffer with [method GLTFDocument.generate_buffer] or writing to the file system with [method GLTFDocument.write_to_filesystem].  
         */
        /* gdvirtual */ _export_preserialize(state: GLTFState): Error
        
        /** Part of the export process. Allows GLTFDocumentExtension classes to provide mappings for properties of nodes in the Godot scene tree, to JSON pointers to glTF properties, as defined by the glTF object model.  
         *  Returns a [GLTFObjectModelProperty] instance that defines how the property should be mapped. If your extension can't handle the property, return `null` or an instance without any JSON pointers (see [method GLTFObjectModelProperty.has_json_pointers]). You should use [method GLTFObjectModelProperty.set_types] to set the types, and set the JSON pointer(s) using the [member GLTFObjectModelProperty.json_pointers] property.  
         *  The parameters provide context for the property, including the NodePath, the Godot node, the GLTF node index, and the target object. The [param target_object] will be equal to [param godot_node] if no sub-object can be found, otherwise it will point to a sub-object. For example, if the path is `^"A/B/C/MeshInstance3D:mesh:surface_0/material:emission_intensity"`, it will get the node, then the mesh, and then the material, so [param target_object] will be the [Material] resource, and [param target_depth] will be 2 because 2 levels were traversed to get to the target.  
         */
        /* gdvirtual */ _export_object_model_property(state: GLTFState, node_path: NodePath | string, godot_node: Node, gltf_node_index: int64, target_object: Object, target_depth: int64): null | GLTFObjectModelProperty
        
        /** Part of the export process. This method is run after [method _convert_scene_node] and before [method _export_node].  
         *  Returns an array of the image formats that can be saved/exported by this extension. This extension will only be selected as the image exporter if the [GLTFDocument]'s [member GLTFDocument.image_format] is in this array. If this [GLTFDocumentExtension] is selected as the image exporter, one of the [method _save_image_at_path] or [method _serialize_image_to_bytes] methods will run next, otherwise [method _export_node] will run next. If the format name contains `"Lossy"`, the lossy quality slider will be displayed.  
         */
        /* gdvirtual */ _get_saveable_image_formats(): PackedStringArray
        
        /** Part of the export process. This method is run after [method _get_saveable_image_formats] and before [method _serialize_texture_json].  
         *  This method is run when embedding images in the glTF file. When images are saved separately, [method _save_image_at_path] runs instead. Note that these methods only run when this [GLTFDocumentExtension] is selected as the image exporter.  
         *  This method must set the image MIME type in the [param image_dict] with the `"mimeType"` key. For example, for a PNG image, it would be set to `"image/png"`. The return value must be a [PackedByteArray] containing the image data.  
         */
        /* gdvirtual */ _serialize_image_to_bytes(state: GLTFState, image: Image, image_dict: GDictionary, image_format: string, lossy_quality: float64): PackedByteArray
        
        /** Part of the export process. This method is run after [method _get_saveable_image_formats] and before [method _serialize_texture_json].  
         *  This method is run when saving images separately from the glTF file. When images are embedded, [method _serialize_image_to_bytes] runs instead. Note that these methods only run when this [GLTFDocumentExtension] is selected as the image exporter.  
         */
        /* gdvirtual */ _save_image_at_path(state: GLTFState, image: Image, file_path: string, image_format: string, lossy_quality: float64): Error
        
        /** Part of the export process. This method is run after [method _save_image_at_path] or [method _serialize_image_to_bytes], and before [method _export_node]. Note that this method only runs when this [GLTFDocumentExtension] is selected as the image exporter.  
         *  This method can be used to set up the extensions for the texture JSON by editing [param texture_json]. The extension must also be added as used extension with [method GLTFState.add_used_extension], be sure to set `required` to `true` if you are not providing a fallback.  
         */
        /* gdvirtual */ _serialize_texture_json(state: GLTFState, texture_json: GDictionary, gltf_texture: GLTFTexture, image_format: string): Error
        
        /** Part of the export process. This method is run after [method _get_saveable_image_formats] and before [method _export_post]. If this [GLTFDocumentExtension] is used for exporting images, this runs after [method _serialize_texture_json].  
         *  This method can be used to modify the final JSON of each node. Data should be primarily stored in [param gltf_node] prior to serializing the JSON, but the original Godot [Node] is also provided if available. [param node] may be `null` if not available, such as when exporting glTF data not generated from a Godot scene.  
         */
        /* gdvirtual */ _export_node(state: GLTFState, gltf_node: GLTFNode, json: GDictionary, node: Node): Error
        
        /** Part of the export process. This method is run last, after all other parts of the export process.  
         *  This method can be used to modify the final JSON of the generated glTF file.  
         */
        /* gdvirtual */ _export_post(state: GLTFState): Error
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGLTFDocumentExtension;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGLTFDocumentExtension;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGLTFDocumentExtensionConvertImporterMesh extends __RPCMapGLTFDocumentExtension {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGLTFDocumentExtensionConvertImporterMesh extends __NameMapGLTFDocumentExtension {
    }
    /** @link https://docs.godotengine.org/en/4.6/classes/class_gltfdocumentextensionconvertimportermesh.html */
    class GLTFDocumentExtensionConvertImporterMesh extends GLTFDocumentExtension {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGLTFDocumentExtensionConvertImporterMesh;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGLTFDocumentExtensionConvertImporterMesh;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGLTFLight extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGLTFLight extends __NameMapResource {
    }
    /** Represents a glTF light.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gltflight.html  
     */
    class GLTFLight extends Resource {
        constructor(identifier?: any)
        /** Create a new GLTFLight instance from the given Godot [Light3D] node. */
        static from_node(light_node: Light3D): null | GLTFLight
        
        /** Converts this GLTFLight instance into a Godot [Light3D] node. */
        to_node(): null | Light3D
        
        /** Creates a new GLTFLight instance by parsing the given [Dictionary]. */
        static from_dictionary(dictionary: GDictionary): null | GLTFLight
        
        /** Serializes this GLTFLight instance into a [Dictionary]. */
        to_dictionary(): GDictionary
        get_additional_data(extension_name: StringName): any
        set_additional_data(extension_name: StringName, additional_data: any): void
        
        /** The [Color] of the light in linear space. Defaults to white. A black color causes the light to have no effect.  
         *  This value is linear to match glTF, but will be converted to nonlinear sRGB when creating a Godot [Light3D] node upon import, or converted to linear when exporting a Godot [Light3D] to glTF.  
         */
        get color(): Color
        set color(value: Color)
        
        /** The intensity of the light. This is expressed in candelas (lumens per steradian) for point and spot lights, and lux (lumens per m²) for directional lights. When creating a Godot light, this value is converted to a unitless multiplier. */
        get intensity(): float64
        set intensity(value: float64)
        
        /** The type of the light. The values accepted by Godot are "point", "spot", and "directional", which correspond to Godot's [OmniLight3D], [SpotLight3D], and [DirectionalLight3D] respectively. */
        get light_type(): string
        set light_type(value: string)
        
        /** The range of the light, beyond which the light has no effect. glTF lights with no range defined behave like physical lights (which have infinite range). When creating a Godot light, the range is clamped to `4096.0`. */
        get range(): float64
        set range(value: float64)
        
        /** The inner angle of the cone in a spotlight. Must be less than or equal to the outer cone angle.  
         *  Within this angle, the light is at full brightness. Between the inner and outer cone angles, there is a transition from full brightness to zero brightness. When creating a Godot [SpotLight3D], the ratio between the inner and outer cone angles is used to calculate the attenuation of the light.  
         */
        get inner_cone_angle(): float64
        set inner_cone_angle(value: float64)
        
        /** The outer angle of the cone in a spotlight. Must be greater than or equal to the inner angle.  
         *  At this angle, the light drops off to zero brightness. Between the inner and outer cone angles, there is a transition from full brightness to zero brightness. If this angle is a half turn, then the spotlight emits in all directions. When creating a Godot [SpotLight3D], the outer cone angle is used as the angle of the spotlight.  
         */
        get outer_cone_angle(): float64
        set outer_cone_angle(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGLTFLight;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGLTFLight;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGLTFMesh extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGLTFMesh extends __NameMapResource {
    }
    /** GLTFMesh represents a glTF mesh.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gltfmesh.html  
     */
    class GLTFMesh extends Resource {
        constructor(identifier?: any)
        /** Gets additional arbitrary data in this [GLTFMesh] instance. This can be used to keep per-node state data in [GLTFDocumentExtension] classes, which is important because they are stateless.  
         *  The argument should be the [GLTFDocumentExtension] name (does not have to match the extension name in the glTF file), and the return value can be anything you set. If nothing was set, the return value is `null`.  
         */
        get_additional_data(extension_name: StringName): any
        
        /** Sets additional arbitrary data in this [GLTFMesh] instance. This can be used to keep per-node state data in [GLTFDocumentExtension] classes, which is important because they are stateless.  
         *  The first argument should be the [GLTFDocumentExtension] name (does not have to match the extension name in the glTF file), and the second argument can be anything you want.  
         */
        set_additional_data(extension_name: StringName, additional_data: any): void
        
        /** The original name of the mesh. */
        get original_name(): string
        set original_name(value: string)
        
        /** The [ImporterMesh] object representing the mesh itself. */
        get mesh(): null | Object
        set mesh(value: null | Object)
        
        /** An array of floats representing the blend weights of the mesh. */
        get blend_weights(): PackedFloat32Array
        set blend_weights(value: PackedFloat32Array | float32[])
        
        /** An array of Material objects representing the materials used in the mesh. */
        get instance_materials(): GArray
        set instance_materials(value: GArray)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGLTFMesh;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGLTFMesh;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGLTFNode extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGLTFNode extends __NameMapResource {
    }
    /** glTF node class.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gltfnode.html  
     */
    class GLTFNode extends Resource {
        constructor(identifier?: any)
        /** Appends the given child node index to the [member children] array. */
        append_child_index(child_index: int64): void
        
        /** Gets additional arbitrary data in this [GLTFNode] instance. This can be used to keep per-node state data in [GLTFDocumentExtension] classes, which is important because they are stateless.  
         *  The argument should be the [GLTFDocumentExtension] name (does not have to match the extension name in the glTF file), and the return value can be anything you set. If nothing was set, the return value is `null`.  
         */
        get_additional_data(extension_name: StringName): any
        
        /** Sets additional arbitrary data in this [GLTFNode] instance. This can be used to keep per-node state data in [GLTFDocumentExtension] classes, which is important because they are stateless.  
         *  The first argument should be the [GLTFDocumentExtension] name (does not have to match the extension name in the glTF file), and the second argument can be anything you want.  
         */
        set_additional_data(extension_name: StringName, additional_data: any): void
        
        /** Returns the [NodePath] that this GLTF node will have in the Godot scene tree after being imported. This is useful when importing glTF object model pointers with [GLTFObjectModelProperty], for handling extensions such as `KHR_animation_pointer` or `KHR_interactivity`.  
         *  If [param handle_skeletons] is `true`, paths to skeleton bone glTF nodes will be resolved properly. For example, a path that would be `^"A/B/C/Bone1/Bone2/Bone3"` if `false` will become `^"A/B/C/Skeleton3D:Bone3"`.  
         */
        get_scene_node_path(gltf_state: GLTFState, handle_skeletons?: boolean /* = true */): NodePath
        
        /** The original name of the node. */
        get original_name(): string
        set original_name(value: string)
        
        /** The index of the parent node in the [GLTFState]. If -1, this node is a root node. */
        get parent(): int64
        set parent(value: int64)
        
        /** How deep into the node hierarchy this node is. A root node will have a height of 0, its children will have a height of 1, and so on. If -1, the height has not been calculated. */
        get height(): int64
        set height(value: int64)
        
        /** The transform of the glTF node relative to its parent. This property is usually unused since the position, rotation, and scale properties are preferred. */
        get xform(): Transform3D
        set xform(value: Transform3D)
        
        /** If this glTF node is a mesh, the index of the [GLTFMesh] in the [GLTFState] that describes the mesh's properties. If -1, this node is not a mesh. */
        get mesh(): int64
        set mesh(value: int64)
        
        /** If this glTF node is a camera, the index of the [GLTFCamera] in the [GLTFState] that describes the camera's properties. If `-1`, this node is not a camera. */
        get camera(): int64
        set camera(value: int64)
        
        /** If this glTF node has a skin, the index of the [GLTFSkin] in the [GLTFState] that describes the skin's properties. If -1, this node does not have a skin. */
        get skin(): int64
        set skin(value: int64)
        
        /** If this glTF node has a skeleton, the index of the [GLTFSkeleton] in the [GLTFState] that describes the skeleton's properties. If -1, this node does not have a skeleton. */
        get skeleton(): int64
        set skeleton(value: int64)
        
        /** The position of the glTF node relative to its parent. */
        get position(): Vector3
        set position(value: Vector3)
        
        /** The rotation of the glTF node relative to its parent. */
        get rotation(): Quaternion
        set rotation(value: Quaternion)
        
        /** The scale of the glTF node relative to its parent. */
        get scale(): Vector3
        set scale(value: Vector3)
        
        /** The indices of the child nodes in the [GLTFState]. If this glTF node has no children, this will be an empty array. */
        get children(): PackedInt32Array
        set children(value: PackedInt32Array | int32[])
        
        /** If this glTF node is a light, the index of the [GLTFLight] in the [GLTFState] that describes the light's properties. If -1, this node is not a light. */
        get light(): int64
        set light(value: int64)
        
        /** If `true`, the GLTF node is visible. If `false`, the GLTF node is not visible. This is converted to the [member Node3D.visible] property in the Godot scene, and is exported to `KHR_node_visibility` when `false`. */
        get visible(): boolean
        set visible(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGLTFNode;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGLTFNode;
    }
    namespace GLTFObjectModelProperty {
        enum GLTFObjectModelType {
            /** Unknown or not set object model type. If the object model type is set to this value, the real type still needs to be determined. */
            GLTF_OBJECT_MODEL_TYPE_UNKNOWN = 0,
            
            /** Object model type "bool". Represented in the glTF JSON as a boolean, and encoded in a [GLTFAccessor] as "SCALAR". When encoded in an accessor, a value of `0` is `false`, and any other value is `true`. */
            GLTF_OBJECT_MODEL_TYPE_BOOL = 1,
            
            /** Object model type "float". Represented in the glTF JSON as a number, and encoded in a [GLTFAccessor] as "SCALAR". */
            GLTF_OBJECT_MODEL_TYPE_FLOAT = 2,
            
            /** Object model type "float[lb][rb]". Represented in the glTF JSON as an array of numbers, and encoded in a [GLTFAccessor] as "SCALAR". */
            GLTF_OBJECT_MODEL_TYPE_FLOAT_ARRAY = 3,
            
            /** Object model type "float2". Represented in the glTF JSON as an array of two numbers, and encoded in a [GLTFAccessor] as "VEC2". */
            GLTF_OBJECT_MODEL_TYPE_FLOAT2 = 4,
            
            /** Object model type "float3". Represented in the glTF JSON as an array of three numbers, and encoded in a [GLTFAccessor] as "VEC3". */
            GLTF_OBJECT_MODEL_TYPE_FLOAT3 = 5,
            
            /** Object model type "float4". Represented in the glTF JSON as an array of four numbers, and encoded in a [GLTFAccessor] as "VEC4". */
            GLTF_OBJECT_MODEL_TYPE_FLOAT4 = 6,
            
            /** Object model type "float2x2". Represented in the glTF JSON as an array of four numbers, and encoded in a [GLTFAccessor] as "MAT2". */
            GLTF_OBJECT_MODEL_TYPE_FLOAT2X2 = 7,
            
            /** Object model type "float3x3". Represented in the glTF JSON as an array of nine numbers, and encoded in a [GLTFAccessor] as "MAT3". */
            GLTF_OBJECT_MODEL_TYPE_FLOAT3X3 = 8,
            
            /** Object model type "float4x4". Represented in the glTF JSON as an array of sixteen numbers, and encoded in a [GLTFAccessor] as "MAT4". */
            GLTF_OBJECT_MODEL_TYPE_FLOAT4X4 = 9,
            
            /** Object model type "int". Represented in the glTF JSON as a number, and encoded in a [GLTFAccessor] as "SCALAR". The range of values is limited to signed integers. For `KHR_interactivity`, only 32-bit integers are supported. */
            GLTF_OBJECT_MODEL_TYPE_INT = 10,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGLTFObjectModelProperty extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGLTFObjectModelProperty extends __NameMapRefCounted {
    }
    /** Describes how to access a property as defined in the glTF object model.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gltfobjectmodelproperty.html  
     */
    class GLTFObjectModelProperty extends RefCounted {
        constructor(identifier?: any)
        /** Appends a [NodePath] to [member node_paths]. This can be used by [GLTFDocumentExtension] classes to define how a glTF object model property maps to a Godot property, or multiple Godot properties. Prefer using [method append_path_to_property] for simple cases. Be sure to also call [method set_types] once (the order does not matter). */
        append_node_path(node_path: NodePath | string): void
        
        /** High-level wrapper over [method append_node_path] that handles the most common cases. It constructs a new [NodePath] using [param node_path] as a base and appends [param prop_name] to the subpath. Be sure to also call [method set_types] once (the order does not matter). */
        append_path_to_property(node_path: NodePath | string, prop_name: StringName): void
        
        /** The GLTF accessor type associated with this property's [member object_model_type]. See [member GLTFAccessor.accessor_type] for possible values, and see [enum GLTFObjectModelType] for how the object model type maps to accessor types. */
        get_accessor_type(): GLTFAccessor.GLTFAccessorType
        
        /** Returns `true` if [member node_paths] is not empty. This is used during import to determine if a [GLTFObjectModelProperty] can handle converting a glTF object model property to a Godot property. */
        has_node_paths(): boolean
        
        /** Returns `true` if [member json_pointers] is not empty. This is used during export to determine if a [GLTFObjectModelProperty] can handle converting a Godot property to a glTF object model property. */
        has_json_pointers(): boolean
        
        /** Sets the [member variant_type] and [member object_model_type] properties. This is a convenience method to set both properties at once, since they are almost always known at the same time. This method should be called once. Calling it again with the same values will have no effect. */
        set_types(variant_type: Variant.Type, obj_model_type: GLTFObjectModelProperty.GLTFObjectModelType): void
        
        /** If set, this [Expression] will be used to convert the property value from the glTF object model to the value expected by the Godot property. This is useful when the glTF object model uses a different unit system, or when the data needs to be transformed in some way. If `null`, the value will be copied as-is. */
        get gltf_to_godot_expression(): null | Expression
        set gltf_to_godot_expression(value: null | Expression)
        
        /** If set, this [Expression] will be used to convert the property value from the Godot property to the value expected by the glTF object model. This is useful when the glTF object model uses a different unit system, or when the data needs to be transformed in some way. If `null`, the value will be copied as-is. */
        get godot_to_gltf_expression(): null | Expression
        set godot_to_gltf_expression(value: null | Expression)
        
        /** An array of [NodePath]s that point to a property, or multiple properties, in the Godot scene tree. On import, this will either be set by [GLTFDocument], or by a [GLTFDocumentExtension] class. For simple cases, use [method append_path_to_property] to add properties to this array.  
         *  In most cases [member node_paths] will only have one item, but in some cases a single glTF JSON pointer will map to multiple Godot properties. For example, a [GLTFCamera] or [GLTFLight] used on multiple glTF nodes will be represented by multiple Godot nodes.  
         */
        get node_paths(): GArray
        set node_paths(value: GArray)
        
        /** The type of data stored in the glTF file as defined by the object model. This is a superset of the available accessor types, and determines the accessor type. */
        get object_model_type(): int64
        set object_model_type(value: int64)
        
        /** The glTF object model JSON pointers used to identify the property in the glTF object model. In most cases, there will be only one item in this array, but specific cases may require multiple pointers. The items are themselves arrays which represent the JSON pointer split into its components. */
        get json_pointers(): PackedStringArray
        set json_pointers(value: PackedStringArray | string[])
        
        /** The type of data stored in the Godot property. This is the type of the property that the [member node_paths] point to. */
        get variant_type(): int64
        set variant_type(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGLTFObjectModelProperty;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGLTFObjectModelProperty;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGLTFPhysicsBody extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGLTFPhysicsBody extends __NameMapResource {
    }
    /** Represents a glTF physics body.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gltfphysicsbody.html  
     */
    class GLTFPhysicsBody extends Resource {
        constructor(identifier?: any)
        /** Creates a new GLTFPhysicsBody instance from the given Godot [CollisionObject3D] node. */
        static from_node(body_node: CollisionObject3D): null | GLTFPhysicsBody
        
        /** Converts this GLTFPhysicsBody instance into a Godot [CollisionObject3D] node. */
        to_node(): null | CollisionObject3D
        
        /** Creates a new GLTFPhysicsBody instance by parsing the given [Dictionary] in the `OMI_physics_body` glTF extension format. */
        static from_dictionary(dictionary: GDictionary): null | GLTFPhysicsBody
        
        /** Serializes this GLTFPhysicsBody instance into a [Dictionary]. It will be in the format expected by the `OMI_physics_body` glTF extension. */
        to_dictionary(): GDictionary
        
        /** The type of the body.  
         *  When importing, this controls what type of [CollisionObject3D] node Godot should generate. Valid values are `"static"`, `"animatable"`, `"character"`, `"rigid"`, `"vehicle"`, and `"trigger"`.  
         *  When exporting, this will be squashed down to one of `"static"`, `"kinematic"`, or `"dynamic"` motion types, or the `"trigger"` property.  
         */
        get body_type(): string
        set body_type(value: string)
        
        /** The mass of the physics body, in kilograms. This is only used when the body type is "rigid" or "vehicle". */
        get mass(): float64
        set mass(value: float64)
        
        /** The linear velocity of the physics body, in meters per second. This is only used when the body type is "rigid" or "vehicle". */
        get linear_velocity(): Vector3
        set linear_velocity(value: Vector3)
        
        /** The angular velocity of the physics body, in radians per second. This is only used when the body type is "rigid" or "vehicle". */
        get angular_velocity(): Vector3
        set angular_velocity(value: Vector3)
        
        /** The center of mass of the body, in meters. This is in local space relative to the body. By default, the center of the mass is the body's origin. */
        get center_of_mass(): Vector3
        set center_of_mass(value: Vector3)
        
        /** The inertia strength of the physics body, in kilogram meter squared (kg⋅m²). This represents the inertia around the principle axes, the diagonal of the inertia tensor matrix. This is only used when the body type is "rigid" or "vehicle".  
         *  When converted to a Godot [RigidBody3D] node, if this value is zero, then the inertia will be calculated automatically.  
         */
        get inertia_diagonal(): Vector3
        set inertia_diagonal(value: Vector3)
        
        /** The inertia orientation of the physics body. This defines the rotation of the inertia's principle axes relative to the object's local axes. This is only used when the body type is "rigid" or "vehicle" and [member inertia_diagonal] is set to a non-zero value. */
        get inertia_orientation(): Quaternion
        set inertia_orientation(value: Quaternion)
        
        /** The inertia tensor of the physics body, in kilogram meter squared (kg⋅m²). This is only used when the body type is "rigid" or "vehicle".  
         *  When converted to a Godot [RigidBody3D] node, if this value is zero, then the inertia will be calculated automatically.  
         */
        get inertia_tensor(): Basis
        set inertia_tensor(value: Basis)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGLTFPhysicsBody;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGLTFPhysicsBody;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGLTFPhysicsShape extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGLTFPhysicsShape extends __NameMapResource {
    }
    /** Represents a glTF physics shape.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gltfphysicsshape.html  
     */
    class GLTFPhysicsShape extends Resource {
        constructor(identifier?: any)
        /** Creates a new GLTFPhysicsShape instance from the given Godot [CollisionShape3D] node. */
        static from_node(shape_node: CollisionShape3D): null | GLTFPhysicsShape
        
        /** Converts this GLTFPhysicsShape instance into a Godot [CollisionShape3D] node. */
        to_node(cache_shapes?: boolean /* = false */): null | CollisionShape3D
        
        /** Creates a new GLTFPhysicsShape instance from the given Godot [Shape3D] resource. */
        static from_resource(shape_resource: Shape3D): null | GLTFPhysicsShape
        
        /** Converts this GLTFPhysicsShape instance into a Godot [Shape3D] resource. */
        to_resource(cache_shapes?: boolean /* = false */): null | Shape3D
        
        /** Creates a new GLTFPhysicsShape instance by parsing the given [Dictionary]. */
        static from_dictionary(dictionary: GDictionary): null | GLTFPhysicsShape
        
        /** Serializes this GLTFPhysicsShape instance into a [Dictionary] in the format defined by `OMI_physics_shape`. */
        to_dictionary(): GDictionary
        
        /** The type of shape this shape represents. Valid values are `"box"`, `"capsule"`, `"cylinder"`, `"sphere"`, `"hull"`, and `"trimesh"`. */
        get shape_type(): string
        set shape_type(value: string)
        
        /** The size of the shape, in meters. This is only used when the shape type is `"box"`, and it represents the `"diameter"` of the box. This value should not be negative. */
        get size(): Vector3
        set size(value: Vector3)
        
        /** The radius of the shape, in meters. This is only used when the shape type is `"capsule"`, `"cylinder"`, or `"sphere"`. This value should not be negative. */
        get radius(): float64
        set radius(value: float64)
        
        /** The height of the shape, in meters. This is only used when the shape type is `"capsule"` or `"cylinder"`. This value should not be negative, and for `"capsule"` it should be at least twice the radius. */
        get height(): float64
        set height(value: float64)
        
        /** If `true`, indicates that this shape is a trigger. For Godot, this means that the shape should be a child of an [Area3D] node.  
         *  This is the only variable not used in the [method to_node] method, it's intended to be used alongside when deciding where to add the generated node as a child.  
         */
        get is_trigger(): boolean
        set is_trigger(value: boolean)
        
        /** The index of the shape's mesh in the glTF file. This is only used when the shape type is `"hull"` (convex hull) or `"trimesh"` (concave trimesh). */
        get mesh_index(): int64
        set mesh_index(value: int64)
        
        /** The [ImporterMesh] resource of the shape. This is only used when the shape type is `"hull"` (convex hull) or `"trimesh"` (concave trimesh). */
        get importer_mesh(): null | ImporterMesh
        set importer_mesh(value: null | ImporterMesh)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGLTFPhysicsShape;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGLTFPhysicsShape;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGLTFSkeleton extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGLTFSkeleton extends __NameMapResource {
    }
    /** @link https://docs.godotengine.org/en/4.6/classes/class_gltfskeleton.html */
    class GLTFSkeleton extends Resource {
        constructor(identifier?: any)
        get_godot_skeleton(): null | Skeleton3D
        get_bone_attachment_count(): int64
        get_bone_attachment(idx: int64): null | BoneAttachment3D
        get joints(): PackedInt32Array
        set joints(value: PackedInt32Array | int32[])
        get roots(): PackedInt32Array
        set roots(value: PackedInt32Array | int32[])
        get unique_names(): GArray
        set unique_names(value: GArray)
        get godot_bone_node(): GDictionary
        set godot_bone_node(value: GDictionary)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGLTFSkeleton;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGLTFSkeleton;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGLTFSkin extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGLTFSkin extends __NameMapResource {
    }
    /** @link https://docs.godotengine.org/en/4.6/classes/class_gltfskin.html */
    class GLTFSkin extends Resource {
        constructor(identifier?: any)
        get skin_root(): int64
        set skin_root(value: int64)
        get joints_original(): PackedInt32Array
        set joints_original(value: PackedInt32Array | int32[])
        get inverse_binds(): GArray
        set inverse_binds(value: GArray)
        get joints(): PackedInt32Array
        set joints(value: PackedInt32Array | int32[])
        get non_joints(): PackedInt32Array
        set non_joints(value: PackedInt32Array | int32[])
        get roots(): PackedInt32Array
        set roots(value: PackedInt32Array | int32[])
        get skeleton(): int64
        set skeleton(value: int64)
        get joint_i_to_bone_i(): GDictionary
        set joint_i_to_bone_i(value: GDictionary)
        get joint_i_to_name(): GDictionary
        set joint_i_to_name(value: GDictionary)
        get godot_skin(): null | Skin
        set godot_skin(value: null | Skin)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGLTFSkin;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGLTFSkin;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGLTFSpecGloss extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGLTFSpecGloss extends __NameMapResource {
    }
    /** Archived glTF extension for specular/glossy materials.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gltfspecgloss.html  
     */
    class GLTFSpecGloss extends Resource {
        constructor(identifier?: any)
        /** The diffuse texture. */
        get diffuse_img(): null | Object
        set diffuse_img(value: null | Object)
        
        /** The reflected diffuse factor of the material. */
        get diffuse_factor(): Color
        set diffuse_factor(value: Color)
        
        /** The glossiness or smoothness of the material. */
        get gloss_factor(): float64
        set gloss_factor(value: float64)
        
        /** The specular RGB color of the material. The alpha channel is unused. */
        get specular_factor(): Color
        set specular_factor(value: Color)
        
        /** The specular-glossiness texture. */
        get spec_gloss_img(): null | Object
        set spec_gloss_img(value: null | Object)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGLTFSpecGloss;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGLTFSpecGloss;
    }
    namespace GLTFState {
        enum HandleBinaryImageMode {
            /** When importing a glTF file with embedded binary images, discards all images and uses untextured materials in their place. Images stored as separate files in the `res://` folder are not affected by this; those will be used as Godot imported them. */
            HANDLE_BINARY_IMAGE_MODE_DISCARD_TEXTURES = 0,
            
            /** When importing a glTF file with embedded binary images, extracts them and saves them to their own files. This allows the image to be imported by Godot's image importer, which can then have their import options customized by the user, including optionally compressing the image to VRAM texture formats.  
             *  This will save the images's bytes exactly as-is, without recompression. For image formats supplied by glTF extensions, the file will have a filename ending with the file extension supplied by [method GLTFDocumentExtension._get_image_file_extension] of the extension class.  
             *      
             *  **Note:** This option is editor-only. At runtime, this acts the same as [constant HANDLE_BINARY_IMAGE_MODE_EMBED_AS_UNCOMPRESSED].  
             */
            HANDLE_BINARY_IMAGE_MODE_EXTRACT_TEXTURES = 1,
            
            /** When importing a glTF file with embedded binary images, embeds textures VRAM compressed with Basis Universal into the generated scene. Images stored as separate files in the `res://` folder are not affected by this; those will be used as Godot imported them. */
            HANDLE_BINARY_IMAGE_MODE_EMBED_AS_BASISU = 2,
            
            /** When importing a glTF file with embedded binary images, embeds textures compressed losslessly into the generated scene. Images stored as separate files in the `res://` folder are not affected by this; those will be used as Godot imported them. */
            HANDLE_BINARY_IMAGE_MODE_EMBED_AS_UNCOMPRESSED = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGLTFState extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGLTFState extends __NameMapResource {
    }
    /** Represents all data of a glTF file.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gltfstate.html  
     */
    class GLTFState extends Resource {
        /** Discards all embedded textures and uses untextured materials. */
        static readonly HANDLE_BINARY_DISCARD_TEXTURES = 0
        
        /** Extracts embedded textures to be reimported and compressed. Editor only. Acts as uncompressed at runtime. */
        static readonly HANDLE_BINARY_EXTRACT_TEXTURES = 1
        
        /** Embeds textures VRAM compressed with Basis Universal into the generated scene. */
        static readonly HANDLE_BINARY_EMBED_AS_BASISU = 2
        
        /** Embeds textures compressed losslessly into the generated scene, matching old behavior. */
        static readonly HANDLE_BINARY_EMBED_AS_UNCOMPRESSED = 3
        constructor(identifier?: any)
        
        /** Appends an extension to the list of extensions used by this glTF file during serialization. If [param required] is `true`, the extension will also be added to the list of required extensions. Do not run this in [method GLTFDocumentExtension._export_post], as that stage is too late to add extensions. The final list is sorted alphabetically. */
        add_used_extension(extension_name: string, required: boolean): void
        
        /** Appends the given byte array [param data] to the buffers and creates a [GLTFBufferView] for it. The index of the destination [GLTFBufferView] is returned. If [param deduplication] is `true`, the buffers are first searched for duplicate data, otherwise new bytes are always appended. */
        append_data_to_buffers(data: PackedByteArray | byte[] | ArrayBuffer, deduplication: boolean): int64
        
        /** Appends the given [GLTFNode] to the state, and returns its new index. This can be used to export one Godot node as multiple glTF nodes, or inject new glTF nodes at import time. On import, this must be called before [method GLTFDocumentExtension._generate_scene_node] finishes for the parent node. On export, this must be called before [method GLTFDocumentExtension._export_node] runs for the parent node.  
         *  The [param godot_scene_node] parameter is the Godot scene node that corresponds to this glTF node. This is highly recommended to be set to a valid node, but may be `null` if there is no corresponding Godot scene node. One Godot scene node may be used for multiple glTF nodes, so if exporting multiple glTF nodes for one Godot scene node, use the same Godot scene node for each.  
         *  The [param parent_node_index] parameter is the index of the parent [GLTFNode] in the state. If `-1`, the node will be a root node, otherwise the new node will be added to the parent's list of children. The index will also be written to the [member GLTFNode.parent] property of the new node.  
         */
        append_gltf_node(gltf_node: GLTFNode, godot_scene_node: Node, parent_node_index: int64): int64
        
        /** Returns the number of [AnimationPlayer] nodes in this [GLTFState]. These nodes are only used during the export process when converting Godot [AnimationPlayer] nodes to glTF animations. */
        get_animation_players_count(anim_player_index: int64): int64
        
        /** Returns the [AnimationPlayer] node with the given index. These nodes are only used during the export process when converting Godot [AnimationPlayer] nodes to glTF animations. */
        get_animation_player(anim_player_index: int64): null | AnimationPlayer
        
        /** Returns the Godot scene node that corresponds to the same index as the [GLTFNode] it was generated from. This is the inverse of [method get_node_index]. Useful during the import process.  
         *      
         *  **Note:** Not every [GLTFNode] will have a scene node generated, and not every generated scene node will have a corresponding [GLTFNode]. If there is no scene node for this [GLTFNode] index, `null` is returned.  
         */
        get_scene_node(gltf_node_index: int64): null | Node
        
        /** Returns the index of the [GLTFNode] corresponding to this Godot scene node. This is the inverse of [method get_scene_node]. Useful during the export process.  
         *      
         *  **Note:** Not every Godot scene node will have a corresponding [GLTFNode], and not every [GLTFNode] will have a scene node generated. If there is no [GLTFNode] index for this scene node, `-1` is returned.  
         */
        get_node_index(scene_node: Node): int64
        
        /** Gets additional arbitrary data in this [GLTFState] instance. This can be used to keep per-file state data in [GLTFDocumentExtension] classes, which is important because they are stateless.  
         *  The argument should be the [GLTFDocumentExtension] name (does not have to match the extension name in the glTF file), and the return value can be anything you set. If nothing was set, the return value is `null`.  
         */
        get_additional_data(extension_name: StringName): any
        
        /** Sets additional arbitrary data in this [GLTFState] instance. This can be used to keep per-file state data in [GLTFDocumentExtension] classes, which is important because they are stateless.  
         *  The first argument should be the [GLTFDocumentExtension] name (does not have to match the extension name in the glTF file), and the second argument can be anything you want.  
         */
        set_additional_data(extension_name: StringName, additional_data: any): void
        
        /** The original raw JSON document corresponding to this GLTFState. */
        get json(): GDictionary
        set json(value: GDictionary)
        get major_version(): int64
        set major_version(value: int64)
        get minor_version(): int64
        set minor_version(value: int64)
        
        /** The copyright string in the asset header of the glTF file. This is set during import if present and export if non-empty. See the glTF asset header documentation for more information. */
        get copyright(): string
        set copyright(value: string)
        
        /** The binary buffer attached to a .glb file. */
        get glb_data(): PackedByteArray
        set glb_data(value: PackedByteArray | byte[] | ArrayBuffer)
        get use_named_skin_binds(): boolean
        set use_named_skin_binds(value: boolean)
        get nodes(): GArray
        set nodes(value: GArray)
        get buffers(): GArray
        set buffers(value: GArray)
        get buffer_views(): GArray
        set buffer_views(value: GArray)
        get accessors(): GArray
        set accessors(value: GArray)
        get meshes(): GArray
        set meshes(value: GArray)
        get materials(): GArray
        set materials(value: GArray)
        
        /** The name of the scene. When importing, if not specified, this will be the file name. When exporting, if specified, the scene name will be saved to the glTF file. */
        get scene_name(): string
        set scene_name(value: string)
        
        /** The folder path associated with this glTF data. This is used to find other files the glTF file references, like images or binary buffers. This will be set during import when appending from a file, and will be set during export when writing to a file. */
        get base_path(): string
        set base_path(value: string)
        
        /** The file name associated with this glTF data. If it ends with `.gltf`, this is text-based glTF, otherwise this is binary GLB. This will be set during import when appending from a file, and will be set during export when writing to a file. If writing to a buffer, this will be an empty string. */
        get filename(): string
        set filename(value: string)
        
        /** The root nodes of the glTF file. Typically, a glTF file will only have one scene, and therefore one root node. However, a glTF file may have multiple scenes and therefore multiple root nodes, which will be generated as siblings of each other and as children of the root node of the generated Godot scene. */
        get root_nodes(): PackedInt32Array
        set root_nodes(value: PackedInt32Array | int32[])
        get textures(): GArray
        set textures(value: GArray)
        get texture_samplers(): GArray
        set texture_samplers(value: GArray)
        get images(): GArray
        set images(value: GArray)
        get skins(): GArray
        set skins(value: GArray)
        get cameras(): GArray
        set cameras(value: GArray)
        get lights(): GArray
        set lights(value: GArray)
        get unique_names(): GArray
        set unique_names(value: GArray)
        get unique_animation_names(): GArray
        set unique_animation_names(value: GArray)
        get skeletons(): GArray
        set skeletons(value: GArray)
        get create_animations(): boolean
        set create_animations(value: boolean)
        
        /** If `true`, forces all GLTFNodes in the document to be bones of a single [Skeleton3D] Godot node. */
        get import_as_skeleton_bones(): boolean
        set import_as_skeleton_bones(value: boolean)
        get animations(): GArray
        set animations(value: GArray)
        
        /** When importing a glTF file with unimported raw binary images embedded inside of binary blob buffers, in data URIs, or separate files not imported by Godot, this controls how the images are handled. Images can be discarded, saved as separate files, or embedded in the scene lossily or losslessly. See [enum HandleBinaryImageMode] for options.  
         *  This property does nothing for image files in the `res://` folder imported by Godot, as those are handled by Godot's image importer directly, and then the Godot scene generated from the glTF file will use the images as Godot imported them.  
         */
        get handle_binary_image_mode(): int64
        set handle_binary_image_mode(value: int64)
        
        /** The baking fps of the animation for either import or export. */
        get bake_fps(): float64
        set bake_fps(value: float64)
        get handle_binary_image(): int64
        set handle_binary_image(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGLTFState;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGLTFState;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGLTFTexture extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGLTFTexture extends __NameMapResource {
    }
    /** GLTFTexture represents a texture in a glTF file.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gltftexture.html  
     */
    class GLTFTexture extends Resource {
        constructor(identifier?: any)
        /** The index of the image associated with this texture, see [method GLTFState.get_images]. If -1, then this texture does not have an image assigned. */
        get src_image(): int64
        set src_image(value: int64)
        
        /** ID of the texture sampler to use when sampling the image. If -1, then the default texture sampler is used (linear filtering, and repeat wrapping in both axes). */
        get sampler(): int64
        set sampler(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGLTFTexture;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGLTFTexture;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGLTFTextureSampler extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGLTFTextureSampler extends __NameMapResource {
    }
    /** Represents a glTF texture sampler  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gltftexturesampler.html  
     */
    class GLTFTextureSampler extends Resource {
        constructor(identifier?: any)
        /** Texture's magnification filter, used when texture appears larger on screen than the source image. */
        get mag_filter(): int64
        set mag_filter(value: int64)
        
        /** Texture's minification filter, used when the texture appears smaller on screen than the source image. */
        get min_filter(): int64
        set min_filter(value: int64)
        
        /** Wrapping mode to use for S-axis (horizontal) texture coordinates. */
        get wrap_s(): int64
        set wrap_s(value: int64)
        
        /** Wrapping mode to use for T-axis (vertical) texture coordinates. */
        get wrap_t(): int64
        set wrap_t(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGLTFTextureSampler;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGLTFTextureSampler;
    }
    namespace GPUParticles2D {
        enum DrawOrder {
            /** Particles are drawn in the order emitted. */
            DRAW_ORDER_INDEX = 0,
            
            /** Particles are drawn in order of remaining lifetime. In other words, the particle with the highest lifetime is drawn at the front. */
            DRAW_ORDER_LIFETIME = 1,
            
            /** Particles are drawn in reverse order of remaining lifetime. In other words, the particle with the lowest lifetime is drawn at the front. */
            DRAW_ORDER_REVERSE_LIFETIME = 2,
        }
        enum EmitFlags {
            /** Particle starts at the specified position. */
            EMIT_FLAG_POSITION = 1,
            
            /** Particle starts with specified rotation and scale. */
            EMIT_FLAG_ROTATION_SCALE = 2,
            
            /** Particle starts with the specified velocity vector, which defines the emission direction and speed. */
            EMIT_FLAG_VELOCITY = 4,
            
            /** Particle starts with specified color. */
            EMIT_FLAG_COLOR = 8,
            
            /** Particle starts with specified `CUSTOM` data. */
            EMIT_FLAG_CUSTOM = 16,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGPUParticles2D extends __RPCMapNode2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGPUParticles2D extends __NameMapNode2D {
    }
    /** A 2D particle emitter.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gpuparticles2d.html  
     */
    class GPUParticles2D<Map extends NodePathMap = any> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Requests the particles to process for extra process time during a single frame.  
         *  Useful for particle playback, if used in combination with [member use_fixed_seed] or by calling [method restart] with parameter `keep_seed` set to `true`.  
         */
        request_particles_process(process_time: float64): void
        
        /** Returns a rectangle containing the positions of all existing particles.  
         *      
         *  **Note:** When using threaded rendering this method synchronizes the rendering thread. Calling it often may have a negative impact on performance.  
         */
        capture_rect(): Rect2
        
        /** Restarts the particle emission cycle, clearing existing particles. To avoid particles vanishing from the viewport, wait for the [signal finished] signal before calling.  
         *      
         *  **Note:** The [signal finished] signal is only emitted by [member one_shot] emitters.  
         *  If [param keep_seed] is `true`, the current random seed will be preserved. Useful for seeking and playback.  
         */
        restart(keep_seed?: boolean /* = false */): void
        
        /** Emits a single particle. Whether [param xform], [param velocity], [param color] and [param custom] are applied depends on the value of [param flags]. See [enum EmitFlags].  
         *  The default ParticleProcessMaterial will overwrite [param color] and use the contents of [param custom] as `(rotation, age, animation, lifetime)`.  
         *      
         *  **Note:** [method emit_particle] is only supported on the Forward+ and Mobile rendering methods, not Compatibility.  
         */
        emit_particle(xform: Transform2D, velocity: Vector2, color: Color, custom: Color, flags: int64): void
        
        /** Sets this node's properties to match a given [CPUParticles2D] node. */
        convert_from_particles(particles: Node): void
        
        /** If `true`, particles are being emitted. [member emitting] can be used to start and stop particles from emitting. However, if [member one_shot] is `true` setting [member emitting] to `true` will not restart the emission cycle unless all active particles have finished processing. Use the [signal finished] signal to be notified once all active particles finish processing.  
         *      
         *  **Note:** For [member one_shot] emitters, due to the particles being computed on the GPU, there may be a short period after receiving the [signal finished] signal during which setting this to `true` will not restart the emission cycle.  
         *  **Tip:** If your [member one_shot] emitter needs to immediately restart emitting particles once [signal finished] signal is received, consider calling [method restart] instead of setting [member emitting].  
         */
        get emitting(): boolean
        set emitting(value: boolean)
        
        /** The number of particles to emit in one emission cycle. The effective emission rate is `(amount * amount_ratio) / lifetime` particles per second. Higher values will increase GPU requirements, even if not all particles are visible at a given time or if [member amount_ratio] is decreased.  
         *      
         *  **Note:** Changing this value will cause the particle system to restart. To avoid this, change [member amount_ratio] instead.  
         */
        get amount(): int64
        set amount(value: int64)
        
        /** The ratio of particles that should actually be emitted. If set to a value lower than `1.0`, this will set the amount of emitted particles throughout the lifetime to `amount * amount_ratio`. Unlike changing [member amount], changing [member amount_ratio] while emitting does not affect already-emitted particles and doesn't cause the particle system to restart. [member amount_ratio] can be used to create effects that make the number of emitted particles vary over time.  
         *      
         *  **Note:** Reducing the [member amount_ratio] has no performance benefit, since resources need to be allocated and processed for the total [member amount] of particles regardless of the [member amount_ratio]. If you don't intend to change the number of particles emitted while the particles are emitting, make sure [member amount_ratio] is set to `1` and change [member amount] to your liking instead.  
         */
        get amount_ratio(): float64
        set amount_ratio(value: float64)
        
        /** Path to another [GPUParticles2D] node that will be used as a subemitter (see [member ParticleProcessMaterial.sub_emitter_mode]). Subemitters can be used to achieve effects such as fireworks, sparks on collision, bubbles popping into water drops, and more.  
         *      
         *  **Note:** When [member sub_emitter] is set, the target [GPUParticles2D] node will no longer emit particles on its own.  
         */
        get sub_emitter(): NodePath
        set sub_emitter(value: NodePath | string)
        
        /** Particle texture. If `null`, particles will be squares with a size of 1×1 pixels.  
         *      
         *  **Note:** To use a flipbook texture, assign a new [CanvasItemMaterial] to the [GPUParticles2D]'s [member CanvasItem.material] property, then enable [member CanvasItemMaterial.particles_animation] and set [member CanvasItemMaterial.particles_anim_h_frames], [member CanvasItemMaterial.particles_anim_v_frames], and [member CanvasItemMaterial.particles_anim_loop] to match the flipbook texture.  
         */
        get texture(): null | Texture2D
        set texture(value: null | Texture2D)
        
        /** The amount of time each particle will exist (in seconds). The effective emission rate is `(amount * amount_ratio) / lifetime` particles per second. */
        get lifetime(): float64
        set lifetime(value: float64)
        
        /** Causes all the particles in this node to interpolate towards the end of their lifetime.  
         *      
         *  **Note:** This only works when used with a [ParticleProcessMaterial]. It needs to be manually implemented for custom process shaders.  
         */
        get interp_to_end(): float64
        set interp_to_end(value: float64)
        
        /** If `true`, only one emission cycle occurs. If set `true` during a cycle, emission will stop at the cycle's end. */
        get one_shot(): boolean
        set one_shot(value: boolean)
        
        /** Particle system starts as if it had already run for this many seconds.  
         *      
         *  **Note:** This can be very expensive if set to a high number as it requires running the particle shader a number of times equal to the [member fixed_fps] (or 30, if [member fixed_fps] is 0) for every second. In extreme cases it can even lead to a GPU crash due to the volume of work done in a single frame.  
         */
        get preprocess(): float64
        set preprocess(value: float64)
        
        /** Particle system's running speed scaling ratio. A value of `0` can be used to pause the particles. */
        get speed_scale(): float64
        set speed_scale(value: float64)
        
        /** How rapidly particles in an emission cycle are emitted. If greater than `0`, there will be a gap in emissions before the next cycle begins. */
        get explosiveness(): float64
        set explosiveness(value: float64)
        
        /** Emission lifetime randomness ratio. */
        get randomness(): float64
        set randomness(value: float64)
        
        /** If `true`, particles will use the same seed for every simulation using the seed defined in [member seed]. This is useful for situations where the visual outcome should be consistent across replays, for example when using Movie Maker mode. */
        get use_fixed_seed(): boolean
        set use_fixed_seed(value: boolean)
        
        /** Sets the random seed used by the particle system. Only effective if [member use_fixed_seed] is `true`. */
        get seed(): int64
        set seed(value: int64)
        
        /** The particle system's frame rate is fixed to a value. For example, changing the value to 2 will make the particles render at 2 frames per second. Note this does not slow down the simulation of the particle system itself. */
        get fixed_fps(): int64
        set fixed_fps(value: int64)
        
        /** Enables particle interpolation, which makes the particle movement smoother when their [member fixed_fps] is lower than the screen refresh rate. */
        get interpolate(): boolean
        set interpolate(value: boolean)
        
        /** If `true`, results in fractional delta calculation which has a smoother particles display effect. */
        get fract_delta(): boolean
        set fract_delta(value: boolean)
        
        /** Multiplier for particle's collision radius. `1.0` corresponds to the size of the sprite. If particles appear to sink into the ground when colliding, increase this value. If particles appear to float when colliding, decrease this value. Only effective if [member ParticleProcessMaterial.collision_mode] is [constant ParticleProcessMaterial.COLLISION_RIGID] or [constant ParticleProcessMaterial.COLLISION_HIDE_ON_CONTACT].  
         *      
         *  **Note:** Particles always have a spherical collision shape.  
         */
        get collision_base_size(): float64
        set collision_base_size(value: float64)
        
        /** The [Rect2] that determines the node's region which needs to be visible on screen for the particle system to be active.  
         *  Grow the rect if particles suddenly appear/disappear when the node enters/exits the screen. The [Rect2] can be grown via code or with the **Particles → Generate Visibility Rect** editor tool.  
         */
        get visibility_rect(): Rect2
        set visibility_rect(value: Rect2)
        
        /** If `true`, particles use the parent node's coordinate space (known as local coordinates). This will cause particles to move and rotate along the [GPUParticles2D] node (and its parents) when it is moved or rotated. If `false`, particles use global coordinates; they will not move or rotate along the [GPUParticles2D] node (and its parents) when it is moved or rotated. */
        get local_coords(): boolean
        set local_coords(value: boolean)
        
        /** Particle draw order. */
        get draw_order(): int64
        set draw_order(value: int64)
        
        /** If `true`, enables particle trails using a mesh skinning system.  
         *      
         *  **Note:** Unlike [GPUParticles3D], the number of trail sections and subdivisions is set with the [member trail_sections] and [member trail_section_subdivisions] properties.  
         */
        get trail_enabled(): boolean
        set trail_enabled(value: boolean)
        
        /** The amount of time the particle's trail should represent (in seconds). Only effective if [member trail_enabled] is `true`. */
        get trail_lifetime(): float64
        set trail_lifetime(value: float64)
        
        /** The number of sections to use for the particle trail rendering. Higher values can result in smoother trail curves, at the cost of performance due to increased mesh complexity. See also [member trail_section_subdivisions]. Only effective if [member trail_enabled] is `true`. */
        get trail_sections(): int64
        set trail_sections(value: int64)
        
        /** The number of subdivisions to use for the particle trail rendering. Higher values can result in smoother trail curves, at the cost of performance due to increased mesh complexity. See also [member trail_sections]. Only effective if [member trail_enabled] is `true`. */
        get trail_section_subdivisions(): int64
        set trail_section_subdivisions(value: int64)
        
        /** [Material] for processing particles. Can be a [ParticleProcessMaterial] or a [ShaderMaterial]. */
        get process_material(): null | ParticleProcessMaterial | ShaderMaterial
        set process_material(value: null | ParticleProcessMaterial | ShaderMaterial)
        
        /** Emitted when all active particles have finished processing. To immediately restart the emission cycle, call [method restart].  
         *  This signal is never emitted when [member one_shot] is disabled, as particles will be emitted and processed continuously.  
         *      
         *  **Note:** For [member one_shot] emitters, due to the particles being computed on the GPU, there may be a short period after receiving the signal during which setting [member emitting] to `true` will not restart the emission cycle. This delay is avoided by instead calling [method restart].  
         */
        readonly finished: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGPUParticles2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGPUParticles2D;
    }
    namespace GPUParticles3D {
        enum DrawOrder {
            /** Particles are drawn in the order emitted. */
            DRAW_ORDER_INDEX = 0,
            
            /** Particles are drawn in order of remaining lifetime. In other words, the particle with the highest lifetime is drawn at the front. */
            DRAW_ORDER_LIFETIME = 1,
            
            /** Particles are drawn in reverse order of remaining lifetime. In other words, the particle with the lowest lifetime is drawn at the front. */
            DRAW_ORDER_REVERSE_LIFETIME = 2,
            
            /** Particles are drawn in order of depth. */
            DRAW_ORDER_VIEW_DEPTH = 3,
        }
        enum EmitFlags {
            /** Particle starts at the specified position. */
            EMIT_FLAG_POSITION = 1,
            
            /** Particle starts with specified rotation and scale. */
            EMIT_FLAG_ROTATION_SCALE = 2,
            
            /** Particle starts with the specified velocity vector, which defines the emission direction and speed. */
            EMIT_FLAG_VELOCITY = 4,
            
            /** Particle starts with specified color. */
            EMIT_FLAG_COLOR = 8,
            
            /** Particle starts with specified `CUSTOM` data. */
            EMIT_FLAG_CUSTOM = 16,
        }
        enum TransformAlign {
            TRANSFORM_ALIGN_DISABLED = 0,
            TRANSFORM_ALIGN_Z_BILLBOARD = 1,
            TRANSFORM_ALIGN_Y_TO_VELOCITY = 2,
            TRANSFORM_ALIGN_Z_BILLBOARD_Y_TO_VELOCITY = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGPUParticles3D extends __RPCMapGeometryInstance3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGPUParticles3D extends __NameMapGeometryInstance3D {
    }
    /** A 3D particle emitter.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gpuparticles3d.html  
     */
    class GPUParticles3D<Map extends NodePathMap = any> extends GeometryInstance3D<Map> {
        /** Maximum number of draw passes supported. */
        static readonly MAX_DRAW_PASSES = 4
        constructor(identifier?: any)
        
        /** Sets the [Mesh] that is drawn at index [param pass]. */
        set_draw_pass_mesh(pass: int64, mesh: Mesh): void
        
        /** Returns the [Mesh] that is drawn at index [param pass]. */
        get_draw_pass_mesh(pass: int64): null | Mesh
        
        /** Restarts the particle emission cycle, clearing existing particles. To avoid particles vanishing from the viewport, wait for the [signal finished] signal before calling.  
         *      
         *  **Note:** The [signal finished] signal is only emitted by [member one_shot] emitters.  
         *  If [param keep_seed] is `true`, the current random seed will be preserved. Useful for seeking and playback.  
         */
        restart(keep_seed?: boolean /* = false */): void
        
        /** Returns the axis-aligned bounding box that contains all the particles that are active in the current frame. */
        capture_aabb(): AABB
        
        /** Emits a single particle. Whether [param xform], [param velocity], [param color] and [param custom] are applied depends on the value of [param flags]. See [enum EmitFlags].  
         *  The default ParticleProcessMaterial will overwrite [param color] and use the contents of [param custom] as `(rotation, age, animation, lifetime)`.  
         *      
         *  **Note:** [method emit_particle] is only supported on the Forward+ and Mobile rendering methods, not Compatibility.  
         */
        emit_particle(xform: Transform3D, velocity: Vector3, color: Color, custom: Color, flags: int64): void
        
        /** Sets this node's properties to match a given [CPUParticles3D] node. */
        convert_from_particles(particles: Node): void
        
        /** Requests the particles to process for extra process time during a single frame.  
         *  Useful for particle playback, if used in combination with [member use_fixed_seed] or by calling [method restart] with parameter `keep_seed` set to `true`.  
         */
        request_particles_process(process_time: float64): void
        
        /** If `true`, particles are being emitted. [member emitting] can be used to start and stop particles from emitting. However, if [member one_shot] is `true` setting [member emitting] to `true` will not restart the emission cycle unless all active particles have finished processing. Use the [signal finished] signal to be notified once all active particles finish processing.  
         *      
         *  **Note:** For [member one_shot] emitters, due to the particles being computed on the GPU, there may be a short period after receiving the [signal finished] signal during which setting this to `true` will not restart the emission cycle.  
         *  **Tip:** If your [member one_shot] emitter needs to immediately restart emitting particles once [signal finished] signal is received, consider calling [method restart] instead of setting [member emitting].  
         */
        get emitting(): boolean
        set emitting(value: boolean)
        
        /** The number of particles to emit in one emission cycle. The effective emission rate is `(amount * amount_ratio) / lifetime` particles per second. Higher values will increase GPU requirements, even if not all particles are visible at a given time or if [member amount_ratio] is decreased.  
         *      
         *  **Note:** Changing this value will cause the particle system to restart. To avoid this, change [member amount_ratio] instead.  
         */
        get amount(): int64
        set amount(value: int64)
        
        /** The ratio of particles that should actually be emitted. If set to a value lower than `1.0`, this will set the amount of emitted particles throughout the lifetime to `amount * amount_ratio`. Unlike changing [member amount], changing [member amount_ratio] while emitting does not affect already-emitted particles and doesn't cause the particle system to restart. [member amount_ratio] can be used to create effects that make the number of emitted particles vary over time.  
         *      
         *  **Note:** Reducing the [member amount_ratio] has no performance benefit, since resources need to be allocated and processed for the total [member amount] of particles regardless of the [member amount_ratio]. If you don't intend to change the number of particles emitted while the particles are emitting, make sure [member amount_ratio] is set to `1` and change [member amount] to your liking instead.  
         */
        get amount_ratio(): float64
        set amount_ratio(value: float64)
        
        /** Path to another [GPUParticles3D] node that will be used as a subemitter (see [member ParticleProcessMaterial.sub_emitter_mode]). Subemitters can be used to achieve effects such as fireworks, sparks on collision, bubbles popping into water drops, and more.  
         *      
         *  **Note:** When [member sub_emitter] is set, the target [GPUParticles3D] node will no longer emit particles on its own.  
         */
        get sub_emitter(): NodePath
        set sub_emitter(value: NodePath | string)
        
        /** The amount of time each particle will exist (in seconds). The effective emission rate is `(amount * amount_ratio) / lifetime` particles per second. */
        get lifetime(): float64
        set lifetime(value: float64)
        
        /** Causes all the particles in this node to interpolate towards the end of their lifetime.  
         *      
         *  **Note:** This only works when used with a [ParticleProcessMaterial]. It needs to be manually implemented for custom process shaders.  
         */
        get interp_to_end(): float64
        set interp_to_end(value: float64)
        
        /** If `true`, only the number of particles equal to [member amount] will be emitted. */
        get one_shot(): boolean
        set one_shot(value: boolean)
        
        /** Amount of time to preprocess the particles before animation starts. Lets you start the animation some time after particles have started emitting.  
         *      
         *  **Note:** This can be very expensive if set to a high number as it requires running the particle shader a number of times equal to the [member fixed_fps] (or 30, if [member fixed_fps] is 0) for every second. In extreme cases it can even lead to a GPU crash due to the volume of work done in a single frame.  
         */
        get preprocess(): float64
        set preprocess(value: float64)
        
        /** Speed scaling ratio. A value of `0` can be used to pause the particles. */
        get speed_scale(): float64
        set speed_scale(value: float64)
        
        /** Time ratio between each emission. If `0`, particles are emitted continuously. If `1`, all particles are emitted simultaneously. */
        get explosiveness(): float64
        set explosiveness(value: float64)
        
        /** Emission randomness ratio. */
        get randomness(): float64
        set randomness(value: float64)
        
        /** If `true`, particles will use the same seed for every simulation using the seed defined in [member seed]. This is useful for situations where the visual outcome should be consistent across replays, for example when using Movie Maker mode. */
        get use_fixed_seed(): boolean
        set use_fixed_seed(value: boolean)
        
        /** Sets the random seed used by the particle system. Only effective if [member use_fixed_seed] is `true`. */
        get seed(): int64
        set seed(value: int64)
        
        /** The particle system's frame rate is fixed to a value. For example, changing the value to 2 will make the particles render at 2 frames per second. Note this does not slow down the simulation of the particle system itself. */
        get fixed_fps(): int64
        set fixed_fps(value: int64)
        
        /** Enables particle interpolation, which makes the particle movement smoother when their [member fixed_fps] is lower than the screen refresh rate. */
        get interpolate(): boolean
        set interpolate(value: boolean)
        
        /** If `true`, results in fractional delta calculation which has a smoother particles display effect. */
        get fract_delta(): boolean
        set fract_delta(value: boolean)
        
        /** The base diameter for particle collision in meters. If particles appear to sink into the ground when colliding, increase this value. If particles appear to float when colliding, decrease this value. Only effective if [member ParticleProcessMaterial.collision_mode] is [constant ParticleProcessMaterial.COLLISION_RIGID] or [constant ParticleProcessMaterial.COLLISION_HIDE_ON_CONTACT].  
         *      
         *  **Note:** Particles always have a spherical collision shape.  
         */
        get collision_base_size(): float64
        set collision_base_size(value: float64)
        
        /** The [AABB] that determines the node's region which needs to be visible on screen for the particle system to be active. [member GeometryInstance3D.extra_cull_margin] is added on each of the AABB's axes. Particle collisions and attraction will only occur within this area.  
         *  Grow the box if particles suddenly appear/disappear when the node enters/exits the screen. The [AABB] can be grown via code or with the **Particles → Generate AABB** editor tool.  
         *      
         *  **Note:** [member visibility_aabb] is overridden by [member GeometryInstance3D.custom_aabb] if that property is set to a non-default value.  
         */
        get visibility_aabb(): AABB
        set visibility_aabb(value: AABB)
        
        /** If `true`, particles use the parent node's coordinate space (known as local coordinates). This will cause particles to move and rotate along the [GPUParticles3D] node (and its parents) when it is moved or rotated. If `false`, particles use global coordinates; they will not move or rotate along the [GPUParticles3D] node (and its parents) when it is moved or rotated. */
        get local_coords(): boolean
        set local_coords(value: boolean)
        
        /** Particle draw order.  
         *      
         *  **Note:** [constant DRAW_ORDER_INDEX] is the only option that supports motion vectors for effects like TAA. It is suggested to use this draw order if the particles are opaque to fix ghosting artifacts.  
         */
        get draw_order(): int64
        set draw_order(value: int64)
        get transform_align(): int64
        set transform_align(value: int64)
        
        /** If `true`, enables particle trails using a mesh skinning system. Designed to work with [RibbonTrailMesh] and [TubeTrailMesh].  
         *      
         *  **Note:** [member BaseMaterial3D.use_particle_trails] must also be enabled on the particle mesh's material. Otherwise, setting [member trail_enabled] to `true` will have no effect.  
         *      
         *  **Note:** Unlike [GPUParticles2D], the number of trail sections and subdivisions is set in the [RibbonTrailMesh] or the [TubeTrailMesh]'s properties.  
         */
        get trail_enabled(): boolean
        set trail_enabled(value: boolean)
        
        /** The amount of time the particle's trail should represent (in seconds). Only effective if [member trail_enabled] is `true`. */
        get trail_lifetime(): float64
        set trail_lifetime(value: float64)
        
        /** [Material] for processing particles. Can be a [ParticleProcessMaterial] or a [ShaderMaterial]. */
        get process_material(): null | ParticleProcessMaterial | ShaderMaterial
        set process_material(value: null | ParticleProcessMaterial | ShaderMaterial)
        
        /** The number of draw passes when rendering particles. */
        get draw_passes(): int64
        set draw_passes(value: int64)
        
        /** [Mesh] that is drawn for the first draw pass. */
        get draw_pass_1(): null | Mesh
        set draw_pass_1(value: null | Mesh)
        
        /** [Mesh] that is drawn for the second draw pass. */
        get draw_pass_2(): null | Mesh
        set draw_pass_2(value: null | Mesh)
        
        /** [Mesh] that is drawn for the third draw pass. */
        get draw_pass_3(): null | Mesh
        set draw_pass_3(value: null | Mesh)
        
        /** [Mesh] that is drawn for the fourth draw pass. */
        get draw_pass_4(): null | Mesh
        set draw_pass_4(value: null | Mesh)
        get draw_skin(): null | Skin
        set draw_skin(value: null | Skin)
        
        /** Emitted when all active particles have finished processing. To immediately restart the emission cycle, call [method restart].  
         *  This signal is never emitted when [member one_shot] is disabled, as particles will be emitted and processed continuously.  
         *      
         *  **Note:** For [member one_shot] emitters, due to the particles being computed on the GPU, there may be a short period after receiving the signal during which setting [member emitting] to `true` will not restart the emission cycle. This delay is avoided by instead calling [method restart].  
         */
        readonly finished: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGPUParticles3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGPUParticles3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGPUParticlesAttractor3D extends __RPCMapVisualInstance3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGPUParticlesAttractor3D extends __NameMapVisualInstance3D {
    }
    /** Abstract base class for 3D particle attractors.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gpuparticlesattractor3d.html  
     */
    class GPUParticlesAttractor3D<Map extends NodePathMap = any> extends VisualInstance3D<Map> {
        constructor(identifier?: any)
        /** Adjusts the strength of the attractor. If [member strength] is negative, particles will be pushed in the opposite direction. Particles will be pushed  *away*  from the attractor's origin if [member directionality] is `0.0`, or towards local +Z if [member directionality] is greater than `0.0`. */
        get strength(): float64
        set strength(value: float64)
        
        /** The particle attractor's attenuation. Higher values result in more gradual pushing of particles as they come closer to the attractor's origin. Zero or negative values will cause particles to be pushed very fast as soon as the touch the attractor's edges. */
        get attenuation(): float64
        set attenuation(value: float64)
        
        /** Adjusts how directional the attractor is. At `0.0`, the attractor is not directional at all: it will attract particles towards its center. At `1.0`, the attractor is fully directional: particles will always be pushed towards local -Z (or +Z if [member strength] is negative).  
         *      
         *  **Note:** If [member directionality] is greater than `0.0`, the direction in which particles are pushed can be changed by rotating the [GPUParticlesAttractor3D] node.  
         */
        get directionality(): float64
        set directionality(value: float64)
        
        /** The particle rendering layers ([member VisualInstance3D.layers]) that will be affected by the attractor. By default, all particles are affected by an attractor.  
         *  After configuring particle nodes accordingly, specific layers can be unchecked to prevent certain particles from being affected by attractors. For example, this can be used if you're using an attractor as part of a spell effect but don't want the attractor to affect unrelated weather particles at the same position.  
         *  Particle attraction can also be disabled on a per-process material basis by setting [member ParticleProcessMaterial.attractor_interaction_enabled] on the [GPUParticles3D] node.  
         */
        get cull_mask(): int64
        set cull_mask(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGPUParticlesAttractor3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGPUParticlesAttractor3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGPUParticlesAttractorBox3D extends __RPCMapGPUParticlesAttractor3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGPUParticlesAttractorBox3D extends __NameMapGPUParticlesAttractor3D {
    }
    /** A box-shaped attractor that influences particles from [GPUParticles3D] nodes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gpuparticlesattractorbox3d.html  
     */
    class GPUParticlesAttractorBox3D<Map extends NodePathMap = any> extends GPUParticlesAttractor3D<Map> {
        constructor(identifier?: any)
        /** The attractor box's size in 3D units. */
        get size(): Vector3
        set size(value: Vector3)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGPUParticlesAttractorBox3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGPUParticlesAttractorBox3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGPUParticlesAttractorSphere3D extends __RPCMapGPUParticlesAttractor3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGPUParticlesAttractorSphere3D extends __NameMapGPUParticlesAttractor3D {
    }
    /** A spheroid-shaped attractor that influences particles from [GPUParticles3D] nodes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gpuparticlesattractorsphere3d.html  
     */
    class GPUParticlesAttractorSphere3D<Map extends NodePathMap = any> extends GPUParticlesAttractor3D<Map> {
        constructor(identifier?: any)
        /** The attractor sphere's radius in 3D units.  
         *      
         *  **Note:** Stretched ellipses can be obtained by using non-uniform scaling on the [GPUParticlesAttractorSphere3D] node.  
         */
        get radius(): float64
        set radius(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGPUParticlesAttractorSphere3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGPUParticlesAttractorSphere3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGPUParticlesAttractorVectorField3D extends __RPCMapGPUParticlesAttractor3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGPUParticlesAttractorVectorField3D extends __NameMapGPUParticlesAttractor3D {
    }
    /** A box-shaped attractor with varying directions and strengths defined in it that influences particles from [GPUParticles3D] nodes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gpuparticlesattractorvectorfield3d.html  
     */
    class GPUParticlesAttractorVectorField3D<Map extends NodePathMap = any> extends GPUParticlesAttractor3D<Map> {
        constructor(identifier?: any)
        /** The size of the vector field box in 3D units. */
        get size(): Vector3
        set size(value: Vector3)
        
        /** The 3D texture to be used. Values are linearly interpolated between the texture's pixels.  
         *      
         *  **Note:** To get better performance, the 3D texture's resolution should reflect the [member size] of the attractor. Since particle attraction is usually low-frequency data, the texture can be kept at a low resolution such as 64×64×64.  
         */
        get texture(): null | Texture3D
        set texture(value: null | Texture3D)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGPUParticlesAttractorVectorField3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGPUParticlesAttractorVectorField3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGPUParticlesCollision3D extends __RPCMapVisualInstance3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGPUParticlesCollision3D extends __NameMapVisualInstance3D {
    }
    /** Abstract base class for 3D particle collision shapes affecting [GPUParticles3D] nodes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gpuparticlescollision3d.html  
     */
    class GPUParticlesCollision3D<Map extends NodePathMap = any> extends VisualInstance3D<Map> {
        constructor(identifier?: any)
        /** The particle rendering layers ([member VisualInstance3D.layers]) that will be affected by the collision shape. By default, all particles that have [member ParticleProcessMaterial.collision_mode] set to [constant ParticleProcessMaterial.COLLISION_RIGID] or [constant ParticleProcessMaterial.COLLISION_HIDE_ON_CONTACT] will be affected by a collision shape.  
         *  After configuring particle nodes accordingly, specific layers can be unchecked to prevent certain particles from being affected by colliders. For example, this can be used if you're using a collider as part of a spell effect but don't want the collider to affect unrelated weather particles at the same position.  
         *  Particle collision can also be disabled on a per-process material basis by setting [member ParticleProcessMaterial.collision_mode] on the [GPUParticles3D] node.  
         */
        get cull_mask(): int64
        set cull_mask(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGPUParticlesCollision3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGPUParticlesCollision3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGPUParticlesCollisionBox3D extends __RPCMapGPUParticlesCollision3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGPUParticlesCollisionBox3D extends __NameMapGPUParticlesCollision3D {
    }
    /** A box-shaped 3D particle collision shape affecting [GPUParticles3D] nodes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gpuparticlescollisionbox3d.html  
     */
    class GPUParticlesCollisionBox3D<Map extends NodePathMap = any> extends GPUParticlesCollision3D<Map> {
        constructor(identifier?: any)
        /** The collision box's size in 3D units. */
        get size(): Vector3
        set size(value: Vector3)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGPUParticlesCollisionBox3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGPUParticlesCollisionBox3D;
    }
    namespace GPUParticlesCollisionHeightField3D {
        enum Resolution {
            /** Generate a 256×256 heightmap. Intended for small-scale scenes, or larger scenes with no distant particles. */
            RESOLUTION_256 = 0,
            
            /** Generate a 512×512 heightmap. Intended for medium-scale scenes, or larger scenes with no distant particles. */
            RESOLUTION_512 = 1,
            
            /** Generate a 1024×1024 heightmap. Intended for large scenes with distant particles. */
            RESOLUTION_1024 = 2,
            
            /** Generate a 2048×2048 heightmap. Intended for very large scenes with distant particles. */
            RESOLUTION_2048 = 3,
            
            /** Generate a 4096×4096 heightmap. Intended for huge scenes with distant particles. */
            RESOLUTION_4096 = 4,
            
            /** Generate a 8192×8192 heightmap. Intended for gigantic scenes with distant particles. */
            RESOLUTION_8192 = 5,
            
            /** Represents the size of the [enum Resolution] enum. */
            RESOLUTION_MAX = 6,
        }
        enum UpdateMode {
            /** Only update the heightmap when the [GPUParticlesCollisionHeightField3D] node is moved, or when the camera moves if [member follow_camera_enabled] is `true`. An update can be forced by slightly moving the [GPUParticlesCollisionHeightField3D] in any direction, or by calling [method RenderingServer.particles_collision_height_field_update]. */
            UPDATE_MODE_WHEN_MOVED = 0,
            
            /** Update the heightmap every frame. This has a significant performance cost. This update should only be used when geometry that particles can collide with changes significantly during gameplay. */
            UPDATE_MODE_ALWAYS = 1,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGPUParticlesCollisionHeightField3D extends __RPCMapGPUParticlesCollision3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGPUParticlesCollisionHeightField3D extends __NameMapGPUParticlesCollision3D {
    }
    /** A real-time heightmap-shaped 3D particle collision shape affecting [GPUParticles3D] nodes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gpuparticlescollisionheightfield3d.html  
     */
    class GPUParticlesCollisionHeightField3D<Map extends NodePathMap = any> extends GPUParticlesCollision3D<Map> {
        constructor(identifier?: any)
        /** Based on [param value], enables or disables the specified layer in the [member heightfield_mask], given a [param layer_number] between `1` and `20`, inclusive. */
        set_heightfield_mask_value(layer_number: int64, value: boolean): void
        
        /** Returns `true` if the specified layer of the [member heightfield_mask] is enabled, given a [param layer_number] between `1` and `20`, inclusive. */
        get_heightfield_mask_value(layer_number: int64): boolean
        
        /** The collision heightmap's size in 3D units. To improve heightmap quality, [member size] should be set as small as possible while covering the parts of the scene you need. */
        get size(): Vector3
        set size(value: Vector3)
        
        /** Higher resolutions can represent small details more accurately in large scenes, at the cost of lower performance. If [member update_mode] is [constant UPDATE_MODE_ALWAYS], consider using the lowest resolution possible. */
        get resolution(): int64
        set resolution(value: int64)
        
        /** The update policy to use for the generated heightmap. */
        get update_mode(): int64
        set update_mode(value: int64)
        
        /** If `true`, the [GPUParticlesCollisionHeightField3D] will follow the current camera in global space. The [GPUParticlesCollisionHeightField3D] does not need to be a child of the [Camera3D] node for this to work.  
         *  Following the camera has a performance cost, as it will force the heightmap to update whenever the camera moves. Consider lowering [member resolution] to improve performance if [member follow_camera_enabled] is `true`.  
         */
        get follow_camera_enabled(): boolean
        set follow_camera_enabled(value: boolean)
        
        /** The visual layers to account for when updating the heightmap. Only [MeshInstance3D]s whose [member VisualInstance3D.layers] match with this [member heightfield_mask] will be included in the heightmap collision update. By default, all 20 user-visible layers are taken into account for updating the heightmap collision.  
         *      
         *  **Note:** Since the [member heightfield_mask] allows for 32 layers to be stored in total, there are an additional 12 layers that are only used internally by the engine and aren't exposed in the editor. Setting [member heightfield_mask] using a script allows you to toggle those reserved layers, which can be useful for editor plugins.  
         *  To adjust [member heightfield_mask] more easily using a script, use [method get_heightfield_mask_value] and [method set_heightfield_mask_value].  
         */
        get heightfield_mask(): int64
        set heightfield_mask(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGPUParticlesCollisionHeightField3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGPUParticlesCollisionHeightField3D;
    }
    namespace GPUParticlesCollisionSDF3D {
        enum Resolution {
            /** Bake a 16×16×16 signed distance field. This is the fastest option, but also the least precise. */
            RESOLUTION_16 = 0,
            
            /** Bake a 32×32×32 signed distance field. */
            RESOLUTION_32 = 1,
            
            /** Bake a 64×64×64 signed distance field. */
            RESOLUTION_64 = 2,
            
            /** Bake a 128×128×128 signed distance field. */
            RESOLUTION_128 = 3,
            
            /** Bake a 256×256×256 signed distance field. */
            RESOLUTION_256 = 4,
            
            /** Bake a 512×512×512 signed distance field. This is the slowest option, but also the most precise. */
            RESOLUTION_512 = 5,
            
            /** Represents the size of the [enum Resolution] enum. */
            RESOLUTION_MAX = 6,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGPUParticlesCollisionSDF3D extends __RPCMapGPUParticlesCollision3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGPUParticlesCollisionSDF3D extends __NameMapGPUParticlesCollision3D {
    }
    /** A baked signed distance field 3D particle collision shape affecting [GPUParticles3D] nodes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gpuparticlescollisionsdf3d.html  
     */
    class GPUParticlesCollisionSDF3D<Map extends NodePathMap = any> extends GPUParticlesCollision3D<Map> {
        constructor(identifier?: any)
        /** Based on [param value], enables or disables the specified layer in the [member bake_mask], given a [param layer_number] between 1 and 32. */
        set_bake_mask_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member bake_mask] is enabled, given a [param layer_number] between 1 and 32. */
        get_bake_mask_value(layer_number: int64): boolean
        
        /** The collision SDF's size in 3D units. To improve SDF quality, the [member size] should be set as small as possible while covering the parts of the scene you need. */
        get size(): Vector3
        set size(value: Vector3)
        
        /** The bake resolution to use for the signed distance field [member texture]. The texture must be baked again for changes to the [member resolution] property to be effective. Higher resolutions have a greater performance cost and take more time to bake. Higher resolutions also result in larger baked textures, leading to increased VRAM and storage space requirements. To improve performance and reduce bake times, use the lowest resolution possible for the object you're representing the collision of. */
        get resolution(): int64
        set resolution(value: int64)
        
        /** The collision shape's thickness. Unlike other particle colliders, [GPUParticlesCollisionSDF3D] is actually hollow on the inside. [member thickness] can be increased to prevent particles from tunneling through the collision shape at high speeds, or when the [GPUParticlesCollisionSDF3D] is moved. */
        get thickness(): float64
        set thickness(value: float64)
        
        /** The visual layers to account for when baking the particle collision SDF. Only [MeshInstance3D]s whose [member VisualInstance3D.layers] match with this [member bake_mask] will be included in the generated particle collision SDF. By default, all objects are taken into account for the particle collision SDF baking. */
        get bake_mask(): int64
        set bake_mask(value: int64)
        
        /** The 3D texture representing the signed distance field. */
        get texture(): null | Texture3D
        set texture(value: null | Texture3D)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGPUParticlesCollisionSDF3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGPUParticlesCollisionSDF3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGPUParticlesCollisionSphere3D extends __RPCMapGPUParticlesCollision3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGPUParticlesCollisionSphere3D extends __NameMapGPUParticlesCollision3D {
    }
    /** A sphere-shaped 3D particle collision shape affecting [GPUParticles3D] nodes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gpuparticlescollisionsphere3d.html  
     */
    class GPUParticlesCollisionSphere3D<Map extends NodePathMap = any> extends GPUParticlesCollision3D<Map> {
        constructor(identifier?: any)
        /** The collision sphere's radius in 3D units. */
        get radius(): float64
        set radius(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGPUParticlesCollisionSphere3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGPUParticlesCollisionSphere3D;
    }
    namespace Generic6DOFJoint3D {
        enum Param {
            /** The minimum difference between the pivot points' axes. */
            PARAM_LINEAR_LOWER_LIMIT = 0,
            
            /** The maximum difference between the pivot points' axes. */
            PARAM_LINEAR_UPPER_LIMIT = 1,
            
            /** A factor applied to the movement across the axes. The lower, the slower the movement. */
            PARAM_LINEAR_LIMIT_SOFTNESS = 2,
            
            /** The amount of restitution on the axes' movement. The lower, the more momentum gets lost. */
            PARAM_LINEAR_RESTITUTION = 3,
            
            /** The amount of damping that happens at the linear motion across the axes. */
            PARAM_LINEAR_DAMPING = 4,
            
            /** The velocity the linear motor will try to reach. */
            PARAM_LINEAR_MOTOR_TARGET_VELOCITY = 5,
            
            /** The maximum force the linear motor will apply while trying to reach the velocity target. */
            PARAM_LINEAR_MOTOR_FORCE_LIMIT = 6,
            PARAM_LINEAR_SPRING_STIFFNESS = 7,
            PARAM_LINEAR_SPRING_DAMPING = 8,
            PARAM_LINEAR_SPRING_EQUILIBRIUM_POINT = 9,
            
            /** The minimum rotation in negative direction to break loose and rotate around the axes. */
            PARAM_ANGULAR_LOWER_LIMIT = 10,
            
            /** The minimum rotation in positive direction to break loose and rotate around the axes. */
            PARAM_ANGULAR_UPPER_LIMIT = 11,
            
            /** The speed of all rotations across the axes. */
            PARAM_ANGULAR_LIMIT_SOFTNESS = 12,
            
            /** The amount of rotational damping across the axes. The lower, the more damping occurs. */
            PARAM_ANGULAR_DAMPING = 13,
            
            /** The amount of rotational restitution across the axes. The lower, the more restitution occurs. */
            PARAM_ANGULAR_RESTITUTION = 14,
            
            /** The maximum amount of force that can occur, when rotating around the axes. */
            PARAM_ANGULAR_FORCE_LIMIT = 15,
            
            /** When rotating across the axes, this error tolerance factor defines how much the correction gets slowed down. The lower, the slower. */
            PARAM_ANGULAR_ERP = 16,
            
            /** Target speed for the motor at the axes. */
            PARAM_ANGULAR_MOTOR_TARGET_VELOCITY = 17,
            
            /** Maximum acceleration for the motor at the axes. */
            PARAM_ANGULAR_MOTOR_FORCE_LIMIT = 18,
            PARAM_ANGULAR_SPRING_STIFFNESS = 19,
            PARAM_ANGULAR_SPRING_DAMPING = 20,
            PARAM_ANGULAR_SPRING_EQUILIBRIUM_POINT = 21,
            
            /** Represents the size of the [enum Param] enum. */
            PARAM_MAX = 22,
        }
        enum Flag {
            /** If enabled, linear motion is possible within the given limits. */
            FLAG_ENABLE_LINEAR_LIMIT = 0,
            
            /** If enabled, rotational motion is possible within the given limits. */
            FLAG_ENABLE_ANGULAR_LIMIT = 1,
            FLAG_ENABLE_LINEAR_SPRING = 3,
            FLAG_ENABLE_ANGULAR_SPRING = 2,
            
            /** If enabled, there is a rotational motor across these axes. */
            FLAG_ENABLE_MOTOR = 4,
            
            /** If enabled, there is a linear motor across these axes. */
            FLAG_ENABLE_LINEAR_MOTOR = 5,
            
            /** Represents the size of the [enum Flag] enum. */
            FLAG_MAX = 6,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGeneric6DOFJoint3D extends __RPCMapJoint3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGeneric6DOFJoint3D extends __NameMapJoint3D {
    }
    /** A physics joint that allows for complex movement and rotation between two 3D physics bodies.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_generic6dofjoint3d.html  
     */
    class Generic6DOFJoint3D<Map extends NodePathMap = any> extends Joint3D<Map> {
        constructor(identifier?: any)
        set_param_x(param: Generic6DOFJoint3D.Param, value: float64): void
        get_param_x(param: Generic6DOFJoint3D.Param): float64
        set_param_y(param: Generic6DOFJoint3D.Param, value: float64): void
        get_param_y(param: Generic6DOFJoint3D.Param): float64
        set_param_z(param: Generic6DOFJoint3D.Param, value: float64): void
        get_param_z(param: Generic6DOFJoint3D.Param): float64
        set_flag_x(flag: Generic6DOFJoint3D.Flag, value: boolean): void
        get_flag_x(flag: Generic6DOFJoint3D.Flag): boolean
        set_flag_y(flag: Generic6DOFJoint3D.Flag, value: boolean): void
        get_flag_y(flag: Generic6DOFJoint3D.Flag): boolean
        set_flag_z(flag: Generic6DOFJoint3D.Flag, value: boolean): void
        get_flag_z(flag: Generic6DOFJoint3D.Flag): boolean
        
        /** If `true`, the linear motion across the X axis is limited. */
        get "linear_limit_x/enabled"(): boolean
        set "linear_limit_x/enabled"(value: boolean)
        
        /** The maximum difference between the pivot points' X axis. */
        get "linear_limit_x/upper_distance"(): float64
        set "linear_limit_x/upper_distance"(value: float64)
        
        /** The minimum difference between the pivot points' X axis. */
        get "linear_limit_x/lower_distance"(): float64
        set "linear_limit_x/lower_distance"(value: float64)
        
        /** A factor applied to the movement across the X axis. The lower, the slower the movement. */
        get "linear_limit_x/softness"(): float64
        set "linear_limit_x/softness"(value: float64)
        
        /** The amount of restitution on the X axis movement. The lower, the more momentum gets lost. */
        get "linear_limit_x/restitution"(): float64
        set "linear_limit_x/restitution"(value: float64)
        
        /** The amount of damping that happens at the X motion. */
        get "linear_limit_x/damping"(): float64
        set "linear_limit_x/damping"(value: float64)
        
        /** If `true`, the linear motion across the Y axis is limited. */
        get "linear_limit_y/enabled"(): boolean
        set "linear_limit_y/enabled"(value: boolean)
        
        /** The maximum difference between the pivot points' Y axis. */
        get "linear_limit_y/upper_distance"(): float64
        set "linear_limit_y/upper_distance"(value: float64)
        
        /** The minimum difference between the pivot points' Y axis. */
        get "linear_limit_y/lower_distance"(): float64
        set "linear_limit_y/lower_distance"(value: float64)
        
        /** A factor applied to the movement across the Y axis. The lower, the slower the movement. */
        get "linear_limit_y/softness"(): float64
        set "linear_limit_y/softness"(value: float64)
        
        /** The amount of restitution on the Y axis movement. The lower, the more momentum gets lost. */
        get "linear_limit_y/restitution"(): float64
        set "linear_limit_y/restitution"(value: float64)
        
        /** The amount of damping that happens at the Y motion. */
        get "linear_limit_y/damping"(): float64
        set "linear_limit_y/damping"(value: float64)
        
        /** If `true`, the linear motion across the Z axis is limited. */
        get "linear_limit_z/enabled"(): boolean
        set "linear_limit_z/enabled"(value: boolean)
        
        /** The maximum difference between the pivot points' Z axis. */
        get "linear_limit_z/upper_distance"(): float64
        set "linear_limit_z/upper_distance"(value: float64)
        
        /** The minimum difference between the pivot points' Z axis. */
        get "linear_limit_z/lower_distance"(): float64
        set "linear_limit_z/lower_distance"(value: float64)
        
        /** A factor applied to the movement across the Z axis. The lower, the slower the movement. */
        get "linear_limit_z/softness"(): float64
        set "linear_limit_z/softness"(value: float64)
        
        /** The amount of restitution on the Z axis movement. The lower, the more momentum gets lost. */
        get "linear_limit_z/restitution"(): float64
        set "linear_limit_z/restitution"(value: float64)
        
        /** The amount of damping that happens at the Z motion. */
        get "linear_limit_z/damping"(): float64
        set "linear_limit_z/damping"(value: float64)
        
        /** If `true`, then there is a linear motor on the X axis. It will attempt to reach the target velocity while staying within the force limits. */
        get "linear_motor_x/enabled"(): boolean
        set "linear_motor_x/enabled"(value: boolean)
        
        /** The speed that the linear motor will attempt to reach on the X axis. */
        get "linear_motor_x/target_velocity"(): float64
        set "linear_motor_x/target_velocity"(value: float64)
        
        /** The maximum force the linear motor can apply on the X axis while trying to reach the target velocity. */
        get "linear_motor_x/force_limit"(): float64
        set "linear_motor_x/force_limit"(value: float64)
        
        /** If `true`, then there is a linear motor on the Y axis. It will attempt to reach the target velocity while staying within the force limits. */
        get "linear_motor_y/enabled"(): boolean
        set "linear_motor_y/enabled"(value: boolean)
        
        /** The speed that the linear motor will attempt to reach on the Y axis. */
        get "linear_motor_y/target_velocity"(): float64
        set "linear_motor_y/target_velocity"(value: float64)
        
        /** The maximum force the linear motor can apply on the Y axis while trying to reach the target velocity. */
        get "linear_motor_y/force_limit"(): float64
        set "linear_motor_y/force_limit"(value: float64)
        
        /** If `true`, then there is a linear motor on the Z axis. It will attempt to reach the target velocity while staying within the force limits. */
        get "linear_motor_z/enabled"(): boolean
        set "linear_motor_z/enabled"(value: boolean)
        
        /** The speed that the linear motor will attempt to reach on the Z axis. */
        get "linear_motor_z/target_velocity"(): float64
        set "linear_motor_z/target_velocity"(value: float64)
        
        /** The maximum force the linear motor can apply on the Z axis while trying to reach the target velocity. */
        get "linear_motor_z/force_limit"(): float64
        set "linear_motor_z/force_limit"(value: float64)
        get "linear_spring_x/enabled"(): boolean
        set "linear_spring_x/enabled"(value: boolean)
        get "linear_spring_x/stiffness"(): float64
        set "linear_spring_x/stiffness"(value: float64)
        get "linear_spring_x/damping"(): float64
        set "linear_spring_x/damping"(value: float64)
        get "linear_spring_x/equilibrium_point"(): float64
        set "linear_spring_x/equilibrium_point"(value: float64)
        get "linear_spring_y/enabled"(): boolean
        set "linear_spring_y/enabled"(value: boolean)
        get "linear_spring_y/stiffness"(): float64
        set "linear_spring_y/stiffness"(value: float64)
        get "linear_spring_y/damping"(): float64
        set "linear_spring_y/damping"(value: float64)
        get "linear_spring_y/equilibrium_point"(): float64
        set "linear_spring_y/equilibrium_point"(value: float64)
        get "linear_spring_z/enabled"(): boolean
        set "linear_spring_z/enabled"(value: boolean)
        get "linear_spring_z/stiffness"(): float64
        set "linear_spring_z/stiffness"(value: float64)
        get "linear_spring_z/damping"(): float64
        set "linear_spring_z/damping"(value: float64)
        get "linear_spring_z/equilibrium_point"(): float64
        set "linear_spring_z/equilibrium_point"(value: float64)
        
        /** If `true`, rotation across the X axis is limited. */
        get "angular_limit_x/enabled"(): boolean
        set "angular_limit_x/enabled"(value: boolean)
        
        /** The minimum rotation in positive direction to break loose and rotate around the X axis. */
        get "angular_limit_x/upper_angle"(): float64
        set "angular_limit_x/upper_angle"(value: float64)
        
        /** The minimum rotation in negative direction to break loose and rotate around the X axis. */
        get "angular_limit_x/lower_angle"(): float64
        set "angular_limit_x/lower_angle"(value: float64)
        
        /** The speed of all rotations across the X axis. */
        get "angular_limit_x/softness"(): float64
        set "angular_limit_x/softness"(value: float64)
        
        /** The amount of rotational restitution across the X axis. The lower, the more restitution occurs. */
        get "angular_limit_x/restitution"(): float64
        set "angular_limit_x/restitution"(value: float64)
        
        /** The amount of rotational damping across the X axis.  
         *  The lower, the longer an impulse from one side takes to travel to the other side.  
         */
        get "angular_limit_x/damping"(): float64
        set "angular_limit_x/damping"(value: float64)
        
        /** The maximum amount of force that can occur, when rotating around the X axis. */
        get "angular_limit_x/force_limit"(): float64
        set "angular_limit_x/force_limit"(value: float64)
        
        /** When rotating across the X axis, this error tolerance factor defines how much the correction gets slowed down. The lower, the slower. */
        get "angular_limit_x/erp"(): float64
        set "angular_limit_x/erp"(value: float64)
        
        /** If `true`, rotation across the Y axis is limited. */
        get "angular_limit_y/enabled"(): boolean
        set "angular_limit_y/enabled"(value: boolean)
        
        /** The minimum rotation in positive direction to break loose and rotate around the Y axis. */
        get "angular_limit_y/upper_angle"(): float64
        set "angular_limit_y/upper_angle"(value: float64)
        
        /** The minimum rotation in negative direction to break loose and rotate around the Y axis. */
        get "angular_limit_y/lower_angle"(): float64
        set "angular_limit_y/lower_angle"(value: float64)
        
        /** The speed of all rotations across the Y axis. */
        get "angular_limit_y/softness"(): float64
        set "angular_limit_y/softness"(value: float64)
        
        /** The amount of rotational restitution across the Y axis. The lower, the more restitution occurs. */
        get "angular_limit_y/restitution"(): float64
        set "angular_limit_y/restitution"(value: float64)
        
        /** The amount of rotational damping across the Y axis. The lower, the more damping occurs. */
        get "angular_limit_y/damping"(): float64
        set "angular_limit_y/damping"(value: float64)
        
        /** The maximum amount of force that can occur, when rotating around the Y axis. */
        get "angular_limit_y/force_limit"(): float64
        set "angular_limit_y/force_limit"(value: float64)
        
        /** When rotating across the Y axis, this error tolerance factor defines how much the correction gets slowed down. The lower, the slower. */
        get "angular_limit_y/erp"(): float64
        set "angular_limit_y/erp"(value: float64)
        
        /** If `true`, rotation across the Z axis is limited. */
        get "angular_limit_z/enabled"(): boolean
        set "angular_limit_z/enabled"(value: boolean)
        
        /** The minimum rotation in positive direction to break loose and rotate around the Z axis. */
        get "angular_limit_z/upper_angle"(): float64
        set "angular_limit_z/upper_angle"(value: float64)
        
        /** The minimum rotation in negative direction to break loose and rotate around the Z axis. */
        get "angular_limit_z/lower_angle"(): float64
        set "angular_limit_z/lower_angle"(value: float64)
        
        /** The speed of all rotations across the Z axis. */
        get "angular_limit_z/softness"(): float64
        set "angular_limit_z/softness"(value: float64)
        
        /** The amount of rotational restitution across the Z axis. The lower, the more restitution occurs. */
        get "angular_limit_z/restitution"(): float64
        set "angular_limit_z/restitution"(value: float64)
        
        /** The amount of rotational damping across the Z axis. The lower, the more damping occurs. */
        get "angular_limit_z/damping"(): float64
        set "angular_limit_z/damping"(value: float64)
        
        /** The maximum amount of force that can occur, when rotating around the Z axis. */
        get "angular_limit_z/force_limit"(): float64
        set "angular_limit_z/force_limit"(value: float64)
        
        /** When rotating across the Z axis, this error tolerance factor defines how much the correction gets slowed down. The lower, the slower. */
        get "angular_limit_z/erp"(): float64
        set "angular_limit_z/erp"(value: float64)
        
        /** If `true`, a rotating motor at the X axis is enabled. */
        get "angular_motor_x/enabled"(): boolean
        set "angular_motor_x/enabled"(value: boolean)
        
        /** Target speed for the motor at the X axis. */
        get "angular_motor_x/target_velocity"(): float64
        set "angular_motor_x/target_velocity"(value: float64)
        
        /** Maximum acceleration for the motor at the X axis. */
        get "angular_motor_x/force_limit"(): float64
        set "angular_motor_x/force_limit"(value: float64)
        
        /** If `true`, a rotating motor at the Y axis is enabled. */
        get "angular_motor_y/enabled"(): boolean
        set "angular_motor_y/enabled"(value: boolean)
        
        /** Target speed for the motor at the Y axis. */
        get "angular_motor_y/target_velocity"(): float64
        set "angular_motor_y/target_velocity"(value: float64)
        
        /** Maximum acceleration for the motor at the Y axis. */
        get "angular_motor_y/force_limit"(): float64
        set "angular_motor_y/force_limit"(value: float64)
        
        /** If `true`, a rotating motor at the Z axis is enabled. */
        get "angular_motor_z/enabled"(): boolean
        set "angular_motor_z/enabled"(value: boolean)
        
        /** Target speed for the motor at the Z axis. */
        get "angular_motor_z/target_velocity"(): float64
        set "angular_motor_z/target_velocity"(value: float64)
        
        /** Maximum acceleration for the motor at the Z axis. */
        get "angular_motor_z/force_limit"(): float64
        set "angular_motor_z/force_limit"(value: float64)
        get "angular_spring_x/enabled"(): boolean
        set "angular_spring_x/enabled"(value: boolean)
        get "angular_spring_x/stiffness"(): float64
        set "angular_spring_x/stiffness"(value: float64)
        get "angular_spring_x/damping"(): float64
        set "angular_spring_x/damping"(value: float64)
        get "angular_spring_x/equilibrium_point"(): float64
        set "angular_spring_x/equilibrium_point"(value: float64)
        get "angular_spring_y/enabled"(): boolean
        set "angular_spring_y/enabled"(value: boolean)
        get "angular_spring_y/stiffness"(): float64
        set "angular_spring_y/stiffness"(value: float64)
        get "angular_spring_y/damping"(): float64
        set "angular_spring_y/damping"(value: float64)
        get "angular_spring_y/equilibrium_point"(): float64
        set "angular_spring_y/equilibrium_point"(value: float64)
        get "angular_spring_z/enabled"(): boolean
        set "angular_spring_z/enabled"(value: boolean)
        get "angular_spring_z/stiffness"(): float64
        set "angular_spring_z/stiffness"(value: float64)
        get "angular_spring_z/damping"(): float64
        set "angular_spring_z/damping"(value: float64)
        get "angular_spring_z/equilibrium_point"(): float64
        set "angular_spring_z/equilibrium_point"(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGeneric6DOFJoint3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGeneric6DOFJoint3D;
    }
    namespace GeometryInstance3D {
        enum ShadowCastingSetting {
            /** Will not cast any shadows. Use this to improve performance for small geometry that is unlikely to cast noticeable shadows (such as debris). */
            SHADOW_CASTING_SETTING_OFF = 0,
            
            /** Will cast shadows from all visible faces in the GeometryInstance3D.  
             *  Will take culling into account, so faces not being rendered will not be taken into account when shadow casting.  
             */
            SHADOW_CASTING_SETTING_ON = 1,
            
            /** Will cast shadows from all visible faces in the GeometryInstance3D.  
             *  Will not take culling into account, so all faces will be taken into account when shadow casting.  
             */
            SHADOW_CASTING_SETTING_DOUBLE_SIDED = 2,
            
            /** Will only show the shadows casted from this object.  
             *  In other words, the actual mesh will not be visible, only the shadows casted from the mesh will be.  
             */
            SHADOW_CASTING_SETTING_SHADOWS_ONLY = 3,
        }
        enum GIMode {
            /** Disabled global illumination mode. Use for dynamic objects that do not contribute to global illumination (such as characters). When using [VoxelGI] and SDFGI, the geometry will  *receive*  indirect lighting and reflections but the geometry will not be considered in GI baking. */
            GI_MODE_DISABLED = 0,
            
            /** Baked global illumination mode. Use for static objects that contribute to global illumination (such as level geometry). This GI mode is effective when using [VoxelGI], SDFGI and [LightmapGI]. */
            GI_MODE_STATIC = 1,
            
            /** Dynamic global illumination mode. Use for dynamic objects that contribute to global illumination. This GI mode is only effective when using [VoxelGI], but it has a higher performance impact than [constant GI_MODE_STATIC]. When using other GI methods, this will act the same as [constant GI_MODE_DISABLED]. When using [LightmapGI], the object will receive indirect lighting using lightmap probes instead of using the baked lightmap texture. */
            GI_MODE_DYNAMIC = 2,
        }
        enum LightmapScale {
            /** The standard texel density for lightmapping with [LightmapGI]. */
            LIGHTMAP_SCALE_1X = 0,
            
            /** Multiplies texel density by 2× for lightmapping with [LightmapGI]. To ensure consistency in texel density, use this when scaling a mesh by a factor between 1.5 and 3.0. */
            LIGHTMAP_SCALE_2X = 1,
            
            /** Multiplies texel density by 4× for lightmapping with [LightmapGI]. To ensure consistency in texel density, use this when scaling a mesh by a factor between 3.0 and 6.0. */
            LIGHTMAP_SCALE_4X = 2,
            
            /** Multiplies texel density by 8× for lightmapping with [LightmapGI]. To ensure consistency in texel density, use this when scaling a mesh by a factor greater than 6.0. */
            LIGHTMAP_SCALE_8X = 3,
            
            /** Represents the size of the [enum LightmapScale] enum. */
            LIGHTMAP_SCALE_MAX = 4,
        }
        enum VisibilityRangeFadeMode {
            /** Will not fade itself nor its visibility dependencies, hysteresis will be used instead. This is the fastest approach to manual LOD, but it can result in noticeable LOD transitions depending on how the LOD meshes are authored. See [member visibility_range_begin] and [member Node3D.visibility_parent] for more information. */
            VISIBILITY_RANGE_FADE_DISABLED = 0,
            
            /** Will fade-out itself when reaching the limits of its own visibility range. This is slower than [constant VISIBILITY_RANGE_FADE_DISABLED], but it can provide smoother transitions. The fading range is determined by [member visibility_range_begin_margin] and [member visibility_range_end_margin].  
             *      
             *  **Note:** Only supported when using the Forward+ rendering method. When using the Mobile or Compatibility rendering method, this mode acts like [constant VISIBILITY_RANGE_FADE_DISABLED] but with hysteresis disabled.  
             */
            VISIBILITY_RANGE_FADE_SELF = 1,
            
            /** Will fade-in its visibility dependencies (see [member Node3D.visibility_parent]) when reaching the limits of its own visibility range. This is slower than [constant VISIBILITY_RANGE_FADE_DISABLED], but it can provide smoother transitions. The fading range is determined by [member visibility_range_begin_margin] and [member visibility_range_end_margin].  
             *      
             *  **Note:** Only supported when using the Forward+ rendering method. When using the Mobile or Compatibility rendering method, this mode acts like [constant VISIBILITY_RANGE_FADE_DISABLED] but with hysteresis disabled.  
             */
            VISIBILITY_RANGE_FADE_DEPENDENCIES = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGeometryInstance3D extends __RPCMapVisualInstance3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGeometryInstance3D extends __NameMapVisualInstance3D {
    }
    /** Base node for geometry-based visual instances.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_geometryinstance3d.html  
     */
    class GeometryInstance3D<Map extends NodePathMap = any> extends VisualInstance3D<Map> {
        constructor(identifier?: any)
        /** Set the value of a shader uniform for this instance only ([url=https://docs.godotengine.org/en/4.6/tutorials/shaders/shader_reference/shading_language.html#per-instance-uniforms]per-instance uniform[/url]). See also [method ShaderMaterial.set_shader_parameter] to assign a uniform on all instances using the same [ShaderMaterial].  
         *      
         *  **Note:** For a shader uniform to be assignable on a per-instance basis, it  *must*  be defined with `instance uniform ...` rather than `uniform ...` in the shader code.  
         *      
         *  **Note:** [param name] is case-sensitive and must match the name of the uniform in the code exactly (not the capitalized name in the inspector).  
         *      
         *  **Note:** Per-instance shader uniforms are only available in Spatial and CanvasItem shaders, but not for Fog, Sky, or Particles shaders.  
         */
        set_instance_shader_parameter(name: StringName, value: any): void
        
        /** Get the value of a shader parameter as set on this instance. */
        get_instance_shader_parameter(name: StringName): any
        
        /** The material override for the whole geometry.  
         *  If a material is assigned to this property, it will be used instead of any material set in any material slot of the mesh.  
         */
        get material_override(): null | BaseMaterial3D | ShaderMaterial
        set material_override(value: null | BaseMaterial3D | ShaderMaterial)
        
        /** The material overlay for the whole geometry.  
         *  If a material is assigned to this property, it will be rendered on top of any other active material for all the surfaces.  
         */
        get material_overlay(): null | BaseMaterial3D | ShaderMaterial
        set material_overlay(value: null | BaseMaterial3D | ShaderMaterial)
        
        /** The transparency applied to the whole geometry (as a multiplier of the materials' existing transparency). `0.0` is fully opaque, while `1.0` is fully transparent. Values greater than `0.0` (exclusive) will force the geometry's materials to go through the transparent pipeline, which is slower to render and can exhibit rendering issues due to incorrect transparency sorting. However, unlike using a transparent material, setting [member transparency] to a value greater than `0.0` (exclusive) will  *not*  disable shadow rendering.  
         *  In spatial shaders, `1.0 - transparency` is set as the default value of the `ALPHA` built-in.  
         *      
         *  **Note:** [member transparency] is clamped between `0.0` and `1.0`, so this property cannot be used to make transparent materials more opaque than they originally are.  
         *      
         *  **Note:** Only supported when using the Forward+ rendering method. When using the Mobile or Compatibility rendering method, [member transparency] is ignored and is considered as always being `0.0`.  
         */
        get transparency(): float64
        set transparency(value: float64)
        
        /** The mode used to cast shadows from this instance. */
        get cast_shadow(): int64
        set cast_shadow(value: int64)
        
        /** The extra distance added to the GeometryInstance3D's bounding box ([AABB]) to increase its cull box. */
        get extra_cull_margin(): float64
        set extra_cull_margin(value: float64)
        
        /** Overrides the bounding box of this node with a custom one. This can be used to avoid the expensive [AABB] recalculation that happens when a skeleton is used with a [MeshInstance3D] or to have precise control over the [MeshInstance3D]'s bounding box. To use the default AABB, set value to an [AABB] with all fields set to `0.0`. To avoid frustum culling, set [member custom_aabb] to a very large AABB that covers your entire game world such as `AABB(-10000, -10000, -10000, 20000, 20000, 20000)`. To disable all forms of culling (including occlusion culling), call [method RenderingServer.instance_set_ignore_culling] on the [GeometryInstance3D]'s [RID]. */
        get custom_aabb(): AABB
        set custom_aabb(value: AABB)
        
        /** Changes how quickly the mesh transitions to a lower level of detail. A value of 0 will force the mesh to its lowest level of detail, a value of 1 will use the default settings, and larger values will keep the mesh in a higher level of detail at farther distances.  
         *  Useful for testing level of detail transitions in the editor.  
         */
        get lod_bias(): float64
        set lod_bias(value: float64)
        
        /** If `true`, disables occlusion culling for this instance. Useful for gizmos that must be rendered even when occlusion culling is in use.  
         *      
         *  **Note:** [member ignore_occlusion_culling] does not affect frustum culling (which is what happens when an object is not visible given the camera's angle). To avoid frustum culling, set [member custom_aabb] to a very large AABB that covers your entire game world such as `AABB(-10000, -10000, -10000, 20000, 20000, 20000)`.  
         */
        get ignore_occlusion_culling(): boolean
        set ignore_occlusion_culling(value: boolean)
        
        /** The global illumination mode to use for the whole geometry. To avoid inconsistent results, use a mode that matches the purpose of the mesh during gameplay (static/dynamic).  
         *      
         *  **Note:** Lights' bake mode will also affect the global illumination rendering. See [member Light3D.light_bake_mode].  
         */
        get gi_mode(): int64
        set gi_mode(value: int64)
        
        /** The texel density to use for lightmapping in [LightmapGI]. Greater scale values provide higher resolution in the lightmap, which can result in sharper shadows for lights that have both direct and indirect light baked. However, greater scale values will also increase the space taken by the mesh in the lightmap texture, which increases the memory, storage, and bake time requirements. When using a single mesh at different scales, consider adjusting this value to keep the lightmap texel density consistent across meshes.  
         *  For example, doubling [member gi_lightmap_texel_scale] doubles the lightmap texture resolution for this object  *on each axis* , so it will  *quadruple*  the texel count.  
         */
        get gi_lightmap_texel_scale(): float64
        set gi_lightmap_texel_scale(value: float64)
        
        /** The texel density to use for lightmapping in [LightmapGI]. */
        get gi_lightmap_scale(): int64
        set gi_lightmap_scale(value: int64)
        
        /** Starting distance from which the GeometryInstance3D will be visible, taking [member visibility_range_begin_margin] into account as well. The default value of 0 is used to disable the range check. */
        get visibility_range_begin(): float64
        set visibility_range_begin(value: float64)
        
        /** Margin for the [member visibility_range_begin] threshold. The GeometryInstance3D will only change its visibility state when it goes over or under the [member visibility_range_begin] threshold by this amount.  
         *  If [member visibility_range_fade_mode] is [constant VISIBILITY_RANGE_FADE_DISABLED], this acts as a hysteresis distance. If [member visibility_range_fade_mode] is [constant VISIBILITY_RANGE_FADE_SELF] or [constant VISIBILITY_RANGE_FADE_DEPENDENCIES], this acts as a fade transition distance and must be set to a value greater than `0.0` for the effect to be noticeable.  
         */
        get visibility_range_begin_margin(): float64
        set visibility_range_begin_margin(value: float64)
        
        /** Distance from which the GeometryInstance3D will be hidden, taking [member visibility_range_end_margin] into account as well. The default value of 0 is used to disable the range check. */
        get visibility_range_end(): float64
        set visibility_range_end(value: float64)
        
        /** Margin for the [member visibility_range_end] threshold. The GeometryInstance3D will only change its visibility state when it goes over or under the [member visibility_range_end] threshold by this amount.  
         *  If [member visibility_range_fade_mode] is [constant VISIBILITY_RANGE_FADE_DISABLED], this acts as a hysteresis distance. If [member visibility_range_fade_mode] is [constant VISIBILITY_RANGE_FADE_SELF] or [constant VISIBILITY_RANGE_FADE_DEPENDENCIES], this acts as a fade transition distance and must be set to a value greater than `0.0` for the effect to be noticeable.  
         */
        get visibility_range_end_margin(): float64
        set visibility_range_end_margin(value: float64)
        
        /** Controls which instances will be faded when approaching the limits of the visibility range. */
        get visibility_range_fade_mode(): int64
        set visibility_range_fade_mode(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGeometryInstance3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGeometryInstance3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGodotInstance extends __RPCMapObject {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGodotInstance extends __NameMapObject {
    }
    /** Provides access to an embedded Godot instance.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_godotinstance.html  
     */
    class GodotInstance extends Object {
        constructor(identifier?: any)
        /** Finishes this instance's startup sequence. Returns `true` on success. */
        start(): boolean
        
        /** Returns `true` if this instance has been fully started. */
        is_started(): boolean
        
        /** Runs a single iteration of the main loop. Returns `true` if the engine is attempting to quit. */
        iteration(): boolean
        
        /** Notifies the instance that it is now in focus. */
        focus_in(): void
        
        /** Notifies the instance that it is now not in focus. */
        focus_out(): void
        
        /** Notifies the instance that it is going to be paused. */
        pause(): void
        
        /** Notifies the instance that it is being resumed. */
        resume(): void
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGodotInstance;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGodotInstance;
    }
    namespace Gradient {
        enum InterpolationMode {
            /** Linear interpolation. */
            GRADIENT_INTERPOLATE_LINEAR = 0,
            
            /** Constant interpolation, color changes abruptly at each point and stays uniform between. This might cause visible aliasing when used for a gradient texture in some cases. */
            GRADIENT_INTERPOLATE_CONSTANT = 1,
            
            /** Cubic interpolation. */
            GRADIENT_INTERPOLATE_CUBIC = 2,
        }
        enum ColorSpace {
            /** sRGB color space. */
            GRADIENT_COLOR_SPACE_SRGB = 0,
            
            /** Linear sRGB color space. */
            GRADIENT_COLOR_SPACE_LINEAR_SRGB = 1,
            
            /** [url=https://bottosson.github.io/posts/oklab/]Oklab[/url] color space. This color space provides a smooth and uniform-looking transition between colors. */
            GRADIENT_COLOR_SPACE_OKLAB = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGradient extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGradient extends __NameMapResource {
    }
    /** A color transition.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gradient.html  
     */
    class Gradient extends Resource {
        constructor(identifier?: any)
        /** Adds the specified color to the gradient, with the specified offset. */
        add_point(offset: float64, color: Color): void
        
        /** Removes the color at index [param point]. */
        remove_point(point: int64): void
        
        /** Sets the offset for the gradient color at index [param point]. */
        set_offset(point: int64, offset: float64): void
        
        /** Returns the offset of the gradient color at index [param point]. */
        get_offset(point: int64): float64
        
        /** Reverses/mirrors the gradient.  
         *      
         *  **Note:** This method mirrors all points around the middle of the gradient, which may produce unexpected results when [member interpolation_mode] is set to [constant GRADIENT_INTERPOLATE_CONSTANT].  
         */
        reverse(): void
        
        /** Sets the color of the gradient color at index [param point]. */
        set_color(point: int64, color: Color): void
        
        /** Returns the color of the gradient color at index [param point]. */
        get_color(point: int64): Color
        
        /** Returns the interpolated color specified by [param offset]. [param offset] should be between `0.0` and `1.0` (inclusive). Using a value lower than `0.0` will return the same color as `0.0`, and using a value higher than `1.0` will return the same color as `1.0`. If your input value is not within this range, consider using [method @GlobalScope.remap] on the input value with output values set to `0.0` and `1.0`. */
        sample(offset: float64): Color
        
        /** Returns the number of colors in the gradient. */
        get_point_count(): int64
        
        /** The algorithm used to interpolate between points of the gradient. */
        get interpolation_mode(): int64
        set interpolation_mode(value: int64)
        
        /** The color space used to interpolate between points of the gradient. It does not affect the returned colors, which will always use nonlinear sRGB encoding.  
         *      
         *  **Note:** This setting has no effect when [member interpolation_mode] is set to [constant GRADIENT_INTERPOLATE_CONSTANT].  
         */
        get interpolation_color_space(): int64
        set interpolation_color_space(value: int64)
        
        /** Gradient's offsets as a [PackedFloat32Array].  
         *      
         *  **Note:** Setting this property updates all offsets at once. To update any offset individually use [method set_offset].  
         */
        get offsets(): PackedFloat32Array
        set offsets(value: PackedFloat32Array | float32[])
        
        /** Gradient's colors as a [PackedColorArray].  
         *      
         *  **Note:** Setting this property updates all colors at once. To update any color individually use [method set_color].  
         */
        get colors(): PackedColorArray
        set colors(value: PackedColorArray | Color[])
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGradient;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGradient;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGradientTexture1D extends __RPCMapTexture2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGradientTexture1D extends __NameMapTexture2D {
    }
    /** A 1D texture that uses colors obtained from a [Gradient].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gradienttexture1d.html  
     */
    class GradientTexture1D extends Texture2D {
        constructor(identifier?: any)
        /** The [Gradient] used to fill the texture. */
        get gradient(): null | Gradient
        set gradient(value: null | Gradient)
        
        /** The number of color samples that will be obtained from the [Gradient]. */
        get width(): int64
        set width(value: int64)
        
        /** If `true`, the generated texture will support high dynamic range ([constant Image.FORMAT_RGBAF] format). This allows for glow effects to work if [member Environment.glow_enabled] is `true`. If `false`, the generated texture will use low dynamic range; overbright colors will be clamped ([constant Image.FORMAT_RGBA8] format). */
        get use_hdr(): boolean
        set use_hdr(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGradientTexture1D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGradientTexture1D;
    }
    namespace GradientTexture2D {
        enum Fill {
            /** The colors are linearly interpolated in a straight line. */
            FILL_LINEAR = 0,
            
            /** The colors are linearly interpolated in a circular pattern. */
            FILL_RADIAL = 1,
            
            /** The colors are linearly interpolated in a square pattern. */
            FILL_SQUARE = 2,
        }
        enum Repeat {
            /** The gradient fill is restricted to the range defined by [member fill_from] to [member fill_to] offsets. */
            REPEAT_NONE = 0,
            
            /** The texture is filled starting from [member fill_from] to [member fill_to] offsets, repeating the same pattern in both directions. */
            REPEAT = 1,
            
            /** The texture is filled starting from [member fill_from] to [member fill_to] offsets, mirroring the pattern in both directions. */
            REPEAT_MIRROR = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGradientTexture2D extends __RPCMapTexture2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGradientTexture2D extends __NameMapTexture2D {
    }
    /** A 2D texture that creates a pattern with colors obtained from a [Gradient].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gradienttexture2d.html  
     */
    class GradientTexture2D extends Texture2D {
        constructor(identifier?: any)
        /** The [Gradient] used to fill the texture. */
        get gradient(): null | Gradient
        set gradient(value: null | Gradient)
        
        /** The number of horizontal color samples that will be obtained from the [Gradient], which also represents the texture's width. */
        get width(): int64
        set width(value: int64)
        
        /** The number of vertical color samples that will be obtained from the [Gradient], which also represents the texture's height. */
        get height(): int64
        set height(value: int64)
        
        /** If `true`, the generated texture will support high dynamic range ([constant Image.FORMAT_RGBAF] format). This allows for glow effects to work if [member Environment.glow_enabled] is `true`. If `false`, the generated texture will use low dynamic range; overbright colors will be clamped ([constant Image.FORMAT_RGBA8] format). */
        get use_hdr(): boolean
        set use_hdr(value: boolean)
        
        /** The gradient's fill type. */
        get fill(): int64
        set fill(value: int64)
        
        /** The initial offset used to fill the texture specified in UV coordinates. */
        get fill_from(): Vector2
        set fill_from(value: Vector2)
        
        /** The final offset used to fill the texture specified in UV coordinates. */
        get fill_to(): Vector2
        set fill_to(value: Vector2)
        
        /** The gradient's repeat type. */
        get repeat(): int64
        set repeat(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGradientTexture2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGradientTexture2D;
    }
    namespace GraphEdit {
        enum PanningScheme {
            /** [kbd]Mouse Wheel[/kbd] will zoom, [kbd]Ctrl + Mouse Wheel[/kbd] will move the view. */
            SCROLL_ZOOMS = 0,
            
            /** [kbd]Mouse Wheel[/kbd] will move the view, [kbd]Ctrl + Mouse Wheel[/kbd] will zoom. */
            SCROLL_PANS = 1,
        }
        enum GridPattern {
            /** Draw the grid using solid lines. */
            GRID_PATTERN_LINES = 0,
            
            /** Draw the grid using dots. */
            GRID_PATTERN_DOTS = 1,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGraphEdit extends __RPCMapControl {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGraphEdit extends __NameMapControl {
    }
    /** An editor for graph-like structures, using [GraphNode]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_graphedit.html  
     */
    class GraphEdit<Map extends NodePathMap = any> extends Control<Map> {
        constructor(identifier?: any)
        /** Returns whether the [param mouse_position] is in the input hot zone.  
         *  By default, a hot zone is a [Rect2] positioned such that its center is at [param in_node].[method GraphNode.get_input_port_position]([param in_port]) (For output's case, call [method GraphNode.get_output_port_position] instead). The hot zone's width is twice the Theme Property `port_grab_distance_horizontal`, and its height is twice the `port_grab_distance_vertical`.  
         *  Below is a sample code to help get started:  
         *    
         */
        /* gdvirtual */ _is_in_input_hotzone(in_node: Object, in_port: int64, mouse_position: Vector2): boolean
        
        /** Returns whether the [param mouse_position] is in the output hot zone. For more information on hot zones, see [method _is_in_input_hotzone].  
         *  Below is a sample code to help get started:  
         *    
         */
        /* gdvirtual */ _is_in_output_hotzone(in_node: Object, in_port: int64, mouse_position: Vector2): boolean
        
        /** Virtual method which can be overridden to customize how connections are drawn. */
        /* gdvirtual */ _get_connection_line(from_position: Vector2, to_position: Vector2): PackedVector2Array
        
        /** This virtual method can be used to insert additional error detection while the user is dragging a connection over a valid port.  
         *  Return `true` if the connection is indeed valid or return `false` if the connection is impossible. If the connection is impossible, no snapping to the port and thus no connection request to that port will happen.  
         *  In this example a connection to same node is suppressed:  
         *    
         */
        /* gdvirtual */ _is_node_hover_valid(from_node: StringName, from_port: int64, to_node: StringName, to_port: int64): boolean
        
        /** Create a connection between the [param from_port] of the [param from_node] [GraphNode] and the [param to_port] of the [param to_node] [GraphNode]. If the connection already exists, no connection is created.  
         *  Connections with [param keep_alive] set to `false` may be deleted automatically if invalid during a redraw.  
         */
        connect_node(from_node: StringName, from_port: int64, to_node: StringName, to_port: int64, keep_alive?: boolean /* = false */): Error
        
        /** Returns `true` if the [param from_port] of the [param from_node] [GraphNode] is connected to the [param to_port] of the [param to_node] [GraphNode]. */
        is_node_connected(from_node: StringName, from_port: int64, to_node: StringName, to_port: int64): boolean
        
        /** Removes the connection between the [param from_port] of the [param from_node] [GraphNode] and the [param to_port] of the [param to_node] [GraphNode]. If the connection does not exist, no connection is removed. */
        disconnect_node(from_node: StringName, from_port: int64, to_node: StringName, to_port: int64): void
        
        /** Sets the coloration of the connection between [param from_node]'s [param from_port] and [param to_node]'s [param to_port] with the color provided in the [theme_item activity] theme property. The color is linearly interpolated between the connection color and the activity color using [param amount] as weight. */
        set_connection_activity(from_node: StringName, from_port: int64, to_node: StringName, to_port: int64, amount: float64): void
        
        /** Returns the number of connections from [param from_port] of [param from_node]. */
        get_connection_count(from_node: StringName, from_port: int64): int64
        
        /** Returns the closest connection to the given point in screen space. If no connection is found within [param max_distance] pixels, an empty [Dictionary] is returned.  
         *  A connection is represented as a [Dictionary] in the form of:  
         *    
         *  For example, getting a connection at a given mouse position can be achieved like this:  
         *    
         */
        get_closest_connection_at_point(point: Vector2, max_distance?: float64 /* = 4 */): GDictionary
        
        /** Returns an [Array] containing a list of all connections for [param node].  
         *  A connection is represented as a [Dictionary] in the form of:  
         *    
         *  **Example:** Get all connections on a specific port:  
         *    
         */
        get_connection_list_from_node(node: StringName): GArray<GDictionary>
        
        /** Returns an [Array] containing the list of connections that intersect with the given [Rect2].  
         *  A connection is represented as a [Dictionary] in the form of:  
         *    
         */
        get_connections_intersecting_with_rect(rect: Rect2): GArray<GDictionary>
        
        /** Removes all connections between nodes. */
        clear_connections(): void
        
        /** Ends the creation of the current connection. In other words, if you are dragging a connection you can use this method to abort the process and remove the line that followed your cursor.  
         *  This is best used together with [signal connection_drag_started] and [signal connection_drag_ended] to add custom behavior like node addition through shortcuts.  
         *      
         *  **Note:** This method suppresses any other connection request signals apart from [signal connection_drag_ended].  
         */
        force_connection_drag_end(): void
        
        /** Allows to disconnect nodes when dragging from the right port of the [GraphNode]'s slot if it has the specified type. See also [method remove_valid_right_disconnect_type]. */
        add_valid_right_disconnect_type(type: int64): void
        
        /** Disallows to disconnect nodes when dragging from the right port of the [GraphNode]'s slot if it has the specified type. Use this to disable a disconnection previously allowed with [method add_valid_right_disconnect_type]. */
        remove_valid_right_disconnect_type(type: int64): void
        
        /** Allows to disconnect nodes when dragging from the left port of the [GraphNode]'s slot if it has the specified type. See also [method remove_valid_left_disconnect_type]. */
        add_valid_left_disconnect_type(type: int64): void
        
        /** Disallows to disconnect nodes when dragging from the left port of the [GraphNode]'s slot if it has the specified type. Use this to disable a disconnection previously allowed with [method add_valid_left_disconnect_type]. */
        remove_valid_left_disconnect_type(type: int64): void
        
        /** Allows the connection between two different port types. The port type is defined individually for the left and the right port of each slot with the [method GraphNode.set_slot] method.  
         *  See also [method is_valid_connection_type] and [method remove_valid_connection_type].  
         */
        add_valid_connection_type(from_type: int64, to_type: int64): void
        
        /** Disallows the connection between two different port types previously allowed by [method add_valid_connection_type]. The port type is defined individually for the left and the right port of each slot with the [method GraphNode.set_slot] method.  
         *  See also [method is_valid_connection_type].  
         */
        remove_valid_connection_type(from_type: int64, to_type: int64): void
        
        /** Returns whether it's possible to make a connection between two different port types. The port type is defined individually for the left and the right port of each slot with the [method GraphNode.set_slot] method.  
         *  See also [method add_valid_connection_type] and [method remove_valid_connection_type].  
         */
        is_valid_connection_type(from_type: int64, to_type: int64): boolean
        
        /** Returns the points which would make up a connection between [param from_node] and [param to_node]. */
        get_connection_line(from_node: Vector2, to_node: Vector2): PackedVector2Array
        
        /** Attaches the [param element] [GraphElement] to the [param frame] [GraphFrame]. */
        attach_graph_element_to_frame(element: StringName, frame: StringName): void
        
        /** Detaches the [param element] [GraphElement] from the [GraphFrame] it is currently attached to. */
        detach_graph_element_from_frame(element: StringName): void
        
        /** Returns the [GraphFrame] that contains the [GraphElement] with the given name. */
        get_element_frame(element: StringName): null | GraphFrame
        
        /** Returns an array of node names that are attached to the [GraphFrame] with the given name. */
        get_attached_nodes_of_frame(frame: StringName): GArray<StringName>
        
        /** Gets the [HBoxContainer] that contains the zooming and grid snap controls in the top left of the graph. You can use this method to reposition the toolbar or to add your own custom controls to it.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member CanvasItem.visible] property.  
         */
        get_menu_hbox(): null | HBoxContainer
        
        /** Rearranges selected nodes in a layout with minimum crossings between connections and uniform horizontal and vertical gap between nodes. */
        arrange_nodes(): void
        
        /** Sets the specified [param node] as the one selected. */
        set_selected(node: Node): void
        
        /** The scroll offset. */
        get scroll_offset(): Vector2
        set scroll_offset(value: Vector2)
        
        /** If `true`, the grid is visible. */
        get show_grid(): boolean
        set show_grid(value: boolean)
        
        /** The pattern used for drawing the grid. */
        get grid_pattern(): int64
        set grid_pattern(value: int64)
        
        /** If `true`, enables snapping. */
        get snapping_enabled(): boolean
        set snapping_enabled(value: boolean)
        
        /** The snapping distance in pixels, also determines the grid line distance. */
        get snapping_distance(): int64
        set snapping_distance(value: int64)
        
        /** Defines the control scheme for panning with mouse wheel. */
        get panning_scheme(): int64
        set panning_scheme(value: int64)
        
        /** If `true`, enables disconnection of existing connections in the GraphEdit by dragging the right end. */
        get right_disconnects(): boolean
        set right_disconnects(value: boolean)
        
        /** [Dictionary] of human-readable port type names. */
        get type_names(): GDictionary<Record<int64, int64>>
        set type_names(value: GDictionary<Record<int64, int64>>)
        
        /** The curvature of the lines between the nodes. 0 results in straight lines. */
        get connection_lines_curvature(): float64
        set connection_lines_curvature(value: float64)
        
        /** The thickness of the lines between the nodes. */
        get connection_lines_thickness(): float64
        set connection_lines_thickness(value: float64)
        
        /** If `true`, the lines between nodes will use antialiasing. */
        get connection_lines_antialiased(): boolean
        set connection_lines_antialiased(value: boolean)
        
        /** The connections between [GraphNode]s.  
         *  A connection is represented as a [Dictionary] in the form of:  
         *    
         *  Connections with `keep_alive` set to `false` may be deleted automatically if invalid during a redraw.  
         */
        get connections(): GArray<any>
        set connections(value: GArray<any>)
        
        /** The current zoom value. */
        get zoom(): float64
        set zoom(value: float64)
        
        /** The lower zoom limit. */
        get zoom_min(): float64
        set zoom_min(value: float64)
        
        /** The upper zoom limit. */
        get zoom_max(): float64
        set zoom_max(value: float64)
        
        /** The step of each zoom level. */
        get zoom_step(): float64
        set zoom_step(value: float64)
        
        /** If `true`, the minimap is visible. */
        get minimap_enabled(): boolean
        set minimap_enabled(value: boolean)
        
        /** The size of the minimap rectangle. The map itself is based on the size of the grid area and is scaled to fit this rectangle. */
        get minimap_size(): Vector2
        set minimap_size(value: Vector2)
        
        /** The opacity of the minimap rectangle. */
        get minimap_opacity(): float64
        set minimap_opacity(value: float64)
        
        /** If `true`, the menu toolbar is visible. */
        get show_menu(): boolean
        set show_menu(value: boolean)
        
        /** If `true`, the label with the current zoom level is visible. The zoom level is displayed in percents. */
        get show_zoom_label(): boolean
        set show_zoom_label(value: boolean)
        
        /** If `true`, buttons that allow to change and reset the zoom level are visible. */
        get show_zoom_buttons(): boolean
        set show_zoom_buttons(value: boolean)
        
        /** If `true`, buttons that allow to configure grid and snapping options are visible. */
        get show_grid_buttons(): boolean
        set show_grid_buttons(value: boolean)
        
        /** If `true`, the button to toggle the minimap is visible. */
        get show_minimap_button(): boolean
        set show_minimap_button(value: boolean)
        
        /** If `true`, the button to automatically arrange graph nodes is visible. */
        get show_arrange_button(): boolean
        set show_arrange_button(value: boolean)
        
        /** Emitted to the GraphEdit when the connection between the [param from_port] of the [param from_node] [GraphNode] and the [param to_port] of the [param to_node] [GraphNode] is attempted to be created. */
        readonly connection_request: Signal<(from_node: StringName, from_port: int64, to_node: StringName, to_port: int64) => void>
        
        /** Emitted to the GraphEdit when the connection between [param from_port] of [param from_node] [GraphNode] and [param to_port] of [param to_node] [GraphNode] is attempted to be removed. */
        readonly disconnection_request: Signal<(from_node: StringName, from_port: int64, to_node: StringName, to_port: int64) => void>
        
        /** Emitted when user drags a connection from an output port into the empty space of the graph. */
        readonly connection_to_empty: Signal<(from_node: StringName, from_port: int64, release_position: Vector2) => void>
        
        /** Emitted when user drags a connection from an input port into the empty space of the graph. */
        readonly connection_from_empty: Signal<(to_node: StringName, to_port: int64, release_position: Vector2) => void>
        
        /** Emitted at the beginning of a connection drag. */
        readonly connection_drag_started: Signal<(from_node: StringName, from_port: int64, is_output: boolean) => void>
        
        /** Emitted at the end of a connection drag. */
        readonly connection_drag_ended: Signal<() => void>
        
        /** Emitted when this [GraphEdit] captures a `ui_copy` action ([kbd]Ctrl + C[/kbd] by default). In general, this signal indicates that the selected [GraphElement]s should be copied. */
        readonly copy_nodes_request: Signal<() => void>
        
        /** Emitted when this [GraphEdit] captures a `ui_cut` action ([kbd]Ctrl + X[/kbd] by default). In general, this signal indicates that the selected [GraphElement]s should be cut. */
        readonly cut_nodes_request: Signal<() => void>
        
        /** Emitted when this [GraphEdit] captures a `ui_paste` action ([kbd]Ctrl + V[/kbd] by default). In general, this signal indicates that previously copied [GraphElement]s should be pasted. */
        readonly paste_nodes_request: Signal<() => void>
        
        /** Emitted when this [GraphEdit] captures a `ui_graph_duplicate` action ([kbd]Ctrl + D[/kbd] by default). In general, this signal indicates that the selected [GraphElement]s should be duplicated. */
        readonly duplicate_nodes_request: Signal<() => void>
        
        /** Emitted when this [GraphEdit] captures a `ui_graph_delete` action ([kbd]Delete[/kbd] by default).  
         *  [param nodes] is an array of node names that should be removed. These usually include all selected nodes.  
         */
        readonly delete_nodes_request: Signal<(nodes: GArray<StringName>) => void>
        
        /** Emitted when the given [GraphElement] node is selected. */
        readonly node_selected: Signal<(node: Node) => void>
        
        /** Emitted when the given [GraphElement] node is deselected. */
        readonly node_deselected: Signal<(node: Node) => void>
        
        /** Emitted when the [GraphFrame] [param frame] is resized to [param new_rect]. */
        readonly frame_rect_changed: Signal<(frame: GraphFrame, new_rect: Rect2) => void>
        
        /** Emitted when a popup is requested. Happens on right-clicking in the GraphEdit. [param at_position] is the position of the mouse pointer when the signal is sent. */
        readonly popup_request: Signal<(at_position: Vector2) => void>
        
        /** Emitted at the beginning of a [GraphElement]'s movement. */
        readonly begin_node_move: Signal<() => void>
        
        /** Emitted at the end of a [GraphElement]'s movement. */
        readonly end_node_move: Signal<() => void>
        
        /** Emitted when one or more [GraphElement]s are dropped onto the [GraphFrame] named [param frame], when they were not previously attached to any other one.  
         *  [param elements] is an array of [GraphElement]s to be attached.  
         */
        readonly graph_elements_linked_to_frame_request: Signal<(elements: GArray, frame: StringName) => void>
        
        /** Emitted when the scroll offset is changed by the user. It will not be emitted when changed in code. */
        readonly scroll_offset_changed: Signal<(offset: Vector2) => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGraphEdit;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGraphEdit;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGraphElement extends __RPCMapContainer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGraphElement extends __NameMapContainer {
    }
    /** A container that represents a basic element that can be placed inside a [GraphEdit] control.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_graphelement.html  
     */
    class GraphElement<Map extends NodePathMap = any> extends Container<Map> {
        constructor(identifier?: any)
        /** The offset of the GraphElement, relative to the scroll offset of the [GraphEdit]. */
        get position_offset(): Vector2
        set position_offset(value: Vector2)
        
        /** If `true`, the user can resize the GraphElement.  
         *      
         *  **Note:** Dragging the handle will only emit the [signal resize_request] and [signal resize_end] signals, the GraphElement needs to be resized manually.  
         */
        get resizable(): boolean
        set resizable(value: boolean)
        
        /** If `true`, the user can drag the GraphElement. */
        get draggable(): boolean
        set draggable(value: boolean)
        
        /** If `true`, the user can select the GraphElement. */
        get selectable(): boolean
        set selectable(value: boolean)
        
        /** If `true`, the GraphElement is selected. */
        get selected(): boolean
        set selected(value: boolean)
        
        /** If `true`, [PopupMenu]s that are descendants of the GraphElement are scaled with the [GraphEdit] zoom. */
        get scaling_menus(): boolean
        set scaling_menus(value: boolean)
        
        /** Emitted when the GraphElement is selected. */
        readonly node_selected: Signal<() => void>
        
        /** Emitted when the GraphElement is deselected. */
        readonly node_deselected: Signal<() => void>
        
        /** Emitted when displaying the GraphElement over other ones is requested. Happens on focusing (clicking into) the GraphElement. */
        readonly raise_request: Signal<() => void>
        
        /** Emitted when removing the GraphElement is requested. */
        readonly delete_request: Signal<() => void>
        
        /** Emitted when resizing the GraphElement is requested. Happens on dragging the resizer handle (see [member resizable]). */
        readonly resize_request: Signal<(new_size: Vector2) => void>
        
        /** Emitted when releasing the mouse button after dragging the resizer handle (see [member resizable]). */
        readonly resize_end: Signal<(new_size: Vector2) => void>
        
        /** Emitted when the GraphElement is dragged. */
        readonly dragged: Signal<(from: Vector2, to: Vector2) => void>
        
        /** Emitted when the GraphElement is moved. */
        readonly position_offset_changed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGraphElement;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGraphElement;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGraphFrame extends __RPCMapGraphElement {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGraphFrame extends __NameMapGraphElement {
    }
    /** GraphFrame is a special [GraphElement] that can be used to organize other [GraphElement]s inside a [GraphEdit].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_graphframe.html  
     */
    class GraphFrame<Map extends NodePathMap = any> extends GraphElement<Map> {
        constructor(identifier?: any)
        /** Returns the [HBoxContainer] used for the title bar, only containing a [Label] for displaying the title by default.  
         *  This can be used to add custom controls to the title bar such as option or close buttons.  
         */
        get_titlebar_hbox(): null | HBoxContainer
        
        /** Title of the frame. */
        get title(): string
        set title(value: string)
        
        /** If `true`, the frame's rect will be adjusted automatically to enclose all attached [GraphElement]s. */
        get autoshrink_enabled(): boolean
        set autoshrink_enabled(value: boolean)
        
        /** The margin around the attached nodes that is used to calculate the size of the frame when [member autoshrink_enabled] is `true`. */
        get autoshrink_margin(): int64
        set autoshrink_margin(value: int64)
        
        /** The margin inside the frame that can be used to drag the frame. */
        get drag_margin(): int64
        set drag_margin(value: int64)
        
        /** If `true`, the tint color will be used to tint the frame. */
        get tint_color_enabled(): boolean
        set tint_color_enabled(value: boolean)
        
        /** The color of the frame when [member tint_color_enabled] is `true`. */
        get tint_color(): Color
        set tint_color(value: Color)
        
        /** Emitted when [member autoshrink_enabled] or [member autoshrink_margin] changes. */
        readonly autoshrink_changed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGraphFrame;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGraphFrame;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGraphNode extends __RPCMapGraphElement {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGraphNode extends __NameMapGraphElement {
    }
    /** A container with connection ports, representing a node in a [GraphEdit].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_graphnode.html  
     */
    class GraphNode<Map extends NodePathMap = any> extends GraphElement<Map> {
        constructor(identifier?: any)
        /* gdvirtual */ _draw_port(slot_index: int64, position: Vector2i, left: boolean, color: Color): void
        
        /** Returns the [HBoxContainer] used for the title bar, only containing a [Label] for displaying the title by default. This can be used to add custom controls to the title bar such as option or close buttons. */
        get_titlebar_hbox(): null | HBoxContainer
        
        /** Sets properties of the slot with the given [param slot_index].  
         *  If [param enable_left_port]/[param enable_right_port] is `true`, a port will appear and the slot will be able to be connected from this side.  
         *  With [param type_left]/[param type_right] an arbitrary type can be assigned to each port. Two ports can be connected if they share the same type, or if the connection between their types is allowed in the parent [GraphEdit] (see [method GraphEdit.add_valid_connection_type]). Keep in mind that the [GraphEdit] has the final say in accepting the connection. Type compatibility simply allows the [signal GraphEdit.connection_request] signal to be emitted.  
         *  Ports can be further customized using [param color_left]/[param color_right] and [param custom_icon_left]/[param custom_icon_right]. The color parameter adds a tint to the icon. The custom icon can be used to override the default port dot.  
         *  Additionally, [param draw_stylebox] can be used to enable or disable drawing of the background stylebox for each slot. See [theme_item slot].  
         *  Individual properties can also be set using one of the `set_slot_*` methods.  
         *      
         *  **Note:** This method only sets properties of the slot. To create the slot itself, add a [Control]-derived child to the GraphNode.  
         */
        set_slot(slot_index: int64, enable_left_port: boolean, type_left: int64, color_left: Color, enable_right_port: boolean, type_right: int64, color_right: Color, custom_icon_left?: Texture2D, custom_icon_right?: Texture2D, draw_stylebox?: boolean /* = true */): void
        
        /** Disables the slot with the given [param slot_index]. This will remove the corresponding input and output port from the GraphNode. */
        clear_slot(slot_index: int64): void
        
        /** Disables all slots of the GraphNode. This will remove all input/output ports from the GraphNode. */
        clear_all_slots(): void
        
        /** Returns `true` if left (input) side of the slot with the given [param slot_index] is enabled. */
        is_slot_enabled_left(slot_index: int64): boolean
        
        /** Toggles the left (input) side of the slot with the given [param slot_index]. If [param enable] is `true`, a port will appear on the left side and the slot will be able to be connected from this side. */
        set_slot_enabled_left(slot_index: int64, enable: boolean): void
        
        /** Sets the left (input) type of the slot with the given [param slot_index] to [param type]. If the value is negative, all connections will be disallowed to be created via user inputs. */
        set_slot_type_left(slot_index: int64, type: int64): void
        
        /** Returns the left (input) type of the slot with the given [param slot_index]. */
        get_slot_type_left(slot_index: int64): int64
        
        /** Sets the [Color] of the left (input) side of the slot with the given [param slot_index] to [param color]. */
        set_slot_color_left(slot_index: int64, color: Color): void
        
        /** Returns the left (input) [Color] of the slot with the given [param slot_index]. */
        get_slot_color_left(slot_index: int64): Color
        
        /** Sets the custom [Texture2D] of the left (input) side of the slot with the given [param slot_index] to [param custom_icon]. */
        set_slot_custom_icon_left(slot_index: int64, custom_icon: Texture2D): void
        
        /** Returns the left (input) custom [Texture2D] of the slot with the given [param slot_index]. */
        get_slot_custom_icon_left(slot_index: int64): null | Texture2D
        
        /** Sets the custom metadata for the left (input) side of the slot with the given [param slot_index] to [param value]. */
        set_slot_metadata_left(slot_index: int64, value: any): void
        
        /** Returns the left (input) metadata of the slot with the given [param slot_index]. */
        get_slot_metadata_left(slot_index: int64): any
        
        /** Returns `true` if right (output) side of the slot with the given [param slot_index] is enabled. */
        is_slot_enabled_right(slot_index: int64): boolean
        
        /** Toggles the right (output) side of the slot with the given [param slot_index]. If [param enable] is `true`, a port will appear on the right side and the slot will be able to be connected from this side. */
        set_slot_enabled_right(slot_index: int64, enable: boolean): void
        
        /** Sets the right (output) type of the slot with the given [param slot_index] to [param type]. If the value is negative, all connections will be disallowed to be created via user inputs. */
        set_slot_type_right(slot_index: int64, type: int64): void
        
        /** Returns the right (output) type of the slot with the given [param slot_index]. */
        get_slot_type_right(slot_index: int64): int64
        
        /** Sets the [Color] of the right (output) side of the slot with the given [param slot_index] to [param color]. */
        set_slot_color_right(slot_index: int64, color: Color): void
        
        /** Returns the right (output) [Color] of the slot with the given [param slot_index]. */
        get_slot_color_right(slot_index: int64): Color
        
        /** Sets the custom [Texture2D] of the right (output) side of the slot with the given [param slot_index] to [param custom_icon]. */
        set_slot_custom_icon_right(slot_index: int64, custom_icon: Texture2D): void
        
        /** Returns the right (output) custom [Texture2D] of the slot with the given [param slot_index]. */
        get_slot_custom_icon_right(slot_index: int64): null | Texture2D
        
        /** Sets the custom metadata for the right (output) side of the slot with the given [param slot_index] to [param value]. */
        set_slot_metadata_right(slot_index: int64, value: any): void
        
        /** Returns the right (output) metadata of the slot with the given [param slot_index]. */
        get_slot_metadata_right(slot_index: int64): any
        
        /** Returns `true` if the background [StyleBox] of the slot with the given [param slot_index] is drawn. */
        is_slot_draw_stylebox(slot_index: int64): boolean
        
        /** Toggles the background [StyleBox] of the slot with the given [param slot_index]. */
        set_slot_draw_stylebox(slot_index: int64, enable: boolean): void
        
        /** Returns the number of slots with an enabled input port. */
        get_input_port_count(): int64
        
        /** Returns the position of the input port with the given [param port_idx]. */
        get_input_port_position(port_idx: int64): Vector2
        
        /** Returns the type of the input port with the given [param port_idx]. */
        get_input_port_type(port_idx: int64): int64
        
        /** Returns the [Color] of the input port with the given [param port_idx]. */
        get_input_port_color(port_idx: int64): Color
        
        /** Returns the corresponding slot index of the input port with the given [param port_idx]. */
        get_input_port_slot(port_idx: int64): int64
        
        /** Returns the number of slots with an enabled output port. */
        get_output_port_count(): int64
        
        /** Returns the position of the output port with the given [param port_idx]. */
        get_output_port_position(port_idx: int64): Vector2
        
        /** Returns the type of the output port with the given [param port_idx]. */
        get_output_port_type(port_idx: int64): int64
        
        /** Returns the [Color] of the output port with the given [param port_idx]. */
        get_output_port_color(port_idx: int64): Color
        
        /** Returns the corresponding slot index of the output port with the given [param port_idx]. */
        get_output_port_slot(port_idx: int64): int64
        
        /** The text displayed in the GraphNode's title bar. */
        get title(): string
        set title(value: string)
        
        /** If `true`, you can connect ports with different types, even if the connection was not explicitly allowed in the parent [GraphEdit]. */
        get ignore_invalid_connection_type(): boolean
        set ignore_invalid_connection_type(value: boolean)
        
        /** Determines how connection slots can be focused.  
         *  - If set to [constant Control.FOCUS_CLICK], connections can only be made with the mouse.  
         *  - If set to [constant Control.FOCUS_ALL], slots can also be focused using the [member ProjectSettings.input/ui_up] and [member ProjectSettings.input/ui_down] and connected using [member ProjectSettings.input/ui_left] and [member ProjectSettings.input/ui_right] input actions.  
         *  - If set to [constant Control.FOCUS_ACCESSIBILITY], slot input actions are only enabled when the screen reader is active.  
         */
        get slots_focus_mode(): int64
        set slots_focus_mode(value: int64)
        
        /** Emitted when any GraphNode's slot is updated. */
        readonly slot_updated: Signal<(slot_index: int64) => void>
        
        /** Emitted when any slot's size might have changed. */
        readonly slot_sizes_changed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGraphNode;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGraphNode;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGridContainer extends __RPCMapContainer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGridContainer extends __NameMapContainer {
    }
    /** A container that arranges its child controls in a grid layout.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gridcontainer.html  
     */
    class GridContainer<Map extends NodePathMap = any> extends Container<Map> {
        constructor(identifier?: any)
        /** The number of columns in the [GridContainer]. If modified, [GridContainer] reorders its Control-derived children to accommodate the new layout. */
        get columns(): int64
        set columns(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGridContainer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGridContainer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGridMap extends __RPCMapNode3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGridMap extends __NameMapNode3D {
    }
    /** Node for 3D tile-based maps.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gridmap.html  
     */
    class GridMap<Map extends NodePathMap = any> extends Node3D<Map> {
        /** Invalid cell item that can be used in [method set_cell_item] to clear cells (or represent an empty cell in [method get_cell_item]). */
        static readonly INVALID_CELL_ITEM = -1
        constructor(identifier?: any)
        
        /** Based on [param value], enables or disables the specified layer in the [member collision_mask], given a [param layer_number] between 1 and 32. */
        set_collision_mask_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member collision_mask] is enabled, given a [param layer_number] between 1 and 32. */
        get_collision_mask_value(layer_number: int64): boolean
        
        /** Based on [param value], enables or disables the specified layer in the [member collision_layer], given a [param layer_number] between 1 and 32. */
        set_collision_layer_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member collision_layer] is enabled, given a [param layer_number] between 1 and 32. */
        get_collision_layer_value(layer_number: int64): boolean
        
        /** Sets the [RID] of the navigation map this GridMap node should use for its cell baked navigation meshes. */
        set_navigation_map(navigation_map: RID): void
        
        /** Returns the [RID] of the navigation map this GridMap node uses for its cell baked navigation meshes.  
         *  This function returns always the map set on the GridMap node and not the map on the NavigationServer. If the map is changed directly with the NavigationServer API the GridMap node will not be aware of the map change.  
         */
        get_navigation_map(): RID
        
        /** Sets the mesh index for the cell referenced by its grid coordinates.  
         *  A negative item index such as [constant INVALID_CELL_ITEM] will clear the cell.  
         *  Optionally, the item's orientation can be passed. For valid orientation values, see [method get_orthogonal_index_from_basis].  
         */
        set_cell_item(position: Vector3i, item: int64, orientation?: int64 /* = 0 */): void
        
        /** The [MeshLibrary] item index located at the given grid coordinates. If the cell is empty, [constant INVALID_CELL_ITEM] will be returned. */
        get_cell_item(position: Vector3i): int64
        
        /** The orientation of the cell at the given grid coordinates. `-1` is returned if the cell is empty. */
        get_cell_item_orientation(position: Vector3i): int64
        
        /** Returns the basis that gives the specified cell its orientation. */
        get_cell_item_basis(position: Vector3i): Basis
        
        /** Returns one of 24 possible rotations that lie along the vectors (x,y,z) with each component being either -1, 0, or 1. For further details, refer to the Godot source code. */
        get_basis_with_orthogonal_index(index: int64): Basis
        
        /** This function considers a discretization of rotations into 24 points on unit sphere, lying along the vectors (x,y,z) with each component being either -1, 0, or 1, and returns the index (in the range from 0 to 23) of the point best representing the orientation of the object. For further details, refer to the Godot source code. */
        get_orthogonal_index_from_basis(basis: Basis): int64
        
        /** Returns the map coordinates of the cell containing the given [param local_position]. If [param local_position] is in global coordinates, consider using [method Node3D.to_local] before passing it to this method. See also [method map_to_local]. */
        local_to_map(local_position: Vector3): Vector3i
        
        /** Returns the position of a grid cell in the GridMap's local coordinate space. To convert the returned value into global coordinates, use [method Node3D.to_global]. See also [method local_to_map]. */
        map_to_local(map_position: Vector3i): Vector3
        
        /** This method does nothing. */
        resource_changed(resource: Resource): void
        
        /** Clear all cells. */
        clear(): void
        
        /** Returns an array of [Vector3] with the non-empty cell coordinates in the grid map. */
        get_used_cells(): GArray<Vector3i>
        
        /** Returns an array of all cells with the given item index specified in [param item]. */
        get_used_cells_by_item(item: int64): GArray<Vector3i>
        
        /** Returns an array of [Transform3D] and [Mesh] references corresponding to the non-empty cells in the grid. The transforms are specified in local space. Even indices contain [Transform3D]s, while odd indices contain [Mesh]es related to the [Transform3D] in the index preceding it. */
        get_meshes(): GArray
        
        /** Returns an array of [ArrayMesh]es and [Transform3D] references of all bake meshes that exist within the current GridMap. Even indices contain [ArrayMesh]es, while odd indices contain [Transform3D]s that are always equal to [constant Transform3D.IDENTITY].  
         *  This method relies on the output of [method make_baked_meshes], which will be called with `gen_lightmap_uv` set to `true` and `lightmap_uv_texel_size` set to `0.1` if it hasn't been called yet.  
         */
        get_bake_meshes(): GArray
        
        /** Returns [RID] of a baked mesh with the given [param idx]. */
        get_bake_mesh_instance(idx: int64): RID
        
        /** Clears all baked meshes. See [method make_baked_meshes]. */
        clear_baked_meshes(): void
        
        /** Generates a baked mesh that represents all meshes in the assigned [MeshLibrary] for use with [LightmapGI]. If [param gen_lightmap_uv] is `true`, UV2 data will be generated for each mesh currently used in the [GridMap]. Otherwise, only meshes that already have UV2 data present will be able to use baked lightmaps. When generating UV2, [param lightmap_uv_texel_size] controls the texel density for lightmaps, with lower values resulting in more detailed lightmaps. [param lightmap_uv_texel_size] is ignored if [param gen_lightmap_uv] is `false`. See also [method get_bake_meshes], which relies on the output of this method.  
         *      
         *  **Note:** Calling this method will not actually bake lightmaps, as lightmap baking is performed using the [LightmapGI] node.  
         */
        make_baked_meshes(gen_lightmap_uv?: boolean /* = false */, lightmap_uv_texel_size?: float64 /* = 0.1 */): void
        
        /** The assigned [MeshLibrary]. */
        get mesh_library(): null | MeshLibrary
        set mesh_library(value: null | MeshLibrary)
        
        /** Overrides the default friction and bounce physics properties for the whole [GridMap]. */
        get physics_material(): null | PhysicsMaterial
        set physics_material(value: null | PhysicsMaterial)
        
        /** The dimensions of the grid's cells.  
         *  This does not affect the size of the meshes. See [member cell_scale].  
         */
        get cell_size(): Vector3
        set cell_size(value: Vector3)
        
        /** The size of each octant measured in number of cells. This applies to all three axis. */
        get cell_octant_size(): int64
        set cell_octant_size(value: int64)
        
        /** If `true`, grid items are centered on the X axis. */
        get cell_center_x(): boolean
        set cell_center_x(value: boolean)
        
        /** If `true`, grid items are centered on the Y axis. */
        get cell_center_y(): boolean
        set cell_center_y(value: boolean)
        
        /** If `true`, grid items are centered on the Z axis. */
        get cell_center_z(): boolean
        set cell_center_z(value: boolean)
        
        /** The scale of the cell items.  
         *  This does not affect the size of the grid cells themselves, only the items in them. This can be used to make cell items overlap their neighbors.  
         */
        get cell_scale(): float64
        set cell_scale(value: float64)
        
        /** The physics layers this GridMap is in.  
         *  GridMaps act as static bodies, meaning they aren't affected by gravity or other forces. They only affect other physics bodies that collide with them.  
         */
        get collision_layer(): int64
        set collision_layer(value: int64)
        
        /** The physics layers this GridMap detects collisions in. See [url=https://docs.godotengine.org/en/4.6/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information. */
        get collision_mask(): int64
        set collision_mask(value: int64)
        
        /** The priority used to solve colliding when occurring penetration. The higher the priority is, the lower the penetration into the object will be. This can for example be used to prevent the player from breaking through the boundaries of a level. */
        get collision_priority(): float64
        set collision_priority(value: float64)
        
        /** If `true`, this GridMap creates a navigation region for each cell that uses a [member mesh_library] item with a navigation mesh. The created navigation region will use the navigation layers bitmask assigned to the [MeshLibrary]'s item. */
        get bake_navigation(): boolean
        set bake_navigation(value: boolean)
        
        /** Emitted when [member cell_size] changes. */
        readonly cell_size_changed: Signal<(cell_size: Vector3) => void>
        
        /** Emitted when the [MeshLibrary] of this GridMap changes. */
        readonly changed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGridMap;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGridMap;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGridMapEditorPlugin extends __RPCMapEditorPlugin {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGridMapEditorPlugin extends __NameMapEditorPlugin {
    }
    /** Editor for [GridMap] nodes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_gridmapeditorplugin.html  
     */
    class GridMapEditorPlugin<Map extends NodePathMap = any> extends EditorPlugin<Map> {
        constructor(identifier?: any)
        /** Returns the [GridMap] node currently edited by the grid map editor. */
        get_current_grid_map(): null | GridMap
        
        /** Selects the cells inside the given bounds from [param begin] to [param end]. */
        set_selection(begin: Vector3i, end: Vector3i): void
        
        /** Deselects any currently selected cells. */
        clear_selection(): void
        
        /** Returns the cell coordinate bounds of the current selection. Use [method has_selection] to check if there is an active selection. */
        get_selection(): AABB
        
        /** Returns `true` if there are selected cells. */
        has_selection(): boolean
        
        /** Returns an array of [Vector3i]s with the selected cells' coordinates. */
        get_selected_cells(): GArray
        
        /** Selects the [MeshLibrary] item with the given index in the grid map editor's palette. If a negative index is given, no item will be selected. If a value greater than the last index is given, the last item will be selected.  
         *      
         *  **Note:** The indices might not be in the same order as they appear in the editor's interface.  
         */
        set_selected_palette_item(item: int64): void
        
        /** Returns the index of the selected [MeshLibrary] item in the grid map editor's palette or `-1` if no item is selected.  
         *      
         *  **Note:** The indices might not be in the same order as they appear in the editor's interface.  
         */
        get_selected_palette_item(): int64
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGridMapEditorPlugin;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGridMapEditorPlugin;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapGrooveJoint2D extends __RPCMapJoint2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapGrooveJoint2D extends __NameMapJoint2D {
    }
    /** A physics joint that restricts the movement of two 2D physics bodies to a fixed axis.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_groovejoint2d.html  
     */
    class GrooveJoint2D<Map extends NodePathMap = any> extends Joint2D<Map> {
        constructor(identifier?: any)
        /** The groove's length. The groove is from the joint's origin towards [member length] along the joint's local Y axis. */
        get length(): float64
        set length(value: float64)
        
        /** The body B's initial anchor position defined by the joint's origin and a local offset [member initial_offset] along the joint's Y axis (along the groove). */
        get initial_offset(): float64
        set initial_offset(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapGrooveJoint2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapGrooveJoint2D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapHBoxContainer extends __RPCMapBoxContainer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapHBoxContainer extends __NameMapBoxContainer {
    }
    /** A container that arranges its child controls horizontally.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_hboxcontainer.html  
     */
    class HBoxContainer<Map extends NodePathMap = any> extends BoxContainer<Map> {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapHBoxContainer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapHBoxContainer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapHFlowContainer extends __RPCMapFlowContainer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapHFlowContainer extends __NameMapFlowContainer {
    }
    /** A container that arranges its child controls horizontally and wraps them around at the borders.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_hflowcontainer.html  
     */
    class HFlowContainer<Map extends NodePathMap = any> extends FlowContainer<Map> {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapHFlowContainer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapHFlowContainer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapHMACContext extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapHMACContext extends __NameMapRefCounted {
    }
    /** Used to create an HMAC for a message using a key.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_hmaccontext.html  
     */
    class HMACContext extends RefCounted {
        constructor(identifier?: any)
        /** Initializes the HMACContext. This method cannot be called again on the same HMACContext until [method finish] has been called. */
        start(hash_type: HashingContext.HashType, key: PackedByteArray | byte[] | ArrayBuffer): Error
        
        /** Updates the message to be HMACed. This can be called multiple times before [method finish] is called to append [param data] to the message, but cannot be called until [method start] has been called. */
        update(data: PackedByteArray | byte[] | ArrayBuffer): Error
        
        /** Returns the resulting HMAC. If the HMAC failed, an empty [PackedByteArray] is returned. */
        finish(): PackedByteArray
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapHMACContext;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapHMACContext;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapHScrollBar extends __RPCMapScrollBar {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapHScrollBar extends __NameMapScrollBar {
    }
    /** A horizontal scrollbar that goes from left (min) to right (max).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_hscrollbar.html  
     */
    class HScrollBar<Map extends NodePathMap = any> extends ScrollBar<Map> {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapHScrollBar;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapHScrollBar;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapHSeparator extends __RPCMapSeparator {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapHSeparator extends __NameMapSeparator {
    }
    /** A horizontal line used for separating other controls.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_hseparator.html  
     */
    class HSeparator<Map extends NodePathMap = any> extends Separator<Map> {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapHSeparator;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapHSeparator;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapHSlider extends __RPCMapSlider {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapHSlider extends __NameMapSlider {
    }
    /** A horizontal slider that goes from left (min) to right (max).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_hslider.html  
     */
    class HSlider<Map extends NodePathMap = any> extends Slider<Map> {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapHSlider;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapHSlider;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapHSplitContainer extends __RPCMapSplitContainer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapHSplitContainer extends __NameMapSplitContainer {
    }
    /** A container that splits two child controls horizontally and provides a grabber for adjusting the split ratio.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_hsplitcontainer.html  
     */
    class HSplitContainer<Map extends NodePathMap = any> extends SplitContainer<Map> {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapHSplitContainer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapHSplitContainer;
    }
    namespace HTTPClient {
        enum Method {
            /** HTTP GET method. The GET method requests a representation of the specified resource. Requests using GET should only retrieve data. */
            METHOD_GET = 0,
            
            /** HTTP HEAD method. The HEAD method asks for a response identical to that of a GET request, but without the response body. This is useful to request metadata like HTTP headers or to check if a resource exists. */
            METHOD_HEAD = 1,
            
            /** HTTP POST method. The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server. This is often used for forms and submitting data or uploading files. */
            METHOD_POST = 2,
            
            /** HTTP PUT method. The PUT method asks to replace all current representations of the target resource with the request payload. (You can think of POST as "create or update" and PUT as "update", although many services tend to not make a clear distinction or change their meaning). */
            METHOD_PUT = 3,
            
            /** HTTP DELETE method. The DELETE method requests to delete the specified resource. */
            METHOD_DELETE = 4,
            
            /** HTTP OPTIONS method. The OPTIONS method asks for a description of the communication options for the target resource. Rarely used. */
            METHOD_OPTIONS = 5,
            
            /** HTTP TRACE method. The TRACE method performs a message loop-back test along the path to the target resource. Returns the entire HTTP request received in the response body. Rarely used. */
            METHOD_TRACE = 6,
            
            /** HTTP CONNECT method. The CONNECT method establishes a tunnel to the server identified by the target resource. Rarely used. */
            METHOD_CONNECT = 7,
            
            /** HTTP PATCH method. The PATCH method is used to apply partial modifications to a resource. */
            METHOD_PATCH = 8,
            
            /** Represents the size of the [enum Method] enum. */
            METHOD_MAX = 9,
        }
        enum Status {
            /** Status: Disconnected from the server. */
            STATUS_DISCONNECTED = 0,
            
            /** Status: Currently resolving the hostname for the given URL into an IP. */
            STATUS_RESOLVING = 1,
            
            /** Status: DNS failure: Can't resolve the hostname for the given URL. */
            STATUS_CANT_RESOLVE = 2,
            
            /** Status: Currently connecting to server. */
            STATUS_CONNECTING = 3,
            
            /** Status: Can't connect to the server. */
            STATUS_CANT_CONNECT = 4,
            
            /** Status: Connection established. */
            STATUS_CONNECTED = 5,
            
            /** Status: Currently sending request. */
            STATUS_REQUESTING = 6,
            
            /** Status: HTTP body received. */
            STATUS_BODY = 7,
            
            /** Status: Error in HTTP connection. */
            STATUS_CONNECTION_ERROR = 8,
            
            /** Status: Error in TLS handshake. */
            STATUS_TLS_HANDSHAKE_ERROR = 9,
        }
        enum ResponseCode {
            /** HTTP status code `100 Continue`. Interim response that indicates everything so far is OK and that the client should continue with the request (or ignore this status if already finished). */
            RESPONSE_CONTINUE = 100,
            
            /** HTTP status code `101 Switching Protocol`. Sent in response to an `Upgrade` request header by the client. Indicates the protocol the server is switching to. */
            RESPONSE_SWITCHING_PROTOCOLS = 101,
            
            /** HTTP status code `102 Processing` (WebDAV). Indicates that the server has received and is processing the request, but no response is available yet. */
            RESPONSE_PROCESSING = 102,
            
            /** HTTP status code `200 OK`. The request has succeeded. Default response for successful requests. Meaning varies depending on the request:  
             *  - [constant METHOD_GET]: The resource has been fetched and is transmitted in the message body.  
             *  - [constant METHOD_HEAD]: The entity headers are in the message body.  
             *  - [constant METHOD_POST]: The resource describing the result of the action is transmitted in the message body.  
             *  - [constant METHOD_TRACE]: The message body contains the request message as received by the server.  
             */
            RESPONSE_OK = 200,
            
            /** HTTP status code `201 Created`. The request has succeeded and a new resource has been created as a result of it. This is typically the response sent after a PUT request. */
            RESPONSE_CREATED = 201,
            
            /** HTTP status code `202 Accepted`. The request has been received but not yet acted upon. It is non-committal, meaning that there is no way in HTTP to later send an asynchronous response indicating the outcome of processing the request. It is intended for cases where another process or server handles the request, or for batch processing. */
            RESPONSE_ACCEPTED = 202,
            
            /** HTTP status code `203 Non-Authoritative Information`. This response code means returned meta-information set is not exact set as available from the origin server, but collected from a local or a third party copy. Except this condition, 200 OK response should be preferred instead of this response. */
            RESPONSE_NON_AUTHORITATIVE_INFORMATION = 203,
            
            /** HTTP status code `204 No Content`. There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones. */
            RESPONSE_NO_CONTENT = 204,
            
            /** HTTP status code `205 Reset Content`. The server has fulfilled the request and desires that the client resets the "document view" that caused the request to be sent to its original state as received from the origin server. */
            RESPONSE_RESET_CONTENT = 205,
            
            /** HTTP status code `206 Partial Content`. This response code is used because of a range header sent by the client to separate download into multiple streams. */
            RESPONSE_PARTIAL_CONTENT = 206,
            
            /** HTTP status code `207 Multi-Status` (WebDAV). A Multi-Status response conveys information about multiple resources in situations where multiple status codes might be appropriate. */
            RESPONSE_MULTI_STATUS = 207,
            
            /** HTTP status code `208 Already Reported` (WebDAV). Used inside a DAV: propstat response element to avoid enumerating the internal members of multiple bindings to the same collection repeatedly. */
            RESPONSE_ALREADY_REPORTED = 208,
            
            /** HTTP status code `226 IM Used` (WebDAV). The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance. */
            RESPONSE_IM_USED = 226,
            
            /** HTTP status code `300 Multiple Choice`. The request has more than one possible responses and there is no standardized way to choose one of the responses. User-agent or user should choose one of them. */
            RESPONSE_MULTIPLE_CHOICES = 300,
            
            /** HTTP status code `301 Moved Permanently`. Redirection. This response code means the URI of requested resource has been changed. The new URI is usually included in the response. */
            RESPONSE_MOVED_PERMANENTLY = 301,
            
            /** HTTP status code `302 Found`. Temporary redirection. This response code means the URI of requested resource has been changed temporarily. New changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests. */
            RESPONSE_FOUND = 302,
            
            /** HTTP status code `303 See Other`. The server is redirecting the user agent to a different resource, as indicated by a URI in the Location header field, which is intended to provide an indirect response to the original request. */
            RESPONSE_SEE_OTHER = 303,
            
            /** HTTP status code `304 Not Modified`. A conditional GET or HEAD request has been received and would have resulted in a 200 OK response if it were not for the fact that the condition evaluated to `false`. */
            RESPONSE_NOT_MODIFIED = 304,
            
            /** HTTP status code `305 Use Proxy`. */
            RESPONSE_USE_PROXY = 305,
            
            /** HTTP status code `306 Switch Proxy`. */
            RESPONSE_SWITCH_PROXY = 306,
            
            /** HTTP status code `307 Temporary Redirect`. The target resource resides temporarily under a different URI and the user agent MUST NOT change the request method if it performs an automatic redirection to that URI. */
            RESPONSE_TEMPORARY_REDIRECT = 307,
            
            /** HTTP status code `308 Permanent Redirect`. The target resource has been assigned a new permanent URI and any future references to this resource ought to use one of the enclosed URIs. */
            RESPONSE_PERMANENT_REDIRECT = 308,
            
            /** HTTP status code `400 Bad Request`. The request was invalid. The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, invalid request contents, or deceptive request routing). */
            RESPONSE_BAD_REQUEST = 400,
            
            /** HTTP status code `401 Unauthorized`. Credentials required. The request has not been applied because it lacks valid authentication credentials for the target resource. */
            RESPONSE_UNAUTHORIZED = 401,
            
            /** HTTP status code `402 Payment Required`. This response code is reserved for future use. Initial aim for creating this code was using it for digital payment systems, however this is not currently used. */
            RESPONSE_PAYMENT_REQUIRED = 402,
            
            /** HTTP status code `403 Forbidden`. The client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike `401`, the client's identity is known to the server. */
            RESPONSE_FORBIDDEN = 403,
            
            /** HTTP status code `404 Not Found`. The server can not find requested resource. Either the URL is not recognized or the endpoint is valid but the resource itself does not exist. May also be sent instead of 403 to hide existence of a resource if the client is not authorized. */
            RESPONSE_NOT_FOUND = 404,
            
            /** HTTP status code `405 Method Not Allowed`. The request's HTTP method is known by the server but has been disabled and cannot be used. For example, an API may forbid DELETE-ing a resource. The two mandatory methods, GET and HEAD, must never be disabled and should not return this error code. */
            RESPONSE_METHOD_NOT_ALLOWED = 405,
            
            /** HTTP status code `406 Not Acceptable`. The target resource does not have a current representation that would be acceptable to the user agent, according to the proactive negotiation header fields received in the request. Used when negotiation content. */
            RESPONSE_NOT_ACCEPTABLE = 406,
            
            /** HTTP status code `407 Proxy Authentication Required`. Similar to 401 Unauthorized, but it indicates that the client needs to authenticate itself in order to use a proxy. */
            RESPONSE_PROXY_AUTHENTICATION_REQUIRED = 407,
            
            /** HTTP status code `408 Request Timeout`. The server did not receive a complete request message within the time that it was prepared to wait. */
            RESPONSE_REQUEST_TIMEOUT = 408,
            
            /** HTTP status code `409 Conflict`. The request could not be completed due to a conflict with the current state of the target resource. This code is used in situations where the user might be able to resolve the conflict and resubmit the request. */
            RESPONSE_CONFLICT = 409,
            
            /** HTTP status code `410 Gone`. The target resource is no longer available at the origin server and this condition is likely permanent. */
            RESPONSE_GONE = 410,
            
            /** HTTP status code `411 Length Required`. The server refuses to accept the request without a defined Content-Length header. */
            RESPONSE_LENGTH_REQUIRED = 411,
            
            /** HTTP status code `412 Precondition Failed`. One or more conditions given in the request header fields evaluated to `false` when tested on the server. */
            RESPONSE_PRECONDITION_FAILED = 412,
            
            /** HTTP status code `413 Entity Too Large`. The server is refusing to process a request because the request payload is larger than the server is willing or able to process. */
            RESPONSE_REQUEST_ENTITY_TOO_LARGE = 413,
            
            /** HTTP status code `414 Request-URI Too Long`. The server is refusing to service the request because the request-target is longer than the server is willing to interpret. */
            RESPONSE_REQUEST_URI_TOO_LONG = 414,
            
            /** HTTP status code `415 Unsupported Media Type`. The origin server is refusing to service the request because the payload is in a format not supported by this method on the target resource. */
            RESPONSE_UNSUPPORTED_MEDIA_TYPE = 415,
            
            /** HTTP status code `416 Requested Range Not Satisfiable`. None of the ranges in the request's Range header field overlap the current extent of the selected resource or the set of ranges requested has been rejected due to invalid ranges or an excessive request of small or overlapping ranges. */
            RESPONSE_REQUESTED_RANGE_NOT_SATISFIABLE = 416,
            
            /** HTTP status code `417 Expectation Failed`. The expectation given in the request's Expect header field could not be met by at least one of the inbound servers. */
            RESPONSE_EXPECTATION_FAILED = 417,
            
            /** HTTP status code `418 I'm A Teapot`. Any attempt to brew coffee with a teapot should result in the error code "418 I'm a teapot". The resulting entity body MAY be short and stout. */
            RESPONSE_IM_A_TEAPOT = 418,
            
            /** HTTP status code `421 Misdirected Request`. The request was directed at a server that is not able to produce a response. This can be sent by a server that is not configured to produce responses for the combination of scheme and authority that are included in the request URI. */
            RESPONSE_MISDIRECTED_REQUEST = 421,
            
            /** HTTP status code `422 Unprocessable Entity` (WebDAV). The server understands the content type of the request entity (hence a 415 Unsupported Media Type status code is inappropriate), and the syntax of the request entity is correct (thus a 400 Bad Request status code is inappropriate) but was unable to process the contained instructions. */
            RESPONSE_UNPROCESSABLE_ENTITY = 422,
            
            /** HTTP status code `423 Locked` (WebDAV). The source or destination resource of a method is locked. */
            RESPONSE_LOCKED = 423,
            
            /** HTTP status code `424 Failed Dependency` (WebDAV). The method could not be performed on the resource because the requested action depended on another action and that action failed. */
            RESPONSE_FAILED_DEPENDENCY = 424,
            
            /** HTTP status code `426 Upgrade Required`. The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. */
            RESPONSE_UPGRADE_REQUIRED = 426,
            
            /** HTTP status code `428 Precondition Required`. The origin server requires the request to be conditional. */
            RESPONSE_PRECONDITION_REQUIRED = 428,
            
            /** HTTP status code `429 Too Many Requests`. The user has sent too many requests in a given amount of time (see "rate limiting"). Back off and increase time between requests or try again later. */
            RESPONSE_TOO_MANY_REQUESTS = 429,
            
            /** HTTP status code `431 Request Header Fields Too Large`. The server is unwilling to process the request because its header fields are too large. The request MAY be resubmitted after reducing the size of the request header fields. */
            RESPONSE_REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
            
            /** HTTP status code `451 Response Unavailable For Legal Reasons`. The server is denying access to the resource as a consequence of a legal demand. */
            RESPONSE_UNAVAILABLE_FOR_LEGAL_REASONS = 451,
            
            /** HTTP status code `500 Internal Server Error`. The server encountered an unexpected condition that prevented it from fulfilling the request. */
            RESPONSE_INTERNAL_SERVER_ERROR = 500,
            
            /** HTTP status code `501 Not Implemented`. The server does not support the functionality required to fulfill the request. */
            RESPONSE_NOT_IMPLEMENTED = 501,
            
            /** HTTP status code `502 Bad Gateway`. The server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request. Usually returned by load balancers or proxies. */
            RESPONSE_BAD_GATEWAY = 502,
            
            /** HTTP status code `503 Service Unavailable`. The server is currently unable to handle the request due to a temporary overload or scheduled maintenance, which will likely be alleviated after some delay. Try again later. */
            RESPONSE_SERVICE_UNAVAILABLE = 503,
            
            /** HTTP status code `504 Gateway Timeout`. The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server it needed to access in order to complete the request. Usually returned by load balancers or proxies. */
            RESPONSE_GATEWAY_TIMEOUT = 504,
            
            /** HTTP status code `505 HTTP Version Not Supported`. The server does not support, or refuses to support, the major version of HTTP that was used in the request message. */
            RESPONSE_HTTP_VERSION_NOT_SUPPORTED = 505,
            
            /** HTTP status code `506 Variant Also Negotiates`. The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process. */
            RESPONSE_VARIANT_ALSO_NEGOTIATES = 506,
            
            /** HTTP status code `507 Insufficient Storage`. The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request. */
            RESPONSE_INSUFFICIENT_STORAGE = 507,
            
            /** HTTP status code `508 Loop Detected`. The server terminated an operation because it encountered an infinite loop while processing a request with "Depth: infinity". This status indicates that the entire operation failed. */
            RESPONSE_LOOP_DETECTED = 508,
            
            /** HTTP status code `510 Not Extended`. The policy for accessing the resource has not been met in the request. The server should send back all the information necessary for the client to issue an extended request. */
            RESPONSE_NOT_EXTENDED = 510,
            
            /** HTTP status code `511 Network Authentication Required`. The client needs to authenticate to gain network access. */
            RESPONSE_NETWORK_AUTH_REQUIRED = 511,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapHTTPClient extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapHTTPClient extends __NameMapRefCounted {
    }
    /** Low-level hyper-text transfer protocol client.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_httpclient.html  
     */
    class HTTPClient extends RefCounted {
        constructor(identifier?: any)
        /** Connects to a host. This needs to be done before any requests are sent.  
         *  If no [param port] is specified (or `-1` is used), it is automatically set to 80 for HTTP and 443 for HTTPS. You can pass the optional [param tls_options] parameter to customize the trusted certification authorities, or the common name verification when using HTTPS. See [method TLSOptions.client] and [method TLSOptions.client_unsafe].  
         */
        connect_to_host(host: string, port?: int64 /* = -1 */, tls_options?: TLSOptions): Error
        
        /** Sends a raw HTTP request to the connected host with the given [param method].  
         *  The URL parameter is usually just the part after the host, so for `https://example.com/index.php`, it is `/index.php`. When sending requests to an HTTP proxy server, it should be an absolute URL. For [constant HTTPClient.METHOD_OPTIONS] requests, `*` is also allowed. For [constant HTTPClient.METHOD_CONNECT] requests, it should be the authority component (`host:port`).  
         *  [param headers] are HTTP request headers.  
         *  Sends the body data raw, as a byte array and does not encode it in any way.  
         */
        request_raw(method: HTTPClient.Method, url: string, headers: PackedStringArray | string[], body: PackedByteArray | byte[] | ArrayBuffer): Error
        
        /** Sends an HTTP request to the connected host with the given [param method].  
         *  The URL parameter is usually just the part after the host, so for `https://example.com/index.php`, it is `/index.php`. When sending requests to an HTTP proxy server, it should be an absolute URL. For [constant HTTPClient.METHOD_OPTIONS] requests, `*` is also allowed. For [constant HTTPClient.METHOD_CONNECT] requests, it should be the authority component (`host:port`).  
         *  [param headers] are HTTP request headers.  
         *  To create a POST request with query strings to push to the server, do:  
         *    
         *      
         *  **Note:** The [param body] parameter is ignored if [param method] is [constant HTTPClient.METHOD_GET]. This is because GET methods can't contain request data. As a workaround, you can pass request data as a query string in the URL. See [method String.uri_encode] for an example.  
         */
        request(method: HTTPClient.Method, url: string, headers: PackedStringArray | string[], body?: string /* = '' */): Error
        
        /** Closes the current connection, allowing reuse of this [HTTPClient]. */
        close(): void
        
        /** If `true`, this [HTTPClient] has a response available. */
        has_response(): boolean
        
        /** If `true`, this [HTTPClient] has a response that is chunked. */
        is_response_chunked(): boolean
        
        /** Returns the response's HTTP status code. */
        get_response_code(): int64
        
        /** Returns the response headers. */
        get_response_headers(): PackedStringArray
        
        /** Returns all response headers as a [Dictionary]. Each entry is composed by the header name, and a [String] containing the values separated by `"; "`. The casing is kept the same as the headers were received.  
         *    
         */
        get_response_headers_as_dictionary(): GDictionary
        
        /** Returns the response's body length.  
         *      
         *  **Note:** Some Web servers may not send a body length. In this case, the value returned will be `-1`. If using chunked transfer encoding, the body length will also be `-1`.  
         *      
         *  **Note:** This function always returns `-1` on the Web platform due to browsers limitations.  
         */
        get_response_body_length(): int64
        
        /** Reads one chunk from the response. */
        read_response_body_chunk(): PackedByteArray
        
        /** Returns a [enum Status] constant. Need to call [method poll] in order to get status updates. */
        get_status(): HTTPClient.Status
        
        /** This needs to be called in order to have any request processed. Check results with [method get_status]. */
        poll(): Error
        
        /** Sets the proxy server for HTTP requests.  
         *  The proxy server is unset if [param host] is empty or [param port] is -1.  
         */
        set_http_proxy(host: string, port: int64): void
        
        /** Sets the proxy server for HTTPS requests.  
         *  The proxy server is unset if [param host] is empty or [param port] is -1.  
         */
        set_https_proxy(host: string, port: int64): void
        
        /** Generates a GET/POST application/x-www-form-urlencoded style query string from a provided dictionary, e.g.:  
         *    
         *  Furthermore, if a key has a `null` value, only the key itself is added, without equal sign and value. If the value is an array, for each value in it a pair with the same key is added.  
         *    
         */
        query_string_from_dict(fields: GDictionary): string
        
        /** If `true`, execution will block until all data is read from the response. */
        get blocking_mode_enabled(): boolean
        set blocking_mode_enabled(value: boolean)
        
        /** The connection to use for this client. */
        get connection(): null | StreamPeer
        set connection(value: null | StreamPeer)
        
        /** The size of the buffer used and maximum bytes to read per iteration. See [method read_response_body_chunk]. */
        get read_chunk_size(): int64
        set read_chunk_size(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapHTTPClient;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapHTTPClient;
    }
    namespace HTTPRequest {
        enum Result {
            /** Request successful. */
            RESULT_SUCCESS = 0,
            
            /** Request failed due to a mismatch between the expected and actual chunked body size during transfer. Possible causes include network errors, server misconfiguration, or issues with chunked encoding. */
            RESULT_CHUNKED_BODY_SIZE_MISMATCH = 1,
            
            /** Request failed while connecting. */
            RESULT_CANT_CONNECT = 2,
            
            /** Request failed while resolving. */
            RESULT_CANT_RESOLVE = 3,
            
            /** Request failed due to connection (read/write) error. */
            RESULT_CONNECTION_ERROR = 4,
            
            /** Request failed on TLS handshake. */
            RESULT_TLS_HANDSHAKE_ERROR = 5,
            
            /** Request does not have a response (yet). */
            RESULT_NO_RESPONSE = 6,
            
            /** Request exceeded its maximum size limit, see [member body_size_limit]. */
            RESULT_BODY_SIZE_LIMIT_EXCEEDED = 7,
            
            /** Request failed due to an error while decompressing the response body. Possible causes include unsupported or incorrect compression format, corrupted data, or incomplete transfer. */
            RESULT_BODY_DECOMPRESS_FAILED = 8,
            
            /** Request failed (currently unused). */
            RESULT_REQUEST_FAILED = 9,
            
            /** HTTPRequest couldn't open the download file. */
            RESULT_DOWNLOAD_FILE_CANT_OPEN = 10,
            
            /** HTTPRequest couldn't write to the download file. */
            RESULT_DOWNLOAD_FILE_WRITE_ERROR = 11,
            
            /** Request reached its maximum redirect limit, see [member max_redirects]. */
            RESULT_REDIRECT_LIMIT_REACHED = 12,
            
            /** Request failed due to a timeout. If you expect requests to take a long time, try increasing the value of [member timeout] or setting it to `0.0` to remove the timeout completely. */
            RESULT_TIMEOUT = 13,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapHTTPRequest extends __RPCMapNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapHTTPRequest extends __NameMapNode {
    }
    /** A node with the ability to send HTTP(S) requests.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_httprequest.html  
     */
    class HTTPRequest<Map extends NodePathMap = any> extends Node<Map> {
        constructor(identifier?: any)
        /** Creates request on the underlying [HTTPClient]. If there is no configuration errors, it tries to connect using [method HTTPClient.connect_to_host] and passes parameters onto [method HTTPClient.request].  
         *  Returns [constant OK] if request is successfully created. (Does not imply that the server has responded), [constant ERR_UNCONFIGURED] if not in the tree, [constant ERR_BUSY] if still processing previous request, [constant ERR_INVALID_PARAMETER] if given string is not a valid URL format, or [constant ERR_CANT_CONNECT] if not using thread and the [HTTPClient] cannot connect to host.  
         *      
         *  **Note:** When [param method] is [constant HTTPClient.METHOD_GET], the payload sent via [param request_data] might be ignored by the server or even cause the server to reject the request (check [url=https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.1]RFC 7231 section 4.3.1[/url] for more details). As a workaround, you can send data as a query string in the URL (see [method String.uri_encode] for an example).  
         *      
         *  **Note:** It's recommended to use transport encryption (TLS) and to avoid sending sensitive information (such as login credentials) in HTTP GET URL parameters. Consider using HTTP POST requests or HTTP headers for such information instead.  
         */
        request(url: string, custom_headers?: PackedStringArray | string[] /* = [] */, method?: HTTPClient.Method /* = 0 */, request_data?: string /* = '' */): Error
        
        /** Creates request on the underlying [HTTPClient] using a raw array of bytes for the request body. If there is no configuration errors, it tries to connect using [method HTTPClient.connect_to_host] and passes parameters onto [method HTTPClient.request].  
         *  Returns [constant OK] if request is successfully created. (Does not imply that the server has responded), [constant ERR_UNCONFIGURED] if not in the tree, [constant ERR_BUSY] if still processing previous request, [constant ERR_INVALID_PARAMETER] if given string is not a valid URL format, or [constant ERR_CANT_CONNECT] if not using thread and the [HTTPClient] cannot connect to host.  
         */
        request_raw(url: string, custom_headers?: PackedStringArray | string[] /* = [] */, method?: HTTPClient.Method /* = 0 */, request_data_raw?: PackedByteArray | byte[] | ArrayBuffer /* = [] */): Error
        
        /** Cancels the current request. */
        cancel_request(): void
        
        /** Sets the [TLSOptions] to be used when connecting to an HTTPS server. See [method TLSOptions.client]. */
        set_tls_options(client_options: TLSOptions): void
        
        /** Returns the current status of the underlying [HTTPClient]. */
        get_http_client_status(): HTTPClient.Status
        
        /** Returns the number of bytes this HTTPRequest downloaded. */
        get_downloaded_bytes(): int64
        
        /** Returns the response body length.  
         *      
         *  **Note:** Some Web servers may not send a body length. In this case, the value returned will be `-1`. If using chunked transfer encoding, the body length will also be `-1`.  
         */
        get_body_size(): int64
        
        /** Sets the proxy server for HTTP requests.  
         *  The proxy server is unset if [param host] is empty or [param port] is -1.  
         */
        set_http_proxy(host: string, port: int64): void
        
        /** Sets the proxy server for HTTPS requests.  
         *  The proxy server is unset if [param host] is empty or [param port] is -1.  
         */
        set_https_proxy(host: string, port: int64): void
        
        /** The file to download into. Will output any received file into it. */
        get download_file(): string
        set download_file(value: string)
        
        /** The size of the buffer used and maximum bytes to read per iteration. See [member HTTPClient.read_chunk_size].  
         *  Set this to a lower value (e.g. 4096 for 4 KiB) when downloading small files to decrease memory usage at the cost of download speeds.  
         */
        get download_chunk_size(): int64
        set download_chunk_size(value: int64)
        
        /** If `true`, multithreading is used to improve performance. */
        get use_threads(): boolean
        set use_threads(value: boolean)
        
        /** If `true`, this header will be added to each request: `Accept-Encoding: gzip, deflate` telling servers that it's okay to compress response bodies.  
         *  Any Response body declaring a `Content-Encoding` of either `gzip` or `deflate` will then be automatically decompressed, and the uncompressed bytes will be delivered via [signal request_completed].  
         *  If the user has specified their own `Accept-Encoding` header, then no header will be added regardless of [member accept_gzip].  
         *  If `false` no header will be added, and no decompression will be performed on response bodies. The raw bytes of the response body will be returned via [signal request_completed].  
         */
        get accept_gzip(): boolean
        set accept_gzip(value: boolean)
        
        /** Maximum allowed size for response bodies. If the response body is compressed, this will be used as the maximum allowed size for the decompressed body. */
        get body_size_limit(): int64
        set body_size_limit(value: int64)
        
        /** Maximum number of allowed redirects. */
        get max_redirects(): int64
        set max_redirects(value: int64)
        
        /** The duration to wait before a request times out, in seconds (independent of [member Engine.time_scale]). If [member timeout] is set to `0.0`, the request will never time out.  
         *  For simple requests, such as communication with a REST API, it is recommended to set [member timeout] to a value suitable for the server response time (commonly between `1.0` and `10.0`). This will help prevent unwanted timeouts caused by variation in response times while still allowing the application to detect when a request has timed out. For larger requests such as file downloads, it is recommended to set [member timeout] to `0.0`, disabling the timeout functionality. This will help prevent large transfers from failing due to exceeding the timeout value.  
         */
        get timeout(): float64
        set timeout(value: float64)
        
        /** Emitted when a request is completed. */
        readonly request_completed: Signal<(result: int64, response_code: int64, headers: PackedStringArray, body: PackedByteArray) => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapHTTPRequest;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapHTTPRequest;
    }
    namespace HashingContext {
        enum HashType {
            /** Hashing algorithm: MD5. */
            HASH_MD5 = 0,
            
            /** Hashing algorithm: SHA-1. */
            HASH_SHA1 = 1,
            
            /** Hashing algorithm: SHA-256. */
            HASH_SHA256 = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapHashingContext extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapHashingContext extends __NameMapRefCounted {
    }
    /** Provides functionality for computing cryptographic hashes chunk by chunk.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_hashingcontext.html  
     */
    class HashingContext extends RefCounted {
        constructor(identifier?: any)
        /** Starts a new hash computation of the given [param type] (e.g. [constant HASH_SHA256] to start computation of an SHA-256). */
        start(type: HashingContext.HashType): Error
        
        /** Updates the computation with the given [param chunk] of data. */
        update(chunk: PackedByteArray | byte[] | ArrayBuffer): Error
        
        /** Closes the current context, and return the computed hash. */
        finish(): PackedByteArray
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapHashingContext;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapHashingContext;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapHeightMapShape3D extends __RPCMapShape3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapHeightMapShape3D extends __NameMapShape3D {
    }
    /** A 3D heightmap shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_heightmapshape3d.html  
     */
    class HeightMapShape3D extends Shape3D {
        constructor(identifier?: any)
        /** Returns the smallest height value found in [member map_data]. Recalculates only when [member map_data] changes. */
        get_min_height(): float64
        
        /** Returns the largest height value found in [member map_data]. Recalculates only when [member map_data] changes. */
        get_max_height(): float64
        
        /** Updates [member map_data] with data read from an [Image] reference. Automatically resizes heightmap [member map_width] and [member map_depth] to fit the full image width and height.  
         *  The image needs to be in either [constant Image.FORMAT_RF] (32 bit), [constant Image.FORMAT_RH] (16 bit), or [constant Image.FORMAT_R8] (8 bit).  
         *  Each image pixel is read in as a float on the range from `0.0` (black pixel) to `1.0` (white pixel). This range value gets remapped to [param height_min] and [param height_max] to form the final height value.  
         *      
         *  **Note:** Using a heightmap with 16-bit or 32-bit data, stored in EXR or HDR format is recommended. Using 8-bit height data, or a format like PNG that Godot imports as 8-bit, will result in a terraced terrain.  
         */
        update_map_data_from_image(image: Image, height_min: float64, height_max: float64): void
        
        /** Number of vertices in the width of the heightmap. Changing this will resize the [member map_data]. */
        get map_width(): int64
        set map_width(value: int64)
        
        /** Number of vertices in the depth of the heightmap. Changing this will resize the [member map_data]. */
        get map_depth(): int64
        set map_depth(value: int64)
        
        /** Heightmap data. The array's size must be equal to [member map_width] multiplied by [member map_depth]. */
        get map_data(): PackedFloat32Array
        set map_data(value: PackedFloat32Array | float32[])
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapHeightMapShape3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapHeightMapShape3D;
    }
    namespace HingeJoint3D {
        enum Param {
            /** The speed with which the two bodies get pulled together when they move in different directions. */
            PARAM_BIAS = 0,
            
            /** The maximum rotation. Only active if [member angular_limit/enable] is `true`. */
            PARAM_LIMIT_UPPER = 1,
            
            /** The minimum rotation. Only active if [member angular_limit/enable] is `true`. */
            PARAM_LIMIT_LOWER = 2,
            
            /** The speed with which the rotation across the axis perpendicular to the hinge gets corrected. */
            PARAM_LIMIT_BIAS = 3,
            PARAM_LIMIT_SOFTNESS = 4,
            
            /** The lower this value, the more the rotation gets slowed down. */
            PARAM_LIMIT_RELAXATION = 5,
            
            /** Target speed for the motor. */
            PARAM_MOTOR_TARGET_VELOCITY = 6,
            
            /** Maximum acceleration for the motor. */
            PARAM_MOTOR_MAX_IMPULSE = 7,
            
            /** Represents the size of the [enum Param] enum. */
            PARAM_MAX = 8,
        }
        enum Flag {
            /** If `true`, the hinges maximum and minimum rotation, defined by [member angular_limit/lower] and [member angular_limit/upper] has effects. */
            FLAG_USE_LIMIT = 0,
            
            /** When activated, a motor turns the hinge. */
            FLAG_ENABLE_MOTOR = 1,
            
            /** Represents the size of the [enum Flag] enum. */
            FLAG_MAX = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapHingeJoint3D extends __RPCMapJoint3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapHingeJoint3D extends __NameMapJoint3D {
    }
    /** A physics joint that restricts the rotation of a 3D physics body around an axis relative to another physics body.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_hingejoint3d.html  
     */
    class HingeJoint3D<Map extends NodePathMap = any> extends Joint3D<Map> {
        constructor(identifier?: any)
        /** Sets the value of the specified parameter. */
        set_param(param: HingeJoint3D.Param, value: float64): void
        
        /** Returns the value of the specified parameter. */
        get_param(param: HingeJoint3D.Param): float64
        
        /** If `true`, enables the specified flag. */
        set_flag(flag: HingeJoint3D.Flag, enabled: boolean): void
        
        /** Returns the value of the specified flag. */
        get_flag(flag: HingeJoint3D.Flag): boolean
        
        /** The speed with which the two bodies get pulled together when they move in different directions. */
        get "params/bias"(): float64
        set "params/bias"(value: float64)
        
        /** If `true`, the hinges maximum and minimum rotation, defined by [member angular_limit/lower] and [member angular_limit/upper] has effects. */
        get "angular_limit/enable"(): boolean
        set "angular_limit/enable"(value: boolean)
        
        /** The maximum rotation. Only active if [member angular_limit/enable] is `true`. */
        get "angular_limit/upper"(): float64
        set "angular_limit/upper"(value: float64)
        
        /** The minimum rotation. Only active if [member angular_limit/enable] is `true`. */
        get "angular_limit/lower"(): float64
        set "angular_limit/lower"(value: float64)
        
        /** The speed with which the rotation across the axis perpendicular to the hinge gets corrected. */
        get "angular_limit/bias"(): float64
        set "angular_limit/bias"(value: float64)
        get "angular_limit/softness"(): float64
        set "angular_limit/softness"(value: float64)
        
        /** The lower this value, the more the rotation gets slowed down. */
        get "angular_limit/relaxation"(): float64
        set "angular_limit/relaxation"(value: float64)
        
        /** When activated, a motor turns the hinge. */
        get "motor/enable"(): boolean
        set "motor/enable"(value: boolean)
        
        /** Target speed for the motor. */
        get "motor/target_velocity"(): float64
        set "motor/target_velocity"(value: float64)
        
        /** Maximum acceleration for the motor. */
        get "motor/max_impulse"(): float64
        set "motor/max_impulse"(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapHingeJoint3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapHingeJoint3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapIKModifier3D extends __RPCMapSkeletonModifier3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapIKModifier3D extends __NameMapSkeletonModifier3D {
    }
    /** A node for inverse kinematics which may modify more than one bone.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_ikmodifier3d.html  
     */
    class IKModifier3D<Map extends NodePathMap = any> extends SkeletonModifier3D<Map> {
        constructor(identifier?: any)
        /** Sets the number of settings. */
        set_setting_count(count: int64): void
        
        /** Returns the number of settings. */
        get_setting_count(): int64
        
        /** Clears all settings. */
        clear_settings(): void
        
        /** Resets a state with respect to the current bone pose. */
        reset(): void
        
        /** If `true`, the solver retrieves the bone axis from the bone pose every frame.  
         *  If `false`, the solver retrieves the bone axis from the bone rest and caches it, which increases performance slightly, but position changes in the bone pose made before processing this [IKModifier3D] are ignored.  
         */
        get mutable_bone_axes(): boolean
        set mutable_bone_axes(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapIKModifier3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapIKModifier3D;
    }
    namespace Image {
        enum Format {
            /** Texture format with a single 8-bit depth representing luminance. */
            FORMAT_L8 = 0,
            
            /** OpenGL texture format with two values, luminance and alpha each stored with 8 bits. */
            FORMAT_LA8 = 1,
            
            /** OpenGL texture format `RED` with a single component and a bitdepth of 8. */
            FORMAT_R8 = 2,
            
            /** OpenGL texture format `RG` with two components and a bitdepth of 8 for each. */
            FORMAT_RG8 = 3,
            
            /** OpenGL texture format `RGB` with three components, each with a bitdepth of 8.  
             *      
             *  **Note:** When creating an [ImageTexture], a nonlinear sRGB to linear encoding conversion is performed.  
             */
            FORMAT_RGB8 = 4,
            
            /** OpenGL texture format `RGBA` with four components, each with a bitdepth of 8.  
             *      
             *  **Note:** When creating an [ImageTexture], a nonlinear sRGB to linear encoding conversion is performed.  
             */
            FORMAT_RGBA8 = 5,
            
            /** OpenGL texture format `RGBA` with four components, each with a bitdepth of 4. */
            FORMAT_RGBA4444 = 6,
            
            /** OpenGL texture format `RGB` with three components. Red and blue have a bitdepth of 5, and green has a bitdepth of 6. */
            FORMAT_RGB565 = 7,
            
            /** OpenGL texture format `GL_R32F` where there's one component, a 32-bit floating-point value. */
            FORMAT_RF = 8,
            
            /** OpenGL texture format `GL_RG32F` where there are two components, each a 32-bit floating-point values. */
            FORMAT_RGF = 9,
            
            /** OpenGL texture format `GL_RGB32F` where there are three components, each a 32-bit floating-point values. */
            FORMAT_RGBF = 10,
            
            /** OpenGL texture format `GL_RGBA32F` where there are four components, each a 32-bit floating-point values. */
            FORMAT_RGBAF = 11,
            
            /** OpenGL texture format `GL_R16F` where there's one component, a 16-bit "half-precision" floating-point value. */
            FORMAT_RH = 12,
            
            /** OpenGL texture format `GL_RG16F` where there are two components, each a 16-bit "half-precision" floating-point value. */
            FORMAT_RGH = 13,
            
            /** OpenGL texture format `GL_RGB16F` where there are three components, each a 16-bit "half-precision" floating-point value. */
            FORMAT_RGBH = 14,
            
            /** OpenGL texture format `GL_RGBA16F` where there are four components, each a 16-bit "half-precision" floating-point value. */
            FORMAT_RGBAH = 15,
            
            /** A special OpenGL texture format where the three color components have 9 bits of precision and all three share a single 5-bit exponent. */
            FORMAT_RGBE9995 = 16,
            
            /** The [url=https://en.wikipedia.org/wiki/S3_Texture_Compression]S3TC[/url] texture format that uses Block Compression 1, and is the smallest variation of S3TC, only providing 1 bit of alpha and color data being premultiplied with alpha.  
             *      
             *  **Note:** When creating an [ImageTexture], a nonlinear sRGB to linear encoding conversion is performed.  
             */
            FORMAT_DXT1 = 17,
            
            /** The [url=https://en.wikipedia.org/wiki/S3_Texture_Compression]S3TC[/url] texture format that uses Block Compression 2, and color data is interpreted as not having been premultiplied by alpha. Well suited for images with sharp alpha transitions between translucent and opaque areas.  
             *      
             *  **Note:** When creating an [ImageTexture], a nonlinear sRGB to linear encoding conversion is performed.  
             */
            FORMAT_DXT3 = 18,
            
            /** The [url=https://en.wikipedia.org/wiki/S3_Texture_Compression]S3TC[/url] texture format also known as Block Compression 3 or BC3 that contains 64 bits of alpha channel data followed by 64 bits of DXT1-encoded color data. Color data is not premultiplied by alpha, same as DXT3. DXT5 generally produces superior results for transparent gradients compared to DXT3.  
             *      
             *  **Note:** When creating an [ImageTexture], a nonlinear sRGB to linear encoding conversion is performed.  
             */
            FORMAT_DXT5 = 19,
            
            /** Texture format that uses [url=https://www.khronos.org/opengl/wiki/Red_Green_Texture_Compression]Red Green Texture Compression[/url], normalizing the red channel data using the same compression algorithm that DXT5 uses for the alpha channel. */
            FORMAT_RGTC_R = 20,
            
            /** Texture format that uses [url=https://www.khronos.org/opengl/wiki/Red_Green_Texture_Compression]Red Green Texture Compression[/url], normalizing the red and green channel data using the same compression algorithm that DXT5 uses for the alpha channel. */
            FORMAT_RGTC_RG = 21,
            
            /** Texture format that uses [url=https://www.khronos.org/opengl/wiki/BPTC_Texture_Compression]BPTC[/url] compression with unsigned normalized RGBA components.  
             *      
             *  **Note:** When creating an [ImageTexture], a nonlinear sRGB to linear encoding conversion is performed.  
             */
            FORMAT_BPTC_RGBA = 22,
            
            /** Texture format that uses [url=https://www.khronos.org/opengl/wiki/BPTC_Texture_Compression]BPTC[/url] compression with signed floating-point RGB components. */
            FORMAT_BPTC_RGBF = 23,
            
            /** Texture format that uses [url=https://www.khronos.org/opengl/wiki/BPTC_Texture_Compression]BPTC[/url] compression with unsigned floating-point RGB components. */
            FORMAT_BPTC_RGBFU = 24,
            
            /** [url=https://en.wikipedia.org/wiki/Ericsson_Texture_Compression#ETC1]Ericsson Texture Compression format 1[/url], also referred to as "ETC1", and is part of the OpenGL ES graphics standard. This format cannot store an alpha channel. */
            FORMAT_ETC = 25,
            
            /** [url=https://en.wikipedia.org/wiki/Ericsson_Texture_Compression#ETC2_and_EAC]Ericsson Texture Compression format 2[/url] (`R11_EAC` variant), which provides one channel of unsigned data. */
            FORMAT_ETC2_R11 = 26,
            
            /** [url=https://en.wikipedia.org/wiki/Ericsson_Texture_Compression#ETC2_and_EAC]Ericsson Texture Compression format 2[/url] (`SIGNED_R11_EAC` variant), which provides one channel of signed data. */
            FORMAT_ETC2_R11S = 27,
            
            /** [url=https://en.wikipedia.org/wiki/Ericsson_Texture_Compression#ETC2_and_EAC]Ericsson Texture Compression format 2[/url] (`RG11_EAC` variant), which provides two channels of unsigned data. */
            FORMAT_ETC2_RG11 = 28,
            
            /** [url=https://en.wikipedia.org/wiki/Ericsson_Texture_Compression#ETC2_and_EAC]Ericsson Texture Compression format 2[/url] (`SIGNED_RG11_EAC` variant), which provides two channels of signed data. */
            FORMAT_ETC2_RG11S = 29,
            
            /** [url=https://en.wikipedia.org/wiki/Ericsson_Texture_Compression#ETC2_and_EAC]Ericsson Texture Compression format 2[/url] (`RGB8` variant), which is a follow-up of ETC1 and compresses RGB888 data.  
             *      
             *  **Note:** When creating an [ImageTexture], a nonlinear sRGB to linear encoding conversion is performed.  
             */
            FORMAT_ETC2_RGB8 = 30,
            
            /** [url=https://en.wikipedia.org/wiki/Ericsson_Texture_Compression#ETC2_and_EAC]Ericsson Texture Compression format 2[/url] (`RGBA8`variant), which compresses RGBA8888 data with full alpha support.  
             *      
             *  **Note:** When creating an [ImageTexture], a nonlinear sRGB to linear encoding conversion is performed.  
             */
            FORMAT_ETC2_RGBA8 = 31,
            
            /** [url=https://en.wikipedia.org/wiki/Ericsson_Texture_Compression#ETC2_and_EAC]Ericsson Texture Compression format 2[/url] (`RGB8_PUNCHTHROUGH_ALPHA1` variant), which compresses RGBA data to make alpha either fully transparent or fully opaque.  
             *      
             *  **Note:** When creating an [ImageTexture], a nonlinear sRGB to linear encoding conversion is performed.  
             */
            FORMAT_ETC2_RGB8A1 = 32,
            
            /** [url=https://en.wikipedia.org/wiki/Ericsson_Texture_Compression#ETC2_and_EAC]Ericsson Texture Compression format 2[/url] (`RGBA8` variant), which compresses RA data and interprets it as two channels (red and green). See also [constant FORMAT_ETC2_RGBA8]. */
            FORMAT_ETC2_RA_AS_RG = 33,
            
            /** The [url=https://en.wikipedia.org/wiki/S3_Texture_Compression]S3TC[/url] texture format also known as Block Compression 3 or BC3, which compresses RA data and interprets it as two channels (red and green). See also [constant FORMAT_DXT5]. */
            FORMAT_DXT5_RA_AS_RG = 34,
            
            /** [url=https://en.wikipedia.org/wiki/Adaptive_scalable_texture_compression]Adaptive Scalable Texture Compression[/url]. This implements the 4×4 (high quality) mode. */
            FORMAT_ASTC_4x4 = 35,
            
            /** Same format as [constant FORMAT_ASTC_4x4], but with the hint to let the GPU know it is used for HDR. */
            FORMAT_ASTC_4x4_HDR = 36,
            
            /** [url=https://en.wikipedia.org/wiki/Adaptive_scalable_texture_compression]Adaptive Scalable Texture Compression[/url]. This implements the 8×8 (low quality) mode. */
            FORMAT_ASTC_8x8 = 37,
            
            /** Same format as [constant FORMAT_ASTC_8x8], but with the hint to let the GPU know it is used for HDR. */
            FORMAT_ASTC_8x8_HDR = 38,
            
            /** OpenGL texture format `GL_R16` where there's one component, a 16-bit unsigned normalized integer value. Since the value is normalized, each component is clamped between `0.0` and `1.0` (inclusive).  
             *      
             *  **Note:** Due to limited hardware support, it is mainly recommended to be used on desktop or console devices. It may be unsupported on mobile or web, and will consequently be converted to [constant FORMAT_RF].  
             */
            FORMAT_R16 = 39,
            
            /** OpenGL texture format `GL_RG16` where there are two components, each a 16-bit unsigned normalized integer value. Since the value is normalized, each component is clamped between `0.0` and `1.0` (inclusive).  
             *      
             *  **Note:** Due to limited hardware support, it is mainly recommended to be used on desktop or console devices. It may be unsupported on mobile or web, and will consequently be converted to [constant FORMAT_RGF].  
             */
            FORMAT_RG16 = 40,
            
            /** OpenGL texture format `GL_RGB16` where there are three components, each a 16-bit unsigned normalized integer value. Since the value is normalized, each component is clamped between `0.0` and `1.0` (inclusive).  
             *      
             *  **Note:** Due to limited hardware support, it is mainly recommended to be used on desktop or console devices. It may be unsupported on mobile or web, and will consequently be converted to [constant FORMAT_RGBF].  
             */
            FORMAT_RGB16 = 41,
            
            /** OpenGL texture format `GL_RGBA16` where there are four components, each a 16-bit unsigned normalized integer value. Since the value is normalized, each component is clamped between `0.0` and `1.0` (inclusive).  
             *      
             *  **Note:** Due to limited hardware support, it is mainly recommended to be used on desktop or console devices. It may be unsupported on mobile or web, and will consequently be converted to [constant FORMAT_RGBAF].  
             */
            FORMAT_RGBA16 = 42,
            
            /** OpenGL texture format `GL_R16UI` where there's one component, a 16-bit unsigned integer value. Each component is clamped between `0` and `65535` (inclusive).  
             *      
             *  **Note:** When used in a shader, the texture requires usage of `usampler` samplers. Additionally, it only supports nearest-neighbor filtering under the Compatibility renderer.  
             *      
             *  **Note:** When sampling using [method Image.get_pixel], returned [Color]s have to be divided by `65535` to get the correct color value.  
             */
            FORMAT_R16I = 43,
            
            /** OpenGL texture format `GL_RG16UI` where there are two components, each a 16-bit unsigned integer value. Each component is clamped between `0` and `65535` (inclusive).  
             *      
             *  **Note:** When used in a shader, the texture requires usage of `usampler` samplers. Additionally, it only supports nearest-neighbor filtering under the Compatibility renderer.  
             *      
             *  **Note:** When sampling using [method Image.get_pixel], returned [Color]s have to be divided by `65535` to get the correct color value.  
             */
            FORMAT_RG16I = 44,
            
            /** OpenGL texture format `GL_RGB16UI` where there are three components, each a 16-bit unsigned integer value. Each component is clamped between `0` and `65535` (inclusive).  
             *      
             *  **Note:** When used in a shader, the texture requires usage of `usampler` samplers. Additionally, it only supports nearest-neighbor filtering under the Compatibility renderer.  
             *      
             *  **Note:** When sampling using [method Image.get_pixel], returned [Color]s have to be divided by `65535` to get the correct color value.  
             */
            FORMAT_RGB16I = 45,
            
            /** OpenGL texture format `GL_RGBA16UI` where there are four components, each a 16-bit unsigned integer value. Each component is clamped between `0` and `65535` (inclusive).  
             *      
             *  **Note:** When used in a shader, the texture requires usage of `usampler` samplers. Additionally, it only supports nearest-neighbor filtering under the Compatibility renderer.  
             *      
             *  **Note:** When sampling using [method Image.get_pixel], returned [Color]s have to be divided by `65535` to get the correct color value.  
             */
            FORMAT_RGBA16I = 46,
            
            /** Represents the size of the [enum Format] enum. */
            FORMAT_MAX = 47,
        }
        enum Interpolation {
            /** Performs nearest-neighbor interpolation. If the image is resized, it will be pixelated. */
            INTERPOLATE_NEAREST = 0,
            
            /** Performs bilinear interpolation. If the image is resized, it will be blurry. This mode is faster than [constant INTERPOLATE_CUBIC], but it results in lower quality. */
            INTERPOLATE_BILINEAR = 1,
            
            /** Performs cubic interpolation. If the image is resized, it will be blurry. This mode often gives better results compared to [constant INTERPOLATE_BILINEAR], at the cost of being slower. */
            INTERPOLATE_CUBIC = 2,
            
            /** Performs bilinear separately on the two most-suited mipmap levels, then linearly interpolates between them.  
             *  It's slower than [constant INTERPOLATE_BILINEAR], but produces higher-quality results with far fewer aliasing artifacts.  
             *  If the image does not have mipmaps, they will be generated and used internally, but no mipmaps will be generated on the resulting image.  
             *      
             *  **Note:** If you intend to scale multiple copies of the original image, it's better to call [method generate_mipmaps]] on it in advance, to avoid wasting processing power in generating them again and again.  
             *  On the other hand, if the image already has mipmaps, they will be used, and a new set will be generated for the resulting image.  
             */
            INTERPOLATE_TRILINEAR = 3,
            
            /** Performs Lanczos interpolation. This is the slowest image resizing mode, but it typically gives the best results, especially when downscaling images. */
            INTERPOLATE_LANCZOS = 4,
        }
        enum AlphaMode {
            /** Image is fully opaque. It does not store alpha data. */
            ALPHA_NONE = 0,
            
            /** Image stores either fully opaque or fully transparent pixels. Also known as punchthrough alpha. */
            ALPHA_BIT = 1,
            
            /** Image stores alpha data with values varying between `0.0` and `1.0`. */
            ALPHA_BLEND = 2,
        }
        enum CompressMode {
            /** Use S3TC compression. */
            COMPRESS_S3TC = 0,
            
            /** Use ETC compression. */
            COMPRESS_ETC = 1,
            
            /** Use ETC2 compression. */
            COMPRESS_ETC2 = 2,
            
            /** Use BPTC compression. */
            COMPRESS_BPTC = 3,
            
            /** Use ASTC compression. */
            COMPRESS_ASTC = 4,
            
            /** Represents the size of the [enum CompressMode] enum. */
            COMPRESS_MAX = 5,
        }
        enum UsedChannels {
            /** The image only uses one channel for luminance (grayscale). */
            USED_CHANNELS_L = 0,
            
            /** The image uses two channels for luminance and alpha, respectively. */
            USED_CHANNELS_LA = 1,
            
            /** The image only uses the red channel. */
            USED_CHANNELS_R = 2,
            
            /** The image uses two channels for red and green. */
            USED_CHANNELS_RG = 3,
            
            /** The image uses three channels for red, green, and blue. */
            USED_CHANNELS_RGB = 4,
            
            /** The image uses four channels for red, green, blue, and alpha. */
            USED_CHANNELS_RGBA = 5,
        }
        enum CompressSource {
            /** Source texture (before compression) is a regular texture. Default for all textures. */
            COMPRESS_SOURCE_GENERIC = 0,
            
            /** Source texture (before compression) uses nonlinear sRGB encoding. */
            COMPRESS_SOURCE_SRGB = 1,
            
            /** Source texture (before compression) is a normal texture (e.g. it can be compressed into two channels). */
            COMPRESS_SOURCE_NORMAL = 2,
        }
        enum ASTCFormat {
            /** Hint to indicate that the high quality 4×4 ASTC compression format should be used. */
            ASTC_FORMAT_4x4 = 0,
            
            /** Hint to indicate that the low quality 8×8 ASTC compression format should be used. */
            ASTC_FORMAT_8x8 = 1,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapImage extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapImage extends __NameMapResource {
    }
    /** Image datatype.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_image.html  
     */
    class Image extends Resource {
        /** The maximal width allowed for [Image] resources. */
        static readonly MAX_WIDTH = 16777216
        
        /** The maximal height allowed for [Image] resources. */
        static readonly MAX_HEIGHT = 16777216
        constructor(identifier?: any)
        
        /** Returns the image's width. */
        get_width(): int64
        
        /** Returns the image's height. */
        get_height(): int64
        
        /** Returns the image's size (width and height). */
        get_size(): Vector2i
        
        /** Returns `true` if the image has generated mipmaps. */
        has_mipmaps(): boolean
        
        /** Returns this image's format. */
        get_format(): Image.Format
        
        /** Returns a copy of the image's raw data. */
        get_data(): PackedByteArray
        
        /** Returns size (in bytes) of the image's raw data. */
        get_data_size(): int64
        
        /** Converts this image's format to the given [param format]. */
        convert(format: Image.Format): void
        
        /** Returns the number of mipmap levels or 0 if the image has no mipmaps. The largest main level image is not counted as a mipmap level by this method, so if you want to include it you can add 1 to this count. */
        get_mipmap_count(): int64
        
        /** Returns the offset where the image's mipmap with index [param mipmap] is stored in the [member data] dictionary. */
        get_mipmap_offset(mipmap: int64): int64
        
        /** Resizes the image to the nearest power of 2 for the width and height. If [param square] is `true`, sets width and height to be the same. New pixels are calculated using the [param interpolation] mode defined via [enum Interpolation] constants. */
        resize_to_po2(square?: boolean /* = false */, interpolation?: Image.Interpolation /* = 1 */): void
        
        /** Resizes the image to the given [param width] and [param height]. New pixels are calculated using the [param interpolation] mode defined via [enum Interpolation] constants. */
        resize(width: int64, height: int64, interpolation?: Image.Interpolation /* = 1 */): void
        
        /** Shrinks the image by a factor of 2 on each axis (this divides the pixel count by 4). */
        shrink_x2(): void
        
        /** Crops the image to the given [param width] and [param height]. If the specified size is larger than the current size, the extra area is filled with black pixels. */
        crop(width: int64, height: int64): void
        
        /** Flips the image horizontally. */
        flip_x(): void
        
        /** Flips the image vertically. */
        flip_y(): void
        
        /** Generates mipmaps for the image. Mipmaps are precalculated lower-resolution copies of the image that are automatically used if the image needs to be scaled down when rendered. They help improve image quality and performance when rendering. This method returns an error if the image is compressed, in a custom format, or if the image's width/height is `0`. Enabling [param renormalize] when generating mipmaps for normal map textures will make sure all resulting vector values are normalized.  
         *  It is possible to check if the image has mipmaps by calling [method has_mipmaps] or [method get_mipmap_count]. Calling [method generate_mipmaps] on an image that already has mipmaps will replace existing mipmaps in the image.  
         */
        generate_mipmaps(renormalize?: boolean /* = false */): Error
        
        /** Removes the image's mipmaps. */
        clear_mipmaps(): void
        
        /** Creates an empty image of the given size and format. If [param use_mipmaps] is `true`, generates mipmaps for this image (see [method generate_mipmaps]). */
        static create(width: int64, height: int64, use_mipmaps: boolean, format: Image.Format): Image
        
        /** Creates an empty image of the given size and format. If [param use_mipmaps] is `true`, generates mipmaps for this image (see [method generate_mipmaps]). */
        static create_empty(width: int64, height: int64, use_mipmaps: boolean, format: Image.Format): Image
        
        /** Creates a new image of the given size and format. Fills the image with the given raw data. If [param use_mipmaps] is `true`, loads the mipmaps for this image from [param data]. See [method generate_mipmaps]. */
        static create_from_data(width: int64, height: int64, use_mipmaps: boolean, format: Image.Format, data: PackedByteArray | byte[] | ArrayBuffer): Image
        
        /** Overwrites data of an existing [Image]. Non-static equivalent of [method create_from_data]. */
        set_data(width: int64, height: int64, use_mipmaps: boolean, format: Image.Format, data: PackedByteArray | byte[] | ArrayBuffer): void
        
        /** Returns `true` if the image has no data. */
        is_empty(): boolean
        
        /** Loads an image from file [param path]. See [url=https://docs.godotengine.org/en/4.6/tutorials/assets_pipeline/importing_images.html#supported-image-formats]Supported image formats[/url] for a list of supported image formats and limitations.  
         *  **Warning:** This method should only be used in the editor or in cases when you need to load external images at run-time, such as images located at the `user://` directory, and may not work in exported projects.  
         *  See also [ImageTexture] description for usage examples.  
         */
        load(path: string): Error
        
        /** Creates a new [Image] and loads data from the specified file. */
        static load_from_file(path: string): null | Image
        
        /** Saves the image as a PNG file to the file at [param path]. */
        save_png(path: string): Error
        
        /** Saves the image as a PNG file to a byte array. */
        save_png_to_buffer(): PackedByteArray
        
        /** Saves the image as a JPEG file to [param path] with the specified [param quality] between `0.01` and `1.0` (inclusive). Higher [param quality] values result in better-looking output at the cost of larger file sizes. Recommended [param quality] values are between `0.75` and `0.90`. Even at quality `1.00`, JPEG compression remains lossy.  
         *      
         *  **Note:** JPEG does not save an alpha channel. If the [Image] contains an alpha channel, the image will still be saved, but the resulting JPEG file won't contain the alpha channel.  
         */
        save_jpg(path: string, quality?: float64 /* = 0.75 */): Error
        
        /** Saves the image as a JPEG file to a byte array with the specified [param quality] between `0.01` and `1.0` (inclusive). Higher [param quality] values result in better-looking output at the cost of larger byte array sizes (and therefore memory usage). Recommended [param quality] values are between `0.75` and `0.90`. Even at quality `1.00`, JPEG compression remains lossy.  
         *      
         *  **Note:** JPEG does not save an alpha channel. If the [Image] contains an alpha channel, the image will still be saved, but the resulting byte array won't contain the alpha channel.  
         */
        save_jpg_to_buffer(quality?: float64 /* = 0.75 */): PackedByteArray
        
        /** Saves the image as an EXR file to [param path]. If [param grayscale] is `true` and the image has only one channel, it will be saved explicitly as monochrome rather than one red channel. This function will return [constant ERR_UNAVAILABLE] if Godot was compiled without the TinyEXR module. */
        save_exr(path: string, grayscale?: boolean /* = false */): Error
        
        /** Saves the image as an EXR file to a byte array. If [param grayscale] is `true` and the image has only one channel, it will be saved explicitly as monochrome rather than one red channel. This function will return an empty byte array if Godot was compiled without the TinyEXR module. */
        save_exr_to_buffer(grayscale?: boolean /* = false */): PackedByteArray
        
        /** Saves the image as a DDS (DirectDraw Surface) file to [param path]. DDS is a container format that can store textures in various compression formats, such as DXT1, DXT5, or BC7. This function will return [constant ERR_UNAVAILABLE] if Godot was compiled without the DDS module.  
         *      
         *  **Note:** The DDS module may be disabled in certain builds, which means [method save_dds] will return [constant ERR_UNAVAILABLE] when it is called from an exported project.  
         */
        save_dds(path: string): Error
        
        /** Saves the image as a DDS (DirectDraw Surface) file to a byte array. DDS is a container format that can store textures in various compression formats, such as DXT1, DXT5, or BC7. This function will return an empty byte array if Godot was compiled without the DDS module.  
         *      
         *  **Note:** The DDS module may be disabled in certain builds, which means [method save_dds_to_buffer] will return an empty byte array when it is called from an exported project.  
         */
        save_dds_to_buffer(): PackedByteArray
        
        /** Saves the image as a WebP (Web Picture) file to the file at [param path]. By default it will save lossless. If [param lossy] is `true`, the image will be saved lossy, using the [param quality] setting between `0.0` and `1.0` (inclusive). Lossless WebP offers more efficient compression than PNG.  
         *      
         *  **Note:** The WebP format is limited to a size of 16383×16383 pixels, while PNG can save larger images.  
         */
        save_webp(path: string, lossy?: boolean /* = false */, quality?: float64 /* = 0.75 */): Error
        
        /** Saves the image as a WebP (Web Picture) file to a byte array. By default it will save lossless. If [param lossy] is `true`, the image will be saved lossy, using the [param quality] setting between `0.0` and `1.0` (inclusive). Lossless WebP offers more efficient compression than PNG.  
         *      
         *  **Note:** The WebP format is limited to a size of 16383×16383 pixels, while PNG can save larger images.  
         */
        save_webp_to_buffer(lossy?: boolean /* = false */, quality?: float64 /* = 0.75 */): PackedByteArray
        
        /** Returns [constant ALPHA_BLEND] if the image has data for alpha values. Returns [constant ALPHA_BIT] if all the alpha values are stored in a single bit. Returns [constant ALPHA_NONE] if no data for alpha values is found. */
        detect_alpha(): Image.AlphaMode
        
        /** Returns `true` if all the image's pixels have an alpha value of 0. Returns `false` if any pixel has an alpha value higher than 0. */
        is_invisible(): boolean
        
        /** Returns the color channels used by this image. If the image is compressed, the original [param source] must be specified. */
        detect_used_channels(source?: Image.CompressSource /* = 0 */): Image.UsedChannels
        
        /** Compresses the image with a VRAM-compressed format to use less memory. Can not directly access pixel data while the image is compressed. Returns error if the chosen compression mode is not available.  
         *  The [param source] parameter helps to pick the best compression method for DXT and ETC2 formats. It is ignored for ASTC compression.  
         *  The [param astc_format] parameter is only taken into account when using ASTC compression; it is ignored for all other formats.  
         *      
         *  **Note:** [method compress] is only supported in editor builds. When run in an exported project, this method always returns [constant ERR_UNAVAILABLE].  
         */
        compress(mode: Image.CompressMode, source?: Image.CompressSource /* = 0 */, astc_format?: Image.ASTCFormat /* = 0 */): Error
        
        /** Compresses the image with a VRAM-compressed format to use less memory. Can not directly access pixel data while the image is compressed. Returns error if the chosen compression mode is not available.  
         *  This is an alternative to [method compress] that lets the user supply the channels used in order for the compressor to pick the best DXT and ETC2 formats. For other formats (non DXT or ETC2), this argument is ignored.  
         *  The [param astc_format] parameter is only taken into account when using ASTC compression; it is ignored for all other formats.  
         *      
         *  **Note:** [method compress_from_channels] is only supported in editor builds. When run in an exported project, this method always returns [constant ERR_UNAVAILABLE].  
         */
        compress_from_channels(mode: Image.CompressMode, channels: Image.UsedChannels, astc_format?: Image.ASTCFormat /* = 0 */): Error
        
        /** Decompresses the image if it is VRAM-compressed in a supported format. This increases memory utilization, but allows modifying the image. Returns [constant OK] if the format is supported, otherwise [constant ERR_UNAVAILABLE]. All VRAM-compressed formats supported by Godot can be decompressed with this method, except [constant FORMAT_ETC2_R11S], [constant FORMAT_ETC2_RG11S], and [constant FORMAT_ETC2_RGB8A1]. */
        decompress(): Error
        
        /** Returns `true` if the image is compressed. */
        is_compressed(): boolean
        
        /** Rotates the image in the specified [param direction] by `90` degrees. The width and height of the image must be greater than `1`. If the width and height are not equal, the image will be resized. */
        rotate_90(direction: ClockDirection): void
        
        /** Rotates the image by `180` degrees. The width and height of the image must be greater than `1`. */
        rotate_180(): void
        
        /** Blends low-alpha pixels with nearby pixels. */
        fix_alpha_edges(): void
        
        /** Multiplies color values with alpha values. Resulting color values for a pixel are `(color * alpha)/256`. See also [member CanvasItemMaterial.blend_mode]. */
        premultiply_alpha(): void
        
        /** Converts the raw data from nonlinear sRGB encoding to linear encoding using a lookup table. Only works on images with [constant FORMAT_RGB8] or [constant FORMAT_RGBA8] formats.  
         *      
         *  **Note:** The 8-bit formats required by this method are not suitable for storing linearly encoded values; a significant amount of color information will be lost in darker values. To maintain image quality, this method should not be used.  
         */
        srgb_to_linear(): void
        
        /** Converts the entire image from linear encoding to nonlinear sRGB encoding by using a lookup table. Only works on images with [constant FORMAT_RGB8] or [constant FORMAT_RGBA8] formats. */
        linear_to_srgb(): void
        
        /** Converts the image's data to represent coordinates on a 3D plane. This is used when the image represents a normal map. A normal map can add lots of detail to a 3D surface without increasing the polygon count. */
        normal_map_to_xy(): void
        
        /** Converts a standard linear RGBE (Red Green Blue Exponent) image to an image that uses nonlinear sRGB encoding. */
        rgbe_to_srgb(): null | Image
        
        /** Converts a bump map to a normal map. A bump map provides a height offset per-pixel, while a normal map provides a normal direction per pixel. */
        bump_map_to_normal_map(bump_scale?: float64 /* = 1 */): void
        
        /** Compute image metrics on the current image and the compared image. This can be used to calculate the similarity between two images.  
         *  The dictionary contains `max`, `mean`, `mean_squared`, `root_mean_squared` and `peak_snr`.  
         */
        compute_image_metrics(compared_image: Image, use_luma: boolean): GDictionary
        
        /** Copies [param src_rect] from [param src] image to this image at coordinates [param dst], clipped accordingly to both image bounds. This image and [param src] image **must** have the same format. [param src_rect] with non-positive size is treated as empty.  
         *      
         *  **Note:** The alpha channel data in [param src] will overwrite the corresponding data in this image at the target position. To blend alpha channels, use [method blend_rect] instead.  
         */
        blit_rect(src: Image, src_rect: Rect2i, dst: Vector2i): void
        
        /** Blits [param src_rect] area from [param src] image to this image at the coordinates given by [param dst], clipped accordingly to both image bounds. [param src] pixel is copied onto [param dst] if the corresponding [param mask] pixel's alpha value is not 0. This image and [param src] image **must** have the same format. [param src] image and [param mask] image **must** have the same size (width and height) but they can have different formats. [param src_rect] with non-positive size is treated as empty. */
        blit_rect_mask(src: Image, mask: Image, src_rect: Rect2i, dst: Vector2i): void
        
        /** Alpha-blends [param src_rect] from [param src] image to this image at coordinates [param dst], clipped accordingly to both image bounds. This image and [param src] image **must** have the same format. [param src_rect] with non-positive size is treated as empty. */
        blend_rect(src: Image, src_rect: Rect2i, dst: Vector2i): void
        
        /** Alpha-blends [param src_rect] from [param src] image to this image using [param mask] image at coordinates [param dst], clipped accordingly to both image bounds. Alpha channels are required for both [param src] and [param mask]. [param dst] pixels and [param src] pixels will blend if the corresponding mask pixel's alpha value is not 0. This image and [param src] image **must** have the same format. [param src] image and [param mask] image **must** have the same size (width and height) but they can have different formats. [param src_rect] with non-positive size is treated as empty. */
        blend_rect_mask(src: Image, mask: Image, src_rect: Rect2i, dst: Vector2i): void
        
        /** Fills the image with [param color]. */
        fill(color: Color): void
        
        /** Fills [param rect] with [param color]. */
        fill_rect(rect: Rect2i, color: Color): void
        
        /** Returns a [Rect2i] enclosing the visible portion of the image, considering each pixel with a non-zero alpha channel as visible. */
        get_used_rect(): Rect2i
        
        /** Returns a new [Image] that is a copy of this [Image]'s area specified with [param region]. */
        get_region(region: Rect2i): null | Image
        
        /** Copies [param src] image to this image. */
        copy_from(src: Image): void
        
        /** Returns the color of the pixel at [param point].  
         *  This is the same as [method get_pixel], but with a [Vector2i] argument instead of two integer arguments.  
         */
        get_pixelv(point: Vector2i): Color
        
        /** Returns the color of the pixel at `(x, y)`.  
         *  This is the same as [method get_pixelv], but with two integer arguments instead of a [Vector2i] argument.  
         */
        get_pixel(x: int64, y: int64): Color
        
        /** Sets the [Color] of the pixel at [param point] to [param color].  
         *    
         *  This is the same as [method set_pixel], but with a [Vector2i] argument instead of two integer arguments.  
         *      
         *  **Note:** Depending on the image's format, the color set here may be clamped or lose precision. Do not assume the color returned by [method get_pixelv] to be identical to the one set here; any comparisons will likely need to use an approximation like [method Color.is_equal_approx].  
         *      
         *  **Note:** On grayscale image formats, only the red channel of [param color] is used (and alpha if relevant). The green and blue channels are ignored.  
         */
        set_pixelv(point: Vector2i, color: Color): void
        
        /** Sets the [Color] of the pixel at `(x, y)` to [param color].  
         *    
         *  This is the same as [method set_pixelv], but with a two integer arguments instead of a [Vector2i] argument.  
         *      
         *  **Note:** Depending on the image's format, the color set here may be clamped or lose precision. Do not assume the color returned by [method get_pixel] to be identical to the one set here; any comparisons will likely need to use an approximation like [method Color.is_equal_approx].  
         *      
         *  **Note:** On grayscale image formats, only the red channel of [param color] is used (and alpha if relevant). The green and blue channels are ignored.  
         */
        set_pixel(x: int64, y: int64, color: Color): void
        
        /** Adjusts this image's [param brightness], [param contrast], and [param saturation] by the given values. Does not work if the image is compressed (see [method is_compressed]). */
        adjust_bcs(brightness: float64, contrast: float64, saturation: float64): void
        
        /** Loads an image from the binary contents of a PNG file. */
        load_png_from_buffer(buffer: PackedByteArray | byte[] | ArrayBuffer): Error
        
        /** Loads an image from the binary contents of a JPEG file. */
        load_jpg_from_buffer(buffer: PackedByteArray | byte[] | ArrayBuffer): Error
        
        /** Loads an image from the binary contents of a WebP file. */
        load_webp_from_buffer(buffer: PackedByteArray | byte[] | ArrayBuffer): Error
        
        /** Loads an image from the binary contents of a TGA file.  
         *      
         *  **Note:** This method is only available in engine builds with the TGA module enabled. By default, the TGA module is enabled, but it can be disabled at build-time using the `module_tga_enabled=no` SCons option.  
         */
        load_tga_from_buffer(buffer: PackedByteArray | byte[] | ArrayBuffer): Error
        
        /** Loads an image from the binary contents of a BMP file.  
         *      
         *  **Note:** Godot's BMP module doesn't support 16-bit per pixel images. Only 1-bit, 4-bit, 8-bit, 24-bit, and 32-bit per pixel images are supported.  
         *      
         *  **Note:** This method is only available in engine builds with the BMP module enabled. By default, the BMP module is enabled, but it can be disabled at build-time using the `module_bmp_enabled=no` SCons option.  
         */
        load_bmp_from_buffer(buffer: PackedByteArray | byte[] | ArrayBuffer): Error
        
        /** Loads an image from the binary contents of a [url=https://github.com/KhronosGroup/KTX-Software]KTX[/url] file. Unlike most image formats, KTX can store VRAM-compressed data and embed mipmaps.  
         *      
         *  **Note:** Godot's libktx implementation only supports 2D images. Cubemaps, texture arrays, and de-padding are not supported.  
         *      
         *  **Note:** This method is only available in engine builds with the KTX module enabled. By default, the KTX module is enabled, but it can be disabled at build-time using the `module_ktx_enabled=no` SCons option.  
         */
        load_ktx_from_buffer(buffer: PackedByteArray | byte[] | ArrayBuffer): Error
        
        /** Loads an image from the binary contents of a DDS file.  
         *      
         *  **Note:** This method is only available in engine builds with the DDS module enabled. By default, the DDS module is enabled, but it can be disabled at build-time using the `module_dds_enabled=no` SCons option.  
         */
        load_dds_from_buffer(buffer: PackedByteArray | byte[] | ArrayBuffer): Error
        
        /** Loads an image from the binary contents of an OpenEXR file. */
        load_exr_from_buffer(buffer: PackedByteArray | byte[] | ArrayBuffer): Error
        
        /** Loads an image from the UTF-8 binary contents of an **uncompressed** SVG file (**.svg**).  
         *      
         *  **Note:** Beware when using compressed SVG files (like **.svgz**), they need to be `decompressed` before loading.  
         *      
         *  **Note:** This method is only available in engine builds with the SVG module enabled. By default, the SVG module is enabled, but it can be disabled at build-time using the `module_svg_enabled=no` SCons option.  
         */
        load_svg_from_buffer(buffer: PackedByteArray | byte[] | ArrayBuffer, scale?: float64 /* = 1 */): Error
        
        /** Loads an image from the string contents of an SVG file (**.svg**).  
         *      
         *  **Note:** This method is only available in engine builds with the SVG module enabled. By default, the SVG module is enabled, but it can be disabled at build-time using the `module_svg_enabled=no` SCons option.  
         */
        load_svg_from_string(svg_str: string, scale?: float64 /* = 1 */): Error
        
        /** Holds all the image's color data in a given format. See [enum Format] constants. */
        get data(): GDictionary
        set data(value: GDictionary)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapImage;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapImage;
    }
    namespace ImageFormatLoader {
        enum LoaderFlags {
            FLAG_NONE = 0,
            FLAG_FORCE_LINEAR = 1,
            FLAG_CONVERT_COLORS = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapImageFormatLoader extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapImageFormatLoader extends __NameMapRefCounted {
    }
    /** Base class to add support for specific image formats.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_imageformatloader.html  
     */
    class ImageFormatLoader extends RefCounted {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapImageFormatLoader;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapImageFormatLoader;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapImageFormatLoaderExtension extends __RPCMapImageFormatLoader {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapImageFormatLoaderExtension extends __NameMapImageFormatLoader {
    }
    /** Base class for creating [ImageFormatLoader] extensions (adding support for extra image formats).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_imageformatloaderextension.html  
     */
    class ImageFormatLoaderExtension extends ImageFormatLoader {
        constructor(identifier?: any)
        /** Returns the list of file extensions for this image format. Files with the given extensions will be treated as image file and loaded using this class. */
        /* gdvirtual */ _get_recognized_extensions(): PackedStringArray
        
        /** Loads the content of [param fileaccess] into the provided [param image]. */
        /* gdvirtual */ _load_image(image: Image, fileaccess: FileAccess, flags: ImageFormatLoader.LoaderFlags, scale: float64): Error
        
        /** Add this format loader to the engine, allowing it to recognize the file extensions returned by [method _get_recognized_extensions]. */
        add_format_loader(): void
        
        /** Remove this format loader from the engine. */
        remove_format_loader(): void
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapImageFormatLoaderExtension;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapImageFormatLoaderExtension;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapImageTexture extends __RPCMapTexture2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapImageTexture extends __NameMapTexture2D {
    }
    /** A [Texture2D] based on an [Image].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_imagetexture.html  
     */
    class ImageTexture extends Texture2D {
        constructor(identifier?: any)
        /** Creates a new [ImageTexture] and initializes it by allocating and setting the data from an [Image]. */
        static create_from_image(image: Image): ImageTexture
        
        /** Returns the format of the texture. */
        get_format(): Image.Format
        
        /** Replaces the texture's data with a new [Image]. This will re-allocate new memory for the texture.  
         *  If you want to update the image, but don't need to change its parameters (format, size), use [method update] instead for better performance.  
         */
        set_image(image: Image): void
        
        /** Replaces the texture's data with a new [Image].  
         *      
         *  **Note:** The texture has to be created using [method create_from_image] or initialized first with the [method set_image] method before it can be updated. The new image dimensions, format, and mipmaps configuration should match the existing texture's image configuration.  
         *  Use this method over [method set_image] if you need to update the texture frequently, which is faster than allocating additional memory for a new texture each time.  
         */
        update(image: Image): void
        
        /** Resizes the texture to the specified dimensions. */
        set_size_override(size: Vector2i): void
        get image(): null | Image
        set image(value: null | Image)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapImageTexture;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapImageTexture;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapImageTexture3D extends __RPCMapTexture3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapImageTexture3D extends __NameMapTexture3D {
    }
    /** Texture with 3 dimensions.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_imagetexture3d.html  
     */
    class ImageTexture3D extends Texture3D {
        constructor(identifier?: any)
        /** Creates the [ImageTexture3D] with specified [param format], [param width], [param height], and [param depth]. If [param use_mipmaps] is `true`, generates mipmaps for the [ImageTexture3D]. */
        create(format: Image.Format, width: int64, height: int64, depth: int64, use_mipmaps: boolean, data: GArray<Image>): Error
        
        /** Replaces the texture's existing data with the layers specified in [param data]. The size of [param data] must match the parameters that were used for [method create]. In other words, the texture cannot be resized or have its format changed by calling [method update]. */
        update(data: GArray<Image>): void
        get _images(): GArray<Image>
        set _images(value: GArray<Image>)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapImageTexture3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapImageTexture3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapImageTextureLayered extends __RPCMapTextureLayered {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapImageTextureLayered extends __NameMapTextureLayered {
    }
    /** Base class for texture types which contain the data of multiple [ImageTexture]s. Each image is of the same size and format.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_imagetexturelayered.html  
     */
    class ImageTextureLayered extends TextureLayered {
        constructor(identifier?: any)
        /** Creates an [ImageTextureLayered] from an array of [Image]s. See [method Image.create] for the expected data format. The first image decides the width, height, image format and mipmapping setting. The other images  *must*  have the same width, height, image format and mipmapping setting.  
         *  Each [Image] represents one `layer`.  
         *    
         */
        create_from_images(images: GArray<Image>): Error
        
        /** Replaces the existing [Image] data at the given [param layer] with this new image.  
         *  The given [Image] must have the same width, height, image format, and mipmapping flag as the rest of the referenced images.  
         *  If the image format is unsupported, it will be decompressed and converted to a similar and supported [enum Image.Format].  
         *  The update is immediate: it's synchronized with drawing.  
         */
        update_layer(image: Image, layer: int64): void
        get _images(): GArray<Image>
        set _images(value: GArray<Image>)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapImageTextureLayered;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapImageTextureLayered;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapImmediateMesh extends __RPCMapMesh {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapImmediateMesh extends __NameMapMesh {
    }
    /** Mesh optimized for creating geometry manually.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_immediatemesh.html  
     */
    class ImmediateMesh extends Mesh {
        constructor(identifier?: any)
        /** Begin a new surface. */
        surface_begin(primitive: Mesh.PrimitiveType, material?: Material): void
        
        /** Set the color attribute that will be pushed with the next vertex. */
        surface_set_color(color: Color): void
        
        /** Set the normal attribute that will be pushed with the next vertex. */
        surface_set_normal(normal: Vector3): void
        
        /** Set the tangent attribute that will be pushed with the next vertex.  
         *      
         *  **Note:** Even though [param tangent] is a [Plane], it does not directly represent the tangent plane. Its [member Plane.x], [member Plane.y], and [member Plane.z] represent the tangent vector and [member Plane.d] should be either `-1` or `1`. See also [constant Mesh.ARRAY_TANGENT].  
         */
        surface_set_tangent(tangent: Plane): void
        
        /** Set the UV attribute that will be pushed with the next vertex. */
        surface_set_uv(uv: Vector2): void
        
        /** Set the UV2 attribute that will be pushed with the next vertex. */
        surface_set_uv2(uv2: Vector2): void
        
        /** Add a 3D vertex using the current attributes previously set. */
        surface_add_vertex(vertex: Vector3): void
        
        /** Add a 2D vertex using the current attributes previously set. */
        surface_add_vertex_2d(vertex: Vector2): void
        
        /** End and commit current surface. Note that surface being created will not be visible until this function is called. */
        surface_end(): void
        
        /** Clear all surfaces. */
        clear_surfaces(): void
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapImmediateMesh;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapImmediateMesh;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapImporterMesh extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapImporterMesh extends __NameMapResource {
    }
    /** A [Resource] that contains vertex array-based geometry during the import process.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_importermesh.html  
     */
    class ImporterMesh extends Resource {
        constructor(identifier?: any)
        /** Adds name for a blend shape that will be added with [method add_surface]. Must be called before surface is added. */
        add_blend_shape(name: string): void
        
        /** Returns the number of blend shapes that the mesh holds. */
        get_blend_shape_count(): int64
        
        /** Returns the name of the blend shape at this index. */
        get_blend_shape_name(blend_shape_idx: int64): string
        
        /** Sets the blend shape mode. */
        set_blend_shape_mode(mode: Mesh.BlendShapeMode): void
        
        /** Returns the blend shape mode for this Mesh. */
        get_blend_shape_mode(): Mesh.BlendShapeMode
        
        /** Creates a new surface. [method Mesh.get_surface_count] will become the `surf_idx` for this new surface.  
         *  Surfaces are created to be rendered using a [param primitive], which may be any of the values defined in [enum Mesh.PrimitiveType].  
         *  The [param arrays] argument is an array of arrays. Each of the [constant Mesh.ARRAY_MAX] elements contains an array with some of the mesh data for this surface as described by the corresponding member of [enum Mesh.ArrayType] or `null` if it is not used by the surface. For example, `arrays[0]` is the array of vertices. That first vertex sub-array is always required; the others are optional. Adding an index array puts this surface into "index mode" where the vertex and other arrays become the sources of data and the index array defines the vertex order. All sub-arrays must have the same length as the vertex array (or be an exact multiple of the vertex array's length, when multiple elements of a sub-array correspond to a single vertex) or be empty, except for [constant Mesh.ARRAY_INDEX] if it is used.  
         *  The [param blend_shapes] argument is an array of vertex data for each blend shape. Each element is an array of the same structure as [param arrays], but [constant Mesh.ARRAY_VERTEX], [constant Mesh.ARRAY_NORMAL], and [constant Mesh.ARRAY_TANGENT] are set if and only if they are set in [param arrays] and all other entries are `null`.  
         *  The [param lods] argument is a dictionary with [float] keys and [PackedInt32Array] values. Each entry in the dictionary represents an LOD level of the surface, where the value is the [constant Mesh.ARRAY_INDEX] array to use for the LOD level and the key is roughly proportional to the distance at which the LOD stats being used. I.e., increasing the key of an LOD also increases the distance that the objects has to be from the camera before the LOD is used.  
         *  The [param flags] argument is the bitwise OR of, as required: One value of [enum Mesh.ArrayCustomFormat] left shifted by `ARRAY_FORMAT_CUSTOMn_SHIFT` for each custom channel in use, [constant Mesh.ARRAY_FLAG_USE_DYNAMIC_UPDATE], [constant Mesh.ARRAY_FLAG_USE_8_BONE_WEIGHTS], or [constant Mesh.ARRAY_FLAG_USES_EMPTY_VERTEX_ARRAY].  
         *      
         *  **Note:** When using indices, it is recommended to only use points, lines, or triangles.  
         */
        add_surface(primitive: Mesh.PrimitiveType, arrays: GArray, blend_shapes?: GArray<GArray>, lods?: GDictionary /* = new GDictionary() */, material?: Material, name?: string /* = '' */, flags?: int64 /* = 0 */): void
        
        /** Returns the number of surfaces that the mesh holds. */
        get_surface_count(): int64
        
        /** Returns the primitive type of the requested surface (see [method add_surface]). */
        get_surface_primitive_type(surface_idx: int64): Mesh.PrimitiveType
        
        /** Gets the name assigned to this surface. */
        get_surface_name(surface_idx: int64): string
        
        /** Returns the arrays for the vertices, normals, UVs, etc. that make up the requested surface. See [method add_surface]. */
        get_surface_arrays(surface_idx: int64): GArray
        
        /** Returns a single set of blend shape arrays for the requested blend shape index for a surface. */
        get_surface_blend_shape_arrays(surface_idx: int64, blend_shape_idx: int64): GArray
        
        /** Returns the number of lods that the mesh holds on a given surface. */
        get_surface_lod_count(surface_idx: int64): int64
        
        /** Returns the screen ratio which activates a lod for a surface. */
        get_surface_lod_size(surface_idx: int64, lod_idx: int64): float64
        
        /** Returns the index buffer of a lod for a surface. */
        get_surface_lod_indices(surface_idx: int64, lod_idx: int64): PackedInt32Array
        
        /** Returns a [Material] in a given surface. Surface is rendered using this material. */
        get_surface_material(surface_idx: int64): null | Material
        
        /** Returns the format of the surface that the mesh holds. */
        get_surface_format(surface_idx: int64): int64
        
        /** Sets a name for a given surface. */
        set_surface_name(surface_idx: int64, name: string): void
        
        /** Sets a [Material] for a given surface. Surface will be rendered using this material. */
        set_surface_material(surface_idx: int64, material: Material): void
        
        /** Generates all lods for this ImporterMesh.  
         *  [param normal_merge_angle] is in degrees and used in the same way as the importer settings in `lods`.  
         *  [param normal_split_angle] is not used and only remains for compatibility with older versions of the API.  
         *  The number of generated lods can be accessed using [method get_surface_lod_count], and each LOD is available in [method get_surface_lod_size] and [method get_surface_lod_indices].  
         *  [param bone_transform_array] is an [Array] which can be either empty or contain [Transform3D]s which, for each of the mesh's bone IDs, will apply mesh skinning when generating the LOD mesh variations. This is usually used to account for discrepancies in scale between the mesh itself and its skinning data.  
         */
        generate_lods(normal_merge_angle: float64, normal_split_angle: float64, bone_transform_array: GArray): void
        
        /** Returns the mesh data represented by this [ImporterMesh] as a usable [ArrayMesh].  
         *  This method caches the returned mesh, and subsequent calls will return the cached data until [method clear] is called.  
         *  If not yet cached and [param base_mesh] is provided, [param base_mesh] will be used and mutated.  
         */
        get_mesh(base_mesh?: ArrayMesh): null | ArrayMesh
        
        /** Converts the given [Mesh] into an [ImporterMesh] by copying all its surfaces, blend shapes, materials, and metadata into a new [ImporterMesh] object. */
        static from_mesh(mesh: Mesh): null | ImporterMesh
        
        /** Removes all surfaces and blend shapes from this [ImporterMesh]. */
        clear(): void
        
        /** Sets the size hint of this mesh for lightmap-unwrapping in UV-space. */
        set_lightmap_size_hint(size: Vector2i): void
        
        /** Returns the size hint of this mesh for lightmap-unwrapping in UV-space. */
        get_lightmap_size_hint(): Vector2i
        get _data(): GDictionary
        set _data(value: GDictionary)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapImporterMesh;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapImporterMesh;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapImporterMeshInstance3D extends __RPCMapNode3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapImporterMeshInstance3D extends __NameMapNode3D {
    }
    /** @link https://docs.godotengine.org/en/4.6/classes/class_importermeshinstance3d.html */
    class ImporterMeshInstance3D<Map extends NodePathMap = any> extends Node3D<Map> {
        constructor(identifier?: any)
        get mesh(): null | ImporterMesh
        set mesh(value: null | ImporterMesh)
        get skin(): null | Skin
        set skin(value: null | Skin)
        get skeleton_path(): NodePath
        set skeleton_path(value: NodePath | string)
        get layer_mask(): int64
        set layer_mask(value: int64)
        get cast_shadow(): int64
        set cast_shadow(value: int64)
        get visibility_range_begin(): float64
        set visibility_range_begin(value: float64)
        get visibility_range_begin_margin(): float64
        set visibility_range_begin_margin(value: float64)
        get visibility_range_end(): float64
        set visibility_range_end(value: float64)
        get visibility_range_end_margin(): float64
        set visibility_range_end_margin(value: float64)
        get visibility_range_fade_mode(): int64
        set visibility_range_fade_mode(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapImporterMeshInstance3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapImporterMeshInstance3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapInputEvent extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapInputEvent extends __NameMapResource {
    }
    /** Abstract base class for input events.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_inputevent.html  
     */
    class InputEvent extends Resource {
        /** Device ID used for emulated mouse input from a touchscreen, or for emulated touch input from a mouse. This can be used to distinguish emulated mouse input from physical mouse input, or emulated touch input from physical touch input. */
        static readonly DEVICE_ID_EMULATION = -1
        constructor(identifier?: any)
        
        /** Returns `true` if this input event matches a pre-defined action of any type.  
         *  If [param exact_match] is `false`, it ignores additional input modifiers for [InputEventKey] and [InputEventMouseButton] events, and the direction for [InputEventJoypadMotion] events.  
         */
        is_action(action: InputActionName, exact_match?: boolean /* = false */): boolean
        
        /** Returns `true` if the given action matches this event and is being pressed (and is not an echo event for [InputEventKey] events, unless [param allow_echo] is `true`). Not relevant for events of type [InputEventMouseMotion] or [InputEventScreenDrag].  
         *  If [param exact_match] is `false`, it ignores additional input modifiers for [InputEventKey] and [InputEventMouseButton] events, and the direction for [InputEventJoypadMotion] events.  
         *      
         *  **Note:** Due to keyboard ghosting, [method is_action_pressed] may return `false` even if one of the action's keys is pressed. See [url=https://docs.godotengine.org/en/4.6/tutorials/inputs/input_examples.html#keyboard-events]Input examples[/url] in the documentation for more information.  
         */
        is_action_pressed(action: InputActionName, allow_echo?: boolean /* = false */, exact_match?: boolean /* = false */): boolean
        
        /** Returns `true` if the given action matches this event and is released (i.e. not pressed). Not relevant for events of type [InputEventMouseMotion] or [InputEventScreenDrag].  
         *  If [param exact_match] is `false`, it ignores additional input modifiers for [InputEventKey] and [InputEventMouseButton] events, and the direction for [InputEventJoypadMotion] events.  
         */
        is_action_released(action: InputActionName, exact_match?: boolean /* = false */): boolean
        
        /** Returns a value between 0.0 and 1.0 depending on the given actions' state. Useful for getting the value of events of type [InputEventJoypadMotion].  
         *  If [param exact_match] is `false`, it ignores additional input modifiers for [InputEventKey] and [InputEventMouseButton] events, and the direction for [InputEventJoypadMotion] events.  
         */
        get_action_strength(action: InputActionName, exact_match?: boolean /* = false */): float64
        
        /** Returns `true` if this input event has been canceled. */
        is_canceled(): boolean
        
        /** Returns `true` if this input event is pressed. Not relevant for events of type [InputEventMouseMotion] or [InputEventScreenDrag].  
         *      
         *  **Note:** Due to keyboard ghosting, [method is_pressed] may return `false` even if one of the action's keys is pressed. See [url=https://docs.godotengine.org/en/4.6/tutorials/inputs/input_examples.html#keyboard-events]Input examples[/url] in the documentation for more information.  
         */
        is_pressed(): boolean
        
        /** Returns `true` if this input event is released. Not relevant for events of type [InputEventMouseMotion] or [InputEventScreenDrag]. */
        is_released(): boolean
        
        /** Returns `true` if this input event is an echo event (only for events of type [InputEventKey]). An echo event is a repeated key event sent when the user is holding down the key. Any other event type returns `false`.  
         *      
         *  **Note:** The rate at which echo events are sent is typically around 20 events per second (after holding down the key for roughly half a second). However, the key repeat delay/speed can be changed by the user or disabled entirely in the operating system settings. To ensure your project works correctly on all configurations, do not assume the user has a specific key repeat configuration in your project's behavior.  
         */
        is_echo(): boolean
        
        /** Returns a [String] representation of the event. */
        as_text(): string
        
        /** Returns `true` if the specified [param event] matches this event. Only valid for action events, which include key ([InputEventKey]), button ([InputEventMouseButton] or [InputEventJoypadButton]), axis [InputEventJoypadMotion], and action ([InputEventAction]) events.  
         *  If [param exact_match] is `false`, the check ignores additional input modifiers for [InputEventKey] and [InputEventMouseButton] events, and the direction for [InputEventJoypadMotion] events.  
         *      
         *  **Note:** This method only considers the event configuration (such as the keyboard key or the joypad axis), not state information like [method is_pressed], [method is_released], [method is_echo], or [method is_canceled].  
         */
        is_match(event: InputEvent, exact_match?: boolean /* = true */): boolean
        
        /** Returns `true` if this input event's type is one that can be assigned to an input action: [InputEventKey], [InputEventMouseButton], [InputEventJoypadButton], [InputEventJoypadMotion], [InputEventAction]. Returns `false` for all other input event types. */
        is_action_type(): boolean
        
        /** Returns `true` if the given input event and this input event can be added together (only for events of type [InputEventMouseMotion]).  
         *  The given input event's position, global position and speed will be copied. The resulting `relative` is a sum of both events. Both events' modifiers have to be identical.  
         */
        accumulate(with_event: InputEvent): boolean
        
        /** Returns a copy of the given input event which has been offset by [param local_ofs] and transformed by [param xform]. Relevant for events of type [InputEventMouseButton], [InputEventMouseMotion], [InputEventScreenTouch], [InputEventScreenDrag], [InputEventMagnifyGesture] and [InputEventPanGesture]. */
        xformed_by(xform: Transform2D, local_ofs?: Vector2 /* = Vector2.ZERO */): null | InputEvent
        
        /** The event's device ID.  
         *      
         *  **Note:** [member device] can be negative for special use cases that don't refer to devices physically present on the system. See [constant DEVICE_ID_EMULATION].  
         */
        get device(): int64
        set device(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapInputEvent;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapInputEvent;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapInputEventAction extends __RPCMapInputEvent {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapInputEventAction extends __NameMapInputEvent {
    }
    /** An input event type for actions.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_inputeventaction.html  
     */
    class InputEventAction extends InputEvent {
        constructor(identifier?: any)
        /** The action's name. This is usually the name of an existing action in the [InputMap] which you want this custom event to match. */
        get action(): StringName
        set action(value: StringName)
        
        /** If `true`, the action's state is pressed. If `false`, the action's state is released. */
        get pressed(): boolean
        set pressed(value: boolean)
        
        /** The action's strength between 0 and 1. This value is considered as equal to 0 if pressed is `false`. The event strength allows faking analog joypad motion events, by specifying how strongly the joypad axis is bent or pressed. */
        get strength(): float64
        set strength(value: float64)
        
        /** The real event index in action this event corresponds to (from events defined for this action in the [InputMap]). If `-1`, a unique ID will be used and actions pressed with this ID will need to be released with another [InputEventAction]. */
        get event_index(): int64
        set event_index(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapInputEventAction;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapInputEventAction;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapInputEventFromWindow extends __RPCMapInputEvent {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapInputEventFromWindow extends __NameMapInputEvent {
    }
    /** Abstract base class for [Viewport]-based input events.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_inputeventfromwindow.html  
     */
    class InputEventFromWindow extends InputEvent {
        constructor(identifier?: any)
        /** The ID of a [Window] that received this event. */
        get window_id(): int64
        set window_id(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapInputEventFromWindow;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapInputEventFromWindow;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapInputEventGesture extends __RPCMapInputEventWithModifiers {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapInputEventGesture extends __NameMapInputEventWithModifiers {
    }
    /** Abstract base class for touch gestures.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_inputeventgesture.html  
     */
    class InputEventGesture extends InputEventWithModifiers {
        constructor(identifier?: any)
        /** The local gesture position relative to the [Viewport]. If used in [method Control._gui_input], the position is relative to the current [Control] that received this gesture. */
        get position(): Vector2
        set position(value: Vector2)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapInputEventGesture;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapInputEventGesture;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapInputEventJoypadButton extends __RPCMapInputEvent {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapInputEventJoypadButton extends __NameMapInputEvent {
    }
    /** Represents a gamepad button being pressed or released.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_inputeventjoypadbutton.html  
     */
    class InputEventJoypadButton extends InputEvent {
        constructor(identifier?: any)
        /** Button identifier. One of the [enum JoyButton] button constants. */
        get button_index(): int64
        set button_index(value: int64)
        get pressure(): float64
        set pressure(value: float64)
        
        /** If `true`, the button's state is pressed. If `false`, the button's state is released. */
        get pressed(): boolean
        set pressed(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapInputEventJoypadButton;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapInputEventJoypadButton;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapInputEventJoypadMotion extends __RPCMapInputEvent {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapInputEventJoypadMotion extends __NameMapInputEvent {
    }
    /** Represents axis motions (such as joystick or analog triggers) from a gamepad.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_inputeventjoypadmotion.html  
     */
    class InputEventJoypadMotion extends InputEvent {
        constructor(identifier?: any)
        /** Axis identifier. */
        get axis(): int64
        set axis(value: int64)
        
        /** Current position of the joystick on the given axis. The value ranges from `-1.0` to `1.0`. A value of `0` means the axis is in its resting position. */
        get axis_value(): float64
        set axis_value(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapInputEventJoypadMotion;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapInputEventJoypadMotion;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapInputEventKey extends __RPCMapInputEventWithModifiers {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapInputEventKey extends __NameMapInputEventWithModifiers {
    }
    /** Represents a key on a keyboard being pressed or released.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_inputeventkey.html  
     */
    class InputEventKey extends InputEventWithModifiers {
        constructor(identifier?: any)
        /** Returns the Latin keycode combined with modifier keys such as [kbd]Shift[/kbd] or [kbd]Alt[/kbd]. See also [InputEventWithModifiers].  
         *  To get a human-readable representation of the [InputEventKey] with modifiers, use `OS.get_keycode_string(event.get_keycode_with_modifiers())` where `event` is the [InputEventKey].  
         */
        get_keycode_with_modifiers(): Key
        
        /** Returns the physical keycode combined with modifier keys such as [kbd]Shift[/kbd] or [kbd]Alt[/kbd]. See also [InputEventWithModifiers].  
         *  To get a human-readable representation of the [InputEventKey] with modifiers, use `OS.get_keycode_string(event.get_physical_keycode_with_modifiers())` where `event` is the [InputEventKey].  
         */
        get_physical_keycode_with_modifiers(): Key
        
        /** Returns the localized key label combined with modifier keys such as [kbd]Shift[/kbd] or [kbd]Alt[/kbd]. See also [InputEventWithModifiers].  
         *  To get a human-readable representation of the [InputEventKey] with modifiers, use `OS.get_keycode_string(event.get_key_label_with_modifiers())` where `event` is the [InputEventKey].  
         */
        get_key_label_with_modifiers(): Key
        
        /** Returns a [String] representation of the event's [member keycode] and modifiers. */
        as_text_keycode(): string
        
        /** Returns a [String] representation of the event's [member physical_keycode] and modifiers. */
        as_text_physical_keycode(): string
        
        /** Returns a [String] representation of the event's [member key_label] and modifiers. */
        as_text_key_label(): string
        
        /** Returns a [String] representation of the event's [member location]. This will be a blank string if the event is not specific to a location. */
        as_text_location(): string
        
        /** If `true`, the key's state is pressed. If `false`, the key's state is released. */
        get pressed(): boolean
        set pressed(value: boolean)
        
        /** Latin label printed on the key in the current keyboard layout, which corresponds to one of the [enum Key] constants. Key codes are meant for shortcuts expressed with a standard Latin keyboard, such as [kbd]Ctrl + S[/kbd] for a "Save" shortcut.  
         *  To get a human-readable representation of the [InputEventKey], use `OS.get_keycode_string(event.keycode)` where `event` is the [InputEventKey].  
         *  [codeblock lang=text]  
         *  +-----+ +-----+  
         *  | Q   | | Q   | - "Q" - keycode  
         *  |   Й | |  ض | - "Й" and "ض" - key_label  
         *  +-----+ +-----+  
         *  [/codeblock]  
         */
        get keycode(): int64
        set keycode(value: int64)
        
        /** Represents the physical location of a key on the 101/102-key US QWERTY keyboard, which corresponds to one of the [enum Key] constants. Physical key codes meant for game input, such as WASD movement, where only the location of the keys is important.  
         *  To get a human-readable representation of the [InputEventKey], use [method OS.get_keycode_string] in combination with [method DisplayServer.keyboard_get_keycode_from_physical] or [method DisplayServer.keyboard_get_label_from_physical]:  
         *    
         */
        get physical_keycode(): int64
        set physical_keycode(value: int64)
        
        /** Represents the localized label printed on the key in the current keyboard layout, which corresponds to one of the [enum Key] constants or any valid Unicode character. Key labels are meant for key prompts.  
         *  For keyboard layouts with a single label on the key, it is equivalent to [member keycode].  
         *  To get a human-readable representation of the [InputEventKey], use `OS.get_keycode_string(event.key_label)` where `event` is the [InputEventKey].  
         *  [codeblock lang=text]  
         *  +-----+ +-----+  
         *  | Q   | | Q   | - "Q" - keycode  
         *  |   Й | |  ض | - "Й" and "ض" - key_label  
         *  +-----+ +-----+  
         *  [/codeblock]  
         */
        get key_label(): int64
        set key_label(value: int64)
        
        /** The key Unicode character code (when relevant), shifted by modifier keys. Unicode character codes for composite characters and complex scripts may not be available unless IME input mode is active. See [method Window.set_ime_active] for more information. Unicode character codes are meant for text input.  
         *      
         *  **Note:** This property is set by the engine only for a pressed event. If the event is sent by an IME or a virtual keyboard, no corresponding key released event is sent.  
         */
        get unicode(): int64
        set unicode(value: int64)
        
        /** Represents the location of a key which has both left and right versions, such as [kbd]Shift[/kbd] or [kbd]Alt[/kbd]. */
        get location(): int64
        set location(value: int64)
        
        /** If `true`, the key was already pressed before this event. An echo event is a repeated key event sent when the user is holding down the key.  
         *      
         *  **Note:** The rate at which echo events are sent is typically around 20 events per second (after holding down the key for roughly half a second). However, the key repeat delay/speed can be changed by the user or disabled entirely in the operating system settings. To ensure your project works correctly on all configurations, do not assume the user has a specific key repeat configuration in your project's behavior.  
         */
        get echo(): boolean
        set echo(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapInputEventKey;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapInputEventKey;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapInputEventMIDI extends __RPCMapInputEvent {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapInputEventMIDI extends __NameMapInputEvent {
    }
    /** Represents a MIDI message from a MIDI device, such as a musical keyboard.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_inputeventmidi.html  
     */
    class InputEventMIDI extends InputEvent {
        constructor(identifier?: any)
        /** The MIDI channel of this message, ranging from `0` to `15`. MIDI channel `9` is reserved for percussion instruments. */
        get channel(): int64
        set channel(value: int64)
        
        /** Represents the type of MIDI message (see the [enum MIDIMessage] enum).  
         *  For more information, see the [url=https://www.midi.org/specifications-old/item/table-2-expanded-messages-list-status-bytes]MIDI message status byte list chart[/url].  
         */
        get message(): int64
        set message(value: int64)
        
        /** The pitch index number of this MIDI message. This value ranges from `0` to `127`.  
         *  On a piano, the **middle C** is `60`, followed by a **C-sharp** (`61`), then a **D** (`62`), and so on. Each octave is split in offsets of 12. See the "MIDI note number" column of the [url=https://en.wikipedia.org/wiki/Piano_key_frequencies]piano key frequency chart[/url] a full list.  
         */
        get pitch(): int64
        set pitch(value: int64)
        
        /** The velocity of the MIDI message. This value ranges from `0` to `127`. For a musical keyboard, this corresponds to how quickly the key was pressed, and is rarely above `110` in practice.  
         *      
         *  **Note:** Some MIDI devices may send a [constant MIDI_MESSAGE_NOTE_ON] message with `0` velocity and expect it to be treated the same as a [constant MIDI_MESSAGE_NOTE_OFF] message. If necessary, this can be handled with a few lines of code:  
         *    
         */
        get velocity(): int64
        set velocity(value: int64)
        
        /** The instrument (also called  *program*  or  *preset* ) used on this MIDI message. This value ranges from `0` to `127`.  
         *  To see what each value means, refer to the [url=https://en.wikipedia.org/wiki/General_MIDI#Program_change_events]General MIDI's instrument list[/url]. Keep in mind that the list is off by 1 because it does not begin from 0. A value of `0` corresponds to the acoustic grand piano.  
         */
        get instrument(): int64
        set instrument(value: int64)
        
        /** The strength of the key being pressed. This value ranges from `0` to `127`.  
         *      
         *  **Note:** For many devices, this value is always `0`. Other devices such as musical keyboards may simulate pressure by changing the [member velocity], instead.  
         */
        get pressure(): int64
        set pressure(value: int64)
        
        /** The unique number of the controller, if [member message] is [constant MIDI_MESSAGE_CONTROL_CHANGE], otherwise this is `0`. This value can be used to identify sliders for volume, balance, and panning, as well as switches and pedals on the MIDI device. See the [url=https://en.wikipedia.org/wiki/General_MIDI#Controller_events]General MIDI specification[/url] for a small list. */
        get controller_number(): int64
        set controller_number(value: int64)
        
        /** The value applied to the controller. If [member message] is [constant MIDI_MESSAGE_CONTROL_CHANGE], this value ranges from `0` to `127`, otherwise it is `0`. See also [member controller_value]. */
        get controller_value(): int64
        set controller_value(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapInputEventMIDI;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapInputEventMIDI;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapInputEventMagnifyGesture extends __RPCMapInputEventGesture {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapInputEventMagnifyGesture extends __NameMapInputEventGesture {
    }
    /** Represents a magnifying touch gesture.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_inputeventmagnifygesture.html  
     */
    class InputEventMagnifyGesture extends InputEventGesture {
        constructor(identifier?: any)
        /** The amount (or delta) of the event. This value is closer to `1.0` the slower the gesture is performed. */
        get factor(): float64
        set factor(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapInputEventMagnifyGesture;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapInputEventMagnifyGesture;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapInputEventMouse extends __RPCMapInputEventWithModifiers {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapInputEventMouse extends __NameMapInputEventWithModifiers {
    }
    /** Base input event type for mouse events.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_inputeventmouse.html  
     */
    class InputEventMouse extends InputEventWithModifiers {
        constructor(identifier?: any)
        /** The mouse button mask identifier, one of or a bitwise combination of the [enum MouseButton] button masks. */
        get button_mask(): int64
        set button_mask(value: int64)
        
        /** When received in [method Node._input] or [method Node._unhandled_input], returns the mouse's position in the [Viewport] this [Node] is in using the coordinate system of this [Viewport].  
         *  When received in [method Control._gui_input], returns the mouse's position in the [Control] using the local coordinate system of the [Control].  
         */
        get position(): Vector2
        set position(value: Vector2)
        
        /** When received in [method Node._input] or [method Node._unhandled_input], returns the mouse's position in the root [Viewport] using the coordinate system of the root [Viewport].  
         *  When received in [method Control._gui_input], returns the mouse's position in the [CanvasLayer] that the [Control] is in using the coordinate system of the [CanvasLayer].  
         */
        get global_position(): Vector2
        set global_position(value: Vector2)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapInputEventMouse;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapInputEventMouse;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapInputEventMouseButton extends __RPCMapInputEventMouse {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapInputEventMouseButton extends __NameMapInputEventMouse {
    }
    /** Represents a mouse button being pressed or released.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_inputeventmousebutton.html  
     */
    class InputEventMouseButton extends InputEventMouse {
        constructor(identifier?: any)
        /** The amount (or delta) of the event. When used for high-precision scroll events, this indicates the scroll amount (vertical or horizontal). This is only supported on some platforms; the reported sensitivity varies depending on the platform. May be `0` if not supported. */
        get factor(): float64
        set factor(value: float64)
        
        /** The mouse button identifier, one of the [enum MouseButton] button or button wheel constants. */
        get button_index(): int64
        set button_index(value: int64)
        
        /** If `true`, the mouse button event has been canceled. */
        get canceled(): boolean
        set canceled(value: boolean)
        
        /** If `true`, the mouse button's state is pressed. If `false`, the mouse button's state is released. */
        get pressed(): boolean
        set pressed(value: boolean)
        
        /** If `true`, the mouse button's state is a double-click. */
        get double_click(): boolean
        set double_click(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapInputEventMouseButton;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapInputEventMouseButton;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapInputEventMouseMotion extends __RPCMapInputEventMouse {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapInputEventMouseMotion extends __NameMapInputEventMouse {
    }
    /** Represents a mouse or a pen movement.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_inputeventmousemotion.html  
     */
    class InputEventMouseMotion extends InputEventMouse {
        constructor(identifier?: any)
        /** Represents the angles of tilt of the pen. Positive X-coordinate value indicates a tilt to the right. Positive Y-coordinate value indicates a tilt toward the user. Ranges from `-1.0` to `1.0` for both axes. */
        get tilt(): Vector2
        set tilt(value: Vector2)
        
        /** Represents the pressure the user puts on the pen. Ranges from `0.0` to `1.0`. */
        get pressure(): float64
        set pressure(value: float64)
        
        /** Returns `true` when using the eraser end of a stylus pen.  
         *      
         *  **Note:** This property is implemented on Linux, macOS and Windows.  
         */
        get pen_inverted(): boolean
        set pen_inverted(value: boolean)
        
        /** The mouse position relative to the previous position (position at the last frame).  
         *      
         *  **Note:** Since [InputEventMouseMotion] may only be emitted when the mouse moves, it is not possible to reliably detect when the mouse has stopped moving by checking this property. A separate, short timer may be necessary.  
         *      
         *  **Note:** [member relative] is automatically scaled according to the content scale factor, which is defined by the project's stretch mode settings. This means mouse sensitivity will appear different depending on resolution when using [member relative] in a script that handles mouse aiming with the [constant Input.MOUSE_MODE_CAPTURED] mouse mode. To avoid this, use [member screen_relative] instead.  
         */
        get relative(): Vector2
        set relative(value: Vector2)
        
        /** The unscaled mouse position relative to the previous position in the coordinate system of the screen (position at the last frame).  
         *      
         *  **Note:** Since [InputEventMouseMotion] may only be emitted when the mouse moves, it is not possible to reliably detect when the mouse has stopped moving by checking this property. A separate, short timer may be necessary.  
         *      
         *  **Note:** This coordinate is  *not*  scaled according to the content scale factor or calls to [method InputEvent.xformed_by]. This should be preferred over [member relative] for mouse aiming when using the [constant Input.MOUSE_MODE_CAPTURED] mouse mode, regardless of the project's stretch mode.  
         */
        get screen_relative(): Vector2
        set screen_relative(value: Vector2)
        
        /** The mouse velocity in pixels per second.  
         *      
         *  **Note:** [member velocity] is automatically scaled according to the content scale factor, which is defined by the project's stretch mode settings. That means mouse sensitivity may appear different depending on resolution.  
         *      
         *  **Note:** Use [member screen_relative] for mouse aiming using the [constant Input.MOUSE_MODE_CAPTURED] mouse mode.  
         */
        get velocity(): Vector2
        set velocity(value: Vector2)
        
        /** The unscaled mouse velocity in pixels per second in screen coordinates. This velocity is  *not*  scaled according to the content scale factor or calls to [method InputEvent.xformed_by].  
         *      
         *  **Note:** Use [member screen_relative] for mouse aiming using the [constant Input.MOUSE_MODE_CAPTURED] mouse mode.  
         */
        get screen_velocity(): Vector2
        set screen_velocity(value: Vector2)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapInputEventMouseMotion;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapInputEventMouseMotion;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapInputEventPanGesture extends __RPCMapInputEventGesture {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapInputEventPanGesture extends __NameMapInputEventGesture {
    }
    /** Represents a panning touch gesture.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_inputeventpangesture.html  
     */
    class InputEventPanGesture extends InputEventGesture {
        constructor(identifier?: any)
        /** Panning amount since last pan event. */
        get delta(): Vector2
        set delta(value: Vector2)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapInputEventPanGesture;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapInputEventPanGesture;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapInputEventScreenDrag extends __RPCMapInputEventFromWindow {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapInputEventScreenDrag extends __NameMapInputEventFromWindow {
    }
    /** Represents a screen drag event.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_inputeventscreendrag.html  
     */
    class InputEventScreenDrag extends InputEventFromWindow {
        constructor(identifier?: any)
        /** The drag event index in the case of a multi-drag event. */
        get index(): int64
        set index(value: int64)
        
        /** Represents the angles of tilt of the pen. Positive X-coordinate value indicates a tilt to the right. Positive Y-coordinate value indicates a tilt toward the user. Ranges from `-1.0` to `1.0` for both axes. */
        get tilt(): Vector2
        set tilt(value: Vector2)
        
        /** Represents the pressure the user puts on the pen. Ranges from `0.0` to `1.0`. */
        get pressure(): float64
        set pressure(value: float64)
        
        /** Returns `true` when using the eraser end of a stylus pen. */
        get pen_inverted(): boolean
        set pen_inverted(value: boolean)
        
        /** The drag position in the viewport the node is in, using the coordinate system of this viewport. */
        get position(): Vector2
        set position(value: Vector2)
        
        /** The drag position relative to the previous position (position at the last frame).  
         *      
         *  **Note:** [member relative] is automatically scaled according to the content scale factor, which is defined by the project's stretch mode settings. This means touch sensitivity will appear different depending on resolution when using [member relative] in a script that handles touch aiming. To avoid this, use [member screen_relative] instead.  
         */
        get relative(): Vector2
        set relative(value: Vector2)
        
        /** The unscaled drag position relative to the previous position in screen coordinates (position at the last frame). This position is  *not*  scaled according to the content scale factor or calls to [method InputEvent.xformed_by]. This should be preferred over [member relative] for touch aiming regardless of the project's stretch mode. */
        get screen_relative(): Vector2
        set screen_relative(value: Vector2)
        
        /** The drag velocity.  
         *      
         *  **Note:** [member velocity] is automatically scaled according to the content scale factor, which is defined by the project's stretch mode settings. This means touch sensitivity will appear different depending on resolution when using [member velocity] in a script that handles touch aiming. To avoid this, use [member screen_velocity] instead.  
         */
        get velocity(): Vector2
        set velocity(value: Vector2)
        
        /** The unscaled drag velocity in pixels per second in screen coordinates. This velocity is  *not*  scaled according to the content scale factor or calls to [method InputEvent.xformed_by]. This should be preferred over [member velocity] for touch aiming regardless of the project's stretch mode. */
        get screen_velocity(): Vector2
        set screen_velocity(value: Vector2)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapInputEventScreenDrag;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapInputEventScreenDrag;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapInputEventScreenTouch extends __RPCMapInputEventFromWindow {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapInputEventScreenTouch extends __NameMapInputEventFromWindow {
    }
    /** Represents a screen touch event.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_inputeventscreentouch.html  
     */
    class InputEventScreenTouch extends InputEventFromWindow {
        constructor(identifier?: any)
        /** The touch index in the case of a multi-touch event. One index = one finger. */
        get index(): int64
        set index(value: int64)
        
        /** The touch position in the viewport the node is in, using the coordinate system of this viewport. */
        get position(): Vector2
        set position(value: Vector2)
        
        /** If `true`, the touch event has been canceled. */
        get canceled(): boolean
        set canceled(value: boolean)
        
        /** If `true`, the touch's state is pressed. If `false`, the touch's state is released. */
        get pressed(): boolean
        set pressed(value: boolean)
        
        /** If `true`, the touch's state is a double tap. */
        get double_tap(): boolean
        set double_tap(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapInputEventScreenTouch;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapInputEventScreenTouch;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapInputEventShortcut extends __RPCMapInputEvent {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapInputEventShortcut extends __NameMapInputEvent {
    }
    /** Represents a triggered keyboard [Shortcut].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_inputeventshortcut.html  
     */
    class InputEventShortcut extends InputEvent {
        constructor(identifier?: any)
        /** The [Shortcut] represented by this event. Its [method Shortcut.matches_event] method will always return `true` for this event. */
        get shortcut(): null | Shortcut
        set shortcut(value: null | Shortcut)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapInputEventShortcut;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapInputEventShortcut;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapInputEventWithModifiers extends __RPCMapInputEventFromWindow {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapInputEventWithModifiers extends __NameMapInputEventFromWindow {
    }
    /** Abstract base class for input events affected by modifier keys like [kbd]Shift[/kbd] and [kbd]Alt[/kbd].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_inputeventwithmodifiers.html  
     */
    class InputEventWithModifiers extends InputEventFromWindow {
        constructor(identifier?: any)
        /** On macOS, returns `true` if [kbd]Meta[/kbd] ([kbd]Cmd[/kbd]) is pressed.  
         *  On other platforms, returns `true` if [kbd]Ctrl[/kbd] is pressed.  
         */
        is_command_or_control_pressed(): boolean
        
        /** Returns the keycode combination of modifier keys. */
        get_modifiers_mask(): KeyModifierMask
        
        /** Automatically use [kbd]Meta[/kbd] ([kbd]Cmd[/kbd]) on macOS and [kbd]Ctrl[/kbd] on other platforms. If `true`, [member ctrl_pressed] and [member meta_pressed] cannot be set. */
        get command_or_control_autoremap(): boolean
        set command_or_control_autoremap(value: boolean)
        
        /** State of the [kbd]Alt[/kbd] modifier. */
        get alt_pressed(): boolean
        set alt_pressed(value: boolean)
        
        /** State of the [kbd]Shift[/kbd] modifier. */
        get shift_pressed(): boolean
        set shift_pressed(value: boolean)
        
        /** State of the [kbd]Ctrl[/kbd] modifier. */
        get ctrl_pressed(): boolean
        set ctrl_pressed(value: boolean)
        
        /** State of the [kbd]Meta[/kbd] modifier. On Windows and Linux, this represents the Windows key (sometimes called "meta" or "super" on Linux). On macOS, this represents the Command key. */
        get meta_pressed(): boolean
        set meta_pressed(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapInputEventWithModifiers;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapInputEventWithModifiers;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapInstancePlaceholder extends __RPCMapNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapInstancePlaceholder extends __NameMapNode {
    }
    /** Placeholder for the root [Node] of a [PackedScene].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_instanceplaceholder.html  
     */
    class InstancePlaceholder<Map extends NodePathMap = any> extends Node<Map> {
        constructor(identifier?: any)
        /** Returns the list of properties that will be applied to the node when [method create_instance] is called.  
         *  If [param with_order] is `true`, a key named `.order` (note the leading period) is added to the dictionary. This `.order` key is an [Array] of [String] property names specifying the order in which properties will be applied (with index 0 being the first).  
         */
        get_stored_values(with_order?: boolean /* = false */): GDictionary
        
        /** Call this method to actually load in the node. The created node will be placed as a sibling  *above*  the [InstancePlaceholder] in the scene tree. The [Node]'s reference is also returned for convenience.  
         *      
         *  **Note:** [method create_instance] is not thread-safe. Use [method Object.call_deferred] if calling from a thread.  
         */
        create_instance(replace?: boolean /* = false */, custom_scene?: PackedScene): Node
        
        /** Gets the path to the [PackedScene] resource file that is loaded by default when calling [method create_instance]. Not thread-safe. Use [method Object.call_deferred] if calling from a thread. */
        get_instance_path(): string
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapInstancePlaceholder;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapInstancePlaceholder;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapIntervalTweener extends __RPCMapTweener {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapIntervalTweener extends __NameMapTweener {
    }
    /** Creates an idle interval in a [Tween] animation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_intervaltweener.html  
     */
    class IntervalTweener extends Tweener {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapIntervalTweener;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapIntervalTweener;
    }
    namespace ItemList {
        enum IconMode {
            /** Icon is drawn above the text. */
            ICON_MODE_TOP = 0,
            
            /** Icon is drawn to the left of the text. */
            ICON_MODE_LEFT = 1,
        }
        enum SelectMode {
            /** Only allow selecting a single item. */
            SELECT_SINGLE = 0,
            
            /** Allows selecting multiple items by holding [kbd]Ctrl[/kbd] or [kbd]Shift[/kbd]. */
            SELECT_MULTI = 1,
            
            /** Allows selecting multiple items by toggling them on and off. */
            SELECT_TOGGLE = 2,
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
    interface __RPCMapItemList extends __RPCMapControl {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapItemList extends __NameMapControl {
    }
    /** A vertical list of selectable items with one or multiple columns.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_itemlist.html  
     */
    class ItemList<Map extends NodePathMap = any> extends Control<Map> {
        constructor(identifier?: any)
        /** Adds an item to the item list with specified text. Returns the index of an added item.  
         *  Specify an [param icon], or use `null` as the [param icon] for a list item with no icon.  
         *  If [param selectable] is `true`, the list item will be selectable.  
         */
        add_item(text: string, icon?: Texture2D, selectable?: boolean /* = true */): int64
        
        /** Adds an item to the item list with no text, only an icon. Returns the index of an added item. */
        add_icon_item(icon: Texture2D, selectable?: boolean /* = true */): int64
        
        /** Sets text of the item associated with the specified index. */
        set_item_text(idx: int64, text: string): void
        
        /** Returns the text associated with the specified index. */
        get_item_text(idx: int64): string
        
        /** Sets (or replaces) the icon's [Texture2D] associated with the specified index. */
        set_item_icon(idx: int64, icon: Texture2D): void
        
        /** Returns the icon associated with the specified index. */
        get_item_icon(idx: int64): null | Texture2D
        
        /** Sets item's text base writing direction. */
        set_item_text_direction(idx: int64, direction: Control.TextDirection): void
        
        /** Returns item's text base writing direction. */
        get_item_text_direction(idx: int64): Control.TextDirection
        
        /** Sets the language code of the text for the item at the given index to [param language]. This is used for line-breaking and text shaping algorithms. If [param language] is empty, the current locale is used. */
        set_item_language(idx: int64, language: string): void
        
        /** Returns item's text language code. */
        get_item_language(idx: int64): string
        
        /** Sets the auto translate mode of the item associated with the specified index.  
         *  Items use [constant Node.AUTO_TRANSLATE_MODE_INHERIT] by default, which uses the same auto translate mode as the [ItemList] itself.  
         */
        set_item_auto_translate_mode(idx: int64, mode: Node.AutoTranslateMode): void
        
        /** Returns item's auto translate mode. */
        get_item_auto_translate_mode(idx: int64): Node.AutoTranslateMode
        
        /** Sets whether the item icon will be drawn transposed. */
        set_item_icon_transposed(idx: int64, transposed: boolean): void
        
        /** Returns `true` if the item icon will be drawn transposed, i.e. the X and Y axes are swapped. */
        is_item_icon_transposed(idx: int64): boolean
        
        /** Sets the region of item's icon used. The whole icon will be used if the region has no area. */
        set_item_icon_region(idx: int64, rect: Rect2): void
        
        /** Returns the region of item's icon used. The whole icon will be used if the region has no area. */
        get_item_icon_region(idx: int64): Rect2
        
        /** Sets a modulating [Color] of the item associated with the specified index. */
        set_item_icon_modulate(idx: int64, modulate: Color): void
        
        /** Returns a [Color] modulating item's icon at the specified index. */
        get_item_icon_modulate(idx: int64): Color
        
        /** Allows or disallows selection of the item associated with the specified index. */
        set_item_selectable(idx: int64, selectable: boolean): void
        
        /** Returns `true` if the item at the specified index is selectable. */
        is_item_selectable(idx: int64): boolean
        
        /** Disables (or enables) the item at the specified index.  
         *  Disabled items cannot be selected and do not trigger activation signals (when double-clicking or pressing [kbd]Enter[/kbd]).  
         */
        set_item_disabled(idx: int64, disabled: boolean): void
        
        /** Returns `true` if the item at the specified index is disabled. */
        is_item_disabled(idx: int64): boolean
        
        /** Sets a value (of any type) to be stored with the item associated with the specified index. */
        set_item_metadata(idx: int64, metadata: any): void
        
        /** Returns the metadata value of the specified index. */
        get_item_metadata(idx: int64): any
        
        /** Sets the background color of the item specified by [param idx] index to the specified [Color]. */
        set_item_custom_bg_color(idx: int64, custom_bg_color: Color): void
        
        /** Returns the custom background color of the item specified by [param idx] index. */
        get_item_custom_bg_color(idx: int64): Color
        
        /** Sets the foreground color of the item specified by [param idx] index to the specified [Color]. */
        set_item_custom_fg_color(idx: int64, custom_fg_color: Color): void
        
        /** Returns the custom foreground color of the item specified by [param idx] index. */
        get_item_custom_fg_color(idx: int64): Color
        
        /** Returns the position and size of the item with the specified index, in the coordinate system of the [ItemList] node. If [param expand] is `true` the last column expands to fill the rest of the row.  
         *      
         *  **Note:** The returned value is unreliable if called right after modifying the [ItemList], before it redraws in the next frame.  
         */
        get_item_rect(idx: int64, expand?: boolean /* = true */): Rect2
        
        /** Sets whether the tooltip hint is enabled for specified item index. */
        set_item_tooltip_enabled(idx: int64, enable: boolean): void
        
        /** Returns `true` if the tooltip is enabled for specified item index. */
        is_item_tooltip_enabled(idx: int64): boolean
        
        /** Sets the tooltip hint for the item associated with the specified index. */
        set_item_tooltip(idx: int64, tooltip: string): void
        
        /** Returns the tooltip hint associated with the specified index. */
        get_item_tooltip(idx: int64): string
        
        /** Select the item at the specified index.  
         *      
         *  **Note:** This method does not trigger the item selection signal.  
         */
        select(idx: int64, single?: boolean /* = true */): void
        
        /** Ensures the item associated with the specified index is not selected. */
        deselect(idx: int64): void
        
        /** Ensures there are no items selected. */
        deselect_all(): void
        
        /** Returns `true` if the item at the specified index is currently selected. */
        is_selected(idx: int64): boolean
        
        /** Returns an array with the indexes of the selected items. */
        get_selected_items(): PackedInt32Array
        
        /** Moves item from index [param from_idx] to [param to_idx]. */
        move_item(from_idx: int64, to_idx: int64): void
        
        /** Removes the item specified by [param idx] index from the list. */
        remove_item(idx: int64): void
        
        /** Removes all items from the list. */
        clear(): void
        
        /** Sorts items in the list by their text. */
        sort_items_by_text(): void
        
        /** Returns `true` if one or more items are selected. */
        is_anything_selected(): boolean
        
        /** Returns the item index at the given [param position].  
         *  When there is no item at that point, -1 will be returned if [param exact] is `true`, and the closest item index will be returned otherwise.  
         *      
         *  **Note:** The returned value is unreliable if called right after modifying the [ItemList], before it redraws in the next frame.  
         */
        get_item_at_position(position: Vector2, exact?: boolean /* = false */): int64
        
        /** Ensure current selection is visible, adjusting the scroll position as necessary. */
        ensure_current_is_visible(): void
        
        /** Returns the vertical scrollbar.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member CanvasItem.visible] property.  
         */
        get_v_scroll_bar(): null | VScrollBar
        
        /** Returns the horizontal scrollbar.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member CanvasItem.visible] property.  
         */
        get_h_scroll_bar(): null | HScrollBar
        
        /** Forces an update to the list size based on its items. This happens automatically whenever size of the items, or other relevant settings like [member auto_height], change. The method can be used to trigger the update ahead of next drawing pass. */
        force_update_list_size(): void
        
        /** Allows single or multiple item selection. See the [enum SelectMode] constants. */
        get select_mode(): int64
        set select_mode(value: int64)
        
        /** If `true`, the currently selected item can be selected again. */
        get allow_reselect(): boolean
        set allow_reselect(value: boolean)
        
        /** If `true`, right mouse button click can select items. */
        get allow_rmb_select(): boolean
        set allow_rmb_select(value: boolean)
        
        /** If `true`, allows navigating the [ItemList] with letter keys through incremental search. */
        get allow_search(): boolean
        set allow_search(value: boolean)
        
        /** Maximum lines of text allowed in each item. Space will be reserved even when there is not enough lines of text to display.  
         *      
         *  **Note:** This property takes effect only when [member icon_mode] is [constant ICON_MODE_TOP]. To make the text wrap, [member fixed_column_width] should be greater than zero.  
         */
        get max_text_lines(): int64
        set max_text_lines(value: int64)
        
        /** If `true`, the control will automatically resize the width to fit its content. */
        get auto_width(): boolean
        set auto_width(value: boolean)
        
        /** If `true`, the control will automatically resize the height to fit its content. */
        get auto_height(): boolean
        set auto_height(value: boolean)
        
        /** The clipping behavior when the text exceeds an item's bounding rectangle. */
        get text_overrun_behavior(): int64
        set text_overrun_behavior(value: int64)
        
        /** If `true`, the control will automatically move items into a new row to fit its content. See also [HFlowContainer] for this behavior.  
         *  If `false`, the control will add a horizontal scrollbar to make all items visible.  
         */
        get wraparound_items(): boolean
        set wraparound_items(value: boolean)
        
        /** The way which scroll hints (indicators that show that the content can still be scrolled in a certain direction) will be shown. */
        get scroll_hint_mode(): int64
        set scroll_hint_mode(value: int64)
        
        /** If `true`, the scroll hint texture will be tiled instead of stretched. See [member scroll_hint_mode]. */
        get tile_scroll_hint(): boolean
        set tile_scroll_hint(value: boolean)
        
        /** The number of items currently in the list. */
        get item_count(): int64
        set item_count(value: int64)
        
        /** Maximum columns the list will have.  
         *  If greater than zero, the content will be split among the specified columns.  
         *  A value of zero means unlimited columns, i.e. all items will be put in the same row.  
         */
        get max_columns(): int64
        set max_columns(value: int64)
        
        /** Whether all columns will have the same width.  
         *  If `true`, the width is equal to the largest column width of all columns.  
         */
        get same_column_width(): boolean
        set same_column_width(value: boolean)
        
        /** The width all columns will be adjusted to.  
         *  A value of zero disables the adjustment, each item will have a width equal to the width of its content and the columns will have an uneven width.  
         */
        get fixed_column_width(): int64
        set fixed_column_width(value: int64)
        
        /** The icon position, whether above or to the left of the text. See the [enum IconMode] constants. */
        get icon_mode(): int64
        set icon_mode(value: int64)
        
        /** The scale of icon applied after [member fixed_icon_size] and transposing takes effect. */
        get icon_scale(): float64
        set icon_scale(value: float64)
        
        /** The size all icons will be adjusted to.  
         *  If either X or Y component is not greater than zero, icon size won't be affected.  
         */
        get fixed_icon_size(): Vector2i
        set fixed_icon_size(value: Vector2i)
        
        /** Emitted when specified item has been selected. Only applicable in single selection mode.  
         *  [member allow_reselect] must be enabled to reselect an item.  
         */
        readonly item_selected: Signal<(index: int64) => void>
        
        /** Emitted when any mouse click is issued within the rect of the list but on empty space.  
         *  [param at_position] is the click position in this control's local coordinate system.  
         */
        readonly empty_clicked: Signal<(at_position: Vector2, mouse_button_index: int64) => void>
        
        /** Emitted when specified list item has been clicked with any mouse button.  
         *  [param at_position] is the click position in this control's local coordinate system.  
         */
        readonly item_clicked: Signal<(index: int64, at_position: Vector2, mouse_button_index: int64) => void>
        
        /** Emitted when a multiple selection is altered on a list allowing multiple selection. */
        readonly multi_selected: Signal<(index: int64, selected: boolean) => void>
        
        /** Emitted when specified list item is activated via double-clicking or by pressing [kbd]Enter[/kbd]. */
        readonly item_activated: Signal<(index: int64) => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapItemList;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapItemList;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapIterateIK3D extends __RPCMapChainIK3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapIterateIK3D extends __NameMapChainIK3D {
    }
    /** A [SkeletonModifier3D] to approach the goal by repeating small rotations.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_iterateik3d.html  
     */
    class IterateIK3D<Map extends NodePathMap = any> extends ChainIK3D<Map> {
        constructor(identifier?: any)
        /** Sets the target node that the end bone is trying to reach. */
        set_target_node(index: int64, target_node: NodePath | string): void
        
        /** Returns the target node that the end bone is trying to reach. */
        get_target_node(index: int64): NodePath
        
        /** Sets the rotation axis at [param joint] in the bone chain's joint list.  
         *  The axes are based on the [method Skeleton3D.get_bone_rest]'s space, if [param axis] is [constant SkeletonModifier3D.ROTATION_AXIS_CUSTOM], you can specify any axis.  
         *      
         *  **Note:** The rotation axis and the forward vector shouldn't be colinear to avoid unintended rotation since [ChainIK3D] does not factor in twisting forces.  
         */
        set_joint_rotation_axis(index: int64, joint: int64, axis: SkeletonModifier3D.RotationAxis): void
        
        /** Returns the rotation axis at [param joint] in the bone chain's joint list. */
        get_joint_rotation_axis(index: int64, joint: int64): SkeletonModifier3D.RotationAxis
        
        /** Sets the rotation axis vector for the specified joint in the bone chain.  
         *  This vector is normalized by an internal process and represents the axis around which the bone chain can rotate.  
         *  If the vector length is `0`, it is considered synonymous with [constant SkeletonModifier3D.ROTATION_AXIS_ALL].  
         */
        set_joint_rotation_axis_vector(index: int64, joint: int64, axis_vector: Vector3): void
        
        /** Returns the rotation axis vector for the specified joint in the bone chain. This vector represents the axis around which the joint can rotate. It is determined based on the rotation axis set for the joint.  
         *  If [method get_joint_rotation_axis] is [constant SkeletonModifier3D.ROTATION_AXIS_ALL], this method returns `Vector3(0, 0, 0)`.  
         */
        get_joint_rotation_axis_vector(index: int64, joint: int64): Vector3
        
        /** Sets the joint limitation at [param joint] in the bone chain's joint list. */
        set_joint_limitation(index: int64, joint: int64, limitation: JointLimitation3D): void
        
        /** Returns the joint limitation at [param joint] in the bone chain's joint list. */
        get_joint_limitation(index: int64, joint: int64): null | JointLimitation3D
        
        /** Sets the joint limitation right axis at [param joint] in the bone chain's joint list. */
        set_joint_limitation_right_axis(index: int64, joint: int64, direction: SkeletonModifier3D.SecondaryDirection): void
        
        /** Returns the joint limitation right axis at [param joint] in the bone chain's joint list. */
        get_joint_limitation_right_axis(index: int64, joint: int64): SkeletonModifier3D.SecondaryDirection
        
        /** Sets the optional joint limitation right axis vector at [param joint] in the bone chain's joint list. */
        set_joint_limitation_right_axis_vector(index: int64, joint: int64, vector: Vector3): void
        
        /** Returns the joint limitation right axis vector at [param joint] in the bone chain's joint list.  
         *  If [method get_joint_limitation_right_axis] is [constant SkeletonModifier3D.SECONDARY_DIRECTION_NONE], this method returns `Vector3(0, 0, 0)`.  
         */
        get_joint_limitation_right_axis_vector(index: int64, joint: int64): Vector3
        
        /** Sets the joint limitation rotation offset at [param joint] in the bone chain's joint list.  
         *  Rotation is done in the local space which is constructed by the bone direction (in general parent to child) as the +Y axis and [method get_joint_limitation_right_axis_vector] as the +X axis.  
         *  If the +X and +Y axes are not orthogonal, the +X axis is implicitly modified to make it orthogonal.  
         *  Also, if the length of [method get_joint_limitation_right_axis_vector] is zero, the space is created by rotating the bone rest using the shortest arc that rotates the +Y axis of the bone rest to match the bone direction.  
         */
        set_joint_limitation_rotation_offset(index: int64, joint: int64, offset: Quaternion): void
        
        /** Returns the joint limitation rotation offset at [param joint] in the bone chain's joint list.  
         *  Rotation is done in the local space which is constructed by the bone direction (in general parent to child) as the +Y axis and [method get_joint_limitation_right_axis_vector] as the +X axis.  
         *  If the +X and +Y axes are not orthogonal, the +X axis is implicitly modified to make it orthogonal.  
         *  Also, if the length of [method get_joint_limitation_right_axis_vector] is zero, the space is created by rotating the bone rest using the shortest arc that rotates the +Y axis of the bone rest to match the bone direction.  
         */
        get_joint_limitation_rotation_offset(index: int64, joint: int64): Quaternion
        
        /** The number of iteration loops used by the IK solver to produce more accurate results. */
        get max_iterations(): int64
        set max_iterations(value: int64)
        
        /** The minimum distance between the end bone and the target. If the distance is below this value, the IK solver stops any further iterations. */
        get min_distance(): float64
        set min_distance(value: float64)
        
        /** The maximum amount each bone can rotate in a single iteration.  
         *      
         *  **Note:** This limitation is applied during each iteration. For example, if [member max_iterations] is `4` and [member angular_delta_limit] is `5` degrees, the maximum rotation possible in a single frame is `20` degrees.  
         */
        get angular_delta_limit(): float64
        set angular_delta_limit(value: float64)
        
        /** If `false`, the result is calculated from the previous frame's [IterateIK3D] result as the initial state.  
         *  If `true`, the previous frame's [IterateIK3D] result is discarded. At this point, the new result is calculated from the bone pose excluding the [IterateIK3D] as the initial state. This means the result will be always equal as long as the target position and the previous bone pose are the same. However, if [member angular_delta_limit] and [member max_iterations] are set too small, the end bone of the chain will never reach the target.  
         */
        get deterministic(): boolean
        set deterministic(value: boolean)
        
        /** The number of settings. */
        get setting_count(): int64
        set setting_count(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapIterateIK3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapIterateIK3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapJNISingleton extends __RPCMapObject {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapJNISingleton extends __NameMapObject {
    }
    /** Singleton that connects the engine with Android plugins to interface with native Android code.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_jnisingleton.html  
     */
    class JNISingleton extends Object {
        constructor(identifier?: any)
        /** Returns `true` if the given [param method] name exists in the JNISingleton's Java methods. */
        has_java_method(method: StringName): boolean
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapJNISingleton;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapJNISingleton;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapJSON extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapJSON extends __NameMapResource {
    }
    /** Helper class for creating and parsing JSON data.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_json.html  
     */
    class JSON extends Resource {
        constructor(identifier?: any)
        /** Converts a [Variant] var to JSON text and returns the result. Useful for serializing data to store or send over the network.  
         *      
         *  **Note:** The JSON specification does not define integer or float types, but only a  *number*  type. Therefore, converting a Variant to JSON text will convert all numerical values to [float] types.  
         *      
         *  **Note:** If [param full_precision] is `true`, when stringifying floats, the unreliable digits are stringified in addition to the reliable digits to guarantee exact decoding.  
         *  The [param indent] parameter controls if and how something is indented; its contents will be used where there should be an indent in the output. Even spaces like `"   "` will work. `\t` and `\n` can also be used for a tab indent, or to make a newline for each indent respectively.  
         *  **Warning:** Non-finite numbers are not supported in JSON. Any occurrences of [constant @GDScript.INF] will be replaced with `1e99999`, and negative [constant @GDScript.INF] will be replaced with `-1e99999`, but they will be interpreted correctly as infinity by most JSON parsers. [constant @GDScript.NAN] will be replaced with `null`, and it will not be interpreted as NaN in JSON parsers. If you expect non-finite numbers, consider passing your data through [method from_native] first.  
         *  **Example output:**  
         *    
         */
        static stringify(data: any, indent?: string /* = '' */, sort_keys?: boolean /* = true */, full_precision?: boolean /* = false */): string
        
        /** Attempts to parse the [param json_string] provided and returns the parsed data. Returns `null` if parse failed. */
        static parse_string(json_string: string): any
        
        /** Attempts to parse the [param json_text] provided.  
         *  Returns an [enum Error]. If the parse was successful, it returns [constant OK] and the result can be retrieved using [member data]. If unsuccessful, use [method get_error_line] and [method get_error_message] to identify the source of the failure.  
         *  Non-static variant of [method parse_string], if you want custom error handling.  
         *  The optional [param keep_text] argument instructs the parser to keep a copy of the original text. This text can be obtained later by using the [method get_parsed_text] function and is used when saving the resource (instead of generating new text from [member data]).  
         */
        parse(json_text: string, keep_text?: boolean /* = false */): Error
        
        /** Return the text parsed by [method parse] (requires passing `keep_text` to [method parse]). */
        get_parsed_text(): string
        
        /** Returns `0` if the last call to [method parse] was successful, or the line number where the parse failed. */
        get_error_line(): int64
        
        /** Returns an empty string if the last call to [method parse] was successful, or the error message if it failed. */
        get_error_message(): string
        
        /** Converts a native engine type to a JSON-compliant value.  
         *  By default, objects are ignored for security reasons, unless [param full_objects] is `true`.  
         *  You can convert a native value to a JSON string like this:  
         *    
         */
        static from_native(variant: any, full_objects?: boolean /* = false */): any
        
        /** Converts a JSON-compliant value that was created with [method from_native] back to native engine types.  
         *  By default, objects are ignored for security reasons, unless [param allow_objects] is `true`.  
         *  You can convert a JSON string back to a native value like this:  
         *    
         */
        static to_native(json: any, allow_objects?: boolean /* = false */): any
        
        /** Contains the parsed JSON data in [Variant] form. */
        get data(): any
        set data(value: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapJSON;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapJSON;
    }
    namespace JSONRPC {
        enum ErrorCode {
            /** The request could not be parsed as it was not valid by JSON standard ([method JSON.parse] failed). */
            PARSE_ERROR = -32700,
            
            /** A method call was requested but the request's format is not valid. */
            INVALID_REQUEST = -32600,
            
            /** A method call was requested but no function of that name existed in the JSONRPC subclass. */
            METHOD_NOT_FOUND = -32601,
            
            /** A method call was requested but the given method parameters are not valid. Not used by the built-in JSONRPC. */
            INVALID_PARAMS = -32602,
            
            /** An internal error occurred while processing the request. Not used by the built-in JSONRPC. */
            INTERNAL_ERROR = -32603,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapJSONRPC extends __RPCMapObject {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapJSONRPC extends __NameMapObject {
    }
    /** A helper to handle dictionaries which look like JSONRPC documents.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_jsonrpc.html  
     */
    class JSONRPC extends Object {
        constructor(identifier?: any)
        /** Registers a callback for the given method name.  
         *  - [param name]: The name that clients can use to access the callback.  
         *  - [param callback]: The callback which will handle the specified method.  
         */
        set_method(name: string, callback: Callable): void
        
        /** Given a Dictionary which takes the form of a JSON-RPC request: unpack the request and run it. Methods are resolved by looking at the field called "method" and looking for an equivalently named function in the JSONRPC object. If one is found that method is called.  
         *  To add new supported methods extend the JSONRPC class and call [method process_action] on your subclass.  
         *  [param action]: The action to be run, as a Dictionary in the form of a JSON-RPC request or notification.  
         */
        process_action(action: any, recurse?: boolean /* = false */): any
        process_string(action: string): string
        
        /** Returns a dictionary in the form of a JSON-RPC request. Requests are sent to a server with the expectation of a response. The ID field is used for the server to specify which exact request it is responding to.  
         *  - [param method]: Name of the method being called.  
         *  - [param params]: An array or dictionary of parameters being passed to the method.  
         *  - [param id]: Uniquely identifies this request. The server is expected to send a response with the same ID.  
         */
        make_request(method: string, params: any, id: any): GDictionary
        
        /** When a server has received and processed a request, it is expected to send a response. If you did not want a response then you need to have sent a Notification instead.  
         *  - [param result]: The return value of the function which was called.  
         *  - [param id]: The ID of the request this response is targeted to.  
         */
        make_response(result: any, id: any): GDictionary
        
        /** Returns a dictionary in the form of a JSON-RPC notification. Notifications are one-shot messages which do not expect a response.  
         *  - [param method]: Name of the method being called.  
         *  - [param params]: An array or dictionary of parameters being passed to the method.  
         */
        make_notification(method: string, params: any): GDictionary
        
        /** Creates a response which indicates a previous reply has failed in some way.  
         *  - [param code]: The error code corresponding to what kind of error this is. See the [enum ErrorCode] constants.  
         *  - [param message]: A custom message about this error.  
         *  - [param id]: The request this error is a response to.  
         */
        make_response_error(code: int64, message: string, id?: any /* = {} */): GDictionary
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapJSONRPC;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapJSONRPC;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapJacobianIK3D extends __RPCMapIterateIK3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapJacobianIK3D extends __NameMapIterateIK3D {
    }
    /** Jacobian transpose based inverse kinematics solver.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_jacobianik3d.html  
     */
    class JacobianIK3D<Map extends NodePathMap = any> extends IterateIK3D<Map> {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapJacobianIK3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapJacobianIK3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapJavaClass extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapJavaClass extends __NameMapRefCounted {
    }
    /** Represents a class from the Java Native Interface.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_javaclass.html  
     */
    class JavaClass extends RefCounted {
        constructor(identifier?: any)
        /** Returns the Java class name. */
        get_java_class_name(): string
        
        /** Returns the object's Java methods and their signatures as an [Array] of dictionaries, in the same format as [method Object.get_method_list]. */
        get_java_method_list(): GArray<GDictionary>
        
        /** Returns a [JavaClass] representing the Java parent class of this class. */
        get_java_parent_class(): null | JavaClass
        
        /** Returns `true` if the given [param method] name exists in the object's Java methods. */
        has_java_method(method: StringName): boolean
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapJavaClass;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapJavaClass;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapJavaObject extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapJavaObject extends __NameMapRefCounted {
    }
    /** Represents an object from the Java Native Interface.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_javaobject.html  
     */
    class JavaObject extends RefCounted {
        constructor(identifier?: any)
        /** Returns the [JavaClass] that this object is an instance of. */
        get_java_class(): null | JavaClass
        
        /** Returns `true` if the given [param method] name exists in the object's Java methods. */
        has_java_method(method: StringName): boolean
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapJavaObject;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapJavaObject;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapJavaScriptObject extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapJavaScriptObject extends __NameMapRefCounted {
    }
    /** A wrapper class for web native JavaScript objects.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_javascriptobject.html  
     */
    class JavaScriptObject extends RefCounted {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapJavaScriptObject;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapJavaScriptObject;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapJoint2D extends __RPCMapNode2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapJoint2D extends __NameMapNode2D {
    }
    /** Abstract base class for all 2D physics joints.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_joint2d.html  
     */
    class Joint2D<Map extends NodePathMap = any> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Returns the joint's internal [RID] from the [PhysicsServer2D]. */
        get_rid(): RID
        
        /** Path to the first body (A) attached to the joint. The node must inherit [PhysicsBody2D]. */
        get node_a(): NodePath
        set node_a(value: NodePath | string)
        
        /** Path to the second body (B) attached to the joint. The node must inherit [PhysicsBody2D]. */
        get node_b(): NodePath
        set node_b(value: NodePath | string)
        
        /** When [member node_a] and [member node_b] move in different directions the [member bias] controls how fast the joint pulls them back to their original position. The lower the [member bias] the more the two bodies can pull on the joint.  
         *  When set to `0`, the default value from [member ProjectSettings.physics/2d/solver/default_constraint_bias] is used.  
         */
        get bias(): float64
        set bias(value: float64)
        
        /** If `true`, the two bodies bound together do not collide with each other. */
        get disable_collision(): boolean
        set disable_collision(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapJoint2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapJoint2D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapJoint3D extends __RPCMapNode3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapJoint3D extends __NameMapNode3D {
    }
    /** Abstract base class for all 3D physics joints.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_joint3d.html  
     */
    class Joint3D<Map extends NodePathMap = any> extends Node3D<Map> {
        constructor(identifier?: any)
        /** Returns the joint's internal [RID] from the [PhysicsServer3D]. */
        get_rid(): RID
        
        /** Path to the first node (A) attached to the joint. The node must inherit [PhysicsBody3D].  
         *  If left empty and [member node_b] is set, the body is attached to a fixed [StaticBody3D] without collision shapes.  
         */
        get node_a(): NodePath
        set node_a(value: NodePath | string)
        
        /** Path to the second node (B) attached to the joint. The node must inherit [PhysicsBody3D].  
         *  If left empty and [member node_a] is set, the body is attached to a fixed [StaticBody3D] without collision shapes.  
         */
        get node_b(): NodePath
        set node_b(value: NodePath | string)
        
        /** The priority used to define which solver is executed first for multiple joints. The lower the value, the higher the priority. */
        get solver_priority(): int64
        set solver_priority(value: int64)
        
        /** If `true`, the two bodies bound together do not collide with each other. */
        get exclude_nodes_from_collision(): boolean
        set exclude_nodes_from_collision(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapJoint3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapJoint3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapJointLimitation3D extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapJointLimitation3D extends __NameMapResource {
    }
    /** A base class of the limitation that interacts with [ChainIK3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_jointlimitation3d.html  
     */
    class JointLimitation3D extends Resource {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapJointLimitation3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapJointLimitation3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapJointLimitationCone3D extends __RPCMapJointLimitation3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapJointLimitationCone3D extends __NameMapJointLimitation3D {
    }
    /** A cone shape limitation that interacts with [ChainIK3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_jointlimitationcone3d.html  
     */
    class JointLimitationCone3D extends JointLimitation3D {
        constructor(identifier?: any)
        /** The radius range of the hole made by the cone.  
         *  `0` degrees makes a sphere without hole, `180` degrees makes a hemisphere, and `360` degrees become empty (no limitation).  
         */
        get angle(): float64
        set angle(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapJointLimitationCone3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapJointLimitationCone3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapKinematicCollision2D extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapKinematicCollision2D extends __NameMapRefCounted {
    }
    /** Holds collision data from the movement of a [PhysicsBody2D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_kinematiccollision2d.html  
     */
    class KinematicCollision2D extends RefCounted {
        constructor(identifier?: any)
        /** Returns the point of collision in global coordinates. */
        get_position(): Vector2
        
        /** Returns the colliding body's shape's normal at the point of collision. */
        get_normal(): Vector2
        
        /** Returns the moving object's travel before collision. */
        get_travel(): Vector2
        
        /** Returns the moving object's remaining movement vector. */
        get_remainder(): Vector2
        
        /** Returns the collision angle according to [param up_direction], which is [constant Vector2.UP] by default. This value is always positive. */
        get_angle(up_direction?: Vector2 /* = new Vector2(0, -1) */): float64
        
        /** Returns the colliding body's length of overlap along the collision normal. */
        get_depth(): float64
        
        /** Returns the moving object's colliding shape. */
        get_local_shape(): null | Object
        
        /** Returns the colliding body's attached [Object]. */
        get_collider(): null | Object
        
        /** Returns the unique instance ID of the colliding body's attached [Object]. See [method Object.get_instance_id]. */
        get_collider_id(): int64
        
        /** Returns the colliding body's [RID] used by the [PhysicsServer2D]. */
        get_collider_rid(): RID
        
        /** Returns the colliding body's shape. */
        get_collider_shape(): null | Object
        
        /** Returns the colliding body's shape index. See [CollisionObject2D]. */
        get_collider_shape_index(): int64
        
        /** Returns the colliding body's velocity. */
        get_collider_velocity(): Vector2
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapKinematicCollision2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapKinematicCollision2D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapKinematicCollision3D extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapKinematicCollision3D extends __NameMapRefCounted {
    }
    /** Holds collision data from the movement of a [PhysicsBody3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_kinematiccollision3d.html  
     */
    class KinematicCollision3D extends RefCounted {
        constructor(identifier?: any)
        /** Returns the moving object's travel before collision. */
        get_travel(): Vector3
        
        /** Returns the moving object's remaining movement vector. */
        get_remainder(): Vector3
        
        /** Returns the colliding body's length of overlap along the collision normal. */
        get_depth(): float64
        
        /** Returns the number of detected collisions. */
        get_collision_count(): int64
        
        /** Returns the point of collision in global coordinates given a collision index (the deepest collision by default). */
        get_position(collision_index?: int64 /* = 0 */): Vector3
        
        /** Returns the colliding body's shape's normal at the point of collision given a collision index (the deepest collision by default). */
        get_normal(collision_index?: int64 /* = 0 */): Vector3
        
        /** Returns the collision angle according to [param up_direction], which is [constant Vector3.UP] by default. This value is always positive. */
        get_angle(collision_index?: int64 /* = 0 */, up_direction?: Vector3 /* = Vector3.ZERO */): float64
        
        /** Returns the moving object's colliding shape given a collision index (the deepest collision by default). */
        get_local_shape(collision_index?: int64 /* = 0 */): null | Object
        
        /** Returns the colliding body's attached [Object] given a collision index (the deepest collision by default). */
        get_collider(collision_index?: int64 /* = 0 */): null | Object
        
        /** Returns the unique instance ID of the colliding body's attached [Object] given a collision index (the deepest collision by default). See [method Object.get_instance_id]. */
        get_collider_id(collision_index?: int64 /* = 0 */): int64
        
        /** Returns the colliding body's [RID] used by the [PhysicsServer3D] given a collision index (the deepest collision by default). */
        get_collider_rid(collision_index?: int64 /* = 0 */): RID
        
        /** Returns the colliding body's shape given a collision index (the deepest collision by default). */
        get_collider_shape(collision_index?: int64 /* = 0 */): null | Object
        
        /** Returns the colliding body's shape index given a collision index (the deepest collision by default). See [CollisionObject3D]. */
        get_collider_shape_index(collision_index?: int64 /* = 0 */): int64
        
        /** Returns the colliding body's velocity given a collision index (the deepest collision by default). */
        get_collider_velocity(collision_index?: int64 /* = 0 */): Vector3
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapKinematicCollision3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapKinematicCollision3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapLabel extends __RPCMapControl {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapLabel extends __NameMapControl {
    }
    /** A control for displaying plain text.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_label.html  
     */
    class Label<Map extends NodePathMap = any> extends Control<Map> {
        constructor(identifier?: any)
        /** Returns the height of the line [param line].  
         *  If [param line] is set to `-1`, returns the biggest line height.  
         *  If there are no lines, returns font size in pixels.  
         */
        get_line_height(line?: int64 /* = -1 */): int64
        
        /** Returns the number of lines of text the Label has. */
        get_line_count(): int64
        
        /** Returns the number of lines shown. Useful if the [Label]'s height cannot currently display all lines. */
        get_visible_line_count(): int64
        
        /** Returns the total number of printable characters in the text (excluding spaces and newlines). */
        get_total_character_count(): int64
        
        /** Returns the bounding rectangle of the character at position [param pos] in the label's local coordinate system. If the character is a non-visual character or [param pos] is outside the valid range, an empty [Rect2] is returned. If the character is a part of a composite grapheme, the bounding rectangle of the whole grapheme is returned. */
        get_character_bounds(pos: int64): Rect2
        
        /** The text to display on screen. */
        get text(): string
        set text(value: string)
        
        /** A [LabelSettings] resource that can be shared between multiple [Label] nodes. Takes priority over theme properties. */
        get label_settings(): null | LabelSettings
        set label_settings(value: null | LabelSettings)
        
        /** Controls the text's horizontal alignment. Supports left, center, right, and fill (also known as justify). */
        get horizontal_alignment(): int64
        set horizontal_alignment(value: int64)
        
        /** Controls the text's vertical alignment. Supports top, center, bottom, and fill. */
        get vertical_alignment(): int64
        set vertical_alignment(value: int64)
        
        /** If set to something other than [constant TextServer.AUTOWRAP_OFF], the text gets wrapped inside the node's bounding rectangle. If you resize the node, it will change its height automatically to show all the text. */
        get autowrap_mode(): int64
        set autowrap_mode(value: int64)
        
        /** Autowrap space trimming flags. See [constant TextServer.BREAK_TRIM_START_EDGE_SPACES] and [constant TextServer.BREAK_TRIM_END_EDGE_SPACES] for more info. */
        get autowrap_trim_flags(): int64
        set autowrap_trim_flags(value: int64)
        
        /** Line fill alignment rules. */
        get justification_flags(): int64
        set justification_flags(value: int64)
        
        /** String used as a paragraph separator. Each paragraph is processed independently, in its own BiDi context. */
        get paragraph_separator(): string
        set paragraph_separator(value: string)
        
        /** If `true`, the Label only shows the text that fits inside its bounding rectangle and will clip text horizontally. */
        get clip_text(): boolean
        set clip_text(value: boolean)
        
        /** The clipping behavior when the text exceeds the node's bounding rectangle. */
        get text_overrun_behavior(): int64
        set text_overrun_behavior(value: int64)
        
        /** Ellipsis character used for text clipping. */
        get ellipsis_char(): string
        set ellipsis_char(value: string)
        
        /** If `true`, all the text displays as UPPERCASE. */
        get uppercase(): boolean
        set uppercase(value: boolean)
        
        /** Aligns text to the given tab-stops. */
        get tab_stops(): PackedFloat32Array
        set tab_stops(value: PackedFloat32Array | float32[])
        
        /** The number of the lines ignored and not displayed from the start of the [member text] value. */
        get lines_skipped(): int64
        set lines_skipped(value: int64)
        
        /** Limits the lines of text the node shows on screen. */
        get max_lines_visible(): int64
        set max_lines_visible(value: int64)
        
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
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapLabel;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapLabel;
    }
    namespace Label3D {
        enum DrawFlags {
            /** If set, lights in the environment affect the label. */
            FLAG_SHADED = 0,
            
            /** If set, text can be seen from the back as well. If not, the text is invisible when looking at it from behind. */
            FLAG_DOUBLE_SIDED = 1,
            
            /** Disables the depth test, so this object is drawn on top of all others. However, objects drawn after it in the draw order may cover it. */
            FLAG_DISABLE_DEPTH_TEST = 2,
            
            /** Label is scaled by depth so that it always appears the same size on screen. */
            FLAG_FIXED_SIZE = 3,
            
            /** Represents the size of the [enum DrawFlags] enum. */
            FLAG_MAX = 4,
        }
        enum AlphaCutMode {
            /** This mode performs standard alpha blending. It can display translucent areas, but transparency sorting issues may be visible when multiple transparent materials are overlapping. [member GeometryInstance3D.cast_shadow] has no effect when this transparency mode is used; the [Label3D] will never cast shadows. */
            ALPHA_CUT_DISABLED = 0,
            
            /** This mode only allows fully transparent or fully opaque pixels. Harsh edges will be visible unless some form of screen-space antialiasing is enabled (see [member ProjectSettings.rendering/anti_aliasing/quality/screen_space_aa]). This mode is also known as  *alpha testing*  or  *1-bit transparency* .  
             *      
             *  **Note:** This mode might have issues with anti-aliased fonts and outlines, try adjusting [member alpha_scissor_threshold] or using MSDF font.  
             *      
             *  **Note:** When using text with overlapping glyphs (e.g., cursive scripts), this mode might have transparency sorting issues between the main text and the outline.  
             */
            ALPHA_CUT_DISCARD = 1,
            
            /** This mode draws fully opaque pixels in the depth prepass. This is slower than [constant ALPHA_CUT_DISABLED] or [constant ALPHA_CUT_DISCARD], but it allows displaying translucent areas and smooth edges while using proper sorting.  
             *      
             *  **Note:** When using text with overlapping glyphs (e.g., cursive scripts), this mode might have transparency sorting issues between the main text and the outline.  
             */
            ALPHA_CUT_OPAQUE_PREPASS = 2,
            
            /** This mode draws cuts off all values below a spatially-deterministic threshold, the rest will remain opaque. */
            ALPHA_CUT_HASH = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapLabel3D extends __RPCMapGeometryInstance3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapLabel3D extends __NameMapGeometryInstance3D {
    }
    /** A node for displaying plain text in 3D space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_label3d.html  
     */
    class Label3D<Map extends NodePathMap = any> extends GeometryInstance3D<Map> {
        constructor(identifier?: any)
        /** If `true`, the specified [param flag] will be enabled. */
        set_draw_flag(flag: Label3D.DrawFlags, enabled: boolean): void
        
        /** Returns the value of the specified flag. */
        get_draw_flag(flag: Label3D.DrawFlags): boolean
        
        /** Returns a [TriangleMesh] with the label's vertices following its current configuration (such as its [member pixel_size]). */
        generate_triangle_mesh(): null | TriangleMesh
        
        /** The size of one pixel's width on the label to scale it in 3D. To make the font look more detailed when up close, increase [member font_size] while decreasing [member pixel_size] at the same time. */
        get pixel_size(): float64
        set pixel_size(value: float64)
        
        /** The text drawing offset (in pixels). */
        get offset(): Vector2
        set offset(value: Vector2)
        
        /** The billboard mode to use for the label. */
        get billboard(): int64
        set billboard(value: int64)
        
        /** If `true`, the [Light3D] in the [Environment] has effects on the label. */
        get shaded(): boolean
        set shaded(value: boolean)
        
        /** If `true`, text can be seen from the back as well, if `false`, it is invisible when looking at it from behind. */
        get double_sided(): boolean
        set double_sided(value: boolean)
        
        /** If `true`, depth testing is disabled and the object will be drawn in render order. */
        get no_depth_test(): boolean
        set no_depth_test(value: boolean)
        
        /** If `true`, the label is rendered at the same size regardless of distance. The label's size on screen is the same as if the camera was `1.0` units away from the label's origin, regardless of the actual distance from the camera. The [Camera3D]'s field of view (or [member Camera3D.size] when in orthogonal/frustum mode) still affects the size the label is drawn at. */
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
        
        /** Filter flags for the texture. */
        get texture_filter(): int64
        set texture_filter(value: int64)
        
        /** Sets the render priority for the text. Higher priority objects will be sorted in front of lower priority objects.  
         *      
         *  **Note:** This only applies if [member alpha_cut] is set to [constant ALPHA_CUT_DISABLED] (default value).  
         *      
         *  **Note:** This only applies to sorting of transparent objects. This will not impact how transparent objects are sorted relative to opaque objects. This is because opaque objects are not sorted, while transparent objects are sorted from back to front (subject to priority).  
         */
        get render_priority(): int64
        set render_priority(value: int64)
        
        /** Sets the render priority for the text outline. Higher priority objects will be sorted in front of lower priority objects.  
         *      
         *  **Note:** This only applies if [member alpha_cut] is set to [constant ALPHA_CUT_DISABLED] (default value).  
         *      
         *  **Note:** This only applies to sorting of transparent objects. This will not impact how transparent objects are sorted relative to opaque objects. This is because opaque objects are not sorted, while transparent objects are sorted from back to front (subject to priority).  
         */
        get outline_render_priority(): int64
        set outline_render_priority(value: int64)
        
        /** Text [Color] of the [Label3D]. */
        get modulate(): Color
        set modulate(value: Color)
        
        /** The tint of text outline. */
        get outline_modulate(): Color
        set outline_modulate(value: Color)
        
        /** The text to display on screen. */
        get text(): string
        set text(value: string)
        
        /** Font configuration used to display text. */
        get font(): null | Font
        set font(value: null | Font)
        
        /** Font size of the [Label3D]'s text. To make the font look more detailed when up close, increase [member font_size] while decreasing [member pixel_size] at the same time.  
         *  Higher font sizes require more time to render new characters, which can cause stuttering during gameplay.  
         */
        get font_size(): int64
        set font_size(value: int64)
        
        /** Text outline size. */
        get outline_size(): int64
        set outline_size(value: int64)
        
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
        
        /** Autowrap space trimming flags. See [constant TextServer.BREAK_TRIM_START_EDGE_SPACES] and [constant TextServer.BREAK_TRIM_END_EDGE_SPACES] for more info. */
        get autowrap_trim_flags(): int64
        set autowrap_trim_flags(value: int64)
        
        /** Line fill alignment rules. */
        get justification_flags(): int64
        set justification_flags(value: int64)
        
        /** Text width (in pixels), used for autowrap and fill alignment. */
        get width(): float64
        set width(value: float64)
        
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
        __godotRPCMap: __RPCMapLabel3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapLabel3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapLabelSettings extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapLabelSettings extends __NameMapResource {
    }
    /** Provides common settings to customize the text in a [Label].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_labelsettings.html  
     */
    class LabelSettings extends Resource {
        constructor(identifier?: any)
        /** Adds a new stacked outline to the label at the given [param index]. If [param index] is `-1`, the new stacked outline will be added at the end of the list. */
        add_stacked_outline(index?: int64 /* = -1 */): void
        
        /** Moves the stacked outline at index [param from_index] to the given position [param to_position] in the array. */
        move_stacked_outline(from_index: int64, to_position: int64): void
        
        /** Removes the stacked outline at index [param index]. */
        remove_stacked_outline(index: int64): void
        
        /** Sets the size of the stacked outline identified by the given [param index] to [param size]. */
        set_stacked_outline_size(index: int64, size: int64): void
        
        /** Returns the size of the stacked outline at [param index]. */
        get_stacked_outline_size(index: int64): int64
        
        /** Sets the color of the stacked outline identified by the given [param index] to [param color]. */
        set_stacked_outline_color(index: int64, color: Color): void
        
        /** Returns the color of the stacked outline at [param index]. */
        get_stacked_outline_color(index: int64): Color
        
        /** Adds a new stacked shadow to the label at the given [param index]. If [param index] is `-1`, the new stacked shadow will be added at the end of the list. */
        add_stacked_shadow(index?: int64 /* = -1 */): void
        
        /** Moves the stacked shadow at index [param from_index] to the given position [param to_position] in the array. */
        move_stacked_shadow(from_index: int64, to_position: int64): void
        
        /** Removes the stacked shadow at index [param index]. */
        remove_stacked_shadow(index: int64): void
        
        /** Sets the offset of the stacked shadow identified by the given [param index] to [param offset]. */
        set_stacked_shadow_offset(index: int64, offset: Vector2): void
        
        /** Returns the offset of the stacked shadow at [param index]. */
        get_stacked_shadow_offset(index: int64): Vector2
        
        /** Sets the color of the stacked shadow identified by the given [param index] to [param color]. */
        set_stacked_shadow_color(index: int64, color: Color): void
        
        /** Returns the color of the stacked shadow at [param index]. */
        get_stacked_shadow_color(index: int64): Color
        
        /** Sets the outline size of the stacked shadow identified by the given [param index] to [param size]. */
        set_stacked_shadow_outline_size(index: int64, size: int64): void
        
        /** Returns the outline size of the stacked shadow at [param index]. */
        get_stacked_shadow_outline_size(index: int64): int64
        
        /** Additional vertical spacing between lines (in pixels), spacing is added to line descent. This value can be negative. */
        get line_spacing(): float64
        set line_spacing(value: float64)
        
        /** Vertical space between paragraphs. Added on top of [member line_spacing]. */
        get paragraph_spacing(): float64
        set paragraph_spacing(value: float64)
        
        /** [Font] used for the text. */
        get font(): null | Font
        set font(value: null | Font)
        
        /** Size of the text. */
        get font_size(): int64
        set font_size(value: int64)
        
        /** Color of the text. */
        get font_color(): Color
        set font_color(value: Color)
        
        /** Text outline size. */
        get outline_size(): int64
        set outline_size(value: int64)
        
        /** The color of the outline. */
        get outline_color(): Color
        set outline_color(value: Color)
        
        /** Size of the shadow effect. */
        get shadow_size(): int64
        set shadow_size(value: int64)
        
        /** Color of the shadow effect. If alpha is `0`, no shadow will be drawn. */
        get shadow_color(): Color
        set shadow_color(value: Color)
        
        /** Offset of the shadow effect, in pixels. */
        get shadow_offset(): Vector2
        set shadow_offset(value: Vector2)
        
        /** The number of stacked outlines. */
        get stacked_outline_count(): int64
        set stacked_outline_count(value: int64)
        
        /** The number of stacked shadows. */
        get stacked_shadow_count(): int64
        set stacked_shadow_count(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapLabelSettings;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapLabelSettings;
    }
    namespace Light2D {
        enum ShadowFilter {
            /** No filter applies to the shadow map. This provides hard shadow edges and is the fastest to render. See [member shadow_filter]. */
            SHADOW_FILTER_NONE = 0,
            
            /** Percentage closer filtering (5 samples) applies to the shadow map. This is slower compared to hard shadow rendering. See [member shadow_filter]. */
            SHADOW_FILTER_PCF5 = 1,
            
            /** Percentage closer filtering (13 samples) applies to the shadow map. This is the slowest shadow filtering mode, and should be used sparingly. See [member shadow_filter]. */
            SHADOW_FILTER_PCF13 = 2,
        }
        enum BlendMode {
            /** Adds the value of pixels corresponding to the Light2D to the values of pixels under it. This is the common behavior of a light. */
            BLEND_MODE_ADD = 0,
            
            /** Subtracts the value of pixels corresponding to the Light2D to the values of pixels under it, resulting in inversed light effect. */
            BLEND_MODE_SUB = 1,
            
            /** Mix the value of pixels corresponding to the Light2D to the values of pixels under it by linear interpolation. */
            BLEND_MODE_MIX = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapLight2D extends __RPCMapNode2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapLight2D extends __NameMapNode2D {
    }
    /** Casts light in a 2D environment.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_light2d.html  
     */
    class Light2D<Map extends NodePathMap = any> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Sets the light's height, which is used in 2D normal mapping. See [member PointLight2D.height] and [member DirectionalLight2D.height]. */
        set_height(height: float64): void
        
        /** Returns the light's height, which is used in 2D normal mapping. See [member PointLight2D.height] and [member DirectionalLight2D.height]. */
        get_height(): float64
        
        /** If `true`, Light2D will emit light. */
        get enabled(): boolean
        set enabled(value: boolean)
        
        /** If `true`, Light2D will only appear when editing the scene. */
        get editor_only(): boolean
        set editor_only(value: boolean)
        
        /** The Light2D's [Color]. */
        get color(): Color
        set color(value: Color)
        
        /** The Light2D's energy value. The larger the value, the stronger the light. */
        get energy(): float64
        set energy(value: float64)
        
        /** The Light2D's blend mode. */
        get blend_mode(): int64
        set blend_mode(value: int64)
        
        /** Minimum `z` value of objects that are affected by the Light2D. */
        get range_z_min(): int64
        set range_z_min(value: int64)
        
        /** Maximum `z` value of objects that are affected by the Light2D. */
        get range_z_max(): int64
        set range_z_max(value: int64)
        
        /** Minimum layer value of objects that are affected by the Light2D. */
        get range_layer_min(): int64
        set range_layer_min(value: int64)
        
        /** Maximum layer value of objects that are affected by the Light2D. */
        get range_layer_max(): int64
        set range_layer_max(value: int64)
        
        /** The layer mask. Only objects with a matching [member CanvasItem.light_mask] will be affected by the Light2D. See also [member shadow_item_cull_mask], which affects which objects can cast shadows.  
         *      
         *  **Note:** [member range_item_cull_mask] is ignored by [DirectionalLight2D], which will always light a 2D node regardless of the 2D node's [member CanvasItem.light_mask].  
         */
        get range_item_cull_mask(): int64
        set range_item_cull_mask(value: int64)
        
        /** If `true`, the Light2D will cast shadows. */
        get shadow_enabled(): boolean
        set shadow_enabled(value: boolean)
        
        /** [Color] of shadows cast by the Light2D. */
        get shadow_color(): Color
        set shadow_color(value: Color)
        
        /** Shadow filter type. */
        get shadow_filter(): int64
        set shadow_filter(value: int64)
        
        /** Smoothing value for shadows. Higher values will result in softer shadows, at the cost of visible streaks that can appear in shadow rendering. [member shadow_filter_smooth] only has an effect if [member shadow_filter] is [constant SHADOW_FILTER_PCF5] or [constant SHADOW_FILTER_PCF13]. */
        get shadow_filter_smooth(): float64
        set shadow_filter_smooth(value: float64)
        
        /** The shadow mask. Used with [LightOccluder2D] to cast shadows. Only occluders with a matching [member CanvasItem.light_mask] will cast shadows. See also [member range_item_cull_mask], which affects which objects can  *receive*  the light. */
        get shadow_item_cull_mask(): int64
        set shadow_item_cull_mask(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapLight2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapLight2D;
    }
    namespace Light3D {
        enum Param {
            /** Constant for accessing [member light_energy]. */
            PARAM_ENERGY = 0,
            
            /** Constant for accessing [member light_indirect_energy]. */
            PARAM_INDIRECT_ENERGY = 1,
            
            /** Constant for accessing [member light_volumetric_fog_energy]. */
            PARAM_VOLUMETRIC_FOG_ENERGY = 2,
            
            /** Constant for accessing [member light_specular]. */
            PARAM_SPECULAR = 3,
            
            /** Constant for accessing [member OmniLight3D.omni_range] or [member SpotLight3D.spot_range]. */
            PARAM_RANGE = 4,
            
            /** Constant for accessing [member light_size]. */
            PARAM_SIZE = 5,
            
            /** Constant for accessing [member OmniLight3D.omni_attenuation] or [member SpotLight3D.spot_attenuation]. */
            PARAM_ATTENUATION = 6,
            
            /** Constant for accessing [member SpotLight3D.spot_angle]. */
            PARAM_SPOT_ANGLE = 7,
            
            /** Constant for accessing [member SpotLight3D.spot_angle_attenuation]. */
            PARAM_SPOT_ATTENUATION = 8,
            
            /** Constant for accessing [member DirectionalLight3D.directional_shadow_max_distance]. */
            PARAM_SHADOW_MAX_DISTANCE = 9,
            
            /** Constant for accessing [member DirectionalLight3D.directional_shadow_split_1]. */
            PARAM_SHADOW_SPLIT_1_OFFSET = 10,
            
            /** Constant for accessing [member DirectionalLight3D.directional_shadow_split_2]. */
            PARAM_SHADOW_SPLIT_2_OFFSET = 11,
            
            /** Constant for accessing [member DirectionalLight3D.directional_shadow_split_3]. */
            PARAM_SHADOW_SPLIT_3_OFFSET = 12,
            
            /** Constant for accessing [member DirectionalLight3D.directional_shadow_fade_start]. */
            PARAM_SHADOW_FADE_START = 13,
            
            /** Constant for accessing [member shadow_normal_bias]. */
            PARAM_SHADOW_NORMAL_BIAS = 14,
            
            /** Constant for accessing [member shadow_bias]. */
            PARAM_SHADOW_BIAS = 15,
            
            /** Constant for accessing [member DirectionalLight3D.directional_shadow_pancake_size]. */
            PARAM_SHADOW_PANCAKE_SIZE = 16,
            
            /** Constant for accessing [member shadow_opacity]. */
            PARAM_SHADOW_OPACITY = 17,
            
            /** Constant for accessing [member shadow_blur]. */
            PARAM_SHADOW_BLUR = 18,
            
            /** Constant for accessing [member shadow_transmittance_bias]. */
            PARAM_TRANSMITTANCE_BIAS = 19,
            
            /** Constant for accessing [member light_intensity_lumens] and [member light_intensity_lux]. Only used when [member ProjectSettings.rendering/lights_and_shadows/use_physical_light_units] is `true`. */
            PARAM_INTENSITY = 20,
            
            /** Represents the size of the [enum Param] enum. */
            PARAM_MAX = 21,
        }
        enum BakeMode {
            /** Light is ignored when baking. This is the fastest mode, but the light will not be taken into account when baking global illumination. This mode should generally be used for dynamic lights that change quickly, as the effect of global illumination is less noticeable on those lights.  
             *      
             *  **Note:** Hiding a light does  *not*  affect baking [LightmapGI]. Hiding a light will still affect baking [VoxelGI] and SDFGI (see [member Environment.sdfgi_enabled]).  
             */
            BAKE_DISABLED = 0,
            
            /** Light is taken into account in static baking ([VoxelGI], [LightmapGI], SDFGI ([member Environment.sdfgi_enabled])). The light can be moved around or modified, but its global illumination will not update in real-time. This is suitable for subtle changes (such as flickering torches), but generally not large changes such as toggling a light on and off.  
             *      
             *  **Note:** The light is not baked in [LightmapGI] if [member editor_only] is `true`.  
             */
            BAKE_STATIC = 1,
            
            /** Light is taken into account in dynamic baking ([VoxelGI] and SDFGI ([member Environment.sdfgi_enabled]) only). The light can be moved around or modified with global illumination updating in real-time. The light's global illumination appearance will be slightly different compared to [constant BAKE_STATIC]. This has a greater performance cost compared to [constant BAKE_STATIC]. When using SDFGI, the update speed of dynamic lights is affected by [member ProjectSettings.rendering/global_illumination/sdfgi/frames_to_update_lights]. */
            BAKE_DYNAMIC = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapLight3D extends __RPCMapVisualInstance3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapLight3D extends __NameMapVisualInstance3D {
    }
    /** Provides a base class for different kinds of light nodes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_light3d.html  
     */
    class Light3D<Map extends NodePathMap = any> extends VisualInstance3D<Map> {
        constructor(identifier?: any)
        /** Sets the value of the specified [enum Light3D.Param] parameter. */
        set_param(param: Light3D.Param, value: float64): void
        
        /** Returns the value of the specified [enum Light3D.Param] parameter. */
        get_param(param: Light3D.Param): float64
        
        /** Returns the [Color] of an idealized blackbody at the given [member light_temperature]. This value is calculated internally based on the [member light_temperature]. This [Color] is multiplied by [member light_color] before being sent to the [RenderingServer]. */
        get_correlated_color(): Color
        
        /** Used by positional lights ([OmniLight3D] and [SpotLight3D]) when [member ProjectSettings.rendering/lights_and_shadows/use_physical_light_units] is `true`. Sets the intensity of the light source measured in Lumens. Lumens are a measure of luminous flux, which is the total amount of visible light emitted by a light source per unit of time.  
         *  For [SpotLight3D]s, we assume that the area outside the visible cone is surrounded by a perfect light absorbing material. Accordingly, the apparent brightness of the cone area does not change as the cone increases and decreases in size.  
         *  A typical household lightbulb can range from around 600 lumens to 1,200 lumens, a candle is about 13 lumens, while a streetlight can be approximately 60,000 lumens.  
         */
        get light_intensity_lumens(): float64
        set light_intensity_lumens(value: float64)
        
        /** Used by [DirectionalLight3D]s when [member ProjectSettings.rendering/lights_and_shadows/use_physical_light_units] is `true`. Sets the intensity of the light source measured in Lux. Lux is a measure of luminous flux per unit area, it is equal to one lumen per square meter. Lux is the measure of how much light hits a surface at a given time.  
         *  On a clear sunny day a surface in direct sunlight may be approximately 100,000 lux, a typical room in a home may be approximately 50 lux, while the moonlit ground may be approximately 0.1 lux.  
         */
        get light_intensity_lux(): float64
        set light_intensity_lux(value: float64)
        
        /** Sets the color temperature of the light source, measured in Kelvin. This is used to calculate a correlated color temperature which tints the [member light_color].  
         *  The sun on a cloudy day is approximately 6500 Kelvin, on a clear day it is between 5500 to 6000 Kelvin, and on a clear day at sunrise or sunset it ranges to around 1850 Kelvin.  
         */
        get light_temperature(): float64
        set light_temperature(value: float64)
        
        /** The light's color in nonlinear sRGB encoding. An  *overbright*  color can be used to achieve a result equivalent to increasing the light's [member light_energy]. */
        get light_color(): Color
        set light_color(value: Color)
        
        /** The light's strength multiplier (this is not a physical unit). For [OmniLight3D] and [SpotLight3D], changing this value will only change the light color's intensity, not the light's radius. */
        get light_energy(): float64
        set light_energy(value: float64)
        
        /** Secondary multiplier used with indirect light (light bounces). Used with [VoxelGI] and SDFGI (see [member Environment.sdfgi_enabled]).  
         *      
         *  **Note:** This property is ignored if [member light_energy] is equal to `0.0`, as the light won't be present at all in the GI shader.  
         */
        get light_indirect_energy(): float64
        set light_indirect_energy(value: float64)
        
        /** Secondary multiplier multiplied with [member light_energy] then used with the [Environment]'s volumetric fog (if enabled). If set to `0.0`, computing volumetric fog will be skipped for this light, which can improve performance for large amounts of lights when volumetric fog is enabled.  
         *      
         *  **Note:** To prevent short-lived dynamic light effects from poorly interacting with volumetric fog, lights used in those effects should have [member light_volumetric_fog_energy] set to `0.0` unless [member Environment.volumetric_fog_temporal_reprojection_enabled] is disabled (or unless the reprojection amount is significantly lowered).  
         */
        get light_volumetric_fog_energy(): float64
        set light_volumetric_fog_energy(value: float64)
        
        /** [Texture2D] projected by light. [member shadow_enabled] must be on for the projector to work. Light projectors make the light appear as if it is shining through a colored but transparent object, almost like light shining through stained-glass.  
         *      
         *  **Note:** Unlike [BaseMaterial3D] whose filter mode can be adjusted on a per-material basis, the filter mode for light projector textures is set globally with [member ProjectSettings.rendering/textures/light_projectors/filter].  
         *      
         *  **Note:** Light projector textures are only supported in the Forward+ and Mobile rendering methods, not Compatibility.  
         */
        get light_projector(): null | Texture2D | AnimatedTexture | AtlasTexture | CameraTexture | CanvasTexture | MeshTexture | Texture2DRD | ViewportTexture
        set light_projector(value: null | Texture2D | AnimatedTexture | AtlasTexture | CameraTexture | CanvasTexture | MeshTexture | Texture2DRD | ViewportTexture)
        
        /** The size of the light in Godot units. Only available for [OmniLight3D]s and [SpotLight3D]s. Increasing this value will make the light fade out slower and shadows appear blurrier (also called percentage-closer soft shadows, or PCSS). This can be used to simulate area lights to an extent. Increasing this value above `0.0` for lights with shadows enabled will have a noticeable performance cost due to PCSS.  
         *      
         *  **Note:** [member light_size] is not affected by [member Node3D.scale] (the light's scale or its parent's scale).  
         *      
         *  **Note:** PCSS for positional lights is only supported in the Forward+ and Mobile rendering methods, not Compatibility.  
         */
        get light_size(): float64
        set light_size(value: float64)
        
        /** The light's angular size in degrees. Increasing this will make shadows softer at greater distances (also called percentage-closer soft shadows, or PCSS). Only available for [DirectionalLight3D]s. For reference, the Sun from the Earth is approximately `0.5`. Increasing this value above `0.0` for lights with shadows enabled will have a noticeable performance cost due to PCSS.  
         *      
         *  **Note:** [member light_angular_distance] is not affected by [member Node3D.scale] (the light's scale or its parent's scale).  
         *      
         *  **Note:** PCSS for directional lights is only supported in the Forward+ rendering method, not Mobile or Compatibility.  
         */
        get light_angular_distance(): float64
        set light_angular_distance(value: float64)
        
        /** If `true`, the light's effect is reversed, darkening areas and casting bright shadows. */
        get light_negative(): boolean
        set light_negative(value: boolean)
        
        /** The intensity of the specular blob in objects affected by the light. At `0`, the light becomes a pure diffuse light. When not baking emission, this can be used to avoid unrealistic reflections when placing lights above an emissive surface. */
        get light_specular(): float64
        set light_specular(value: float64)
        
        /** The light's bake mode. This will affect the global illumination techniques that have an effect on the light's rendering.  
         *      
         *  **Note:** Meshes' global illumination mode will also affect the global illumination rendering. See [member GeometryInstance3D.gi_mode].  
         */
        get light_bake_mode(): int64
        set light_bake_mode(value: int64)
        
        /** The light will affect objects in the selected layers.  
         *      
         *  **Note:** The light cull mask is ignored by [VoxelGI], SDFGI, [LightmapGI], and volumetric fog. These will always render lights in a way that ignores the cull mask. See also [member VisualInstance3D.layers].  
         */
        get light_cull_mask(): int64
        set light_cull_mask(value: int64)
        
        /** If `true`, the light will cast real-time shadows. This has a significant performance cost. Only enable shadow rendering when it makes a noticeable difference in the scene's appearance, and consider using [member distance_fade_enabled] to hide the light when far away from the [Camera3D]. */
        get shadow_enabled(): boolean
        set shadow_enabled(value: boolean)
        
        /** Used to adjust shadow appearance. Too small a value results in self-shadowing ("shadow acne"), while too large a value causes shadows to separate from casters ("peter-panning"). Adjust as needed. */
        get shadow_bias(): float64
        set shadow_bias(value: float64)
        
        /** Offsets the lookup into the shadow map by the object's normal. This can be used to reduce self-shadowing artifacts without using [member shadow_bias]. In practice, this value should be tweaked along with [member shadow_bias] to reduce artifacts as much as possible. */
        get shadow_normal_bias(): float64
        set shadow_normal_bias(value: float64)
        
        /** If `true`, reverses the backface culling of the mesh. This can be useful when you have a flat mesh that has a light behind it. If you need to cast a shadow on both sides of the mesh, set the mesh to use double-sided shadows with [constant GeometryInstance3D.SHADOW_CASTING_SETTING_DOUBLE_SIDED]. */
        get shadow_reverse_cull_face(): boolean
        set shadow_reverse_cull_face(value: boolean)
        get shadow_transmittance_bias(): float64
        set shadow_transmittance_bias(value: float64)
        
        /** The opacity to use when rendering the light's shadow map. Values lower than `1.0` make the light appear through shadows. This can be used to fake global illumination at a low performance cost. */
        get shadow_opacity(): float64
        set shadow_opacity(value: float64)
        
        /** Blurs the edges of the shadow. Can be used to hide pixel artifacts in low-resolution shadow maps. A high value can impact performance, make shadows appear grainy and can cause other unwanted artifacts. Try to keep as near default as possible. */
        get shadow_blur(): float64
        set shadow_blur(value: float64)
        
        /** The light will only cast shadows using objects in the selected layers. */
        get shadow_caster_mask(): int64
        set shadow_caster_mask(value: int64)
        
        /** If `true`, the light will smoothly fade away when far from the active [Camera3D] starting at [member distance_fade_begin]. This acts as a form of level of detail (LOD). The light will fade out over [member distance_fade_begin] + [member distance_fade_length], after which it will be culled and not sent to the shader at all. Use this to reduce the number of active lights in a scene and thus improve performance.  
         *      
         *  **Note:** Only effective for [OmniLight3D] and [SpotLight3D].  
         */
        get distance_fade_enabled(): boolean
        set distance_fade_enabled(value: boolean)
        
        /** The distance from the camera at which the light begins to fade away (in 3D units).  
         *      
         *  **Note:** Only effective for [OmniLight3D] and [SpotLight3D].  
         */
        get distance_fade_begin(): float64
        set distance_fade_begin(value: float64)
        
        /** The distance from the camera at which the light's shadow cuts off (in 3D units). Set this to a value lower than [member distance_fade_begin] + [member distance_fade_length] to further improve performance, as shadow rendering is often more expensive than light rendering itself.  
         *      
         *  **Note:** Only effective for [OmniLight3D] and [SpotLight3D], and only when [member shadow_enabled] is `true`.  
         */
        get distance_fade_shadow(): float64
        set distance_fade_shadow(value: float64)
        
        /** Distance over which the light and its shadow fades. The light's energy and shadow's opacity is progressively reduced over this distance and is completely invisible at the end.  
         *      
         *  **Note:** Only effective for [OmniLight3D] and [SpotLight3D].  
         */
        get distance_fade_length(): float64
        set distance_fade_length(value: float64)
        
        /** If `true`, the light only appears in the editor and will not be visible at runtime. If `true`, the light will never be baked in [LightmapGI] regardless of its [member light_bake_mode]. */
        get editor_only(): boolean
        set editor_only(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapLight3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapLight3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapLightOccluder2D extends __RPCMapNode2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapLightOccluder2D extends __NameMapNode2D {
    }
    /** Occludes light cast by a Light2D, casting shadows.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_lightoccluder2d.html  
     */
    class LightOccluder2D<Map extends NodePathMap = any> extends Node2D<Map> {
        constructor(identifier?: any)
        /** The [OccluderPolygon2D] used to compute the shadow. */
        get occluder(): null | OccluderPolygon2D
        set occluder(value: null | OccluderPolygon2D)
        
        /** If enabled, the occluder will be part of a real-time generated signed distance field that can be used in custom shaders. */
        get sdf_collision(): boolean
        set sdf_collision(value: boolean)
        
        /** The LightOccluder2D's occluder light mask. The LightOccluder2D will cast shadows only from Light2D(s) that have the same light mask(s). */
        get occluder_light_mask(): int64
        set occluder_light_mask(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapLightOccluder2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapLightOccluder2D;
    }
    namespace LightmapGI {
        enum BakeQuality {
            /** Low bake quality (fastest bake times). The quality of this preset can be adjusted by changing [member ProjectSettings.rendering/lightmapping/bake_quality/low_quality_ray_count] and [member ProjectSettings.rendering/lightmapping/bake_quality/low_quality_probe_ray_count]. */
            BAKE_QUALITY_LOW = 0,
            
            /** Medium bake quality (fast bake times). The quality of this preset can be adjusted by changing [member ProjectSettings.rendering/lightmapping/bake_quality/medium_quality_ray_count] and [member ProjectSettings.rendering/lightmapping/bake_quality/medium_quality_probe_ray_count]. */
            BAKE_QUALITY_MEDIUM = 1,
            
            /** High bake quality (slow bake times). The quality of this preset can be adjusted by changing [member ProjectSettings.rendering/lightmapping/bake_quality/high_quality_ray_count] and [member ProjectSettings.rendering/lightmapping/bake_quality/high_quality_probe_ray_count]. */
            BAKE_QUALITY_HIGH = 2,
            
            /** Highest bake quality (slowest bake times). The quality of this preset can be adjusted by changing [member ProjectSettings.rendering/lightmapping/bake_quality/ultra_quality_ray_count] and [member ProjectSettings.rendering/lightmapping/bake_quality/ultra_quality_probe_ray_count]. */
            BAKE_QUALITY_ULTRA = 3,
        }
        enum GenerateProbes {
            /** Don't generate lightmap probes for lighting dynamic objects. */
            GENERATE_PROBES_DISABLED = 0,
            
            /** Lowest level of subdivision (fastest bake times, smallest file sizes). */
            GENERATE_PROBES_SUBDIV_4 = 1,
            
            /** Low level of subdivision (fast bake times, small file sizes). */
            GENERATE_PROBES_SUBDIV_8 = 2,
            
            /** High level of subdivision (slow bake times, large file sizes). */
            GENERATE_PROBES_SUBDIV_16 = 3,
            
            /** Highest level of subdivision (slowest bake times, largest file sizes). */
            GENERATE_PROBES_SUBDIV_32 = 4,
        }
        enum BakeError {
            /** Lightmap baking was successful. */
            BAKE_ERROR_OK = 0,
            
            /** Lightmap baking failed because the root node for the edited scene could not be accessed. */
            BAKE_ERROR_NO_SCENE_ROOT = 1,
            
            /** Lightmap baking failed as the lightmap data resource is embedded in a foreign resource. */
            BAKE_ERROR_FOREIGN_DATA = 2,
            
            /** Lightmap baking failed as there is no lightmapper available in this Godot build. */
            BAKE_ERROR_NO_LIGHTMAPPER = 3,
            
            /** Lightmap baking failed as the [LightmapGIData] save path isn't configured in the resource. */
            BAKE_ERROR_NO_SAVE_PATH = 4,
            
            /** Lightmap baking failed as there are no meshes whose [member GeometryInstance3D.gi_mode] is [constant GeometryInstance3D.GI_MODE_STATIC] and with valid UV2 mapping in the current scene. You may need to select 3D scenes in the Import dock and change their global illumination mode accordingly. */
            BAKE_ERROR_NO_MESHES = 5,
            
            /** Lightmap baking failed as the lightmapper failed to analyze some of the meshes marked as static for baking. */
            BAKE_ERROR_MESHES_INVALID = 6,
            
            /** Lightmap baking failed as the resulting image couldn't be saved or imported by Godot after it was saved. */
            BAKE_ERROR_CANT_CREATE_IMAGE = 7,
            
            /** The user aborted the lightmap baking operation (typically by clicking the **Cancel** button in the progress dialog). */
            BAKE_ERROR_USER_ABORTED = 8,
            
            /** Lightmap baking failed as the maximum texture size is too small to fit some of the meshes marked for baking. */
            BAKE_ERROR_TEXTURE_SIZE_TOO_SMALL = 9,
            
            /** Lightmap baking failed as the lightmap is too small. */
            BAKE_ERROR_LIGHTMAP_TOO_SMALL = 10,
            
            /** Lightmap baking failed as the lightmap was unable to fit into an atlas. */
            BAKE_ERROR_ATLAS_TOO_SMALL = 11,
        }
        enum EnvironmentMode {
            /** Ignore environment lighting when baking lightmaps. */
            ENVIRONMENT_MODE_DISABLED = 0,
            
            /** Use the scene's environment lighting when baking lightmaps.  
             *      
             *  **Note:** If baking lightmaps in a scene with no [WorldEnvironment] node, this will act like [constant ENVIRONMENT_MODE_DISABLED]. The editor's preview sky and sun is  *not*  taken into account by [LightmapGI] when baking lightmaps.  
             */
            ENVIRONMENT_MODE_SCENE = 1,
            
            /** Use [member environment_custom_sky] as a source of environment lighting when baking lightmaps. */
            ENVIRONMENT_MODE_CUSTOM_SKY = 2,
            
            /** Use [member environment_custom_color] multiplied by [member environment_custom_energy] as a constant source of environment lighting when baking lightmaps. */
            ENVIRONMENT_MODE_CUSTOM_COLOR = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapLightmapGI extends __RPCMapVisualInstance3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapLightmapGI extends __NameMapVisualInstance3D {
    }
    /** Computes and stores baked lightmaps for fast global illumination.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_lightmapgi.html  
     */
    class LightmapGI<Map extends NodePathMap = any> extends VisualInstance3D<Map> {
        constructor(identifier?: any)
        /** The quality preset to use when baking lightmaps. This affects bake times, but output file sizes remain mostly identical across quality levels.  
         *  To further speed up bake times, decrease [member bounces], disable [member use_denoiser] and/or decrease [member texel_scale].  
         *  To further increase quality, enable [member supersampling] and/or increase [member texel_scale].  
         */
        get quality(): int64
        set quality(value: int64)
        
        /** If `true`, lightmaps are baked with the texel scale multiplied with [member supersampling_factor] and downsampled before saving the lightmap (so the effective texel density is identical to having supersampling disabled).  
         *  Supersampling provides increased lightmap quality with less noise, smoother shadows and better shadowing of small-scale features in objects. However, it may result in significantly increased bake times and memory usage while baking lightmaps. Padding is automatically adjusted to avoid increasing light leaking.  
         */
        get supersampling(): boolean
        set supersampling(value: boolean)
        
        /** The factor by which the texel density is multiplied for supersampling. For best results, use an integer value. While fractional values are allowed, they can result in increased light leaking and a blurry lightmap.  
         *  Higher values may result in better quality, but also increase bake times and memory usage while baking.  
         *  See [member supersampling] for more information.  
         */
        get supersampling_factor(): float64
        set supersampling_factor(value: float64)
        
        /** Number of light bounces that are taken into account during baking. Higher values result in brighter, more realistic lighting, at the cost of longer bake times. If set to `0`, only environment lighting, direct light and emissive lighting is baked. */
        get bounces(): int64
        set bounces(value: int64)
        
        /** The energy multiplier for each bounce. Higher values will make indirect lighting brighter. A value of `1.0` represents physically accurate behavior, but higher values can be used to make indirect lighting propagate more visibly when using a low number of bounces. This can be used to speed up bake times by lowering the number of [member bounces] then increasing [member bounce_indirect_energy].  
         *      
         *  **Note:** [member bounce_indirect_energy] only has an effect if [member bounces] is set to a value greater than or equal to `1`.  
         */
        get bounce_indirect_energy(): float64
        set bounce_indirect_energy(value: float64)
        
        /** If `true`, bakes lightmaps to contain directional information as spherical harmonics. This results in more realistic lighting appearance, especially with normal mapped materials and for lights that have their direct light baked ([member Light3D.light_bake_mode] set to [constant Light3D.BAKE_STATIC] and with [member Light3D.editor_only] set to `false`). The directional information is also used to provide rough reflections for static and dynamic objects. This has a small run-time performance cost as the shader has to perform more work to interpret the direction information from the lightmap. Directional lightmaps also take longer to bake and result in larger file sizes.  
         *      
         *  **Note:** The property's name has no relationship with [DirectionalLight3D]. [member directional] works with all light types.  
         */
        get directional(): boolean
        set directional(value: boolean)
        
        /** The shadowmasking policy to use for directional shadows on static objects that are baked with this [LightmapGI] instance.  
         *  Shadowmasking allows [DirectionalLight3D] nodes to cast shadows even outside the range defined by their [member DirectionalLight3D.directional_shadow_max_distance] property. This is done by baking a texture that contains a shadowmap for the directional light, then using this texture according to the current shadowmask mode.  
         *      
         *  **Note:** The shadowmask texture is only created if [member shadowmask_mode] is not [constant LightmapGIData.SHADOWMASK_MODE_NONE]. To see a difference, you need to bake lightmaps again after switching from [constant LightmapGIData.SHADOWMASK_MODE_NONE] to any other mode.  
         */
        get shadowmask_mode(): int64
        set shadowmask_mode(value: int64)
        
        /** If `true`, a texture with the lighting information will be generated to speed up the generation of indirect lighting at the cost of some accuracy. The geometry might exhibit extra light leak artifacts when using low resolution lightmaps or UVs that stretch the lightmap significantly across surfaces. Leave [member use_texture_for_bounces] at its default value of `true` if unsure.  
         *      
         *  **Note:** [member use_texture_for_bounces] only has an effect if [member bounces] is set to a value greater than or equal to `1`.  
         */
        get use_texture_for_bounces(): boolean
        set use_texture_for_bounces(value: boolean)
        
        /** If `true`, ignore environment lighting when baking lightmaps. */
        get interior(): boolean
        set interior(value: boolean)
        
        /** If `true`, uses a GPU-based denoising algorithm on the generated lightmap. This eliminates most noise within the generated lightmap at the cost of longer bake times. File sizes are generally not impacted significantly by the use of a denoiser, although lossless compression may do a better job at compressing a denoised image. */
        get use_denoiser(): boolean
        set use_denoiser(value: boolean)
        
        /** The strength of denoising step applied to the generated lightmaps. Only effective if [member use_denoiser] is `true` and [member ProjectSettings.rendering/lightmapping/denoising/denoiser] is set to JNLM. */
        get denoiser_strength(): float64
        set denoiser_strength(value: float64)
        
        /** The distance in pixels from which the denoiser samples. Lower values preserve more details, but may give blotchy results if the lightmap quality is not high enough. Only effective if [member use_denoiser] is `true` and [member ProjectSettings.rendering/lightmapping/denoising/denoiser] is set to JNLM. */
        get denoiser_range(): int64
        set denoiser_range(value: int64)
        
        /** The bias to use when computing shadows. Increasing [member bias] can fix shadow acne on the resulting baked lightmap, but can introduce peter-panning (shadows not connecting to their casters). Real-time [Light3D] shadows are not affected by this [member bias] property. */
        get bias(): float64
        set bias(value: float64)
        
        /** Scales the lightmap texel density of all meshes for the current bake. This is a multiplier that builds upon the existing lightmap texel size defined in each imported 3D scene, along with the per-mesh density multiplier (which is designed to be used when the same mesh is used at different scales). Lower values will result in faster bake times.  
         *  For example, doubling [member texel_scale] doubles the lightmap texture resolution for all objects  *on each axis* , so it will  *quadruple*  the texel count.  
         */
        get texel_scale(): float64
        set texel_scale(value: float64)
        
        /** The maximum texture size for the generated texture atlas. Higher values will result in fewer slices being generated, but may not work on all hardware as a result of hardware limitations on texture sizes. Leave [member max_texture_size] at its default value of `16384` if unsure. */
        get max_texture_size(): int64
        set max_texture_size(value: int64)
        
        /** The environment mode to use when baking lightmaps. */
        get environment_mode(): int64
        set environment_mode(value: int64)
        
        /** The sky to use as a source of environment lighting. Only effective if [member environment_mode] is [constant ENVIRONMENT_MODE_CUSTOM_SKY]. */
        get environment_custom_sky(): null | Sky
        set environment_custom_sky(value: null | Sky)
        
        /** The color to use for environment lighting. Only effective if [member environment_mode] is [constant ENVIRONMENT_MODE_CUSTOM_COLOR]. */
        get environment_custom_color(): Color
        set environment_custom_color(value: Color)
        
        /** The color multiplier to use for environment lighting. Only effective if [member environment_mode] is [constant ENVIRONMENT_MODE_CUSTOM_COLOR]. */
        get environment_custom_energy(): float64
        set environment_custom_energy(value: float64)
        
        /** The [CameraAttributes] resource that specifies exposure levels to bake at. Auto-exposure and non exposure properties will be ignored. Exposure settings should be used to reduce the dynamic range present when baking. If exposure is too high, the [LightmapGI] will have banding artifacts or may have over-exposure artifacts. */
        get camera_attributes(): null | CameraAttributesPractical | CameraAttributesPhysical
        set camera_attributes(value: null | CameraAttributesPractical | CameraAttributesPhysical)
        
        /** The level of subdivision to use when automatically generating [LightmapProbe]s for dynamic object lighting. Higher values result in more accurate indirect lighting on dynamic objects, at the cost of longer bake times and larger file sizes.  
         *      
         *  **Note:** Automatically generated [LightmapProbe]s are not visible as nodes in the Scene tree dock, and cannot be modified this way after they are generated.  
         *      
         *  **Note:** Regardless of [member generate_probes_subdiv], direct lighting on dynamic objects is always applied using [Light3D] nodes in real-time.  
         */
        get generate_probes_subdiv(): int64
        set generate_probes_subdiv(value: int64)
        
        /** The [LightmapGIData] associated to this [LightmapGI] node. This resource is automatically created after baking, and is not meant to be created manually. */
        get light_data(): null | LightmapGIData
        set light_data(value: null | LightmapGIData)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapLightmapGI;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapLightmapGI;
    }
    namespace LightmapGIData {
        enum ShadowmaskMode {
            /** Shadowmasking is disabled. No shadowmask texture will be created when baking lightmaps. Existing shadowmask textures will be removed during baking. */
            SHADOWMASK_MODE_NONE = 0,
            
            /** Shadowmasking is enabled. Directional shadows that are outside the [member DirectionalLight3D.directional_shadow_max_distance] will be rendered using the shadowmask texture. Shadows that are inside the range will be rendered using real-time shadows exclusively. This mode allows for more precise real-time shadows up close, without the potential "smearing" effect that can occur when using lightmaps with a high texel size. The downside is that when the camera moves fast, the transition between the real-time light and shadowmask can be obvious. Also, objects that only have shadows baked in the shadowmask (and no real-time shadows) won't display any shadows up close. */
            SHADOWMASK_MODE_REPLACE = 1,
            
            /** Shadowmasking is enabled. Directional shadows will be rendered with real-time shadows overlaid on top of the shadowmask texture. This mode makes for smoother shadow transitions when the camera moves fast, at the cost of a potential smearing effect for directional shadows that are up close (due to the real-time shadow being mixed with a low-resolution shadowmask). Objects that only have shadows baked in the shadowmask (and no real-time shadows) will keep their shadows up close. */
            SHADOWMASK_MODE_OVERLAY = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapLightmapGIData extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapLightmapGIData extends __NameMapResource {
    }
    /** Contains baked lightmap and dynamic object probe data for [LightmapGI].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_lightmapgidata.html  
     */
    class LightmapGIData extends Resource {
        constructor(identifier?: any)
        /** Adds an object that is considered baked within this [LightmapGIData]. */
        add_user(path: NodePath | string, uv_scale: Rect2, slice_index: int64, sub_instance: int64): void
        
        /** Returns the number of objects that are considered baked within this [LightmapGIData]. */
        get_user_count(): int64
        
        /** Returns the [NodePath] of the baked object at index [param user_idx]. */
        get_user_path(user_idx: int64): NodePath
        
        /** Clear all objects that are considered baked within this [LightmapGIData]. */
        clear_users(): void
        
        /** The lightmap atlas textures generated by the lightmapper. */
        get lightmap_textures(): GArray<TextureLayered>
        set lightmap_textures(value: GArray<TextureLayered>)
        
        /** The shadowmask atlas textures generated by the lightmapper. */
        get shadowmask_textures(): GArray<TextureLayered>
        set shadowmask_textures(value: GArray<TextureLayered>)
        get uses_spherical_harmonics(): boolean
        set uses_spherical_harmonics(value: boolean)
        get user_data(): GArray
        set user_data(value: GArray)
        get probe_data(): GDictionary
        set probe_data(value: GDictionary)
        get _uses_packed_directional(): boolean
        set _uses_packed_directional(value: boolean)
        
        /** The lightmap atlas texture generated by the lightmapper. */
        get light_texture(): null | TextureLayered
        set light_texture(value: null | TextureLayered)
        get light_textures(): GArray
        set light_textures(value: GArray)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapLightmapGIData;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapLightmapGIData;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapLightmapProbe extends __RPCMapNode3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapLightmapProbe extends __NameMapNode3D {
    }
    /** Represents a single manually placed probe for dynamic object lighting with [LightmapGI].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_lightmapprobe.html  
     */
    class LightmapProbe<Map extends NodePathMap = any> extends Node3D<Map> {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapLightmapProbe;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapLightmapProbe;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapLightmapper extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapLightmapper extends __NameMapRefCounted {
    }
    /** Abstract class extended by lightmappers, for use in [LightmapGI].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_lightmapper.html  
     */
    class Lightmapper extends RefCounted {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapLightmapper;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapLightmapper;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapLightmapperRD extends __RPCMapLightmapper {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapLightmapperRD extends __NameMapLightmapper {
    }
    /** The built-in GPU-based lightmapper for use with [LightmapGI].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_lightmapperrd.html  
     */
    class LightmapperRD extends Lightmapper {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapLightmapperRD;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapLightmapperRD;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapLimitAngularVelocityModifier3D extends __RPCMapSkeletonModifier3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapLimitAngularVelocityModifier3D extends __NameMapSkeletonModifier3D {
    }
    /** Limit bone rotation angular velocity.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_limitangularvelocitymodifier3d.html  
     */
    class LimitAngularVelocityModifier3D<Map extends NodePathMap = any> extends SkeletonModifier3D<Map> {
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
         *  **Note:** End bone must be the root bone or a child of the root bone.  
         */
        set_end_bone_name(index: int64, bone_name: string): void
        
        /** Returns the end bone name of the bone chain. */
        get_end_bone_name(index: int64): string
        
        /** Sets the end bone index of the bone chain. */
        set_end_bone(index: int64, bone: int64): void
        
        /** Returns the end bone index of the bone chain. */
        get_end_bone(index: int64): int64
        
        /** Clear all chains. */
        clear_chains(): void
        
        /** Sets the reference pose for angle comparison to the current pose with the influence of constraints removed. This function is automatically triggered when joints change or upon activation. */
        reset(): void
        
        /** The maximum angular velocity per second. */
        get max_angular_velocity(): float64
        set max_angular_velocity(value: float64)
        
        /** If `true`, the modifier processes bones not included in the bone list.  
         *  If `false`, the bones processed by the modifier are equal to the bone list.  
         */
        get exclude(): boolean
        set exclude(value: boolean)
        
        /** The number of chains. */
        get chain_count(): int64
        set chain_count(value: int64)
        
        /** The number of joints in the list which created by chains dynamically. */
        get joint_count(): int64
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapLimitAngularVelocityModifier3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapLimitAngularVelocityModifier3D;
    }
    namespace Line2D {
        enum LineJointMode {
            /** Makes the polyline's joints pointy, connecting the sides of the two segments by extending them until they intersect. If the rotation of a joint is too big (based on [member sharp_limit]), the joint falls back to [constant LINE_JOINT_BEVEL] to prevent very long miters. */
            LINE_JOINT_SHARP = 0,
            
            /** Makes the polyline's joints bevelled/chamfered, connecting the sides of the two segments with a simple line. */
            LINE_JOINT_BEVEL = 1,
            
            /** Makes the polyline's joints rounded, connecting the sides of the two segments with an arc. The detail of this arc depends on [member round_precision]. */
            LINE_JOINT_ROUND = 2,
        }
        enum LineCapMode {
            /** Draws no line cap. */
            LINE_CAP_NONE = 0,
            
            /** Draws the line cap as a box, slightly extending the first/last segment. */
            LINE_CAP_BOX = 1,
            
            /** Draws the line cap as a semicircle attached to the first/last segment. */
            LINE_CAP_ROUND = 2,
        }
        enum LineTextureMode {
            /** Takes the left pixels of the texture and renders them over the whole polyline. */
            LINE_TEXTURE_NONE = 0,
            
            /** Tiles the texture over the polyline. [member CanvasItem.texture_repeat] of the [Line2D] node must be [constant CanvasItem.TEXTURE_REPEAT_ENABLED] or [constant CanvasItem.TEXTURE_REPEAT_MIRROR] for it to work properly. */
            LINE_TEXTURE_TILE = 1,
            
            /** Stretches the texture across the polyline. [member CanvasItem.texture_repeat] of the [Line2D] node must be [constant CanvasItem.TEXTURE_REPEAT_DISABLED] for best results. */
            LINE_TEXTURE_STRETCH = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapLine2D extends __RPCMapNode2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapLine2D extends __NameMapNode2D {
    }
    /** A 2D polyline that can optionally be textured.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_line2d.html  
     */
    class Line2D<Map extends NodePathMap = any> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Overwrites the position of the point at the given [param index] with the supplied [param position]. */
        set_point_position(index: int64, position: Vector2): void
        
        /** Returns the position of the point at index [param index]. */
        get_point_position(index: int64): Vector2
        
        /** Returns the number of points in the polyline. */
        get_point_count(): int64
        
        /** Adds a point with the specified [param position] relative to the polyline's own position. If no [param index] is provided, the new point will be added to the end of the points array.  
         *  If [param index] is given, the new point is inserted before the existing point identified by index [param index]. The indices of the points after the new point get increased by 1. The provided [param index] must not exceed the number of existing points in the polyline. See [method get_point_count].  
         */
        add_point(position: Vector2, index?: int64 /* = -1 */): void
        
        /** Removes the point at index [param index] from the polyline. */
        remove_point(index: int64): void
        
        /** Removes all points from the polyline, making it empty. */
        clear_points(): void
        
        /** The points of the polyline, interpreted in local 2D coordinates. Segments are drawn between the adjacent points in this array. */
        get points(): PackedVector2Array
        set points(value: PackedVector2Array | Vector2[])
        
        /** If `true` and the polyline has more than 2 points, the last point and the first one will be connected by a segment.  
         *      
         *  **Note:** The shape of the closing segment is not guaranteed to be seamless if a [member width_curve] is provided.  
         *      
         *  **Note:** The joint between the closing segment and the first segment is drawn first and it samples the [member gradient] and the [member width_curve] at the beginning. This is an implementation detail that might change in a future version.  
         */
        get closed(): boolean
        set closed(value: boolean)
        
        /** The polyline's width. */
        get width(): float64
        set width(value: float64)
        
        /** The polyline's width curve. The width of the polyline over its length will be equivalent to the value of the width curve over its domain. The width curve should be a unit [Curve]. */
        get width_curve(): null | Curve
        set width_curve(value: null | Curve)
        
        /** The color of the polyline. Will not be used if a gradient is set. */
        get default_color(): Color
        set default_color(value: Color)
        
        /** The gradient is drawn through the whole line from start to finish. The [member default_color] will not be used if this property is set. */
        get gradient(): null | Gradient
        set gradient(value: null | Gradient)
        
        /** The texture used for the polyline. Uses [member texture_mode] for drawing style. */
        get texture(): null | Texture2D
        set texture(value: null | Texture2D)
        
        /** The style to render the [member texture] of the polyline. */
        get texture_mode(): int64
        set texture_mode(value: int64)
        
        /** The style of the connections between segments of the polyline. */
        get joint_mode(): int64
        set joint_mode(value: int64)
        
        /** The style of the beginning of the polyline, if [member closed] is `false`. */
        get begin_cap_mode(): int64
        set begin_cap_mode(value: int64)
        
        /** The style of the end of the polyline, if [member closed] is `false`. */
        get end_cap_mode(): int64
        set end_cap_mode(value: int64)
        
        /** Determines the miter limit of the polyline. Normally, when [member joint_mode] is set to [constant LINE_JOINT_SHARP], sharp angles fall back to using the logic of [constant LINE_JOINT_BEVEL] joints to prevent very long miters. Higher values of this property mean that the fallback to a bevel joint will happen at sharper angles. */
        get sharp_limit(): float64
        set sharp_limit(value: float64)
        
        /** The smoothness used for rounded joints and caps. Higher values result in smoother corners, but are more demanding to render and update. */
        get round_precision(): int64
        set round_precision(value: int64)
        
        /** If `true`, the polyline's border will be anti-aliased.  
         *      
         *  **Note:** [Line2D] is not accelerated by batching when being anti-aliased.  
         */
        get antialiased(): boolean
        set antialiased(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapLine2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapLine2D;
    }
    namespace LineEdit {
        enum MenuItems {
            /** Cuts (copies and clears) the selected text. */
            MENU_CUT = 0,
            
            /** Copies the selected text. */
            MENU_COPY = 1,
            
            /** Pastes the clipboard text over the selected text (or at the caret's position).  
             *  Non-printable escape characters are automatically stripped from the OS clipboard via [method String.strip_escapes].  
             */
            MENU_PASTE = 2,
            
            /** Erases the whole [LineEdit] text. */
            MENU_CLEAR = 3,
            
            /** Selects the whole [LineEdit] text. */
            MENU_SELECT_ALL = 4,
            
            /** Undoes the previous action. */
            MENU_UNDO = 5,
            
            /** Reverse the last undo action. */
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
        enum VirtualKeyboardType {
            /** Default text virtual keyboard. */
            KEYBOARD_TYPE_DEFAULT = 0,
            
            /** Multiline virtual keyboard. */
            KEYBOARD_TYPE_MULTILINE = 1,
            
            /** Virtual number keypad, useful for PIN entry. */
            KEYBOARD_TYPE_NUMBER = 2,
            
            /** Virtual number keypad, useful for entering fractional numbers. */
            KEYBOARD_TYPE_NUMBER_DECIMAL = 3,
            
            /** Virtual phone number keypad. */
            KEYBOARD_TYPE_PHONE = 4,
            
            /** Virtual keyboard with additional keys to assist with typing email addresses. */
            KEYBOARD_TYPE_EMAIL_ADDRESS = 5,
            
            /** Virtual keyboard for entering a password. On most platforms, this should disable autocomplete and autocapitalization.  
             *      
             *  **Note:** This is not supported on Web. Instead, this behaves identically to [constant KEYBOARD_TYPE_DEFAULT].  
             */
            KEYBOARD_TYPE_PASSWORD = 6,
            
            /** Virtual keyboard with additional keys to assist with typing URLs. */
            KEYBOARD_TYPE_URL = 7,
        }
        enum ExpandMode {
            /** Use the original size for the right icon. */
            EXPAND_MODE_ORIGINAL_SIZE = 0,
            
            /** Scale the right icon's size to match the size of the text. */
            EXPAND_MODE_FIT_TO_TEXT = 1,
            
            /** Scale the right icon to fit the LineEdit. */
            EXPAND_MODE_FIT_TO_LINE_EDIT = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapLineEdit extends __RPCMapControl {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapLineEdit extends __NameMapControl {
    }
    /** An input field for single-line text.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_lineedit.html  
     */
    class LineEdit<Map extends NodePathMap = any> extends Control<Map> {
        constructor(identifier?: any)
        _set_text(text: string, emit_signal?: boolean /* = false */): void
        
        /** Returns `true` if the user has text in the [url=https://en.wikipedia.org/wiki/Input_method]Input Method Editor[/url] (IME). */
        has_ime_text(): boolean
        
        /** Closes the [url=https://en.wikipedia.org/wiki/Input_method]Input Method Editor[/url] (IME) if it is open. Any text in the IME will be lost. */
        cancel_ime(): void
        
        /** Applies text from the [url=https://en.wikipedia.org/wiki/Input_method]Input Method Editor[/url] (IME) and closes the IME if it is open. */
        apply_ime(): void
        
        /** Allows entering edit mode whether the [LineEdit] is focused or not. If [param hide_focus] is `true`, the focused state will not be shown (see [method Control.grab_focus]).  
         *  See also [member keep_editing_on_text_submit].  
         */
        edit(hide_focus?: boolean /* = false */): void
        
        /** Allows exiting edit mode while preserving focus. */
        unedit(): void
        
        /** Returns whether the [LineEdit] is being edited. */
        is_editing(): boolean
        
        /** Erases the [LineEdit]'s [member text]. */
        clear(): void
        
        /** Selects characters inside [LineEdit] between [param from] and [param to]. By default, [param from] is at the beginning and [param to] at the end.  
         *    
         */
        select(from?: int64 /* = 0 */, to?: int64 /* = -1 */): void
        
        /** Selects the whole [String]. */
        select_all(): void
        
        /** Clears the current selection. */
        deselect(): void
        
        /** Returns `true` if an "undo" action is available. */
        has_undo(): boolean
        
        /** Returns `true` if a "redo" action is available. */
        has_redo(): boolean
        
        /** Returns `true` if the user has selected text. */
        has_selection(): boolean
        
        /** Returns the text inside the selection. */
        get_selected_text(): string
        
        /** Returns the selection begin column. */
        get_selection_from_column(): int64
        
        /** Returns the selection end column. */
        get_selection_to_column(): int64
        
        /** Returns the correct column at the end of a composite character like ❤️‍🩹 (mending heart; Unicode: `U+2764 U+FE0F U+200D U+1FA79`) which is comprised of more than one Unicode code point, if the caret is at the start of the composite character. Also returns the correct column with the caret at mid grapheme and for non-composite characters.  
         *      
         *  **Note:** To check at caret location use `get_next_composite_character_column(get_caret_column())`  
         */
        get_next_composite_character_column(column: int64): int64
        
        /** Returns the correct column at the start of a composite character like ❤️‍🩹 (mending heart; Unicode: `U+2764 U+FE0F U+200D U+1FA79`) which is comprised of more than one Unicode code point, if the caret is at the end of the composite character. Also returns the correct column with the caret at mid grapheme and for non-composite characters.  
         *      
         *  **Note:** To check at caret location use `get_previous_composite_character_column(get_caret_column())`  
         */
        get_previous_composite_character_column(column: int64): int64
        
        /** Returns the scroll offset due to [member caret_column], as a number of characters. */
        get_scroll_offset(): float64
        
        /** Inserts [param text] at the caret. If the resulting value is longer than [member max_length], nothing happens. */
        insert_text_at_caret(text: string): void
        
        /** Deletes one character at the caret's current position (equivalent to pressing [kbd]Delete[/kbd]). */
        delete_char_at_caret(): void
        
        /** Deletes a section of the [member text] going from position [param from_column] to [param to_column]. Both parameters should be within the text's length. */
        delete_text(from_column: int64, to_column: int64): void
        
        /** Executes a given action as defined in the [enum MenuItems] enum. */
        menu_option(option: int64): void
        
        /** Returns the [PopupMenu] of this [LineEdit]. By default, this menu is displayed when right-clicking on the [LineEdit].  
         *  You can add custom menu items or remove standard ones. Make sure your IDs don't conflict with the standard ones (see [enum MenuItems]). For example:  
         *    
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member Window.visible] property.  
         */
        get_menu(): null | PopupMenu
        
        /** Returns whether the menu is visible. Use this instead of `get_menu().visible` to improve performance (so the creation of the menu is avoided). */
        is_menu_visible(): boolean
        
        /** String value of the [LineEdit].  
         *      
         *  **Note:** Changing text using this property won't emit the [signal text_changed] signal.  
         */
        get text(): string
        set text(value: string)
        
        /** Text shown when the [LineEdit] is empty. It is **not** the [LineEdit]'s default value (see [member text]). */
        get placeholder_text(): string
        set placeholder_text(value: string)
        
        /** The text's horizontal alignment. */
        get alignment(): int64
        set alignment(value: int64)
        
        /** Maximum number of characters that can be entered inside the [LineEdit]. If `0`, there is no limit.  
         *  When a limit is defined, characters that would exceed [member max_length] are truncated. This happens both for existing [member text] contents when setting the max length, or for new text inserted in the [LineEdit], including pasting.  
         *  If any input text is truncated, the [signal text_change_rejected] signal is emitted with the truncated substring as a parameter:  
         *    
         */
        get max_length(): int64
        set max_length(value: int64)
        
        /** If `false`, existing text cannot be modified and new text cannot be added. */
        get editable(): boolean
        set editable(value: boolean)
        
        /** If `true`, the [LineEdit] will not exit edit mode when text is submitted by pressing `ui_text_submit` action (by default: [kbd]Enter[/kbd] or [kbd]Kp Enter[/kbd]). */
        get keep_editing_on_text_submit(): boolean
        set keep_editing_on_text_submit(value: boolean)
        
        /** If `true`, the [LineEdit] width will increase to stay longer than the [member text]. It will **not** compress if the [member text] is shortened. */
        get expand_to_text_length(): boolean
        set expand_to_text_length(value: boolean)
        
        /** If `true`, the context menu will appear when right-clicked. */
        get context_menu_enabled(): boolean
        set context_menu_enabled(value: boolean)
        
        /** If `true`, "Emoji and Symbols" menu is enabled. */
        get emoji_menu_enabled(): boolean
        set emoji_menu_enabled(value: boolean)
        
        /** If `true` and [member caret_mid_grapheme] is `false`, backspace deletes an entire composite character such as ❤️‍🩹, instead of deleting part of the composite character. */
        get backspace_deletes_composite_character_enabled(): boolean
        set backspace_deletes_composite_character_enabled(value: boolean)
        
        /** If `true`, the [LineEdit] will show a clear button if [member text] is not empty, which can be used to clear the text quickly. */
        get clear_button_enabled(): boolean
        set clear_button_enabled(value: boolean)
        
        /** If `true`, shortcut keys for context menu items are enabled, even if the context menu is disabled. */
        get shortcut_keys_enabled(): boolean
        set shortcut_keys_enabled(value: boolean)
        
        /** If `false`, using middle mouse button to paste clipboard will be disabled.  
         *      
         *  **Note:** This method is only implemented on Linux.  
         */
        get middle_mouse_paste_enabled(): boolean
        set middle_mouse_paste_enabled(value: boolean)
        
        /** If `false`, it's impossible to select the text using mouse nor keyboard. */
        get selecting_enabled(): boolean
        set selecting_enabled(value: boolean)
        
        /** If `true`, the selected text will be deselected when focus is lost. */
        get deselect_on_focus_loss_enabled(): boolean
        set deselect_on_focus_loss_enabled(value: boolean)
        
        /** If `true`, allow drag and drop of selected text. */
        get drag_and_drop_selection_enabled(): boolean
        set drag_and_drop_selection_enabled(value: boolean)
        
        /** If `true`, the [LineEdit] doesn't display decoration. */
        get flat(): boolean
        set flat(value: boolean)
        
        /** If `true`, control characters are displayed. */
        get draw_control_chars(): boolean
        set draw_control_chars(value: boolean)
        
        /** If `true`, the [LineEdit] will select the whole text when it gains focus. */
        get select_all_on_focus(): boolean
        set select_all_on_focus(value: boolean)
        
        /** If `true`, the native virtual keyboard is enabled on platforms that support it. */
        get virtual_keyboard_enabled(): boolean
        set virtual_keyboard_enabled(value: boolean)
        
        /** If `true`, the native virtual keyboard is shown on focus events on platforms that support it. */
        get virtual_keyboard_show_on_focus(): boolean
        set virtual_keyboard_show_on_focus(value: boolean)
        
        /** Specifies the type of virtual keyboard to show. */
        get virtual_keyboard_type(): int64
        set virtual_keyboard_type(value: int64)
        
        /** If `true`, makes the caret blink. */
        get caret_blink(): boolean
        set caret_blink(value: boolean)
        
        /** The interval at which the caret blinks (in seconds). */
        get caret_blink_interval(): float64
        set caret_blink_interval(value: float64)
        
        /** The caret's column position inside the [LineEdit]. When set, the text may scroll to accommodate it. */
        get caret_column(): int64
        set caret_column(value: int64)
        
        /** If `true`, the [LineEdit] will always show the caret, even if not editing or focus is lost. */
        get caret_force_displayed(): boolean
        set caret_force_displayed(value: boolean)
        
        /** Allow moving caret, selecting and removing the individual composite character components.  
         *      
         *  **Note:** [kbd]Backspace[/kbd] is always removing individual composite character components.  
         */
        get caret_mid_grapheme(): boolean
        set caret_mid_grapheme(value: boolean)
        
        /** If `true`, every character is replaced with the secret character (see [member secret_character]). */
        get secret(): boolean
        set secret(value: boolean)
        
        /** The character to use to mask secret input. Only a single character can be used as the secret character. If it is longer than one character, only the first one will be used. If it is empty, a space will be used instead. */
        get secret_character(): string
        set secret_character(value: string)
        
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
        
        /** Sets the icon that will appear in the right end of the [LineEdit] if there's no [member text], or always, if [member clear_button_enabled] is set to `false`. */
        get right_icon(): null | Texture2D
        set right_icon(value: null | Texture2D)
        
        /** Define the scaling behavior of the [member right_icon]. */
        get icon_expand_mode(): int64
        set icon_expand_mode(value: int64)
        
        /** Scale ratio of the icon when [member icon_expand_mode] is set to [constant EXPAND_MODE_FIT_TO_LINE_EDIT]. */
        get right_icon_scale(): float64
        set right_icon_scale(value: float64)
        
        /** Emitted when the text changes. */
        readonly text_changed: Signal<(new_text: string) => void>
        
        /** Emitted when appending text that overflows the [member max_length]. The appended text is truncated to fit [member max_length], and the part that couldn't fit is passed as the [param rejected_substring] argument. */
        readonly text_change_rejected: Signal<(rejected_substring: string) => void>
        
        /** Emitted when the user presses the `ui_text_submit` action (by default: [kbd]Enter[/kbd] or [kbd]Kp Enter[/kbd]) while the [LineEdit] has focus. */
        readonly text_submitted: Signal<(new_text: string) => void>
        
        /** Emitted when the [LineEdit] switches in or out of edit mode. */
        readonly editing_toggled: Signal<(toggled_on: boolean) => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapLineEdit;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapLineEdit;
    }
    namespace LinkButton {
        enum UnderlineMode {
            /** The LinkButton will always show an underline at the bottom of its text. */
            UNDERLINE_MODE_ALWAYS = 0,
            
            /** The LinkButton will show an underline at the bottom of its text when the mouse cursor is over it. */
            UNDERLINE_MODE_ON_HOVER = 1,
            
            /** The LinkButton will never show an underline at the bottom of its text. */
            UNDERLINE_MODE_NEVER = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapLinkButton extends __RPCMapBaseButton {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapLinkButton extends __NameMapBaseButton {
    }
    /** A button that represents a link.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_linkbutton.html  
     */
    class LinkButton<Map extends NodePathMap = any> extends BaseButton<Map> {
        constructor(identifier?: any)
        /** The button's text that will be displayed inside the button's area. */
        get text(): string
        set text(value: string)
        
        /** The underline mode to use for the text. */
        get underline(): int64
        set underline(value: int64)
        
        /** The [url=https://en.wikipedia.org/wiki/Uniform_Resource_Identifier]URI[/url] for this [LinkButton]. If set to a valid URI, pressing the button opens the URI using the operating system's default program for the protocol (via [method OS.shell_open]). HTTP and HTTPS URLs open the default web browser.  
         *    
         */
        get uri(): string
        set uri(value: string)
        
        /** Sets the clipping behavior when the text exceeds the node's bounding rectangle. */
        get text_overrun_behavior(): int64
        set text_overrun_behavior(value: int64)
        
        /** Ellipsis character used for text clipping. */
        get ellipsis_char(): string
        set ellipsis_char(value: string)
        
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
        __godotRPCMap: __RPCMapLinkButton;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapLinkButton;
    }
    namespace Logger {
        enum ErrorType {
            /** The message received is an error. */
            ERROR_TYPE_ERROR = 0,
            
            /** The message received is a warning. */
            ERROR_TYPE_WARNING = 1,
            
            /** The message received is a script error. */
            ERROR_TYPE_SCRIPT = 2,
            
            /** The message received is a shader error. */
            ERROR_TYPE_SHADER = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapLogger extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapLogger extends __NameMapRefCounted {
    }
    /** Custom logger to receive messages from the internal error/warning stream.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_logger.html  
     */
    class Logger extends RefCounted {
        constructor(identifier?: any)
        /** Called when an error is logged. The error provides the [param function], [param file], and [param line] that it originated from, as well as either the [param code] that generated the error or a [param rationale].  
         *  The type of error provided by [param error_type] is described in the [enum ErrorType] enumeration.  
         *  Additionally, [param script_backtraces] provides backtraces for each of the script languages. These will only contain stack frames in editor builds and debug builds by default. To enable them for release builds as well, you need to enable [member ProjectSettings.debug/settings/gdscript/always_track_call_stacks].  
         *  **Warning:** This method will be called from threads other than the main thread, possibly at the same time, so you will need to have some kind of thread-safety in your implementation of it, like a [Mutex].  
         *      
         *  **Note:** [param script_backtraces] will not contain any captured variables, due to its prohibitively high cost. To get those you will need to capture the backtraces yourself, from within the [Logger] virtual methods, using [method Engine.capture_script_backtraces].  
         *      
         *  **Note:** Logging errors from this method using functions like [method @GlobalScope.push_error] or [method @GlobalScope.push_warning] is not supported, as it could cause infinite recursion. These errors will only show up in the console output.  
         */
        /* gdvirtual */ _log_error(function_: string, file: string, line: int64, code: string, rationale: string, editor_notify: boolean, error_type: int64, script_backtraces: GArray<ScriptBacktrace>): void
        
        /** Called when a message is logged. If [param error] is `true`, then this message was meant to be sent to `stderr`.  
         *  **Warning:** This method will be called from threads other than the main thread, possibly at the same time, so you will need to have some kind of thread-safety in your implementation of it, like a [Mutex].  
         *      
         *  **Note:** Logging another message from this method using functions like [method @GlobalScope.print] is not supported, as it could cause infinite recursion. These messages will only show up in the console output.  
         */
        /* gdvirtual */ _log_message(message: string, error: boolean): void
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapLogger;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapLogger;
    }
    namespace LookAtModifier3D {
        enum OriginFrom {
            /** The bone rest position of the bone specified in [member bone] is used as origin. */
            ORIGIN_FROM_SELF = 0,
            
            /** The bone global pose position of the bone specified in [member origin_bone] is used as origin.  
             *      
             *  **Note:** It is recommended that you select only the parent bone unless you are familiar with the bone processing process. The specified bone pose at the time the [LookAtModifier3D] is processed is used as a reference. In other words, if you specify a child bone and the [LookAtModifier3D] causes the child bone to move, the rendered result and direction will not match.  
             */
            ORIGIN_FROM_SPECIFIC_BONE = 1,
            
            /** The global position of the [Node3D] specified in [member origin_external_node] is used as origin.  
             *      
             *  **Note:** Same as [constant ORIGIN_FROM_SPECIFIC_BONE], when specifying a [BoneAttachment3D] with a child bone assigned, the rendered result and direction will not match.  
             */
            ORIGIN_FROM_EXTERNAL_NODE = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapLookAtModifier3D extends __RPCMapSkeletonModifier3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapLookAtModifier3D extends __NameMapSkeletonModifier3D {
    }
    /** The [LookAtModifier3D] rotates a bone to look at a target.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_lookatmodifier3d.html  
     */
    class LookAtModifier3D<Map extends NodePathMap = any> extends SkeletonModifier3D<Map> {
        constructor(identifier?: any)
        /** Returns the remaining seconds of the time-based interpolation. */
        get_interpolation_remaining(): float64
        
        /** Returns `true` if time-based interpolation is running. If `true`, it is equivalent to [method get_interpolation_remaining] returning `0.0`.  
         *  This is useful to determine whether a [LookAtModifier3D] can be removed safely.  
         */
        is_interpolating(): boolean
        
        /** Returns whether the target is within the angle limitations. It is useful for unsetting the [member target_node] when the target is outside of the angle limitations.  
         *      
         *  **Note:** The value is updated after [method SkeletonModifier3D._process_modification]. To retrieve this value correctly, we recommend using the signal [signal SkeletonModifier3D.modification_processed].  
         */
        is_target_within_limitation(): boolean
        
        /** The [NodePath] to the node that is the target for the look at modification. This node is what the modification will rotate the bone to. */
        get target_node(): NodePath
        set target_node(value: NodePath | string)
        
        /** The bone name of the [Skeleton3D] that the modification will operate on. */
        get bone_name(): string
        set bone_name(value: string)
        
        /** Index of the [member bone_name] in the parent [Skeleton3D]. */
        get bone(): int64
        set bone(value: int64)
        
        /** The forward axis of the bone. This [SkeletonModifier3D] modifies the bone so that this axis points toward the [member target_node]. */
        get forward_axis(): int64
        set forward_axis(value: int64)
        
        /** The axis of the first rotation. This [SkeletonModifier3D] works by compositing the rotation by Euler angles to prevent to rotate the [member forward_axis]. */
        get primary_rotation_axis(): int64
        set primary_rotation_axis(value: int64)
        
        /** If `true`, provides rotation by two axes. */
        get use_secondary_rotation(): boolean
        set use_secondary_rotation(value: boolean)
        
        /** The relative option. If `true`, the rotation is applied relative to the pose. If `false`, the rotation is applied relative to the rest. It means to replace the current pose with the [LookAtModifier3D]'s result.  
         *      
         *  **Note:** This option affects the base angle for [member use_angle_limitation] unlike [IterateIK3D]'s [JointLimitation3D]. Since the [LookAtModifier3D] relies strongly on Euler rotation, the axis that determines the limitation and the actual rotation are strongly tied together.  
         */
        get relative(): boolean
        set relative(value: boolean)
        
        /** This value determines from what origin is retrieved for use in the calculation of the forward vector. */
        get origin_from(): int64
        set origin_from(value: int64)
        
        /** If [member origin_from] is [constant ORIGIN_FROM_SPECIFIC_BONE], the bone global pose position specified for this is used as origin. */
        get origin_bone_name(): string
        set origin_bone_name(value: string)
        
        /** Index of the [member origin_bone_name] in the parent [Skeleton3D]. */
        get origin_bone(): int64
        set origin_bone(value: int64)
        
        /** If [member origin_from] is [constant ORIGIN_FROM_EXTERNAL_NODE], the global position of the [Node3D] specified for this is used as origin. */
        get origin_external_node(): NodePath
        set origin_external_node(value: NodePath | string)
        
        /** The offset of the bone pose origin. Matching the origins by offset is useful for cases where multiple bones must always face the same direction, such as the eyes.  
         *      
         *  **Note:** This value indicates the local position of the object set in [member origin_from].  
         */
        get origin_offset(): Vector3
        set origin_offset(value: Vector3)
        
        /** If the target passes through too close to the origin than this value, time-based interpolation is used even if the target is within the angular limitations, to prevent the angular velocity from becoming too high. */
        get origin_safe_margin(): float64
        set origin_safe_margin(value: float64)
        
        /** The duration of the time-based interpolation. Interpolation is triggered at the following cases:  
         *  - When the target node is changed  
         *  - When an axis is flipped due to angle limitation  
         *      
         *  **Note:** The flipping occurs when the target is outside the angle limitation and the internally computed secondary rotation axis of the forward vector is flipped. Visually, it occurs when the target is outside the angle limitation and crosses the plane of the [member forward_axis] and [member primary_rotation_axis].  
         */
        get duration(): float64
        set duration(value: float64)
        
        /** The transition type of the time-based interpolation. See also [enum Tween.TransitionType]. */
        get transition_type(): int64
        set transition_type(value: int64)
        
        /** The ease type of the time-based interpolation. See also [enum Tween.EaseType]. */
        get ease_type(): int64
        set ease_type(value: int64)
        
        /** If `true`, limits the amount of rotation. For example, this helps to prevent a character's neck from rotating 360 degrees.  
         *      
         *  **Note:** As with [AnimationTree] blending, interpolation is provided that favors [method Skeleton3D.get_bone_rest] or [method Skeleton3D.get_bone_pose] depends on the [member relative] option. This means that interpolation does not select the shortest path in some cases.  
         *      
         *  **Note:** Some values for [member transition_type] (such as [constant Tween.TRANS_BACK], [constant Tween.TRANS_ELASTIC], and [constant Tween.TRANS_SPRING]) may exceed the limitations. If interpolation occurs while overshooting the limitations, the result might not respect the bone rest.  
         */
        get use_angle_limitation(): boolean
        set use_angle_limitation(value: boolean)
        
        /** If `true`, the limitations are spread from the bone symmetrically.  
         *  If `false`, the limitation can be specified separately for each side of the bone rest.  
         */
        get symmetry_limitation(): boolean
        set symmetry_limitation(value: boolean)
        
        /** The limit angle of the primary rotation when [member symmetry_limitation] is `true`, in radians. */
        get primary_limit_angle(): float64
        set primary_limit_angle(value: float64)
        
        /** The threshold to start damping for [member primary_limit_angle]. It provides non-linear (b-spline) interpolation, let it feel more resistance the more it rotate to the edge limit. This is useful for simulating the limits of human motion.  
         *  If `1.0`, no damping is performed. If `0.0`, damping is always performed.  
         */
        get primary_damp_threshold(): float64
        set primary_damp_threshold(value: float64)
        
        /** The limit angle of positive side of the primary rotation when [member symmetry_limitation] is `false`, in radians. */
        get primary_positive_limit_angle(): float64
        set primary_positive_limit_angle(value: float64)
        
        /** The threshold to start damping for [member primary_positive_limit_angle]. */
        get primary_positive_damp_threshold(): float64
        set primary_positive_damp_threshold(value: float64)
        
        /** The limit angle of negative side of the primary rotation when [member symmetry_limitation] is `false`, in radians. */
        get primary_negative_limit_angle(): float64
        set primary_negative_limit_angle(value: float64)
        
        /** The threshold to start damping for [member primary_negative_limit_angle]. */
        get primary_negative_damp_threshold(): float64
        set primary_negative_damp_threshold(value: float64)
        
        /** The limit angle of the secondary rotation when [member symmetry_limitation] is `true`, in radians. */
        get secondary_limit_angle(): float64
        set secondary_limit_angle(value: float64)
        
        /** The threshold to start damping for [member secondary_limit_angle]. */
        get secondary_damp_threshold(): float64
        set secondary_damp_threshold(value: float64)
        
        /** The limit angle of positive side of the secondary rotation when [member symmetry_limitation] is `false`, in radians. */
        get secondary_positive_limit_angle(): float64
        set secondary_positive_limit_angle(value: float64)
        
        /** The threshold to start damping for [member secondary_positive_limit_angle]. */
        get secondary_positive_damp_threshold(): float64
        set secondary_positive_damp_threshold(value: float64)
        
        /** The limit angle of negative side of the secondary rotation when [member symmetry_limitation] is `false`, in radians. */
        get secondary_negative_limit_angle(): float64
        set secondary_negative_limit_angle(value: float64)
        
        /** The threshold to start damping for [member secondary_negative_limit_angle]. */
        get secondary_negative_damp_threshold(): float64
        set secondary_negative_damp_threshold(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapLookAtModifier3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapLookAtModifier3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapMainLoop extends __RPCMapObject {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapMainLoop extends __NameMapObject {
    }
    /** Abstract base class for the game's main loop.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_mainloop.html  
     */
    class MainLoop extends Object {
        /** Notification received from the OS when the application is exceeding its allocated memory.  
         *  Specific to the iOS platform.  
         */
        static readonly NOTIFICATION_OS_MEMORY_WARNING = 2009
        
        /** Notification received when translations may have changed. Can be triggered by the user changing the locale. Can be used to respond to language changes, for example to change the UI strings on the fly. Useful when working with the built-in translation support, like [method Object.tr]. */
        static readonly NOTIFICATION_TRANSLATION_CHANGED = 2010
        
        /** Notification received from the OS when a request for "About" information is sent.  
         *  Specific to the macOS platform.  
         */
        static readonly NOTIFICATION_WM_ABOUT = 2011
        
        /** Notification received from Godot's crash handler when the engine is about to crash.  
         *  Implemented on desktop platforms if the crash handler is enabled.  
         */
        static readonly NOTIFICATION_CRASH = 2012
        
        /** Notification received from the OS when an update of the Input Method Engine occurs (e.g. change of IME cursor position or composition string).  
         *  Implemented on desktop and web platforms.  
         */
        static readonly NOTIFICATION_OS_IME_UPDATE = 2013
        
        /** Notification received from the OS when the application is resumed.  
         *  Specific to the Android and iOS platforms.  
         */
        static readonly NOTIFICATION_APPLICATION_RESUMED = 2014
        
        /** Notification received from the OS when the application is paused.  
         *  Specific to the Android and iOS platforms.  
         *      
         *  **Note:** On iOS, you only have approximately 5 seconds to finish a task started by this signal. If you go over this allotment, iOS will kill the app instead of pausing it.  
         */
        static readonly NOTIFICATION_APPLICATION_PAUSED = 2015
        
        /** Notification received from the OS when the application is focused, i.e. when changing the focus from the OS desktop or a thirdparty application to any open window of the Godot instance.  
         *  Implemented on desktop and mobile platforms.  
         */
        static readonly NOTIFICATION_APPLICATION_FOCUS_IN = 2016
        
        /** Notification received from the OS when the application is defocused, i.e. when changing the focus from any open window of the Godot instance to the OS desktop or a thirdparty application.  
         *  Implemented on desktop and mobile platforms.  
         */
        static readonly NOTIFICATION_APPLICATION_FOCUS_OUT = 2017
        
        /** Notification received when text server is changed. */
        static readonly NOTIFICATION_TEXT_SERVER_CHANGED = 2018
        constructor(identifier?: any)
        
        /** Called once during initialization. */
        /* gdvirtual */ _initialize(): void
        
        /** Called each physics tick. [param delta] is the logical time between physics ticks in seconds and is equal to [member Engine.time_scale] / [member Engine.physics_ticks_per_second]. Equivalent to [method Node._physics_process].  
         *  If implemented, the method must return a boolean value. `true` ends the main loop, while `false` lets it proceed to the next step.  
         *      
         *  **Note:** [method _physics_process] may be called up to [member Engine.max_physics_steps_per_frame] times per (idle) frame. This step limit may be reached when the engine is suffering performance issues.  
         *      
         *  **Note:** Accumulated [param delta] may diverge from real world seconds.  
         */
        /* gdvirtual */ _physics_process(delta: float64): boolean
        
        /** Called on each idle frame, prior to rendering, and after physics ticks have been processed. [param delta] is the time between frames in seconds. Equivalent to [method Node._process].  
         *  If implemented, the method must return a boolean value. `true` ends the main loop, while `false` lets it proceed to the next frame.  
         *      
         *  **Note:** When the engine is struggling and the frame rate is lowered, [param delta] will increase. When [param delta] is increased, it's capped at a maximum of [member Engine.time_scale] * [member Engine.max_physics_steps_per_frame] / [member Engine.physics_ticks_per_second]. As a result, accumulated [param delta] may not represent real world time.  
         *      
         *  **Note:** When `--fixed-fps` is enabled or the engine is running in Movie Maker mode (see [MovieWriter]), process [param delta] will always be the same for every frame, regardless of how much time the frame took to render.  
         *      
         *  **Note:** Frame delta may be post-processed by [member OS.delta_smoothing] if this is enabled for the project.  
         */
        /* gdvirtual */ _process(delta: float64): boolean
        
        /** Called before the program exits. */
        /* gdvirtual */ _finalize(): void
        
        /** Emitted when a user responds to a permission request. */
        readonly on_request_permissions_result: Signal<(permission: string, granted: boolean) => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapMainLoop;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapMainLoop;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapMarginContainer extends __RPCMapContainer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapMarginContainer extends __NameMapContainer {
    }
    /** A container that keeps a margin around its child controls.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_margincontainer.html  
     */
    class MarginContainer<Map extends NodePathMap = any> extends Container<Map> {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapMarginContainer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapMarginContainer;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapMarker2D extends __RPCMapNode2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapMarker2D extends __NameMapNode2D {
    }
    /** Generic 2D position hint for editing.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_marker2d.html  
     */
    class Marker2D<Map extends NodePathMap = any> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Size of the gizmo cross that appears in the editor. */
        get gizmo_extents(): float64
        set gizmo_extents(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapMarker2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapMarker2D;
    }
}
