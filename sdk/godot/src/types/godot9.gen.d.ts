// AUTO-GENERATED
declare module "godot" {
    namespace VisualShaderNodeDerivativeFunc {
        enum OpType {
            /** A floating-point scalar. */
            OP_TYPE_SCALAR = 0,
            
            /** A 2D vector type. */
            OP_TYPE_VECTOR_2D = 1,
            
            /** A 3D vector type. */
            OP_TYPE_VECTOR_3D = 2,
            
            /** A 4D vector type. */
            OP_TYPE_VECTOR_4D = 3,
            
            /** Represents the size of the [enum OpType] enum. */
            OP_TYPE_MAX = 4,
        }
        enum Function {
            /** Sum of absolute derivative in `x` and `y`. */
            FUNC_SUM = 0,
            
            /** Derivative in `x` using local differencing. */
            FUNC_X = 1,
            
            /** Derivative in `y` using local differencing. */
            FUNC_Y = 2,
            
            /** Represents the size of the [enum Function] enum. */
            FUNC_MAX = 3,
        }
        enum Precision {
            /** No precision is specified, the GPU driver is allowed to use whatever level of precision it chooses. This is the default option and is equivalent to using `dFdx()` or `dFdy()` in text shaders. */
            PRECISION_NONE = 0,
            
            /** The derivative will be calculated using the current fragment's neighbors (which may not include the current fragment). This tends to be faster than using [constant PRECISION_FINE], but may not be suitable when more precision is needed. This is equivalent to using `dFdxCoarse()` or `dFdyCoarse()` in text shaders. */
            PRECISION_COARSE = 1,
            
            /** The derivative will be calculated using the current fragment and its immediate neighbors. This tends to be slower than using [constant PRECISION_COARSE], but may be necessary when more precision is needed. This is equivalent to using `dFdxFine()` or `dFdyFine()` in text shaders. */
            PRECISION_FINE = 2,
            
            /** Represents the size of the [enum Precision] enum. */
            PRECISION_MAX = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeDerivativeFunc extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeDerivativeFunc extends __NameMapVisualShaderNode {
    }
    /** Calculates a derivative within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodederivativefunc.html  
     */
    class VisualShaderNodeDerivativeFunc extends VisualShaderNode {
        constructor(identifier?: any)
        /** A type of operands and returned value. */
        get op_type(): int64
        set op_type(value: int64)
        
        /** A derivative function type. */
        get "function"(): int64
        set "function"(value: int64)
        
        /** Sets the level of precision to use for the derivative function. When using the Compatibility renderer, this setting has no effect. */
        get precision(): int64
        set precision(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeDerivativeFunc;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeDerivativeFunc;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeDeterminant extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeDeterminant extends __NameMapVisualShaderNode {
    }
    /** Calculates the determinant of a [Transform3D] within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodedeterminant.html  
     */
    class VisualShaderNodeDeterminant extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeDeterminant;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeDeterminant;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeDistanceFade extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeDistanceFade extends __NameMapVisualShaderNode {
    }
    /** A visual shader node representing distance fade effect.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodedistancefade.html  
     */
    class VisualShaderNodeDistanceFade extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeDistanceFade;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeDistanceFade;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeDotProduct extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeDotProduct extends __NameMapVisualShaderNode {
    }
    /** Calculates a dot product of two vectors within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodedotproduct.html  
     */
    class VisualShaderNodeDotProduct extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeDotProduct;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeDotProduct;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeExpression extends __RPCMapVisualShaderNodeGroupBase {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeExpression extends __NameMapVisualShaderNodeGroupBase {
    }
    /** A custom visual shader graph expression written in Godot Shading Language.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeexpression.html  
     */
    class VisualShaderNodeExpression extends VisualShaderNodeGroupBase {
        constructor(identifier?: any)
        /** An expression in Godot Shading Language, which will be injected at the start of the graph's matching shader function (`vertex`, `fragment`, or `light`), and thus cannot be used to declare functions, varyings, uniforms, or global constants. */
        get expression(): string
        set expression(value: string)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeExpression;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeExpression;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeFaceForward extends __RPCMapVisualShaderNodeVectorBase {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeFaceForward extends __NameMapVisualShaderNodeVectorBase {
    }
    /** Returns the vector that points in the same direction as a reference vector within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodefaceforward.html  
     */
    class VisualShaderNodeFaceForward extends VisualShaderNodeVectorBase {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeFaceForward;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeFaceForward;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeFloatConstant extends __RPCMapVisualShaderNodeConstant {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeFloatConstant extends __NameMapVisualShaderNodeConstant {
    }
    /** A scalar floating-point constant to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodefloatconstant.html  
     */
    class VisualShaderNodeFloatConstant extends VisualShaderNodeConstant {
        constructor(identifier?: any)
        /** A floating-point constant which represents a state of this node. */
        get constant(): float64
        set constant(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeFloatConstant;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeFloatConstant;
    }
    namespace VisualShaderNodeFloatFunc {
        enum Function {
            /** Returns the sine of the parameter. Translates to `sin(x)` in the Godot Shader Language. */
            FUNC_SIN = 0,
            
            /** Returns the cosine of the parameter. Translates to `cos(x)` in the Godot Shader Language. */
            FUNC_COS = 1,
            
            /** Returns the tangent of the parameter. Translates to `tan(x)` in the Godot Shader Language. */
            FUNC_TAN = 2,
            
            /** Returns the arc-sine of the parameter. Translates to `asin(x)` in the Godot Shader Language. */
            FUNC_ASIN = 3,
            
            /** Returns the arc-cosine of the parameter. Translates to `acos(x)` in the Godot Shader Language. */
            FUNC_ACOS = 4,
            
            /** Returns the arc-tangent of the parameter. Translates to `atan(x)` in the Godot Shader Language. */
            FUNC_ATAN = 5,
            
            /** Returns the hyperbolic sine of the parameter. Translates to `sinh(x)` in the Godot Shader Language. */
            FUNC_SINH = 6,
            
            /** Returns the hyperbolic cosine of the parameter. Translates to `cosh(x)` in the Godot Shader Language. */
            FUNC_COSH = 7,
            
            /** Returns the hyperbolic tangent of the parameter. Translates to `tanh(x)` in the Godot Shader Language. */
            FUNC_TANH = 8,
            
            /** Returns the natural logarithm of the parameter. Translates to `log(x)` in the Godot Shader Language. */
            FUNC_LOG = 9,
            
            /** Returns the natural exponentiation of the parameter. Translates to `exp(x)` in the Godot Shader Language. */
            FUNC_EXP = 10,
            
            /** Returns the square root of the parameter. Translates to `sqrt(x)` in the Godot Shader Language. */
            FUNC_SQRT = 11,
            
            /** Returns the absolute value of the parameter. Translates to `abs(x)` in the Godot Shader Language. */
            FUNC_ABS = 12,
            
            /** Extracts the sign of the parameter. Translates to `sign(x)` in the Godot Shader Language. */
            FUNC_SIGN = 13,
            
            /** Finds the nearest integer less than or equal to the parameter. Translates to `floor(x)` in the Godot Shader Language. */
            FUNC_FLOOR = 14,
            
            /** Finds the nearest integer to the parameter. Translates to `round(x)` in the Godot Shader Language. */
            FUNC_ROUND = 15,
            
            /** Finds the nearest integer that is greater than or equal to the parameter. Translates to `ceil(x)` in the Godot Shader Language. */
            FUNC_CEIL = 16,
            
            /** Computes the fractional part of the argument. Translates to `fract(x)` in the Godot Shader Language. */
            FUNC_FRACT = 17,
            
            /** Clamps the value between `0.0` and `1.0` using `min(max(x, 0.0), 1.0)`. */
            FUNC_SATURATE = 18,
            
            /** Negates the `x` using `-(x)`. */
            FUNC_NEGATE = 19,
            
            /** Returns the arc-hyperbolic-cosine of the parameter. Translates to `acosh(x)` in the Godot Shader Language. */
            FUNC_ACOSH = 20,
            
            /** Returns the arc-hyperbolic-sine of the parameter. Translates to `asinh(x)` in the Godot Shader Language. */
            FUNC_ASINH = 21,
            
            /** Returns the arc-hyperbolic-tangent of the parameter. Translates to `atanh(x)` in the Godot Shader Language. */
            FUNC_ATANH = 22,
            
            /** Convert a quantity in radians to degrees. Translates to `degrees(x)` in the Godot Shader Language. */
            FUNC_DEGREES = 23,
            
            /** Returns 2 raised by the power of the parameter. Translates to `exp2(x)` in the Godot Shader Language. */
            FUNC_EXP2 = 24,
            
            /** Returns the inverse of the square root of the parameter. Translates to `inversesqrt(x)` in the Godot Shader Language. */
            FUNC_INVERSE_SQRT = 25,
            
            /** Returns the base 2 logarithm of the parameter. Translates to `log2(x)` in the Godot Shader Language. */
            FUNC_LOG2 = 26,
            
            /** Convert a quantity in degrees to radians. Translates to `radians(x)` in the Godot Shader Language. */
            FUNC_RADIANS = 27,
            
            /** Finds reciprocal value of dividing 1 by `x` (i.e. `1 / x`). */
            FUNC_RECIPROCAL = 28,
            
            /** Finds the nearest even integer to the parameter. Translates to `roundEven(x)` in the Godot Shader Language. */
            FUNC_ROUNDEVEN = 29,
            
            /** Returns a value equal to the nearest integer to `x` whose absolute value is not larger than the absolute value of `x`. Translates to `trunc(x)` in the Godot Shader Language. */
            FUNC_TRUNC = 30,
            
            /** Subtracts scalar `x` from 1 (i.e. `1 - x`). */
            FUNC_ONEMINUS = 31,
            
            /** Represents the size of the [enum Function] enum. */
            FUNC_MAX = 32,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeFloatFunc extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeFloatFunc extends __NameMapVisualShaderNode {
    }
    /** A scalar floating-point function to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodefloatfunc.html  
     */
    class VisualShaderNodeFloatFunc extends VisualShaderNode {
        constructor(identifier?: any)
        /** A function to be applied to the scalar. */
        get "function"(): int64
        set "function"(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeFloatFunc;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeFloatFunc;
    }
    namespace VisualShaderNodeFloatOp {
        enum Operator {
            /** Sums two numbers using `a + b`. */
            OP_ADD = 0,
            
            /** Subtracts two numbers using `a - b`. */
            OP_SUB = 1,
            
            /** Multiplies two numbers using `a * b`. */
            OP_MUL = 2,
            
            /** Divides two numbers using `a / b`. */
            OP_DIV = 3,
            
            /** Calculates the remainder of two numbers. Translates to `mod(a, b)` in the Godot Shader Language. */
            OP_MOD = 4,
            
            /** Raises the `a` to the power of `b`. Translates to `pow(a, b)` in the Godot Shader Language. */
            OP_POW = 5,
            
            /** Returns the greater of two numbers. Translates to `max(a, b)` in the Godot Shader Language. */
            OP_MAX = 6,
            
            /** Returns the lesser of two numbers. Translates to `min(a, b)` in the Godot Shader Language. */
            OP_MIN = 7,
            
            /** Returns the arc-tangent of the parameters. Translates to `atan(a, b)` in the Godot Shader Language. */
            OP_ATAN2 = 8,
            
            /** Generates a step function by comparing `b`(x) to `a`(edge). Returns 0.0 if `x` is smaller than `edge` and otherwise 1.0. Translates to `step(a, b)` in the Godot Shader Language. */
            OP_STEP = 9,
            
            /** Represents the size of the [enum Operator] enum. */
            OP_ENUM_SIZE = 10,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeFloatOp extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeFloatOp extends __NameMapVisualShaderNode {
    }
    /** A floating-point scalar operator to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodefloatop.html  
     */
    class VisualShaderNodeFloatOp extends VisualShaderNode {
        constructor(identifier?: any)
        /** An operator to be applied to the inputs. */
        get operator(): int64
        set operator(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeFloatOp;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeFloatOp;
    }
    namespace VisualShaderNodeFloatParameter {
        enum Hint {
            /** No hint used. */
            HINT_NONE = 0,
            
            /** A range hint for scalar value, which limits possible input values between [member min] and [member max]. Translated to `hint_range(min, max)` in shader code. */
            HINT_RANGE = 1,
            
            /** A range hint for scalar value with step, which limits possible input values between [member min] and [member max], with a step (increment) of [member step]). Translated to `hint_range(min, max, step)` in shader code. */
            HINT_RANGE_STEP = 2,
            
            /** Represents the size of the [enum Hint] enum. */
            HINT_MAX = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeFloatParameter extends __RPCMapVisualShaderNodeParameter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeFloatParameter extends __NameMapVisualShaderNodeParameter {
    }
    /** A scalar float parameter to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodefloatparameter.html  
     */
    class VisualShaderNodeFloatParameter extends VisualShaderNodeParameter {
        constructor(identifier?: any)
        /** A hint applied to the uniform, which controls the values it can take when set through the Inspector. */
        get hint(): int64
        set hint(value: int64)
        
        /** Maximum value for range hints. Used if [member hint] is set to [constant HINT_RANGE] or [constant HINT_RANGE_STEP]. */
        get min(): float64
        set min(value: float64)
        
        /** Minimum value for range hints. Used if [member hint] is set to [constant HINT_RANGE] or [constant HINT_RANGE_STEP]. */
        get max(): float64
        set max(value: float64)
        
        /** Step (increment) value for the range hint with step. Used if [member hint] is set to [constant HINT_RANGE_STEP]. */
        get step(): float64
        set step(value: float64)
        
        /** Enables usage of the [member default_value]. */
        get default_value_enabled(): boolean
        set default_value_enabled(value: boolean)
        
        /** A default value to be assigned within the shader. */
        get default_value(): float64
        set default_value(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeFloatParameter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeFloatParameter;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeFrame extends __RPCMapVisualShaderNodeResizableBase {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeFrame extends __NameMapVisualShaderNodeResizableBase {
    }
    /** A frame other visual shader nodes can be attached to for better organization.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeframe.html  
     */
    class VisualShaderNodeFrame extends VisualShaderNodeResizableBase {
        constructor(identifier?: any)
        /** Adds a node to the list of nodes attached to the frame. Should not be called directly, use the [method VisualShader.attach_node_to_frame] method instead. */
        add_attached_node(node: int64): void
        
        /** Removes a node from the list of nodes attached to the frame. Should not be called directly, use the [method VisualShader.detach_node_from_frame] method instead. */
        remove_attached_node(node: int64): void
        
        /** The title of the node. */
        get title(): string
        set title(value: string)
        
        /** If `true`, the frame will be tinted with the color specified in [member tint_color]. */
        get tint_color_enabled(): boolean
        set tint_color_enabled(value: boolean)
        
        /** The color of the frame when [member tint_color_enabled] is `true`. */
        get tint_color(): Color
        set tint_color(value: Color)
        
        /** If `true`, the frame will automatically resize to enclose all attached nodes. */
        get autoshrink(): boolean
        set autoshrink(value: boolean)
        
        /** The list of nodes attached to the frame. */
        get attached_nodes(): PackedInt32Array
        set attached_nodes(value: PackedInt32Array | int32[])
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeFrame;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeFrame;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeFresnel extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeFresnel extends __NameMapVisualShaderNode {
    }
    /** A Fresnel effect to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodefresnel.html  
     */
    class VisualShaderNodeFresnel extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeFresnel;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeFresnel;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeGlobalExpression extends __RPCMapVisualShaderNodeExpression {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeGlobalExpression extends __NameMapVisualShaderNodeExpression {
    }
    /** A custom global visual shader graph expression written in Godot Shading Language.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeglobalexpression.html  
     */
    class VisualShaderNodeGlobalExpression extends VisualShaderNodeExpression {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeGlobalExpression;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeGlobalExpression;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeGroupBase extends __RPCMapVisualShaderNodeResizableBase {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeGroupBase extends __NameMapVisualShaderNodeResizableBase {
    }
    /** Base class for a family of nodes with variable number of input and output ports within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodegroupbase.html  
     */
    class VisualShaderNodeGroupBase extends VisualShaderNodeResizableBase {
        constructor(identifier?: any)
        /** Defines all input ports using a [String] formatted as a colon-separated list: `id,type,name;` (see [method add_input_port]). */
        set_inputs(inputs: string): void
        
        /** Returns a [String] description of the input ports as a colon-separated list using the format `id,type,name;` (see [method add_input_port]). */
        get_inputs(): string
        
        /** Defines all output ports using a [String] formatted as a colon-separated list: `id,type,name;` (see [method add_output_port]). */
        set_outputs(outputs: string): void
        
        /** Returns a [String] description of the output ports as a colon-separated list using the format `id,type,name;` (see [method add_output_port]). */
        get_outputs(): string
        
        /** Returns `true` if the specified port name does not override an existed port name and is valid within the shader. */
        is_valid_port_name(name: string): boolean
        
        /** Adds an input port with the specified [param type] (see [enum VisualShaderNode.PortType]) and [param name]. */
        add_input_port(id: int64, type: int64, name: string): void
        
        /** Removes the specified input port. */
        remove_input_port(id: int64): void
        
        /** Returns the number of input ports in use. Alternative for [method get_free_input_port_id]. */
        get_input_port_count(): int64
        
        /** Returns `true` if the specified input port exists. */
        has_input_port(id: int64): boolean
        
        /** Removes all previously specified input ports. */
        clear_input_ports(): void
        
        /** Adds an output port with the specified [param type] (see [enum VisualShaderNode.PortType]) and [param name]. */
        add_output_port(id: int64, type: int64, name: string): void
        
        /** Removes the specified output port. */
        remove_output_port(id: int64): void
        
        /** Returns the number of output ports in use. Alternative for [method get_free_output_port_id]. */
        get_output_port_count(): int64
        
        /** Returns `true` if the specified output port exists. */
        has_output_port(id: int64): boolean
        
        /** Removes all previously specified output ports. */
        clear_output_ports(): void
        
        /** Renames the specified input port. */
        set_input_port_name(id: int64, name: string): void
        
        /** Sets the specified input port's type (see [enum VisualShaderNode.PortType]). */
        set_input_port_type(id: int64, type: int64): void
        
        /** Renames the specified output port. */
        set_output_port_name(id: int64, name: string): void
        
        /** Sets the specified output port's type (see [enum VisualShaderNode.PortType]). */
        set_output_port_type(id: int64, type: int64): void
        
        /** Returns a free input port ID which can be used in [method add_input_port]. */
        get_free_input_port_id(): int64
        
        /** Returns a free output port ID which can be used in [method add_output_port]. */
        get_free_output_port_id(): int64
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeGroupBase;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeGroupBase;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeIf extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeIf extends __NameMapVisualShaderNode {
    }
    /** Outputs a 3D vector based on the result of a floating-point comparison within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeif.html  
     */
    class VisualShaderNodeIf extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeIf;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeIf;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeInput extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeInput extends __NameMapVisualShaderNode {
    }
    /** Represents the input shader parameter within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeinput.html  
     */
    class VisualShaderNodeInput extends VisualShaderNode {
        constructor(identifier?: any)
        /** Returns a translated name of the current constant in the Godot Shader Language. E.g. `"ALBEDO"` if the [member input_name] equal to `"albedo"`. */
        get_input_real_name(): string
        
        /** One of the several input constants in lower-case style like: "vertex" (`VERTEX`) or "point_size" (`POINT_SIZE`). */
        get input_name(): StringName
        set input_name(value: StringName)
        
        /** Emitted when input is changed via [member input_name]. */
        readonly input_type_changed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeInput;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeInput;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeIntConstant extends __RPCMapVisualShaderNodeConstant {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeIntConstant extends __NameMapVisualShaderNodeConstant {
    }
    /** A scalar integer constant to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeintconstant.html  
     */
    class VisualShaderNodeIntConstant extends VisualShaderNodeConstant {
        constructor(identifier?: any)
        /** An integer constant which represents a state of this node. */
        get constant(): int64
        set constant(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeIntConstant;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeIntConstant;
    }
    namespace VisualShaderNodeIntFunc {
        enum Function {
            /** Returns the absolute value of the parameter. Translates to `abs(x)` in the Godot Shader Language. */
            FUNC_ABS = 0,
            
            /** Negates the `x` using `-(x)`. */
            FUNC_NEGATE = 1,
            
            /** Extracts the sign of the parameter. Translates to `sign(x)` in the Godot Shader Language. */
            FUNC_SIGN = 2,
            
            /** Returns the result of bitwise `NOT` operation on the integer. Translates to `~a` in the Godot Shader Language. */
            FUNC_BITWISE_NOT = 3,
            
            /** Represents the size of the [enum Function] enum. */
            FUNC_MAX = 4,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeIntFunc extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeIntFunc extends __NameMapVisualShaderNode {
    }
    /** A scalar integer function to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeintfunc.html  
     */
    class VisualShaderNodeIntFunc extends VisualShaderNode {
        constructor(identifier?: any)
        /** A function to be applied to the scalar. */
        get "function"(): int64
        set "function"(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeIntFunc;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeIntFunc;
    }
    namespace VisualShaderNodeIntOp {
        enum Operator {
            /** Sums two numbers using `a + b`. */
            OP_ADD = 0,
            
            /** Subtracts two numbers using `a - b`. */
            OP_SUB = 1,
            
            /** Multiplies two numbers using `a * b`. */
            OP_MUL = 2,
            
            /** Divides two numbers using `a / b`. */
            OP_DIV = 3,
            
            /** Calculates the remainder of two numbers using `a % b`. */
            OP_MOD = 4,
            
            /** Returns the greater of two numbers. Translates to `max(a, b)` in the Godot Shader Language. */
            OP_MAX = 5,
            
            /** Returns the lesser of two numbers. Translates to `max(a, b)` in the Godot Shader Language. */
            OP_MIN = 6,
            
            /** Returns the result of bitwise `AND` operation on the integer. Translates to `a & b` in the Godot Shader Language. */
            OP_BITWISE_AND = 7,
            
            /** Returns the result of bitwise `OR` operation for two integers. Translates to `a | b` in the Godot Shader Language. */
            OP_BITWISE_OR = 8,
            
            /** Returns the result of bitwise `XOR` operation for two integers. Translates to `a ^ b` in the Godot Shader Language. */
            OP_BITWISE_XOR = 9,
            
            /** Returns the result of bitwise left shift operation on the integer. Translates to `a << b` in the Godot Shader Language. */
            OP_BITWISE_LEFT_SHIFT = 10,
            
            /** Returns the result of bitwise right shift operation on the integer. Translates to `a >> b` in the Godot Shader Language. */
            OP_BITWISE_RIGHT_SHIFT = 11,
            
            /** Represents the size of the [enum Operator] enum. */
            OP_ENUM_SIZE = 12,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeIntOp extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeIntOp extends __NameMapVisualShaderNode {
    }
    /** An integer scalar operator to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeintop.html  
     */
    class VisualShaderNodeIntOp extends VisualShaderNode {
        constructor(identifier?: any)
        /** An operator to be applied to the inputs. */
        get operator(): int64
        set operator(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeIntOp;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeIntOp;
    }
    namespace VisualShaderNodeIntParameter {
        enum Hint {
            /** The parameter will not constrain its value. */
            HINT_NONE = 0,
            
            /** The parameter's value must be within the specified [member min]/[member max] range. */
            HINT_RANGE = 1,
            
            /** The parameter's value must be within the specified range, with the given [member step] between values. */
            HINT_RANGE_STEP = 2,
            
            /** The parameter uses an enum to associate preset values to names in the editor. */
            HINT_ENUM = 3,
            
            /** Represents the size of the [enum Hint] enum. */
            HINT_MAX = 4,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeIntParameter extends __RPCMapVisualShaderNodeParameter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeIntParameter extends __NameMapVisualShaderNodeParameter {
    }
    /** A visual shader node for shader parameter (uniform) of type [int].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeintparameter.html  
     */
    class VisualShaderNodeIntParameter extends VisualShaderNodeParameter {
        constructor(identifier?: any)
        /** Range hint of this node. Use it to customize valid parameter range. */
        get hint(): int64
        set hint(value: int64)
        
        /** The minimum value this parameter can take. [member hint] must be either [constant HINT_RANGE] or [constant HINT_RANGE_STEP] for this to take effect. */
        get min(): int64
        set min(value: int64)
        
        /** The maximum value this parameter can take. [member hint] must be either [constant HINT_RANGE] or [constant HINT_RANGE_STEP] for this to take effect. */
        get max(): int64
        set max(value: int64)
        
        /** The step between parameter's values. Forces the parameter to be a multiple of the given value. [member hint] must be [constant HINT_RANGE_STEP] for this to take effect. */
        get step(): int64
        set step(value: int64)
        
        /** The names used for the enum select in the editor. [member hint] must be [constant HINT_ENUM] for this to take effect. */
        get enum_names(): PackedStringArray
        set enum_names(value: PackedStringArray | string[])
        
        /** If `true`, the node will have a custom default value. */
        get default_value_enabled(): boolean
        set default_value_enabled(value: boolean)
        
        /** Default value of this parameter, which will be used if not set externally. [member default_value_enabled] must be enabled; defaults to `0` otherwise. */
        get default_value(): int64
        set default_value(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeIntParameter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeIntParameter;
    }
    namespace VisualShaderNodeIs {
        enum Function {
            /** Comparison with `INF` (Infinity). */
            FUNC_IS_INF = 0,
            
            /** Comparison with `NaN` (Not a Number; indicates invalid numeric results, such as division by zero). */
            FUNC_IS_NAN = 1,
            
            /** Represents the size of the [enum Function] enum. */
            FUNC_MAX = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeIs extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeIs extends __NameMapVisualShaderNode {
    }
    /** A boolean comparison operator to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeis.html  
     */
    class VisualShaderNodeIs extends VisualShaderNode {
        constructor(identifier?: any)
        /** The comparison function. */
        get "function"(): int64
        set "function"(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeIs;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeIs;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeLinearSceneDepth extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeLinearSceneDepth extends __NameMapVisualShaderNode {
    }
    /** A visual shader node that returns the depth value of the DEPTH_TEXTURE node in a linear space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodelinearscenedepth.html  
     */
    class VisualShaderNodeLinearSceneDepth extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeLinearSceneDepth;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeLinearSceneDepth;
    }
    namespace VisualShaderNodeMix {
        enum OpType {
            /** A floating-point scalar. */
            OP_TYPE_SCALAR = 0,
            
            /** A 2D vector type. */
            OP_TYPE_VECTOR_2D = 1,
            
            /** The `a` and `b` ports use a 2D vector type. The `weight` port uses a scalar type. */
            OP_TYPE_VECTOR_2D_SCALAR = 2,
            
            /** A 3D vector type. */
            OP_TYPE_VECTOR_3D = 3,
            
            /** The `a` and `b` ports use a 3D vector type. The `weight` port uses a scalar type. */
            OP_TYPE_VECTOR_3D_SCALAR = 4,
            
            /** A 4D vector type. */
            OP_TYPE_VECTOR_4D = 5,
            
            /** The `a` and `b` ports use a 4D vector type. The `weight` port uses a scalar type. */
            OP_TYPE_VECTOR_4D_SCALAR = 6,
            
            /** Represents the size of the [enum OpType] enum. */
            OP_TYPE_MAX = 7,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeMix extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeMix extends __NameMapVisualShaderNode {
    }
    /** Linearly interpolates between two values within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodemix.html  
     */
    class VisualShaderNodeMix extends VisualShaderNode {
        constructor(identifier?: any)
        /** A type of operands and returned value. */
        get op_type(): int64
        set op_type(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeMix;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeMix;
    }
    namespace VisualShaderNodeMultiplyAdd {
        enum OpType {
            /** A floating-point scalar type. */
            OP_TYPE_SCALAR = 0,
            
            /** A 2D vector type. */
            OP_TYPE_VECTOR_2D = 1,
            
            /** A 3D vector type. */
            OP_TYPE_VECTOR_3D = 2,
            
            /** A 4D vector type. */
            OP_TYPE_VECTOR_4D = 3,
            
            /** Represents the size of the [enum OpType] enum. */
            OP_TYPE_MAX = 4,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeMultiplyAdd extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeMultiplyAdd extends __NameMapVisualShaderNode {
    }
    /** Performs a fused multiply-add operation within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodemultiplyadd.html  
     */
    class VisualShaderNodeMultiplyAdd extends VisualShaderNode {
        constructor(identifier?: any)
        /** A type of operands and returned value. */
        get op_type(): int64
        set op_type(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeMultiplyAdd;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeMultiplyAdd;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeOuterProduct extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeOuterProduct extends __NameMapVisualShaderNode {
    }
    /** Calculates an outer product of two vectors within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeouterproduct.html  
     */
    class VisualShaderNodeOuterProduct extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeOuterProduct;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeOuterProduct;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeOutput extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeOutput extends __NameMapVisualShaderNode {
    }
    /** Represents the output shader parameters within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeoutput.html  
     */
    class VisualShaderNodeOutput extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeOutput;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeOutput;
    }
    namespace VisualShaderNodeParameter {
        enum Qualifier {
            /** The parameter will be tied to the [ShaderMaterial] using this shader. */
            QUAL_NONE = 0,
            
            /** The parameter will use a global value, defined in Project Settings. */
            QUAL_GLOBAL = 1,
            
            /** The parameter will be tied to the node with attached [ShaderMaterial] using this shader. */
            QUAL_INSTANCE = 2,
            
            /** The parameter will be tied to the node with attached [ShaderMaterial] using this shader. Enables setting a [member instance_index] property. */
            QUAL_INSTANCE_INDEX = 3,
            
            /** Represents the size of the [enum Qualifier] enum. */
            QUAL_MAX = 4,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeParameter extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeParameter extends __NameMapVisualShaderNode {
    }
    /** A base type for the parameters within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeparameter.html  
     */
    class VisualShaderNodeParameter extends VisualShaderNode {
        constructor(identifier?: any)
        /** Name of the parameter, by which it can be accessed through the [ShaderMaterial] properties. */
        get parameter_name(): StringName
        set parameter_name(value: StringName)
        
        /** Defines the scope of the parameter. */
        get qualifier(): int64
        set qualifier(value: int64)
        
        /** The index within 0-15 range, which is used to avoid clashes when shader used on multiple materials. */
        get instance_index(): int64
        set instance_index(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeParameter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeParameter;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeParameterRef extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeParameterRef extends __NameMapVisualShaderNode {
    }
    /** A reference to an existing [VisualShaderNodeParameter].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeparameterref.html  
     */
    class VisualShaderNodeParameterRef extends VisualShaderNode {
        constructor(identifier?: any)
        /** The name of the parameter which this reference points to. */
        get parameter_name(): StringName
        set parameter_name(value: StringName)
        get param_type(): int64
        set param_type(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeParameterRef;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeParameterRef;
    }
    namespace VisualShaderNodeParticleAccelerator {
        enum Mode {
            /** The particles will be accelerated based on their velocity. */
            MODE_LINEAR = 0,
            
            /** The particles will be accelerated towards or away from the center. */
            MODE_RADIAL = 1,
            
            /** The particles will be accelerated tangentially to the radius vector from center to their position. */
            MODE_TANGENTIAL = 2,
            
            /** Represents the size of the [enum Mode] enum. */
            MODE_MAX = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeParticleAccelerator extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeParticleAccelerator extends __NameMapVisualShaderNode {
    }
    /** A visual shader node that accelerates particles.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeparticleaccelerator.html  
     */
    class VisualShaderNodeParticleAccelerator extends VisualShaderNode {
        constructor(identifier?: any)
        /** Defines in what manner the particles will be accelerated. */
        get mode(): int64
        set mode(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeParticleAccelerator;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeParticleAccelerator;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeParticleBoxEmitter extends __RPCMapVisualShaderNodeParticleEmitter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeParticleBoxEmitter extends __NameMapVisualShaderNodeParticleEmitter {
    }
    /** A visual shader node that makes particles emitted in a box shape.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeparticleboxemitter.html  
     */
    class VisualShaderNodeParticleBoxEmitter extends VisualShaderNodeParticleEmitter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeParticleBoxEmitter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeParticleBoxEmitter;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeParticleConeVelocity extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeParticleConeVelocity extends __NameMapVisualShaderNode {
    }
    /** A visual shader node that makes particles move in a cone shape.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeparticleconevelocity.html  
     */
    class VisualShaderNodeParticleConeVelocity extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeParticleConeVelocity;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeParticleConeVelocity;
    }
    namespace VisualShaderNodeParticleEmit {
        enum EmitFlags {
            /** If enabled, the particle starts with the position defined by this node. */
            EMIT_FLAG_POSITION = 1,
            
            /** If enabled, the particle starts with the rotation and scale defined by this node. */
            EMIT_FLAG_ROT_SCALE = 2,
            
            /** If enabled,the particle starts with the velocity defined by this node. */
            EMIT_FLAG_VELOCITY = 4,
            
            /** If enabled, the particle starts with the color defined by this node. */
            EMIT_FLAG_COLOR = 8,
            
            /** If enabled, the particle starts with the `CUSTOM` data defined by this node. */
            EMIT_FLAG_CUSTOM = 16,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeParticleEmit extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeParticleEmit extends __NameMapVisualShaderNode {
    }
    /** A visual shader node that forces to emit a particle from a sub-emitter.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeparticleemit.html  
     */
    class VisualShaderNodeParticleEmit extends VisualShaderNode {
        constructor(identifier?: any)
        /** Flags used to override the properties defined in the sub-emitter's process material. */
        get flags(): int64
        set flags(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeParticleEmit;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeParticleEmit;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeParticleEmitter extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeParticleEmitter extends __NameMapVisualShaderNode {
    }
    /** A base class for particle emitters.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeparticleemitter.html  
     */
    class VisualShaderNodeParticleEmitter extends VisualShaderNode {
        constructor(identifier?: any)
        /** If `true`, the result of this emitter is projected to 2D space. By default it is `false` and meant for use in 3D space. */
        get mode_2d(): boolean
        set mode_2d(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeParticleEmitter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeParticleEmitter;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeParticleMeshEmitter extends __RPCMapVisualShaderNodeParticleEmitter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeParticleMeshEmitter extends __NameMapVisualShaderNodeParticleEmitter {
    }
    /** A visual shader node that makes particles emitted in a shape defined by a [Mesh].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeparticlemeshemitter.html  
     */
    class VisualShaderNodeParticleMeshEmitter extends VisualShaderNodeParticleEmitter {
        constructor(identifier?: any)
        /** The [Mesh] that defines emission shape. */
        get mesh(): null | Mesh
        set mesh(value: null | Mesh)
        
        /** If `true`, the particles will emit from all surfaces of the mesh. */
        get use_all_surfaces(): boolean
        set use_all_surfaces(value: boolean)
        
        /** Index of the surface that emits particles. [member use_all_surfaces] must be `false` for this to take effect. */
        get surface_index(): int64
        set surface_index(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeParticleMeshEmitter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeParticleMeshEmitter;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeParticleMultiplyByAxisAngle extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeParticleMultiplyByAxisAngle extends __NameMapVisualShaderNode {
    }
    /** A visual shader helper node for multiplying position and rotation of particles.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeparticlemultiplybyaxisangle.html  
     */
    class VisualShaderNodeParticleMultiplyByAxisAngle extends VisualShaderNode {
        constructor(identifier?: any)
        /** If `true`, the angle will be interpreted in degrees instead of radians. */
        get degrees_mode(): boolean
        set degrees_mode(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeParticleMultiplyByAxisAngle;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeParticleMultiplyByAxisAngle;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeParticleOutput extends __RPCMapVisualShaderNodeOutput {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeParticleOutput extends __NameMapVisualShaderNodeOutput {
    }
    /** Visual shader node that defines output values for particle emitting.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeparticleoutput.html  
     */
    class VisualShaderNodeParticleOutput extends VisualShaderNodeOutput {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeParticleOutput;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeParticleOutput;
    }
    namespace VisualShaderNodeParticleRandomness {
        enum OpType {
            /** A floating-point scalar. */
            OP_TYPE_SCALAR = 0,
            
            /** A 2D vector type. */
            OP_TYPE_VECTOR_2D = 1,
            
            /** A 3D vector type. */
            OP_TYPE_VECTOR_3D = 2,
            
            /** A 4D vector type. */
            OP_TYPE_VECTOR_4D = 3,
            
            /** Represents the size of the [enum OpType] enum. */
            OP_TYPE_MAX = 4,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeParticleRandomness extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeParticleRandomness extends __NameMapVisualShaderNode {
    }
    /** Visual shader node for randomizing particle values.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeparticlerandomness.html  
     */
    class VisualShaderNodeParticleRandomness extends VisualShaderNode {
        constructor(identifier?: any)
        /** A type of operands and returned value. */
        get op_type(): int64
        set op_type(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeParticleRandomness;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeParticleRandomness;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeParticleRingEmitter extends __RPCMapVisualShaderNodeParticleEmitter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeParticleRingEmitter extends __NameMapVisualShaderNodeParticleEmitter {
    }
    /** A visual shader node that makes particles emitted in a ring shape.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeparticleringemitter.html  
     */
    class VisualShaderNodeParticleRingEmitter extends VisualShaderNodeParticleEmitter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeParticleRingEmitter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeParticleRingEmitter;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeParticleSphereEmitter extends __RPCMapVisualShaderNodeParticleEmitter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeParticleSphereEmitter extends __NameMapVisualShaderNodeParticleEmitter {
    }
    /** A visual shader node that makes particles emitted in a sphere shape.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeparticlesphereemitter.html  
     */
    class VisualShaderNodeParticleSphereEmitter extends VisualShaderNodeParticleEmitter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeParticleSphereEmitter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeParticleSphereEmitter;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeProximityFade extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeProximityFade extends __NameMapVisualShaderNode {
    }
    /** A visual shader node representing proximity fade effect.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeproximityfade.html  
     */
    class VisualShaderNodeProximityFade extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeProximityFade;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeProximityFade;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeRandomRange extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeRandomRange extends __NameMapVisualShaderNode {
    }
    /** A visual shader node that generates a pseudo-random scalar.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernoderandomrange.html  
     */
    class VisualShaderNodeRandomRange extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeRandomRange;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeRandomRange;
    }
    namespace VisualShaderNodeRemap {
        enum OpType {
            /** A floating-point scalar type. */
            OP_TYPE_SCALAR = 0,
            
            /** A 2D vector type. */
            OP_TYPE_VECTOR_2D = 1,
            
            /** The `value` port uses a 2D vector type, while the `input min`, `input max`, `output min`, and `output max` ports use a floating-point scalar type. */
            OP_TYPE_VECTOR_2D_SCALAR = 2,
            
            /** A 3D vector type. */
            OP_TYPE_VECTOR_3D = 3,
            
            /** The `value` port uses a 3D vector type, while the `input min`, `input max`, `output min`, and `output max` ports use a floating-point scalar type. */
            OP_TYPE_VECTOR_3D_SCALAR = 4,
            
            /** A 4D vector type. */
            OP_TYPE_VECTOR_4D = 5,
            
            /** The `value` port uses a 4D vector type, while the `input min`, `input max`, `output min`, and `output max` ports use a floating-point scalar type. */
            OP_TYPE_VECTOR_4D_SCALAR = 6,
            
            /** Represents the size of the [enum OpType] enum. */
            OP_TYPE_MAX = 7,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeRemap extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeRemap extends __NameMapVisualShaderNode {
    }
    /** A visual shader node for remap function.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernoderemap.html  
     */
    class VisualShaderNodeRemap extends VisualShaderNode {
        constructor(identifier?: any)
        get op_type(): int64
        set op_type(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeRemap;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeRemap;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeReroute extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeReroute extends __NameMapVisualShaderNode {
    }
    /** A node that allows rerouting a connection within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodereroute.html  
     */
    class VisualShaderNodeReroute extends VisualShaderNode {
        constructor(identifier?: any)
        get port_type(): int64
        set port_type(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeReroute;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeReroute;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeResizableBase extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeResizableBase extends __NameMapVisualShaderNode {
    }
    /** Base class for resizable nodes in a visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernoderesizablebase.html  
     */
    class VisualShaderNodeResizableBase extends VisualShaderNode {
        constructor(identifier?: any)
        /** The size of the node in the visual shader graph. */
        get size(): Vector2
        set size(value: Vector2)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeResizableBase;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeResizableBase;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeRotationByAxis extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeRotationByAxis extends __NameMapVisualShaderNode {
    }
    /** A visual shader node that modifies the rotation of the object using a rotation matrix.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernoderotationbyaxis.html  
     */
    class VisualShaderNodeRotationByAxis extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeRotationByAxis;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeRotationByAxis;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeSDFRaymarch extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeSDFRaymarch extends __NameMapVisualShaderNode {
    }
    /** SDF raymarching algorithm to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodesdfraymarch.html  
     */
    class VisualShaderNodeSDFRaymarch extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeSDFRaymarch;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeSDFRaymarch;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeSDFToScreenUV extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeSDFToScreenUV extends __NameMapVisualShaderNode {
    }
    /** A function to convert an SDF (signed-distance field) to screen UV, to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodesdftoscreenuv.html  
     */
    class VisualShaderNodeSDFToScreenUV extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeSDFToScreenUV;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeSDFToScreenUV;
    }
    namespace VisualShaderNodeSample3D {
        enum Source {
            /** Creates internal uniform and provides a way to assign it within node. */
            SOURCE_TEXTURE = 0,
            
            /** Use the uniform texture from sampler port. */
            SOURCE_PORT = 1,
            
            /** Represents the size of the [enum Source] enum. */
            SOURCE_MAX = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeSample3D extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeSample3D extends __NameMapVisualShaderNode {
    }
    /** A base node for nodes which samples 3D textures in the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodesample3d.html  
     */
    class VisualShaderNodeSample3D extends VisualShaderNode {
        constructor(identifier?: any)
        /** An input source type. */
        get source(): int64
        set source(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeSample3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeSample3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeScreenNormalWorldSpace extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeScreenNormalWorldSpace extends __NameMapVisualShaderNode {
    }
    /** A visual shader node that unpacks the screen normal texture in World Space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodescreennormalworldspace.html  
     */
    class VisualShaderNodeScreenNormalWorldSpace extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeScreenNormalWorldSpace;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeScreenNormalWorldSpace;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeScreenUVToSDF extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeScreenUVToSDF extends __NameMapVisualShaderNode {
    }
    /** A function to convert screen UV to an SDF (signed-distance field), to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodescreenuvtosdf.html  
     */
    class VisualShaderNodeScreenUVToSDF extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeScreenUVToSDF;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeScreenUVToSDF;
    }
    namespace VisualShaderNodeSmoothStep {
        enum OpType {
            /** A floating-point scalar type. */
            OP_TYPE_SCALAR = 0,
            
            /** A 2D vector type. */
            OP_TYPE_VECTOR_2D = 1,
            
            /** The `x` port uses a 2D vector type. The first two ports use a floating-point scalar type. */
            OP_TYPE_VECTOR_2D_SCALAR = 2,
            
            /** A 3D vector type. */
            OP_TYPE_VECTOR_3D = 3,
            
            /** The `x` port uses a 3D vector type. The first two ports use a floating-point scalar type. */
            OP_TYPE_VECTOR_3D_SCALAR = 4,
            
            /** A 4D vector type. */
            OP_TYPE_VECTOR_4D = 5,
            
            /** The `a` and `b` ports use a 4D vector type. The `weight` port uses a scalar type. */
            OP_TYPE_VECTOR_4D_SCALAR = 6,
            
            /** Represents the size of the [enum OpType] enum. */
            OP_TYPE_MAX = 7,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeSmoothStep extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeSmoothStep extends __NameMapVisualShaderNode {
    }
    /** Calculates a SmoothStep function within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodesmoothstep.html  
     */
    class VisualShaderNodeSmoothStep extends VisualShaderNode {
        constructor(identifier?: any)
        /** A type of operands and returned value. */
        get op_type(): int64
        set op_type(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeSmoothStep;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeSmoothStep;
    }
    namespace VisualShaderNodeStep {
        enum OpType {
            /** A floating-point scalar type. */
            OP_TYPE_SCALAR = 0,
            
            /** A 2D vector type. */
            OP_TYPE_VECTOR_2D = 1,
            
            /** The `x` port uses a 2D vector type, while the `edge` port uses a floating-point scalar type. */
            OP_TYPE_VECTOR_2D_SCALAR = 2,
            
            /** A 3D vector type. */
            OP_TYPE_VECTOR_3D = 3,
            
            /** The `x` port uses a 3D vector type, while the `edge` port uses a floating-point scalar type. */
            OP_TYPE_VECTOR_3D_SCALAR = 4,
            
            /** A 4D vector type. */
            OP_TYPE_VECTOR_4D = 5,
            
            /** The `a` and `b` ports use a 4D vector type. The `weight` port uses a scalar type. */
            OP_TYPE_VECTOR_4D_SCALAR = 6,
            
            /** Represents the size of the [enum OpType] enum. */
            OP_TYPE_MAX = 7,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeStep extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeStep extends __NameMapVisualShaderNode {
    }
    /** Calculates a Step function within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodestep.html  
     */
    class VisualShaderNodeStep extends VisualShaderNode {
        constructor(identifier?: any)
        /** A type of operands and returned value. */
        get op_type(): int64
        set op_type(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeStep;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeStep;
    }
    namespace VisualShaderNodeSwitch {
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
            
            /** A boolean type. */
            OP_TYPE_BOOLEAN = 6,
            
            /** A transform type. */
            OP_TYPE_TRANSFORM = 7,
            
            /** Represents the size of the [enum OpType] enum. */
            OP_TYPE_MAX = 8,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeSwitch extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeSwitch extends __NameMapVisualShaderNode {
    }
    /** A selector function for use within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeswitch.html  
     */
    class VisualShaderNodeSwitch extends VisualShaderNode {
        constructor(identifier?: any)
        /** A type of operands and returned value. */
        get op_type(): int64
        set op_type(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeSwitch;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeSwitch;
    }
    namespace VisualShaderNodeTexture {
        enum Source {
            /** Use the texture given as an argument for this function. */
            SOURCE_TEXTURE = 0,
            
            /** Use the current viewport's texture as the source. */
            SOURCE_SCREEN = 1,
            
            /** Use the texture from this shader's texture built-in (e.g. a texture of a [Sprite2D]). */
            SOURCE_2D_TEXTURE = 2,
            
            /** Use the texture from this shader's normal map built-in. */
            SOURCE_2D_NORMAL = 3,
            
            /** Use the depth texture captured during the depth prepass. Only available when the depth prepass is used (i.e. in spatial shaders and in the forward_plus or gl_compatibility renderers). */
            SOURCE_DEPTH = 4,
            
            /** Use the texture provided in the input port for this function. */
            SOURCE_PORT = 5,
            
            /** Use the normal buffer captured during the depth prepass. Only available when the normal-roughness buffer is available (i.e. in spatial shaders and in the forward_plus renderer). */
            SOURCE_3D_NORMAL = 6,
            
            /** Use the roughness buffer captured during the depth prepass. Only available when the normal-roughness buffer is available (i.e. in spatial shaders and in the forward_plus renderer). */
            SOURCE_ROUGHNESS = 7,
            
            /** Represents the size of the [enum Source] enum. */
            SOURCE_MAX = 8,
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
    interface __RPCMapVisualShaderNodeTexture extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeTexture extends __NameMapVisualShaderNode {
    }
    /** Performs a 2D texture lookup within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodetexture.html  
     */
    class VisualShaderNodeTexture extends VisualShaderNode {
        constructor(identifier?: any)
        /** Determines the source for the lookup. */
        get source(): int64
        set source(value: int64)
        
        /** The source texture, if needed for the selected [member source]. */
        get texture(): null | Texture2D
        set texture(value: null | Texture2D)
        
        /** Specifies the type of the texture if [member source] is set to [constant SOURCE_TEXTURE]. */
        get texture_type(): int64
        set texture_type(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeTexture;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeTexture;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeTexture2DArray extends __RPCMapVisualShaderNodeSample3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeTexture2DArray extends __NameMapVisualShaderNodeSample3D {
    }
    /** A 2D texture uniform array to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodetexture2darray.html  
     */
    class VisualShaderNodeTexture2DArray extends VisualShaderNodeSample3D {
        constructor(identifier?: any)
        /** A source texture array. Used if [member VisualShaderNodeSample3D.source] is set to [constant VisualShaderNodeSample3D.SOURCE_TEXTURE]. */
        get texture_array(): null | Texture2DArray | CompressedTexture2DArray | PlaceholderTexture2DArray | Texture2DArrayRD
        set texture_array(value: null | Texture2DArray | CompressedTexture2DArray | PlaceholderTexture2DArray | Texture2DArrayRD)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeTexture2DArray;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeTexture2DArray;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeTexture2DArrayParameter extends __RPCMapVisualShaderNodeTextureParameter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeTexture2DArrayParameter extends __NameMapVisualShaderNodeTextureParameter {
    }
    /** A visual shader node for shader parameter (uniform) of type [Texture2DArray].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodetexture2darrayparameter.html  
     */
    class VisualShaderNodeTexture2DArrayParameter extends VisualShaderNodeTextureParameter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeTexture2DArrayParameter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeTexture2DArrayParameter;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeTexture2DParameter extends __RPCMapVisualShaderNodeTextureParameter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeTexture2DParameter extends __NameMapVisualShaderNodeTextureParameter {
    }
    /** Provides a 2D texture parameter within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodetexture2dparameter.html  
     */
    class VisualShaderNodeTexture2DParameter extends VisualShaderNodeTextureParameter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeTexture2DParameter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeTexture2DParameter;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeTexture3D extends __RPCMapVisualShaderNodeSample3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeTexture3D extends __NameMapVisualShaderNodeSample3D {
    }
    /** Performs a 3D texture lookup within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodetexture3d.html  
     */
    class VisualShaderNodeTexture3D extends VisualShaderNodeSample3D {
        constructor(identifier?: any)
        /** A source texture. Used if [member VisualShaderNodeSample3D.source] is set to [constant VisualShaderNodeSample3D.SOURCE_TEXTURE]. */
        get texture(): null | Texture3D
        set texture(value: null | Texture3D)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeTexture3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeTexture3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeTexture3DParameter extends __RPCMapVisualShaderNodeTextureParameter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeTexture3DParameter extends __NameMapVisualShaderNodeTextureParameter {
    }
    /** Provides a 3D texture parameter within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodetexture3dparameter.html  
     */
    class VisualShaderNodeTexture3DParameter extends VisualShaderNodeTextureParameter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeTexture3DParameter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeTexture3DParameter;
    }
    namespace VisualShaderNodeTextureParameter {
        enum TextureType {
            /** No hints are added to the uniform declaration. */
            TYPE_DATA = 0,
            
            /** Adds `source_color` as hint to the uniform declaration for proper conversion from nonlinear sRGB encoding to linear encoding. */
            TYPE_COLOR = 1,
            
            /** Adds `hint_normal` as hint to the uniform declaration, which internally converts the texture for proper usage as normal map. */
            TYPE_NORMAL_MAP = 2,
            
            /** Adds `hint_anisotropy` as hint to the uniform declaration to use for a flowmap. */
            TYPE_ANISOTROPY = 3,
            
            /** Represents the size of the [enum TextureType] enum. */
            TYPE_MAX = 4,
        }
        enum ColorDefault {
            /** Defaults to fully opaque white color. */
            COLOR_DEFAULT_WHITE = 0,
            
            /** Defaults to fully opaque black color. */
            COLOR_DEFAULT_BLACK = 1,
            
            /** Defaults to fully transparent black color. */
            COLOR_DEFAULT_TRANSPARENT = 2,
            
            /** Represents the size of the [enum ColorDefault] enum. */
            COLOR_DEFAULT_MAX = 3,
        }
        enum TextureFilter {
            /** Sample the texture using the filter determined by the node this shader is attached to. */
            FILTER_DEFAULT = 0,
            
            /** The texture filter reads from the nearest pixel only. This makes the texture look pixelated from up close, and grainy from a distance (due to mipmaps not being sampled). */
            FILTER_NEAREST = 1,
            
            /** The texture filter blends between the nearest 4 pixels. This makes the texture look smooth from up close, and grainy from a distance (due to mipmaps not being sampled). */
            FILTER_LINEAR = 2,
            
            /** The texture filter reads from the nearest pixel and blends between the nearest 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`). This makes the texture look pixelated from up close, and smooth from a distance.  
             *  Use this for non-pixel art textures that may be viewed at a low scale (e.g. due to [Camera2D] zoom or sprite scaling), as mipmaps are important to smooth out pixels that are smaller than on-screen pixels.  
             */
            FILTER_NEAREST_MIPMAP = 3,
            
            /** The texture filter blends between the nearest 4 pixels and between the nearest 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`). This makes the texture look smooth from up close, and smooth from a distance.  
             *  Use this for non-pixel art textures that may be viewed at a low scale (e.g. due to [Camera2D] zoom or sprite scaling), as mipmaps are important to smooth out pixels that are smaller than on-screen pixels.  
             */
            FILTER_LINEAR_MIPMAP = 4,
            
            /** The texture filter reads from the nearest pixel and blends between 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`) based on the angle between the surface and the camera view. This makes the texture look pixelated from up close, and smooth from a distance. Anisotropic filtering improves texture quality on surfaces that are almost in line with the camera, but is slightly slower. The anisotropic filtering level can be changed by adjusting [member ProjectSettings.rendering/textures/default_filters/anisotropic_filtering_level].  
             *      
             *  **Note:** This texture filter is rarely useful in 2D projects. [constant FILTER_NEAREST_MIPMAP] is usually more appropriate in this case.  
             */
            FILTER_NEAREST_MIPMAP_ANISOTROPIC = 5,
            
            /** The texture filter blends between the nearest 4 pixels and blends between 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`) based on the angle between the surface and the camera view. This makes the texture look smooth from up close, and smooth from a distance. Anisotropic filtering improves texture quality on surfaces that are almost in line with the camera, but is slightly slower. The anisotropic filtering level can be changed by adjusting [member ProjectSettings.rendering/textures/default_filters/anisotropic_filtering_level].  
             *      
             *  **Note:** This texture filter is rarely useful in 2D projects. [constant FILTER_LINEAR_MIPMAP] is usually more appropriate in this case.  
             */
            FILTER_LINEAR_MIPMAP_ANISOTROPIC = 6,
            
            /** Represents the size of the [enum TextureFilter] enum. */
            FILTER_MAX = 7,
        }
        enum TextureRepeat {
            /** Sample the texture using the repeat mode determined by the node this shader is attached to. */
            REPEAT_DEFAULT = 0,
            
            /** Texture will repeat normally. */
            REPEAT_ENABLED = 1,
            
            /** Texture will not repeat. */
            REPEAT_DISABLED = 2,
            
            /** Represents the size of the [enum TextureRepeat] enum. */
            REPEAT_MAX = 3,
        }
        enum TextureSource {
            /** The texture source is not specified in the shader. */
            SOURCE_NONE = 0,
            
            /** The texture source is the screen texture which captures all opaque objects drawn this frame. */
            SOURCE_SCREEN = 1,
            
            /** The texture source is the depth texture from the depth prepass. */
            SOURCE_DEPTH = 2,
            
            /** The texture source is the normal-roughness buffer from the depth prepass. */
            SOURCE_NORMAL_ROUGHNESS = 3,
            
            /** Represents the size of the [enum TextureSource] enum. */
            SOURCE_MAX = 4,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeTextureParameter extends __RPCMapVisualShaderNodeParameter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeTextureParameter extends __NameMapVisualShaderNodeParameter {
    }
    /** Performs a uniform texture lookup within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodetextureparameter.html  
     */
    class VisualShaderNodeTextureParameter extends VisualShaderNodeParameter {
        constructor(identifier?: any)
        /** Defines the type of data provided by the source texture. */
        get texture_type(): int64
        set texture_type(value: int64)
        
        /** Sets the default color if no texture is assigned to the uniform. */
        get color_default(): int64
        set color_default(value: int64)
        
        /** Sets the texture filtering mode. */
        get texture_filter(): int64
        set texture_filter(value: int64)
        
        /** Sets the texture repeating mode. */
        get texture_repeat(): int64
        set texture_repeat(value: int64)
        
        /** Sets the texture source mode. Used for reading from the screen, depth, or normal_roughness texture. */
        get texture_source(): int64
        set texture_source(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeTextureParameter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeTextureParameter;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeTextureParameterTriplanar extends __RPCMapVisualShaderNodeTextureParameter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeTextureParameterTriplanar extends __NameMapVisualShaderNodeTextureParameter {
    }
    /** Performs a uniform texture lookup with triplanar within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodetextureparametertriplanar.html  
     */
    class VisualShaderNodeTextureParameterTriplanar extends VisualShaderNodeTextureParameter {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeTextureParameterTriplanar;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeTextureParameterTriplanar;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeTextureSDF extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeTextureSDF extends __NameMapVisualShaderNode {
    }
    /** Performs an SDF (signed-distance field) texture lookup within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodetexturesdf.html  
     */
    class VisualShaderNodeTextureSDF extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeTextureSDF;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeTextureSDF;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeTextureSDFNormal extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeTextureSDFNormal extends __NameMapVisualShaderNode {
    }
    /** Performs an SDF (signed-distance field) normal texture lookup within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodetexturesdfnormal.html  
     */
    class VisualShaderNodeTextureSDFNormal extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeTextureSDFNormal;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeTextureSDFNormal;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeTransformCompose extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeTransformCompose extends __NameMapVisualShaderNode {
    }
    /** Composes a [Transform3D] from four [Vector3]s within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodetransformcompose.html  
     */
    class VisualShaderNodeTransformCompose extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeTransformCompose;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeTransformCompose;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeTransformConstant extends __RPCMapVisualShaderNodeConstant {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeTransformConstant extends __NameMapVisualShaderNodeConstant {
    }
    /** A [Transform3D] constant for use within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodetransformconstant.html  
     */
    class VisualShaderNodeTransformConstant extends VisualShaderNodeConstant {
        constructor(identifier?: any)
        /** A [Transform3D] constant which represents the state of this node. */
        get constant(): Transform3D
        set constant(value: Transform3D)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeTransformConstant;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeTransformConstant;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeTransformDecompose extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeTransformDecompose extends __NameMapVisualShaderNode {
    }
    /** Decomposes a [Transform3D] into four [Vector3]s within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodetransformdecompose.html  
     */
    class VisualShaderNodeTransformDecompose extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeTransformDecompose;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeTransformDecompose;
    }
    namespace VisualShaderNodeTransformFunc {
        enum Function {
            /** Perform the inverse operation on the [Transform3D] matrix. */
            FUNC_INVERSE = 0,
            
            /** Perform the transpose operation on the [Transform3D] matrix. */
            FUNC_TRANSPOSE = 1,
            
            /** Represents the size of the [enum Function] enum. */
            FUNC_MAX = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeTransformFunc extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeTransformFunc extends __NameMapVisualShaderNode {
    }
    /** Computes a [Transform3D] function within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodetransformfunc.html  
     */
    class VisualShaderNodeTransformFunc extends VisualShaderNode {
        constructor(identifier?: any)
        /** The function to be computed. */
        get "function"(): int64
        set "function"(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeTransformFunc;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeTransformFunc;
    }
    namespace VisualShaderNodeTransformOp {
        enum Operator {
            /** Multiplies transform `a` by the transform `b`. */
            OP_AxB = 0,
            
            /** Multiplies transform `b` by the transform `a`. */
            OP_BxA = 1,
            
            /** Performs a component-wise multiplication of transform `a` by the transform `b`. */
            OP_AxB_COMP = 2,
            
            /** Performs a component-wise multiplication of transform `b` by the transform `a`. */
            OP_BxA_COMP = 3,
            
            /** Adds two transforms. */
            OP_ADD = 4,
            
            /** Subtracts the transform `a` from the transform `b`. */
            OP_A_MINUS_B = 5,
            
            /** Subtracts the transform `b` from the transform `a`. */
            OP_B_MINUS_A = 6,
            
            /** Divides the transform `a` by the transform `b`. */
            OP_A_DIV_B = 7,
            
            /** Divides the transform `b` by the transform `a`. */
            OP_B_DIV_A = 8,
            
            /** Represents the size of the [enum Operator] enum. */
            OP_MAX = 9,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeTransformOp extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeTransformOp extends __NameMapVisualShaderNode {
    }
    /** A [Transform3D] operator to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodetransformop.html  
     */
    class VisualShaderNodeTransformOp extends VisualShaderNode {
        constructor(identifier?: any)
        /** The type of the operation to be performed on the transforms. */
        get operator(): int64
        set operator(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeTransformOp;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeTransformOp;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeTransformParameter extends __RPCMapVisualShaderNodeParameter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeTransformParameter extends __NameMapVisualShaderNodeParameter {
    }
    /** A [Transform3D] parameter for use within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodetransformparameter.html  
     */
    class VisualShaderNodeTransformParameter extends VisualShaderNodeParameter {
        constructor(identifier?: any)
        /** Enables usage of the [member default_value]. */
        get default_value_enabled(): boolean
        set default_value_enabled(value: boolean)
        
        /** A default value to be assigned within the shader. */
        get default_value(): Transform3D
        set default_value(value: Transform3D)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeTransformParameter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeTransformParameter;
    }
    namespace VisualShaderNodeTransformVecMult {
        enum Operator {
            /** Multiplies transform `a` by the vector `b`. */
            OP_AxB = 0,
            
            /** Multiplies vector `b` by the transform `a`. */
            OP_BxA = 1,
            
            /** Multiplies transform `a` by the vector `b`, skipping the last row and column of the transform. */
            OP_3x3_AxB = 2,
            
            /** Multiplies vector `b` by the transform `a`, skipping the last row and column of the transform. */
            OP_3x3_BxA = 3,
            
            /** Represents the size of the [enum Operator] enum. */
            OP_MAX = 4,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeTransformVecMult extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeTransformVecMult extends __NameMapVisualShaderNode {
    }
    /** Multiplies a [Transform3D] and a [Vector3] within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodetransformvecmult.html  
     */
    class VisualShaderNodeTransformVecMult extends VisualShaderNode {
        constructor(identifier?: any)
        /** The multiplication type to be performed. */
        get operator(): int64
        set operator(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeTransformVecMult;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeTransformVecMult;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeUIntConstant extends __RPCMapVisualShaderNodeConstant {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeUIntConstant extends __NameMapVisualShaderNodeConstant {
    }
    /** An unsigned scalar integer constant to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeuintconstant.html  
     */
    class VisualShaderNodeUIntConstant extends VisualShaderNodeConstant {
        constructor(identifier?: any)
        /** An unsigned integer constant which represents a state of this node. */
        get constant(): int64
        set constant(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeUIntConstant;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeUIntConstant;
    }
    namespace VisualShaderNodeUIntFunc {
        enum Function {
            /** Negates the `x` using `-(x)`. */
            FUNC_NEGATE = 0,
            
            /** Returns the result of bitwise `NOT` operation on the integer. Translates to `~a` in the Godot Shader Language. */
            FUNC_BITWISE_NOT = 1,
            
            /** Represents the size of the [enum Function] enum. */
            FUNC_MAX = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeUIntFunc extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeUIntFunc extends __NameMapVisualShaderNode {
    }
    /** An unsigned scalar integer function to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeuintfunc.html  
     */
    class VisualShaderNodeUIntFunc extends VisualShaderNode {
        constructor(identifier?: any)
        /** A function to be applied to the scalar. */
        get "function"(): int64
        set "function"(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeUIntFunc;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeUIntFunc;
    }
    namespace VisualShaderNodeUIntOp {
        enum Operator {
            /** Sums two numbers using `a + b`. */
            OP_ADD = 0,
            
            /** Subtracts two numbers using `a - b`. */
            OP_SUB = 1,
            
            /** Multiplies two numbers using `a * b`. */
            OP_MUL = 2,
            
            /** Divides two numbers using `a / b`. */
            OP_DIV = 3,
            
            /** Calculates the remainder of two numbers using `a % b`. */
            OP_MOD = 4,
            
            /** Returns the greater of two numbers. Translates to `max(a, b)` in the Godot Shader Language. */
            OP_MAX = 5,
            
            /** Returns the lesser of two numbers. Translates to `max(a, b)` in the Godot Shader Language. */
            OP_MIN = 6,
            
            /** Returns the result of bitwise `AND` operation on the integer. Translates to `a & b` in the Godot Shader Language. */
            OP_BITWISE_AND = 7,
            
            /** Returns the result of bitwise `OR` operation for two integers. Translates to `a | b` in the Godot Shader Language. */
            OP_BITWISE_OR = 8,
            
            /** Returns the result of bitwise `XOR` operation for two integers. Translates to `a ^ b` in the Godot Shader Language. */
            OP_BITWISE_XOR = 9,
            
            /** Returns the result of bitwise left shift operation on the integer. Translates to `a << b` in the Godot Shader Language. */
            OP_BITWISE_LEFT_SHIFT = 10,
            
            /** Returns the result of bitwise right shift operation on the integer. Translates to `a >> b` in the Godot Shader Language. */
            OP_BITWISE_RIGHT_SHIFT = 11,
            
            /** Represents the size of the [enum Operator] enum. */
            OP_ENUM_SIZE = 12,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeUIntOp extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeUIntOp extends __NameMapVisualShaderNode {
    }
    /** An unsigned integer scalar operator to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeuintop.html  
     */
    class VisualShaderNodeUIntOp extends VisualShaderNode {
        constructor(identifier?: any)
        /** An operator to be applied to the inputs. */
        get operator(): int64
        set operator(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeUIntOp;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeUIntOp;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeUIntParameter extends __RPCMapVisualShaderNodeParameter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeUIntParameter extends __NameMapVisualShaderNodeParameter {
    }
    /** A visual shader node for shader parameter (uniform) of type unsigned [int].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeuintparameter.html  
     */
    class VisualShaderNodeUIntParameter extends VisualShaderNodeParameter {
        constructor(identifier?: any)
        /** If `true`, the node will have a custom default value. */
        get default_value_enabled(): boolean
        set default_value_enabled(value: boolean)
        
        /** Default value of this parameter, which will be used if not set externally. [member default_value_enabled] must be enabled; defaults to `0` otherwise. */
        get default_value(): int64
        set default_value(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeUIntParameter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeUIntParameter;
    }
    namespace VisualShaderNodeUVFunc {
        enum Function {
            /** Translates `uv` by using `scale` and `offset` values using the following formula: `uv = uv + offset * scale`. `uv` port is connected to `UV` built-in by default. */
            FUNC_PANNING = 0,
            
            /** Scales `uv` by using `scale` and `pivot` values using the following formula: `uv = (uv - pivot) * scale + pivot`. `uv` port is connected to `UV` built-in by default. */
            FUNC_SCALING = 1,
            
            /** Represents the size of the [enum Function] enum. */
            FUNC_MAX = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeUVFunc extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeUVFunc extends __NameMapVisualShaderNode {
    }
    /** Contains functions to modify texture coordinates (`uv`) to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeuvfunc.html  
     */
    class VisualShaderNodeUVFunc extends VisualShaderNode {
        constructor(identifier?: any)
        /** A function to be applied to the texture coordinates. */
        get "function"(): int64
        set "function"(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeUVFunc;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeUVFunc;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeUVPolarCoord extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeUVPolarCoord extends __NameMapVisualShaderNode {
    }
    /** A visual shader node that modifies the texture UV using polar coordinates.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeuvpolarcoord.html  
     */
    class VisualShaderNodeUVPolarCoord extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeUVPolarCoord;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeUVPolarCoord;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeVarying extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeVarying extends __NameMapVisualShaderNode {
    }
    /** A visual shader node that represents a "varying" shader value.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodevarying.html  
     */
    class VisualShaderNodeVarying extends VisualShaderNode {
        constructor(identifier?: any)
        /** Name of the variable. Must be unique. */
        get varying_name(): StringName
        set varying_name(value: StringName)
        
        /** Type of the variable. Determines where the variable can be accessed. */
        get varying_type(): int64
        set varying_type(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeVarying;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeVarying;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeVaryingGetter extends __RPCMapVisualShaderNodeVarying {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeVaryingGetter extends __NameMapVisualShaderNodeVarying {
    }
    /** A visual shader node that gets a value of a varying.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodevaryinggetter.html  
     */
    class VisualShaderNodeVaryingGetter extends VisualShaderNodeVarying {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeVaryingGetter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeVaryingGetter;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeVaryingSetter extends __RPCMapVisualShaderNodeVarying {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeVaryingSetter extends __NameMapVisualShaderNodeVarying {
    }
    /** A visual shader node that sets a value of a varying.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodevaryingsetter.html  
     */
    class VisualShaderNodeVaryingSetter extends VisualShaderNodeVarying {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeVaryingSetter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeVaryingSetter;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeVec2Constant extends __RPCMapVisualShaderNodeConstant {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeVec2Constant extends __NameMapVisualShaderNodeConstant {
    }
    /** A [Vector2] constant to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodevec2constant.html  
     */
    class VisualShaderNodeVec2Constant extends VisualShaderNodeConstant {
        constructor(identifier?: any)
        /** A [Vector2] constant which represents the state of this node. */
        get constant(): Vector2
        set constant(value: Vector2)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeVec2Constant;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeVec2Constant;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeVec2Parameter extends __RPCMapVisualShaderNodeParameter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeVec2Parameter extends __NameMapVisualShaderNodeParameter {
    }
    /** A [Vector2] parameter to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodevec2parameter.html  
     */
    class VisualShaderNodeVec2Parameter extends VisualShaderNodeParameter {
        constructor(identifier?: any)
        /** Enables usage of the [member default_value]. */
        get default_value_enabled(): boolean
        set default_value_enabled(value: boolean)
        
        /** A default value to be assigned within the shader. */
        get default_value(): Vector2
        set default_value(value: Vector2)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeVec2Parameter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeVec2Parameter;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeVec3Constant extends __RPCMapVisualShaderNodeConstant {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeVec3Constant extends __NameMapVisualShaderNodeConstant {
    }
    /** A [Vector3] constant to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodevec3constant.html  
     */
    class VisualShaderNodeVec3Constant extends VisualShaderNodeConstant {
        constructor(identifier?: any)
        /** A [Vector3] constant which represents the state of this node. */
        get constant(): Vector3
        set constant(value: Vector3)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeVec3Constant;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeVec3Constant;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeVec3Parameter extends __RPCMapVisualShaderNodeParameter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeVec3Parameter extends __NameMapVisualShaderNodeParameter {
    }
    /** A [Vector3] parameter to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodevec3parameter.html  
     */
    class VisualShaderNodeVec3Parameter extends VisualShaderNodeParameter {
        constructor(identifier?: any)
        /** Enables usage of the [member default_value]. */
        get default_value_enabled(): boolean
        set default_value_enabled(value: boolean)
        
        /** A default value to be assigned within the shader. */
        get default_value(): Vector3
        set default_value(value: Vector3)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeVec3Parameter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeVec3Parameter;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeVec4Constant extends __RPCMapVisualShaderNodeConstant {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeVec4Constant extends __NameMapVisualShaderNodeConstant {
    }
    /** A 4D vector constant to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodevec4constant.html  
     */
    class VisualShaderNodeVec4Constant extends VisualShaderNodeConstant {
        constructor(identifier?: any)
        /** A 4D vector (represented as a [Quaternion]) constant which represents the state of this node. */
        get constant(): Quaternion
        set constant(value: Quaternion)
        get constant_v4(): Vector4
        set constant_v4(value: Vector4)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeVec4Constant;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeVec4Constant;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeVec4Parameter extends __RPCMapVisualShaderNodeParameter {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeVec4Parameter extends __NameMapVisualShaderNodeParameter {
    }
    /** A 4D vector parameter to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodevec4parameter.html  
     */
    class VisualShaderNodeVec4Parameter extends VisualShaderNodeParameter {
        constructor(identifier?: any)
        /** Enables usage of the [member default_value]. */
        get default_value_enabled(): boolean
        set default_value_enabled(value: boolean)
        
        /** A default value to be assigned within the shader. */
        get default_value(): Vector4
        set default_value(value: Vector4)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeVec4Parameter;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeVec4Parameter;
    }
    namespace VisualShaderNodeVectorBase {
        enum OpType {
            /** A 2D vector type. */
            OP_TYPE_VECTOR_2D = 0,
            
            /** A 3D vector type. */
            OP_TYPE_VECTOR_3D = 1,
            
            /** A 4D vector type. */
            OP_TYPE_VECTOR_4D = 2,
            
            /** Represents the size of the [enum OpType] enum. */
            OP_TYPE_MAX = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeVectorBase extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeVectorBase extends __NameMapVisualShaderNode {
    }
    /** A base type for the nodes that perform vector operations within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodevectorbase.html  
     */
    class VisualShaderNodeVectorBase extends VisualShaderNode {
        constructor(identifier?: any)
        /** A vector type that this operation is performed on. */
        get op_type(): int64
        set op_type(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeVectorBase;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeVectorBase;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeVectorCompose extends __RPCMapVisualShaderNodeVectorBase {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeVectorCompose extends __NameMapVisualShaderNodeVectorBase {
    }
    /** Composes a [Vector2], [Vector3] or 4D vector (represented as a [Quaternion]) from scalars within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodevectorcompose.html  
     */
    class VisualShaderNodeVectorCompose extends VisualShaderNodeVectorBase {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeVectorCompose;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeVectorCompose;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeVectorDecompose extends __RPCMapVisualShaderNodeVectorBase {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeVectorDecompose extends __NameMapVisualShaderNodeVectorBase {
    }
    /** Decomposes a [Vector2], [Vector3] or 4D vector (represented as a [Quaternion]) into scalars within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodevectordecompose.html  
     */
    class VisualShaderNodeVectorDecompose extends VisualShaderNodeVectorBase {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeVectorDecompose;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeVectorDecompose;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeVectorDistance extends __RPCMapVisualShaderNodeVectorBase {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeVectorDistance extends __NameMapVisualShaderNodeVectorBase {
    }
    /** Returns the distance between two points. To be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodevectordistance.html  
     */
    class VisualShaderNodeVectorDistance extends VisualShaderNodeVectorBase {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeVectorDistance;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeVectorDistance;
    }
    namespace VisualShaderNodeVectorFunc {
        enum Function {
            /** Normalizes the vector so that it has a length of `1` but points in the same direction. */
            FUNC_NORMALIZE = 0,
            
            /** Clamps the value between `0.0` and `1.0`. */
            FUNC_SATURATE = 1,
            
            /** Returns the opposite value of the parameter. */
            FUNC_NEGATE = 2,
            
            /** Returns `1/vector`. */
            FUNC_RECIPROCAL = 3,
            
            /** Returns the absolute value of the parameter. */
            FUNC_ABS = 4,
            
            /** Returns the arc-cosine of the parameter. */
            FUNC_ACOS = 5,
            
            /** Returns the inverse hyperbolic cosine of the parameter. */
            FUNC_ACOSH = 6,
            
            /** Returns the arc-sine of the parameter. */
            FUNC_ASIN = 7,
            
            /** Returns the inverse hyperbolic sine of the parameter. */
            FUNC_ASINH = 8,
            
            /** Returns the arc-tangent of the parameter. */
            FUNC_ATAN = 9,
            
            /** Returns the inverse hyperbolic tangent of the parameter. */
            FUNC_ATANH = 10,
            
            /** Finds the nearest integer that is greater than or equal to the parameter. */
            FUNC_CEIL = 11,
            
            /** Returns the cosine of the parameter. */
            FUNC_COS = 12,
            
            /** Returns the hyperbolic cosine of the parameter. */
            FUNC_COSH = 13,
            
            /** Converts a quantity in radians to degrees. */
            FUNC_DEGREES = 14,
            
            /** Base-e Exponential. */
            FUNC_EXP = 15,
            
            /** Base-2 Exponential. */
            FUNC_EXP2 = 16,
            
            /** Finds the nearest integer less than or equal to the parameter. */
            FUNC_FLOOR = 17,
            
            /** Computes the fractional part of the argument. */
            FUNC_FRACT = 18,
            
            /** Returns the inverse of the square root of the parameter. */
            FUNC_INVERSE_SQRT = 19,
            
            /** Natural logarithm. */
            FUNC_LOG = 20,
            
            /** Base-2 logarithm. */
            FUNC_LOG2 = 21,
            
            /** Converts a quantity in degrees to radians. */
            FUNC_RADIANS = 22,
            
            /** Finds the nearest integer to the parameter. */
            FUNC_ROUND = 23,
            
            /** Finds the nearest even integer to the parameter. */
            FUNC_ROUNDEVEN = 24,
            
            /** Extracts the sign of the parameter, i.e. returns `-1` if the parameter is negative, `1` if it's positive and `0` otherwise. */
            FUNC_SIGN = 25,
            
            /** Returns the sine of the parameter. */
            FUNC_SIN = 26,
            
            /** Returns the hyperbolic sine of the parameter. */
            FUNC_SINH = 27,
            
            /** Returns the square root of the parameter. */
            FUNC_SQRT = 28,
            
            /** Returns the tangent of the parameter. */
            FUNC_TAN = 29,
            
            /** Returns the hyperbolic tangent of the parameter. */
            FUNC_TANH = 30,
            
            /** Returns a value equal to the nearest integer to the parameter whose absolute value is not larger than the absolute value of the parameter. */
            FUNC_TRUNC = 31,
            
            /** Returns `1.0 - vector`. */
            FUNC_ONEMINUS = 32,
            
            /** Represents the size of the [enum Function] enum. */
            FUNC_MAX = 33,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeVectorFunc extends __RPCMapVisualShaderNodeVectorBase {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeVectorFunc extends __NameMapVisualShaderNodeVectorBase {
    }
    /** A vector function to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodevectorfunc.html  
     */
    class VisualShaderNodeVectorFunc extends VisualShaderNodeVectorBase {
        constructor(identifier?: any)
        /** The function to be performed. */
        get "function"(): int64
        set "function"(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeVectorFunc;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeVectorFunc;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeVectorLen extends __RPCMapVisualShaderNodeVectorBase {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeVectorLen extends __NameMapVisualShaderNodeVectorBase {
    }
    /** Returns the length of a [Vector3] within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodevectorlen.html  
     */
    class VisualShaderNodeVectorLen extends VisualShaderNodeVectorBase {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeVectorLen;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeVectorLen;
    }
    namespace VisualShaderNodeVectorOp {
        enum Operator {
            /** Adds two vectors. */
            OP_ADD = 0,
            
            /** Subtracts a vector from a vector. */
            OP_SUB = 1,
            
            /** Multiplies two vectors. */
            OP_MUL = 2,
            
            /** Divides vector by vector. */
            OP_DIV = 3,
            
            /** Returns the remainder of the two vectors. */
            OP_MOD = 4,
            
            /** Returns the value of the first parameter raised to the power of the second, for each component of the vectors. */
            OP_POW = 5,
            
            /** Returns the greater of two values, for each component of the vectors. */
            OP_MAX = 6,
            
            /** Returns the lesser of two values, for each component of the vectors. */
            OP_MIN = 7,
            
            /** Calculates the cross product of two vectors. */
            OP_CROSS = 8,
            
            /** Returns the arc-tangent of the parameters. */
            OP_ATAN2 = 9,
            
            /** Returns the vector that points in the direction of reflection. `a` is incident vector and `b` is the normal vector. */
            OP_REFLECT = 10,
            
            /** Vector step operator. Returns `0.0` if `a` is smaller than `b` and `1.0` otherwise. */
            OP_STEP = 11,
            
            /** Represents the size of the [enum Operator] enum. */
            OP_ENUM_SIZE = 12,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeVectorOp extends __RPCMapVisualShaderNodeVectorBase {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeVectorOp extends __NameMapVisualShaderNodeVectorBase {
    }
    /** A vector operator to be used within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodevectorop.html  
     */
    class VisualShaderNodeVectorOp extends VisualShaderNodeVectorBase {
        constructor(identifier?: any)
        /** The operator to be used. */
        get operator(): int64
        set operator(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeVectorOp;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeVectorOp;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeVectorRefract extends __RPCMapVisualShaderNodeVectorBase {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeVectorRefract extends __NameMapVisualShaderNodeVectorBase {
    }
    /** Returns the vector that points in the direction of refraction. For use within the visual shader graph.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodevectorrefract.html  
     */
    class VisualShaderNodeVectorRefract extends VisualShaderNodeVectorBase {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeVectorRefract;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeVectorRefract;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVisualShaderNodeWorldPositionFromDepth extends __RPCMapVisualShaderNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVisualShaderNodeWorldPositionFromDepth extends __NameMapVisualShaderNode {
    }
    /** A visual shader node that calculates the position of the pixel in world space using the depth texture.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_visualshadernodeworldpositionfromdepth.html  
     */
    class VisualShaderNodeWorldPositionFromDepth extends VisualShaderNode {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVisualShaderNodeWorldPositionFromDepth;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVisualShaderNodeWorldPositionFromDepth;
    }
    namespace VoxelGI {
        enum Subdiv {
            /** Use 64 subdivisions. This is the lowest quality setting, but the fastest. Use it if you can, but especially use it on lower-end hardware. */
            SUBDIV_64 = 0,
            
            /** Use 128 subdivisions. This is the default quality setting. */
            SUBDIV_128 = 1,
            
            /** Use 256 subdivisions. */
            SUBDIV_256 = 2,
            
            /** Use 512 subdivisions. This is the highest quality setting, but the slowest. On lower-end hardware, this could cause the GPU to stall. */
            SUBDIV_512 = 3,
            
            /** Represents the size of the [enum Subdiv] enum. */
            SUBDIV_MAX = 4,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVoxelGI extends __RPCMapVisualInstance3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVoxelGI extends __NameMapVisualInstance3D {
    }
    /** Real-time global illumination (GI) probe.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_voxelgi.html  
     */
    class VoxelGI<Map extends NodePathMap = any> extends VisualInstance3D<Map> {
        constructor(identifier?: any)
        /** Bakes the effect from all [GeometryInstance3D]s marked with [constant GeometryInstance3D.GI_MODE_STATIC] and [Light3D]s marked with either [constant Light3D.BAKE_STATIC] or [constant Light3D.BAKE_DYNAMIC]. If [param create_visual_debug] is `true`, after baking the light, this will generate a [MultiMesh] that has a cube representing each solid cell with each cube colored to the cell's albedo color. This can be used to visualize the [VoxelGI]'s data and debug any issues that may be occurring.  
         *      
         *  **Note:** [method bake] works from the editor and in exported projects. This makes it suitable for procedurally generated or user-built levels. Baking a [VoxelGI] node generally takes from 5 to 20 seconds in most scenes. Reducing [member subdiv] can speed up baking.  
         *      
         *  **Note:** [GeometryInstance3D]s and [Light3D]s must be fully ready before [method bake] is called. If you are procedurally creating those and some meshes or lights are missing from your baked [VoxelGI], use `call_deferred("bake")` instead of calling [method bake] directly.  
         */
        bake(from_node?: Node, create_visual_debug?: boolean /* = false */): void
        
        /** Calls [method bake] with `create_visual_debug` enabled. */
        debug_bake(): void
        
        /** Number of times to subdivide the grid that the [VoxelGI] operates on. A higher number results in finer detail and thus higher visual quality, while lower numbers result in better performance. */
        get subdiv(): int64
        set subdiv(value: int64)
        
        /** The size of the area covered by the [VoxelGI]. This must be `1.0` or greater on each axis.  
         *      
         *  **Note:** If you make the size larger without increasing the number of subdivisions with [member subdiv], the size of each cell will increase and result in less detailed lighting.  
         */
        get size(): Vector3
        set size(value: Vector3)
        
        /** The [CameraAttributes] resource that specifies exposure levels to bake at. Auto-exposure and non exposure properties will be ignored. Exposure settings should be used to reduce the dynamic range present when baking. If exposure is too high, the [VoxelGI] will have banding artifacts or may have over-exposure artifacts. */
        get camera_attributes(): null | CameraAttributesPractical | CameraAttributesPhysical
        set camera_attributes(value: null | CameraAttributesPractical | CameraAttributesPhysical)
        
        /** The [VoxelGIData] resource that holds the data for this [VoxelGI]. */
        get data(): null | VoxelGIData
        set data(value: null | VoxelGIData)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVoxelGI;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVoxelGI;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapVoxelGIData extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapVoxelGIData extends __NameMapResource {
    }
    /** Contains baked voxel global illumination data for use in a [VoxelGI] node.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_voxelgidata.html  
     */
    class VoxelGIData extends Resource {
        constructor(identifier?: any)
        allocate(to_cell_xform: Transform3D, aabb: AABB, octree_size: Vector3, octree_cells: PackedByteArray | byte[] | ArrayBuffer, data_cells: PackedByteArray | byte[] | ArrayBuffer, distance_field: PackedByteArray | byte[] | ArrayBuffer, level_counts: PackedInt32Array | int32[]): void
        
        /** Returns the bounds of the baked voxel data as an [AABB], which should match [member VoxelGI.size] after being baked (which only contains the size as a [Vector3]).  
         *      
         *  **Note:** If the size was modified without baking the VoxelGI data, then the value of [method get_bounds] and [member VoxelGI.size] will not match.  
         */
        get_bounds(): AABB
        get_octree_size(): Vector3
        get_to_cell_xform(): Transform3D
        get_octree_cells(): PackedByteArray
        get_data_cells(): PackedByteArray
        get_level_counts(): PackedInt32Array
        get _data(): GDictionary
        set _data(value: GDictionary)
        
        /** The dynamic range to use (`1.0` represents a low dynamic range scene brightness). Higher values can be used to provide brighter indirect lighting, at the cost of more visible color banding in dark areas (both in indirect lighting and reflections). To avoid color banding, it's recommended to use the lowest value that does not result in visible light clipping. */
        get dynamic_range(): float64
        set dynamic_range(value: float64)
        
        /** The energy of the indirect lighting and reflections produced by the [VoxelGI] node. Higher values result in brighter indirect lighting. If indirect lighting looks too flat, try decreasing [member propagation] while increasing [member energy] at the same time. See also [member use_two_bounces] which influences the indirect lighting's effective brightness. */
        get energy(): float64
        set energy(value: float64)
        
        /** The normal bias to use for indirect lighting and reflections. Higher values reduce self-reflections visible in non-rough materials, at the cost of more visible light leaking and flatter-looking indirect lighting. To prioritize hiding self-reflections over lighting quality, set [member bias] to `0.0` and [member normal_bias] to a value between `1.0` and `2.0`. */
        get bias(): float64
        set bias(value: float64)
        
        /** The normal bias to use for indirect lighting and reflections. Higher values reduce self-reflections visible in non-rough materials, at the cost of more visible light leaking and flatter-looking indirect lighting. See also [member bias]. To prioritize hiding self-reflections over lighting quality, set [member bias] to `0.0` and [member normal_bias] to a value between `1.0` and `2.0`. */
        get normal_bias(): float64
        set normal_bias(value: float64)
        
        /** The multiplier to use when light bounces off a surface. Higher values result in brighter indirect lighting. If indirect lighting looks too flat, try decreasing [member propagation] while increasing [member energy] at the same time. See also [member use_two_bounces] which influences the indirect lighting's effective brightness. */
        get propagation(): float64
        set propagation(value: float64)
        
        /** If `true`, performs two bounces of indirect lighting instead of one. This makes indirect lighting look more natural and brighter at a small performance cost. The second bounce is also visible in reflections. If the scene appears too bright after enabling [member use_two_bounces], adjust [member propagation] and [member energy]. */
        get use_two_bounces(): boolean
        set use_two_bounces(value: boolean)
        
        /** If `true`, [Environment] lighting is ignored by the [VoxelGI] node. If `false`, [Environment] lighting is taken into account by the [VoxelGI] node. [Environment] lighting updates in real-time, which means it can be changed without having to bake the [VoxelGI] node again. */
        get interior(): boolean
        set interior(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapVoxelGIData;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapVoxelGIData;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapWeakRef extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapWeakRef extends __NameMapRefCounted {
    }
    /** Holds an [Object]. If the object is [RefCounted], it doesn't update the reference count.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_weakref.html  
     */
    class WeakRef extends RefCounted {
        constructor(identifier?: any)
        /** Returns the [Object] this weakref is referring to. Returns `null` if that object no longer exists. */
        get_ref(): any
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapWeakRef;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapWeakRef;
    }
    namespace WebRTCDataChannel {
        enum WriteMode {
            /** Tells the channel to send data over this channel as text. An external peer (non-Godot) would receive this as a string. */
            WRITE_MODE_TEXT = 0,
            
            /** Tells the channel to send data over this channel as binary. An external peer (non-Godot) would receive this as array buffer or blob. */
            WRITE_MODE_BINARY = 1,
        }
        enum ChannelState {
            /** The channel was created, but it's still trying to connect. */
            STATE_CONNECTING = 0,
            
            /** The channel is currently open, and data can flow over it. */
            STATE_OPEN = 1,
            
            /** The channel is being closed, no new messages will be accepted, but those already in queue will be flushed. */
            STATE_CLOSING = 2,
            
            /** The channel was closed, or connection failed. */
            STATE_CLOSED = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapWebRTCDataChannel extends __RPCMapPacketPeer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapWebRTCDataChannel extends __NameMapPacketPeer {
    }
    /** @link https://docs.godotengine.org/en/4.6/classes/class_webrtcdatachannel.html */
    class WebRTCDataChannel extends PacketPeer {
        constructor(identifier?: any)
        /** Reserved, but not used for now. */
        poll(): Error
        
        /** Closes this data channel, notifying the other peer. */
        close(): void
        
        /** Returns `true` if the last received packet was transferred as text. See [member write_mode]. */
        was_string_packet(): boolean
        
        /** Returns the current state of this channel. */
        get_ready_state(): WebRTCDataChannel.ChannelState
        
        /** Returns the label assigned to this channel during creation. */
        get_label(): string
        
        /** Returns `true` if this channel was created with ordering enabled (default). */
        is_ordered(): boolean
        
        /** Returns the ID assigned to this channel during creation (or auto-assigned during negotiation).  
         *  If the channel is not negotiated out-of-band the ID will only be available after the connection is established (will return `65535` until then).  
         */
        get_id(): int64
        
        /** Returns the `maxPacketLifeTime` value assigned to this channel during creation.  
         *  Will be `65535` if not specified.  
         */
        get_max_packet_life_time(): int64
        
        /** Returns the `maxRetransmits` value assigned to this channel during creation.  
         *  Will be `65535` if not specified.  
         */
        get_max_retransmits(): int64
        
        /** Returns the sub-protocol assigned to this channel during creation. An empty string if not specified. */
        get_protocol(): string
        
        /** Returns `true` if this channel was created with out-of-band configuration. */
        is_negotiated(): boolean
        
        /** Returns the number of bytes currently queued to be sent over this channel. */
        get_buffered_amount(): int64
        
        /** The transfer mode to use when sending outgoing packet. Either text or binary. */
        get write_mode(): int64
        set write_mode(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapWebRTCDataChannel;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapWebRTCDataChannel;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapWebRTCDataChannelExtension extends __RPCMapWebRTCDataChannel {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapWebRTCDataChannelExtension extends __NameMapWebRTCDataChannel {
    }
    /** @link https://docs.godotengine.org/en/4.6/classes/class_webrtcdatachannelextension.html */
    class WebRTCDataChannelExtension extends WebRTCDataChannel {
        constructor(identifier?: any)
        /* gdvirtual */ _get_packet(r_buffer: int64, r_buffer_size: int64): Error
        /* gdvirtual */ _put_packet(p_buffer: int64, p_buffer_size: int64): Error
        /* gdvirtual */ _get_available_packet_count(): int64
        /* gdvirtual */ _get_max_packet_size(): int64
        /* gdvirtual */ _poll(): Error
        /* gdvirtual */ _close(): void
        /* gdvirtual */ _set_write_mode(p_write_mode: WebRTCDataChannel.WriteMode): void
        /* gdvirtual */ _get_write_mode(): WebRTCDataChannel.WriteMode
        /* gdvirtual */ _was_string_packet(): boolean
        /* gdvirtual */ _get_ready_state(): WebRTCDataChannel.ChannelState
        /* gdvirtual */ _get_label(): string
        /* gdvirtual */ _is_ordered(): boolean
        /* gdvirtual */ _get_id(): int64
        /* gdvirtual */ _get_max_packet_life_time(): int64
        /* gdvirtual */ _get_max_retransmits(): int64
        /* gdvirtual */ _get_protocol(): string
        /* gdvirtual */ _is_negotiated(): boolean
        /* gdvirtual */ _get_buffered_amount(): int64
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapWebRTCDataChannelExtension;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapWebRTCDataChannelExtension;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapWebRTCMultiplayerPeer extends __RPCMapMultiplayerPeer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapWebRTCMultiplayerPeer extends __NameMapMultiplayerPeer {
    }
    /** A simple interface to create a peer-to-peer mesh network composed of [WebRTCPeerConnection] that is compatible with the [MultiplayerAPI].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_webrtcmultiplayerpeer.html  
     */
    class WebRTCMultiplayerPeer extends MultiplayerPeer {
        constructor(identifier?: any)
        /** Initialize the multiplayer peer as a server (with unique ID of `1`). This mode enables [method MultiplayerPeer.is_server_relay_supported], allowing the upper [MultiplayerAPI] layer to perform peer exchange and packet relaying.  
         *  You can optionally specify a [param channels_config] array of [enum MultiplayerPeer.TransferMode] which will be used to create extra channels (WebRTC only supports one transfer mode per channel).  
         */
        create_server(channels_config?: GArray): Error
        
        /** Initialize the multiplayer peer as a client with the given [param peer_id] (must be between 2 and 2147483647). In this mode, you should only call [method add_peer] once and with [param peer_id] of `1`. This mode enables [method MultiplayerPeer.is_server_relay_supported], allowing the upper [MultiplayerAPI] layer to perform peer exchange and packet relaying.  
         *  You can optionally specify a [param channels_config] array of [enum MultiplayerPeer.TransferMode] which will be used to create extra channels (WebRTC only supports one transfer mode per channel).  
         */
        create_client(peer_id: int64, channels_config?: GArray): Error
        
        /** Initialize the multiplayer peer as a mesh (i.e. all peers connect to each other) with the given [param peer_id] (must be between 1 and 2147483647). */
        create_mesh(peer_id: int64, channels_config?: GArray): Error
        
        /** Add a new peer to the mesh with the given [param peer_id]. The [WebRTCPeerConnection] must be in state [constant WebRTCPeerConnection.STATE_NEW].  
         *  Three channels will be created for reliable, unreliable, and ordered transport. The value of [param unreliable_lifetime] will be passed to the `"maxPacketLifetime"` option when creating unreliable and ordered channels (see [method WebRTCPeerConnection.create_data_channel]).  
         */
        add_peer(peer: WebRTCPeerConnection, peer_id: int64, unreliable_lifetime?: int64 /* = 1 */): Error
        
        /** Remove the peer with given [param peer_id] from the mesh. If the peer was connected, and [signal MultiplayerPeer.peer_connected] was emitted for it, then [signal MultiplayerPeer.peer_disconnected] will be emitted. */
        remove_peer(peer_id: int64): void
        
        /** Returns `true` if the given [param peer_id] is in the peers map (it might not be connected though). */
        has_peer(peer_id: int64): boolean
        
        /** Returns a dictionary representation of the peer with given [param peer_id] with three keys. `"connection"` containing the [WebRTCPeerConnection] to this peer, `"channels"` an array of three [WebRTCDataChannel], and `"connected"` a boolean representing if the peer connection is currently connected (all three channels are open). */
        get_peer(peer_id: int64): GDictionary
        
        /** Returns a dictionary which keys are the peer ids and values the peer representation as in [method get_peer]. */
        get_peers(): GDictionary
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapWebRTCMultiplayerPeer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapWebRTCMultiplayerPeer;
    }
    namespace WebRTCPeerConnection {
        enum ConnectionState {
            /** The connection is new, data channels and an offer can be created in this state. */
            STATE_NEW = 0,
            
            /** The peer is connecting, ICE is in progress, none of the transports has failed. */
            STATE_CONNECTING = 1,
            
            /** The peer is connected, all ICE transports are connected. */
            STATE_CONNECTED = 2,
            
            /** At least one ICE transport is disconnected. */
            STATE_DISCONNECTED = 3,
            
            /** One or more of the ICE transports failed. */
            STATE_FAILED = 4,
            
            /** The peer connection is closed (after calling [method close] for example). */
            STATE_CLOSED = 5,
        }
        enum GatheringState {
            /** The peer connection was just created and hasn't done any networking yet. */
            GATHERING_STATE_NEW = 0,
            
            /** The ICE agent is in the process of gathering candidates for the connection. */
            GATHERING_STATE_GATHERING = 1,
            
            /** The ICE agent has finished gathering candidates. If something happens that requires collecting new candidates, such as a new interface being added or the addition of a new ICE server, the state will revert to gathering to gather those candidates. */
            GATHERING_STATE_COMPLETE = 2,
        }
        enum SignalingState {
            /** There is no ongoing exchange of offer and answer underway. This may mean that the [WebRTCPeerConnection] is new ([constant STATE_NEW]) or that negotiation is complete and a connection has been established ([constant STATE_CONNECTED]). */
            SIGNALING_STATE_STABLE = 0,
            
            /** The local peer has called [method set_local_description], passing in SDP representing an offer (usually created by calling [method create_offer]), and the offer has been applied successfully. */
            SIGNALING_STATE_HAVE_LOCAL_OFFER = 1,
            
            /** The remote peer has created an offer and used the signaling server to deliver it to the local peer, which has set the offer as the remote description by calling [method set_remote_description]. */
            SIGNALING_STATE_HAVE_REMOTE_OFFER = 2,
            
            /** The offer sent by the remote peer has been applied and an answer has been created and applied by calling [method set_local_description]. This provisional answer describes the supported media formats and so forth, but may not have a complete set of ICE candidates included. Further candidates will be delivered separately later. */
            SIGNALING_STATE_HAVE_LOCAL_PRANSWER = 3,
            
            /** A provisional answer has been received and successfully applied in response to an offer previously sent and established by calling [method set_local_description]. */
            SIGNALING_STATE_HAVE_REMOTE_PRANSWER = 4,
            
            /** The [WebRTCPeerConnection] has been closed. */
            SIGNALING_STATE_CLOSED = 5,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapWebRTCPeerConnection extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapWebRTCPeerConnection extends __NameMapRefCounted {
    }
    /** Interface to a WebRTC peer connection.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_webrtcpeerconnection.html  
     */
    class WebRTCPeerConnection extends RefCounted {
        constructor(identifier?: any)
        /** Sets the [param extension_class] as the default [WebRTCPeerConnectionExtension] returned when creating a new [WebRTCPeerConnection]. */
        static set_default_extension(extension_class: StringName): void
        
        /** Re-initialize this peer connection, closing any previously active connection, and going back to state [constant STATE_NEW]. A dictionary of [param configuration] options can be passed to configure the peer connection.  
         *  Valid [param configuration] options are:  
         *    
         */
        initialize(configuration?: GDictionary /* = new GDictionary() */): Error
        
        /** Returns a new [WebRTCDataChannel] (or `null` on failure) with given [param label] and optionally configured via the [param options] dictionary. This method can only be called when the connection is in state [constant STATE_NEW].  
         *  There are two ways to create a working data channel: either call [method create_data_channel] on only one of the peer and listen to [signal data_channel_received] on the other, or call [method create_data_channel] on both peers, with the same values, and the `"negotiated"` option set to `true`.  
         *  Valid [param options] are:  
         *    
         *      
         *  **Note:** You must keep a reference to channels created this way, or it will be closed.  
         */
        create_data_channel(label: string, options?: GDictionary /* = new GDictionary() */): WebRTCDataChannel
        
        /** Creates a new SDP offer to start a WebRTC connection with a remote peer. At least one [WebRTCDataChannel] must have been created before calling this method.  
         *  If this functions returns [constant OK], [signal session_description_created] will be called when the session is ready to be sent.  
         */
        create_offer(): Error
        
        /** Sets the SDP description of the local peer. This should be called in response to [signal session_description_created].  
         *  After calling this function the peer will start emitting [signal ice_candidate_created] (unless an [enum Error] different from [constant OK] is returned).  
         */
        set_local_description(type: string, sdp: string): Error
        
        /** Sets the SDP description of the remote peer. This should be called with the values generated by a remote peer and received over the signaling server.  
         *  If [param type] is `"offer"` the peer will emit [signal session_description_created] with the appropriate answer.  
         *  If [param type] is `"answer"` the peer will start emitting [signal ice_candidate_created].  
         */
        set_remote_description(type: string, sdp: string): Error
        
        /** Add an ice candidate generated by a remote peer (and received over the signaling server). See [signal ice_candidate_created]. */
        add_ice_candidate(media: string, index: int64, name: string): Error
        
        /** Call this method frequently (e.g. in [method Node._process] or [method Node._physics_process]) to properly receive signals. */
        poll(): Error
        
        /** Close the peer connection and all data channels associated with it.  
         *      
         *  **Note:** You cannot reuse this object for a new connection unless you call [method initialize].  
         */
        close(): void
        
        /** Returns the connection state. */
        get_connection_state(): WebRTCPeerConnection.ConnectionState
        
        /** Returns the ICE [enum GatheringState] of the connection. This lets you detect, for example, when collection of ICE candidates has finished. */
        get_gathering_state(): WebRTCPeerConnection.GatheringState
        
        /** Returns the signaling state on the local end of the connection while connecting or reconnecting to another peer. */
        get_signaling_state(): WebRTCPeerConnection.SignalingState
        
        /** Emitted after a successful call to [method create_offer] or [method set_remote_description] (when it generates an answer). The parameters are meant to be passed to [method set_local_description] on this object, and sent to the remote peer over the signaling server. */
        readonly session_description_created: Signal<(type: string, sdp: string) => void>
        
        /** Emitted when a new ICE candidate has been created. The three parameters are meant to be passed to the remote peer over the signaling server. */
        readonly ice_candidate_created: Signal<(media: string, index: int64, name: string) => void>
        
        /** Emitted when a new in-band channel is received, i.e. when the channel was created with `negotiated: false` (default).  
         *  The object will be an instance of [WebRTCDataChannel]. You must keep a reference of it or it will be closed automatically. See [method create_data_channel].  
         */
        readonly data_channel_received: Signal<(channel: WebRTCDataChannel) => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapWebRTCPeerConnection;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapWebRTCPeerConnection;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapWebRTCPeerConnectionExtension extends __RPCMapWebRTCPeerConnection {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapWebRTCPeerConnectionExtension extends __NameMapWebRTCPeerConnection {
    }
    /** @link https://docs.godotengine.org/en/4.6/classes/class_webrtcpeerconnectionextension.html */
    class WebRTCPeerConnectionExtension extends WebRTCPeerConnection {
        constructor(identifier?: any)
        /* gdvirtual */ _get_connection_state(): WebRTCPeerConnection.ConnectionState
        /* gdvirtual */ _get_gathering_state(): WebRTCPeerConnection.GatheringState
        /* gdvirtual */ _get_signaling_state(): WebRTCPeerConnection.SignalingState
        /* gdvirtual */ _initialize(p_config: GDictionary): Error
        /* gdvirtual */ _create_data_channel(p_label: string, p_config: GDictionary): null | WebRTCDataChannel
        /* gdvirtual */ _create_offer(): Error
        /* gdvirtual */ _set_remote_description(p_type: string, p_sdp: string): Error
        /* gdvirtual */ _set_local_description(p_type: string, p_sdp: string): Error
        /* gdvirtual */ _add_ice_candidate(p_sdp_mid_name: string, p_sdp_mline_index: int64, p_sdp_name: string): Error
        /* gdvirtual */ _poll(): Error
        /* gdvirtual */ _close(): void
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapWebRTCPeerConnectionExtension;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapWebRTCPeerConnectionExtension;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapWebSocketMultiplayerPeer extends __RPCMapMultiplayerPeer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapWebSocketMultiplayerPeer extends __NameMapMultiplayerPeer {
    }
    /** Base class for WebSocket server and client.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_websocketmultiplayerpeer.html  
     */
    class WebSocketMultiplayerPeer extends MultiplayerPeer {
        constructor(identifier?: any)
        /** Starts a new multiplayer client connecting to the given [param url]. TLS certificates will be verified against the hostname when connecting using the `wss://` protocol. You can pass the optional [param tls_client_options] parameter to customize the trusted certification authorities, or disable the common name verification. See [method TLSOptions.client] and [method TLSOptions.client_unsafe].  
         *      
         *  **Note:** It is recommended to specify the scheme part of the URL, i.e. the [param url] should start with either `ws://` or `wss://`.  
         */
        create_client(url: string, tls_client_options?: TLSOptions): Error
        
        /** Starts a new multiplayer server listening on the given [param port]. You can optionally specify a [param bind_address], and provide valid [param tls_server_options] to use TLS. See [method TLSOptions.server]. */
        create_server(port: int64, bind_address?: string /* = '*' */, tls_server_options?: TLSOptions): Error
        
        /** Returns the [WebSocketPeer] associated to the given [param peer_id]. */
        get_peer(peer_id: int64): null | WebSocketPeer
        
        /** Returns the IP address of the given peer. */
        get_peer_address(id: int64): string
        
        /** Returns the remote port of the given peer. */
        get_peer_port(id: int64): int64
        
        /** The supported WebSocket sub-protocols. See [member WebSocketPeer.supported_protocols] for more details. */
        get supported_protocols(): PackedStringArray
        set supported_protocols(value: PackedStringArray | string[])
        
        /** The extra headers to use during handshake. See [member WebSocketPeer.handshake_headers] for more details. */
        get handshake_headers(): PackedStringArray
        set handshake_headers(value: PackedStringArray | string[])
        
        /** The inbound buffer size for connected peers. See [member WebSocketPeer.inbound_buffer_size] for more details. */
        get inbound_buffer_size(): int64
        set inbound_buffer_size(value: int64)
        
        /** The outbound buffer size for connected peers. See [member WebSocketPeer.outbound_buffer_size] for more details. */
        get outbound_buffer_size(): int64
        set outbound_buffer_size(value: int64)
        
        /** The maximum time each peer can stay in a connecting state before being dropped. */
        get handshake_timeout(): float64
        set handshake_timeout(value: float64)
        
        /** The maximum number of queued packets for connected peers. See [member WebSocketPeer.max_queued_packets] for more details. */
        get max_queued_packets(): int64
        set max_queued_packets(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapWebSocketMultiplayerPeer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapWebSocketMultiplayerPeer;
    }
    namespace WebSocketPeer {
        enum WriteMode {
            /** Specifies that WebSockets messages should be transferred as text payload (only valid UTF-8 is allowed). */
            WRITE_MODE_TEXT = 0,
            
            /** Specifies that WebSockets messages should be transferred as binary payload (any byte combination is allowed). */
            WRITE_MODE_BINARY = 1,
        }
        enum State {
            /** Socket has been created. The connection is not yet open. */
            STATE_CONNECTING = 0,
            
            /** The connection is open and ready to communicate. */
            STATE_OPEN = 1,
            
            /** The connection is in the process of closing. This means a close request has been sent to the remote peer but confirmation has not been received. */
            STATE_CLOSING = 2,
            
            /** The connection is closed or couldn't be opened. */
            STATE_CLOSED = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapWebSocketPeer extends __RPCMapPacketPeer {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapWebSocketPeer extends __NameMapPacketPeer {
    }
    /** A WebSocket connection.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_websocketpeer.html  
     */
    class WebSocketPeer extends PacketPeer {
        constructor(identifier?: any)
        /** Connects to the given URL. TLS certificates will be verified against the hostname when connecting using the `wss://` protocol. You can pass the optional [param tls_client_options] parameter to customize the trusted certification authorities, or disable the common name verification. See [method TLSOptions.client] and [method TLSOptions.client_unsafe].  
         *      
         *  **Note:** This method is non-blocking, and will return [constant OK] before the connection is established as long as the provided parameters are valid and the peer is not in an invalid state (e.g. already connected). Regularly call [method poll] (e.g. during [Node] process) and check the result of [method get_ready_state] to know whether the connection succeeds or fails.  
         *      
         *  **Note:** To avoid mixed content warnings or errors in Web, you may have to use a [param url] that starts with `wss://` (secure) instead of `ws://`. When doing so, make sure to use the fully qualified domain name that matches the one defined in the server's TLS certificate. Do not connect directly via the IP address for `wss://` connections, as it won't match with the TLS certificate.  
         */
        connect_to_url(url: string, tls_client_options?: TLSOptions): Error
        
        /** Accepts a peer connection performing the HTTP handshake as a WebSocket server. The [param stream] must be a valid TCP stream retrieved via [method TCPServer.take_connection], or a TLS stream accepted via [method StreamPeerTLS.accept_stream].  
         *      
         *  **Note:** Not supported in Web exports due to browsers' restrictions.  
         */
        accept_stream(stream: StreamPeer): Error
        
        /** Sends the given [param message] using the desired [param write_mode]. When sending a [String], prefer using [method send_text]. */
        send(message: PackedByteArray | byte[] | ArrayBuffer, write_mode?: WebSocketPeer.WriteMode /* = 1 */): Error
        
        /** Sends the given [param message] using WebSocket text mode. Prefer this method over [method PacketPeer.put_packet] when interacting with third-party text-based API (e.g. when using [JSON] formatted messages). */
        send_text(message: string): Error
        
        /** Returns `true` if the last received packet was sent as a text payload. See [enum WriteMode]. */
        was_string_packet(): boolean
        
        /** Updates the connection state and receive incoming packets. Call this function regularly to keep it in a clean state. */
        poll(): void
        
        /** Closes this WebSocket connection.  
         *  [param code] is the status code for the closure (see [url=https://datatracker.ietf.org/doc/html/rfc6455#section-7.4.1]RFC 6455 section 7.4[/url] for a list of valid status codes). If [param code] is negative, the connection will be closed immediately without notifying the remote peer.  
         *  [param reason] is the human-readable reason for closing the connection. It can be any UTF-8 string that's smaller than 123 bytes.  
         *      
         *  **Note:** To achieve a clean closure, you will need to keep polling until [constant STATE_CLOSED] is reached.  
         *      
         *  **Note:** The Web export might not support all status codes. Please refer to browser-specific documentation for more details.  
         */
        close(code?: int64 /* = 1000 */, reason?: string /* = '' */): void
        
        /** Returns the IP address of the connected peer.  
         *      
         *  **Note:** Not available in the Web export.  
         */
        get_connected_host(): string
        
        /** Returns the remote port of the connected peer.  
         *      
         *  **Note:** Not available in the Web export.  
         */
        get_connected_port(): int64
        
        /** Returns the selected WebSocket sub-protocol for this connection or an empty string if the sub-protocol has not been selected yet. */
        get_selected_protocol(): string
        
        /** Returns the URL requested by this peer. The URL is derived from the `url` passed to [method connect_to_url] or from the HTTP headers when acting as server (i.e. when using [method accept_stream]). */
        get_requested_url(): string
        
        /** Disable Nagle's algorithm on the underlying TCP socket (default). See [method StreamPeerTCP.set_no_delay] for more information.  
         *      
         *  **Note:** Not available in the Web export.  
         */
        set_no_delay(enabled: boolean): void
        
        /** Returns the current amount of data in the outbound websocket buffer.     
         *  **Note:** Web exports use WebSocket.bufferedAmount, while other platforms use an internal buffer.  
         */
        get_current_outbound_buffered_amount(): int64
        
        /** Returns the ready state of the connection. */
        get_ready_state(): WebSocketPeer.State
        
        /** Returns the received WebSocket close frame status code, or `-1` when the connection was not cleanly closed. Only call this method when [method get_ready_state] returns [constant STATE_CLOSED]. */
        get_close_code(): int64
        
        /** Returns the received WebSocket close frame status reason string. Only call this method when [method get_ready_state] returns [constant STATE_CLOSED]. */
        get_close_reason(): string
        
        /** The WebSocket sub-protocols allowed during the WebSocket handshake. */
        get supported_protocols(): PackedStringArray
        set supported_protocols(value: PackedStringArray | string[])
        
        /** The extra HTTP headers to be sent during the WebSocket handshake.  
         *      
         *  **Note:** Not supported in Web exports due to browsers' restrictions.  
         */
        get handshake_headers(): PackedStringArray
        set handshake_headers(value: PackedStringArray | string[])
        
        /** The size of the input buffer in bytes (roughly the maximum amount of memory that will be allocated for the inbound packets). */
        get inbound_buffer_size(): int64
        set inbound_buffer_size(value: int64)
        
        /** The size of the input buffer in bytes (roughly the maximum amount of memory that will be allocated for the outbound packets). */
        get outbound_buffer_size(): int64
        set outbound_buffer_size(value: int64)
        
        /** The maximum amount of packets that will be allowed in the queues (both inbound and outbound). */
        get max_queued_packets(): int64
        set max_queued_packets(value: int64)
        
        /** The interval (in seconds) at which the peer will automatically send WebSocket "ping" control frames. When set to `0`, no "ping" control frames will be sent.  
         *      
         *  **Note:** Has no effect in Web exports due to browser restrictions.  
         */
        get heartbeat_interval(): int64
        set heartbeat_interval(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapWebSocketPeer;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapWebSocketPeer;
    }
    namespace WebXRInterface {
        enum TargetRayMode {
            /** We don't know the target ray mode. */
            TARGET_RAY_MODE_UNKNOWN = 0,
            
            /** Target ray originates at the viewer's eyes and points in the direction they are looking. */
            TARGET_RAY_MODE_GAZE = 1,
            
            /** Target ray from a handheld pointer, most likely a VR touch controller. */
            TARGET_RAY_MODE_TRACKED_POINTER = 2,
            
            /** Target ray from touch screen, mouse or other tactile input device. */
            TARGET_RAY_MODE_SCREEN = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapWebXRInterface extends __RPCMapXRInterface {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapWebXRInterface extends __NameMapXRInterface {
    }
    /** XR interface using WebXR.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_webxrinterface.html  
     */
    class WebXRInterface extends XRInterface {
        constructor(identifier?: any)
        /** Checks if the given [param session_mode] is supported by the user's browser.  
         *  Possible values come from [url=https://developer.mozilla.org/en-US/docs/Web/API/XRSessionMode]WebXR's XRSessionMode[/url], including: `"immersive-vr"`, `"immersive-ar"`, and `"inline"`.  
         *  This method returns nothing, instead it emits the [signal session_supported] signal with the result.  
         */
        is_session_supported(session_mode: string): void
        
        /** Returns `true` if there is an active input source with the given [param input_source_id]. */
        is_input_source_active(input_source_id: int64): boolean
        
        /** Gets an [XRControllerTracker] for the given [param input_source_id].  
         *  In the context of WebXR, an input source can be an advanced VR controller like the Oculus Touch or Index controllers, or even a tap on the screen, a spoken voice command or a button press on the device itself. When a non-traditional input source is used, interpret the position and orientation of the [XRPositionalTracker] as a ray pointing at the object the user wishes to interact with.  
         *  Use this method to get information about the input source that triggered one of these signals:  
         *  - [signal selectstart]  
         *  - [signal select]  
         *  - [signal selectend]  
         *  - [signal squeezestart]  
         *  - [signal squeeze]  
         *  - [signal squeezestart]  
         */
        get_input_source_tracker(input_source_id: int64): null | XRControllerTracker
        
        /** Returns the target ray mode for the given [param input_source_id].  
         *  This can help interpret the input coming from that input source. See [url=https://developer.mozilla.org/en-US/docs/Web/API/XRInputSource/targetRayMode]XRInputSource.targetRayMode[/url] for more information.  
         */
        get_input_source_target_ray_mode(input_source_id: int64): WebXRInterface.TargetRayMode
        
        /** Returns the display refresh rate for the current HMD. Not supported on all HMDs and browsers. It may not report an accurate value until after using [method set_display_refresh_rate]. */
        get_display_refresh_rate(): float64
        
        /** Sets the display refresh rate for the current HMD. Not supported on all HMDs and browsers. It won't take effect right away until after [signal display_refresh_rate_changed] is emitted. */
        set_display_refresh_rate(refresh_rate: float64): void
        
        /** Returns display refresh rates supported by the current HMD. Only returned if this feature is supported by the web browser and after the interface has been initialized. */
        get_available_display_refresh_rates(): GArray
        
        /** The session mode used by [method XRInterface.initialize] when setting up the WebXR session.  
         *  This doesn't have any effect on the interface when already initialized.  
         *  Possible values come from [url=https://developer.mozilla.org/en-US/docs/Web/API/XRSessionMode]WebXR's XRSessionMode[/url], including: `"immersive-vr"`, `"immersive-ar"`, and `"inline"`.  
         */
        get session_mode(): string
        set session_mode(value: string)
        
        /** A comma-seperated list of required features used by [method XRInterface.initialize] when setting up the WebXR session.  
         *  If a user's browser or device doesn't support one of the given features, initialization will fail and [signal session_failed] will be emitted.  
         *  This doesn't have any effect on the interface when already initialized.  
         *  See the MDN documentation on [url=https://developer.mozilla.org/en-US/docs/Web/API/XRSystem/requestSession#session_features]WebXR's session features[/url] for a list of possible values.  
         */
        get required_features(): string
        set required_features(value: string)
        
        /** A comma-seperated list of optional features used by [method XRInterface.initialize] when setting up the WebXR session.  
         *  If a user's browser or device doesn't support one of the given features, initialization will continue, but you won't be able to use the requested feature.  
         *  This doesn't have any effect on the interface when already initialized.  
         *  See the MDN documentation on [url=https://developer.mozilla.org/en-US/docs/Web/API/XRSystem/requestSession#session_features]WebXR's session features[/url] for a list of possible values.  
         */
        get optional_features(): string
        set optional_features(value: string)
        
        /** A comma-seperated list of reference space types used by [method XRInterface.initialize] when setting up the WebXR session.  
         *  The reference space types are requested in order, and the first one supported by the user's device or browser will be used. The [member reference_space_type] property contains the reference space type that was ultimately selected.  
         *  This doesn't have any effect on the interface when already initialized.  
         *  Possible values come from [url=https://developer.mozilla.org/en-US/docs/Web/API/XRReferenceSpaceType]WebXR's XRReferenceSpaceType[/url]. If you want to use a particular reference space type, it must be listed in either [member required_features] or [member optional_features].  
         */
        get requested_reference_space_types(): string
        set requested_reference_space_types(value: string)
        
        /** The reference space type (from the list of requested types set in the [member requested_reference_space_types] property), that was ultimately used by [method XRInterface.initialize] when setting up the WebXR session.  
         *  Possible values come from [url=https://developer.mozilla.org/en-US/docs/Web/API/XRReferenceSpaceType]WebXR's XRReferenceSpaceType[/url]. If you want to use a particular reference space type, it must be listed in either [member required_features] or [member optional_features].  
         */
        get reference_space_type(): string
        
        /** A comma-separated list of features that were successfully enabled by [method XRInterface.initialize] when setting up the WebXR session.  
         *  This may include features requested by setting [member required_features] and [member optional_features], and will only be available after [signal session_started] has been emitted.  
         *      
         *  **Note:** This may not be support by all web browsers, in which case it will be an empty string.  
         */
        get enabled_features(): string
        
        /** Indicates if the WebXR session's imagery is visible to the user.  
         *  Possible values come from [url=https://developer.mozilla.org/en-US/docs/Web/API/XRVisibilityState]WebXR's XRVisibilityState[/url], including `"hidden"`, `"visible"`, and `"visible-blurred"`.  
         */
        get visibility_state(): string
        
        /** Emitted by [method is_session_supported] to indicate if the given [param session_mode] is supported or not. */
        readonly session_supported: Signal<(session_mode: string, supported: boolean) => void>
        
        /** Emitted by [method XRInterface.initialize] if the session is successfully started.  
         *  At this point, it's safe to do `get_viewport().use_xr = true` to instruct Godot to start rendering to the XR device.  
         */
        readonly session_started: Signal<() => void>
        
        /** Emitted when the user ends the WebXR session (which can be done using UI from the browser or device).  
         *  At this point, you should do `get_viewport().use_xr = false` to instruct Godot to resume rendering to the screen.  
         */
        readonly session_ended: Signal<() => void>
        
        /** Emitted by [method XRInterface.initialize] if the session fails to start.  
         *  [param message] may optionally contain an error message from WebXR, or an empty string if no message is available.  
         */
        readonly session_failed: Signal<(message: string) => void>
        
        /** Emitted when one of the input source has started its "primary action".  
         *  Use [method get_input_source_tracker] and [method get_input_source_target_ray_mode] to get more information about the input source.  
         */
        readonly selectstart: Signal<(input_source_id: int64) => void>
        
        /** Emitted after one of the input sources has finished its "primary action".  
         *  Use [method get_input_source_tracker] and [method get_input_source_target_ray_mode] to get more information about the input source.  
         */
        readonly select: Signal<(input_source_id: int64) => void>
        
        /** Emitted when one of the input sources has finished its "primary action".  
         *  Use [method get_input_source_tracker] and [method get_input_source_target_ray_mode] to get more information about the input source.  
         */
        readonly selectend: Signal<(input_source_id: int64) => void>
        
        /** Emitted when one of the input sources has started its "primary squeeze action".  
         *  Use [method get_input_source_tracker] and [method get_input_source_target_ray_mode] to get more information about the input source.  
         */
        readonly squeezestart: Signal<(input_source_id: int64) => void>
        
        /** Emitted after one of the input sources has finished its "primary squeeze action".  
         *  Use [method get_input_source_tracker] and [method get_input_source_target_ray_mode] to get more information about the input source.  
         */
        readonly squeeze: Signal<(input_source_id: int64) => void>
        
        /** Emitted when one of the input sources has finished its "primary squeeze action".  
         *  Use [method get_input_source_tracker] and [method get_input_source_target_ray_mode] to get more information about the input source.  
         */
        readonly squeezeend: Signal<(input_source_id: int64) => void>
        
        /** Emitted when [member visibility_state] has changed. */
        readonly visibility_state_changed: Signal<() => void>
        
        /** Emitted to indicate that the reference space has been reset or reconfigured.  
         *  When (or whether) this is emitted depends on the user's browser or device, but may include when the user has changed the dimensions of their play space (which you may be able to access via [method XRInterface.get_play_area]) or pressed/held a button to recenter their position.  
         *  See [url=https://developer.mozilla.org/en-US/docs/Web/API/XRReferenceSpace/reset_event]WebXR's XRReferenceSpace reset event[/url] for more information.  
         */
        readonly reference_space_reset: Signal<() => void>
        
        /** Emitted after the display's refresh rate has changed. */
        readonly display_refresh_rate_changed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapWebXRInterface;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapWebXRInterface;
    }
    namespace Window {
        enum Mode {
            /** Windowed mode, i.e. [Window] doesn't occupy the whole screen (unless set to the size of the screen). */
            MODE_WINDOWED = 0,
            
            /** Minimized window mode, i.e. [Window] is not visible and available on window manager's window list. Normally happens when the minimize button is pressed. */
            MODE_MINIMIZED = 1,
            
            /** Maximized window mode, i.e. [Window] will occupy whole screen area except task bar and still display its borders. Normally happens when the maximize button is pressed. */
            MODE_MAXIMIZED = 2,
            
            /** Full screen mode with full multi-window support.  
             *  Full screen window covers the entire display area of a screen and has no decorations. The display's video mode is not changed.  
             *  **On Android:** This enables immersive mode.  
             *  **On macOS:** A new desktop is used to display the running project.  
             *      
             *  **Note:** Regardless of the platform, enabling full screen will change the window size to match the monitor's size. Therefore, make sure your project supports [url=https://docs.godotengine.org/en/4.6/tutorials/rendering/multiple_resolutions.html]multiple resolutions[/url] when enabling full screen mode.  
             */
            MODE_FULLSCREEN = 3,
            
            /** A single window full screen mode. This mode has less overhead, but only one window can be open on a given screen at a time (opening a child window or application switching will trigger a full screen transition).  
             *  Full screen window covers the entire display area of a screen and has no border or decorations. The display's video mode is not changed.  
             *      
             *  **Note:** This mode might not work with screen recording software.  
             *  **On Android:** This enables immersive mode.  
             *  **On Windows:** Depending on video driver, full screen transition might cause screens to go black for a moment.  
             *  **On macOS:** A new desktop is used to display the running project. Exclusive full screen mode prevents Dock and Menu from showing up when the mouse pointer is hovering the edge of the screen.  
             *  **On Linux (X11):** Exclusive full screen mode bypasses compositor.  
             *  **On Linux (Wayland):** Equivalent to [constant MODE_FULLSCREEN].  
             *      
             *  **Note:** Regardless of the platform, enabling full screen will change the window size to match the monitor's size. Therefore, make sure your project supports [url=https://docs.godotengine.org/en/4.6/tutorials/rendering/multiple_resolutions.html]multiple resolutions[/url] when enabling full screen mode.  
             */
            MODE_EXCLUSIVE_FULLSCREEN = 4,
        }
        enum Flags {
            /** The window can't be resized by dragging its resize grip. It's still possible to resize the window using [member size]. This flag is ignored for full screen windows. Set with [member unresizable]. */
            FLAG_RESIZE_DISABLED = 0,
            
            /** The window do not have native title bar and other decorations. This flag is ignored for full-screen windows. Set with [member borderless]. */
            FLAG_BORDERLESS = 1,
            
            /** The window is floating on top of all other windows. This flag is ignored for full-screen windows. Set with [member always_on_top]. */
            FLAG_ALWAYS_ON_TOP = 2,
            
            /** The window background can be transparent. Set with [member transparent].  
             *      
             *  **Note:** This flag has no effect if either [member ProjectSettings.display/window/per_pixel_transparency/allowed], or the window's [member Viewport.transparent_bg] is set to `false`.  
             */
            FLAG_TRANSPARENT = 3,
            
            /** The window can't be focused. No-focus window will ignore all input, except mouse clicks. Set with [member unfocusable]. */
            FLAG_NO_FOCUS = 4,
            
            /** Window is part of menu or [OptionButton] dropdown. This flag can't be changed when the window is visible. An active popup window will exclusively receive all input, without stealing focus from its parent. Popup windows are automatically closed when uses click outside it, or when an application is switched. Popup window must have transient parent set (see [member transient]).  
             *      
             *  **Note:** This flag has no effect in embedded windows (unless said window is a [Popup]).  
             */
            FLAG_POPUP = 5,
            
            /** Window content is expanded to the full size of the window. Unlike borderless window, the frame is left intact and can be used to resize the window, title bar is transparent, but have minimize/maximize/close buttons. Set with [member extend_to_title].  
             *      
             *  **Note:** This flag is implemented only on macOS.  
             *      
             *  **Note:** This flag has no effect in embedded windows.  
             */
            FLAG_EXTEND_TO_TITLE = 6,
            
            /** All mouse events are passed to the underlying window of the same application.  
             *      
             *  **Note:** This flag has no effect in embedded windows.  
             */
            FLAG_MOUSE_PASSTHROUGH = 7,
            
            /** Window style is overridden, forcing sharp corners.  
             *      
             *  **Note:** This flag has no effect in embedded windows.  
             *      
             *  **Note:** This flag is implemented only on Windows (11).  
             */
            FLAG_SHARP_CORNERS = 8,
            
            /** Windows is excluded from screenshots taken by [method DisplayServer.screen_get_image], [method DisplayServer.screen_get_image_rect], and [method DisplayServer.screen_get_pixel].  
             *      
             *  **Note:** This flag has no effect in embedded windows.  
             *      
             *  **Note:** This flag is implemented on macOS and Windows (10, 20H1).  
             *      
             *  **Note:** Setting this flag will prevent standard screenshot methods from capturing a window image, but does **NOT** guarantee that other apps won't be able to capture an image. It should not be used as a DRM or security measure.  
             */
            FLAG_EXCLUDE_FROM_CAPTURE = 9,
            
            /** Signals the window manager that this window is supposed to be an implementation-defined "popup" (usually a floating, borderless, untileable and immovable child window). */
            FLAG_POPUP_WM_HINT = 10,
            
            /** Window minimize button is disabled.  
             *      
             *  **Note:** This flag is implemented on macOS and Windows.  
             */
            FLAG_MINIMIZE_DISABLED = 11,
            
            /** Window maximize button is disabled.  
             *      
             *  **Note:** This flag is implemented on macOS and Windows.  
             */
            FLAG_MAXIMIZE_DISABLED = 12,
            
            /** Max value of the [enum Flags]. */
            FLAG_MAX = 13,
        }
        enum ContentScaleMode {
            /** The content will not be scaled to match the [Window]'s size ([member content_scale_size] is ignored). */
            CONTENT_SCALE_MODE_DISABLED = 0,
            
            /** The content will be rendered at the target size. This is more performance-expensive than [constant CONTENT_SCALE_MODE_VIEWPORT], but provides better results. */
            CONTENT_SCALE_MODE_CANVAS_ITEMS = 1,
            
            /** The content will be rendered at the base size and then scaled to the target size. More performant than [constant CONTENT_SCALE_MODE_CANVAS_ITEMS], but results in pixelated image. */
            CONTENT_SCALE_MODE_VIEWPORT = 2,
        }
        enum ContentScaleAspect {
            /** The aspect will be ignored. Scaling will simply stretch the content to fit the target size. */
            CONTENT_SCALE_ASPECT_IGNORE = 0,
            
            /** The content's aspect will be preserved. If the target size has different aspect from the base one, the image will be centered and black bars will appear on left and right sides. */
            CONTENT_SCALE_ASPECT_KEEP = 1,
            
            /** The content can be expanded vertically. Scaling horizontally will result in keeping the width ratio and then black bars on left and right sides. */
            CONTENT_SCALE_ASPECT_KEEP_WIDTH = 2,
            
            /** The content can be expanded horizontally. Scaling vertically will result in keeping the height ratio and then black bars on top and bottom sides. */
            CONTENT_SCALE_ASPECT_KEEP_HEIGHT = 3,
            
            /** The content's aspect will be preserved. If the target size has different aspect from the base one, the content will stay in the top-left corner and add an extra visible area in the stretched space. */
            CONTENT_SCALE_ASPECT_EXPAND = 4,
        }
        enum ContentScaleStretch {
            /** The content will be stretched according to a fractional factor. This fills all the space available in the window, but allows "pixel wobble" to occur due to uneven pixel scaling. */
            CONTENT_SCALE_STRETCH_FRACTIONAL = 0,
            
            /** The content will be stretched only according to an integer factor, preserving sharp pixels. This may leave a black background visible on the window's edges depending on the window size. */
            CONTENT_SCALE_STRETCH_INTEGER = 1,
        }
        enum LayoutDirection {
            /** Automatic layout direction, determined from the parent window layout direction. */
            LAYOUT_DIRECTION_INHERITED = 0,
            
            /** Automatic layout direction, determined from the current locale. */
            LAYOUT_DIRECTION_APPLICATION_LOCALE = 1,
            
            /** Left-to-right layout direction. */
            LAYOUT_DIRECTION_LTR = 2,
            
            /** Right-to-left layout direction. */
            LAYOUT_DIRECTION_RTL = 3,
            
            /** Automatic layout direction, determined from the system locale. */
            LAYOUT_DIRECTION_SYSTEM_LOCALE = 4,
            
            /** Represents the size of the [enum LayoutDirection] enum. */
            LAYOUT_DIRECTION_MAX = 5,
            LAYOUT_DIRECTION_LOCALE = 1,
        }
        enum WindowInitialPosition {
            /** Initial window position is determined by [member position]. */
            WINDOW_INITIAL_POSITION_ABSOLUTE = 0,
            
            /** Initial window position is the center of the primary screen. */
            WINDOW_INITIAL_POSITION_CENTER_PRIMARY_SCREEN = 1,
            
            /** Initial window position is the center of the main window screen. */
            WINDOW_INITIAL_POSITION_CENTER_MAIN_WINDOW_SCREEN = 2,
            
            /** Initial window position is the center of [member current_screen] screen. */
            WINDOW_INITIAL_POSITION_CENTER_OTHER_SCREEN = 3,
            
            /** Initial window position is the center of the screen containing the mouse pointer. */
            WINDOW_INITIAL_POSITION_CENTER_SCREEN_WITH_MOUSE_FOCUS = 4,
            
            /** Initial window position is the center of the screen containing the window with the keyboard focus. */
            WINDOW_INITIAL_POSITION_CENTER_SCREEN_WITH_KEYBOARD_FOCUS = 5,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapWindow extends __RPCMapViewport {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapWindow extends __NameMapViewport {
    }
    /** Base class for all windows, dialogs, and popups.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_window.html  
     */
    class Window<Map extends NodePathMap = any> extends Viewport<Map> {
        /** Emitted when [Window]'s visibility changes, right before [signal visibility_changed]. */
        static readonly NOTIFICATION_VISIBILITY_CHANGED = 30
        
        /** Sent when the node needs to refresh its theme items. This happens in one of the following cases:  
         *  - The [member theme] property is changed on this node or any of its ancestors.  
         *  - The [member theme_type_variation] property is changed on this node.  
         *  - The node enters the scene tree.  
         *      
         *  **Note:** As an optimization, this notification won't be sent from changes that occur while this node is outside of the scene tree. Instead, all of the theme item updates can be applied at once when the node enters the scene tree.  
         */
        static readonly NOTIFICATION_THEME_CHANGED = 32
        constructor(identifier?: any)
        
        /** Virtual method to be implemented by the user. Overrides the value returned by [method get_contents_minimum_size]. */
        /* gdvirtual */ _get_contents_minimum_size(): Vector2
        
        /** Centers the window in the current screen. If the window is embedded, it is centered in the embedder [Viewport] instead. */
        move_to_center(): void
        
        /** Resets the size to the minimum size, which is the max of [member min_size] and (if [member wrap_controls] is enabled) [method get_contents_minimum_size]. This is equivalent to calling `set_size(Vector2i())` (or any size below the minimum). */
        reset_size(): void
        
        /** Returns the window's position including its border.  
         *      
         *  **Note:** If [member visible] is `false`, this method returns the same value as [member position].  
         */
        get_position_with_decorations(): Vector2i
        
        /** Returns the window's size including its border.  
         *      
         *  **Note:** If [member visible] is `false`, this method returns the same value as [member size].  
         */
        get_size_with_decorations(): Vector2i
        
        /** Sets a specified window flag. */
        set_flag(flag: Window.Flags, enabled: boolean): void
        
        /** Returns `true` if the [param flag] is set. */
        get_flag(flag: Window.Flags): boolean
        
        /** Returns `true` if the window can be maximized (the maximize button is enabled). */
        is_maximize_allowed(): boolean
        
        /** Tells the OS that the [Window] needs an attention. This makes the window stand out in some way depending on the system, e.g. it might blink on the task bar. */
        request_attention(): void
        
        /** Causes the window to grab focus, allowing it to receive user input. */
        move_to_foreground(): void
        
        /** Hides the window. This is not the same as minimized state. Hidden window can't be interacted with and needs to be made visible with [method show]. */
        hide(): void
        
        /** Makes the [Window] appear. This enables interactions with the [Window] and doesn't change any of its property other than visibility (unlike e.g. [method popup]). */
        show(): void
        
        /** If [param unparent] is `true`, the window is automatically unparented when going invisible.  
         *      
         *  **Note:** Make sure to keep a reference to the node, otherwise it will be orphaned. You also need to manually call [method Node.queue_free] to free the window if it's not parented.  
         */
        set_unparent_when_invisible(unparent: boolean): void
        
        /** Returns whether the window is being drawn to the screen. */
        can_draw(): boolean
        
        /** Returns `true` if the window is focused. */
        has_focus(): boolean
        
        /** Causes the window to grab focus, allowing it to receive user input. */
        grab_focus(): void
        
        /** Starts an interactive drag operation on the window, using the current mouse position. Call this method when handling a mouse button being pressed to simulate a pressed event on the window's title bar. Using this method allows the window to participate in space switching, tiling, and other system features. */
        start_drag(): void
        
        /** Starts an interactive resize operation on the window, using the current mouse position. Call this method when handling a mouse button being pressed to simulate a pressed event on the window's edge. */
        start_resize(edge: DisplayServer.WindowResizeEdge): void
        
        /** If [param active] is `true`, enables system's native IME (Input Method Editor). */
        set_ime_active(active: boolean): void
        
        /** Moves IME to the given position. */
        set_ime_position(position: Vector2i): void
        
        /** Returns `true` if the window is currently embedded in another window. */
        is_embedded(): boolean
        
        /** Returns the combined minimum size from the child [Control] nodes of the window. Use [method child_controls_changed] to update it when child nodes have changed.  
         *  The value returned by this method can be overridden with [method _get_contents_minimum_size].  
         */
        get_contents_minimum_size(): Vector2
        
        /** Requests an update of the [Window] size to fit underlying [Control] nodes. */
        child_controls_changed(): void
        
        /** Prevents `*_theme_*_override` methods from emitting [constant NOTIFICATION_THEME_CHANGED] until [method end_bulk_theme_override] is called. */
        begin_bulk_theme_override(): void
        
        /** Ends a bulk theme override update. See [method begin_bulk_theme_override]. */
        end_bulk_theme_override(): void
        
        /** Creates a local override for a theme icon with the specified [param name]. Local overrides always take precedence when fetching theme items for the control. An override can be removed with [method remove_theme_icon_override].  
         *  See also [method get_theme_icon].  
         */
        add_theme_icon_override(name: StringName, texture: Texture2D): void
        
        /** Creates a local override for a theme [StyleBox] with the specified [param name]. Local overrides always take precedence when fetching theme items for the control. An override can be removed with [method remove_theme_stylebox_override].  
         *  See also [method get_theme_stylebox] and [method Control.add_theme_stylebox_override] for more details.  
         */
        add_theme_stylebox_override(name: StringName, stylebox: StyleBox): void
        
        /** Creates a local override for a theme [Font] with the specified [param name]. Local overrides always take precedence when fetching theme items for the control. An override can be removed with [method remove_theme_font_override].  
         *  See also [method get_theme_font].  
         */
        add_theme_font_override(name: StringName, font: Font): void
        
        /** Creates a local override for a theme font size with the specified [param name]. Local overrides always take precedence when fetching theme items for the control. An override can be removed with [method remove_theme_font_size_override].  
         *  See also [method get_theme_font_size].  
         */
        add_theme_font_size_override(name: StringName, font_size: int64): void
        
        /** Creates a local override for a theme [Color] with the specified [param name]. Local overrides always take precedence when fetching theme items for the control. An override can be removed with [method remove_theme_color_override].  
         *  See also [method get_theme_color] and [method Control.add_theme_color_override] for more details.  
         */
        add_theme_color_override(name: StringName, color: Color): void
        
        /** Creates a local override for a theme constant with the specified [param name]. Local overrides always take precedence when fetching theme items for the control. An override can be removed with [method remove_theme_constant_override].  
         *  See also [method get_theme_constant].  
         */
        add_theme_constant_override(name: StringName, constant: int64): void
        
        /** Removes a local override for a theme icon with the specified [param name] previously added by [method add_theme_icon_override] or via the Inspector dock. */
        remove_theme_icon_override(name: StringName): void
        
        /** Removes a local override for a theme [StyleBox] with the specified [param name] previously added by [method add_theme_stylebox_override] or via the Inspector dock. */
        remove_theme_stylebox_override(name: StringName): void
        
        /** Removes a local override for a theme [Font] with the specified [param name] previously added by [method add_theme_font_override] or via the Inspector dock. */
        remove_theme_font_override(name: StringName): void
        
        /** Removes a local override for a theme font size with the specified [param name] previously added by [method add_theme_font_size_override] or via the Inspector dock. */
        remove_theme_font_size_override(name: StringName): void
        
        /** Removes a local override for a theme [Color] with the specified [param name] previously added by [method add_theme_color_override] or via the Inspector dock. */
        remove_theme_color_override(name: StringName): void
        
        /** Removes a local override for a theme constant with the specified [param name] previously added by [method add_theme_constant_override] or via the Inspector dock. */
        remove_theme_constant_override(name: StringName): void
        
        /** Returns an icon from the first matching [Theme] in the tree if that [Theme] has an icon item with the specified [param name] and [param theme_type].  
         *  See [method Control.get_theme_color] for details.  
         */
        get_theme_icon(name: StringName, theme_type?: StringName /* = '' */): null | Texture2D
        
        /** Returns a [StyleBox] from the first matching [Theme] in the tree if that [Theme] has a stylebox item with the specified [param name] and [param theme_type].  
         *  See [method Control.get_theme_color] for details.  
         */
        get_theme_stylebox(name: StringName, theme_type?: StringName /* = '' */): null | StyleBox
        
        /** Returns a [Font] from the first matching [Theme] in the tree if that [Theme] has a font item with the specified [param name] and [param theme_type].  
         *  See [method Control.get_theme_color] for details.  
         */
        get_theme_font(name: StringName, theme_type?: StringName /* = '' */): null | Font
        
        /** Returns a font size from the first matching [Theme] in the tree if that [Theme] has a font size item with the specified [param name] and [param theme_type].  
         *  See [method Control.get_theme_color] for details.  
         */
        get_theme_font_size(name: StringName, theme_type?: StringName /* = '' */): int64
        
        /** Returns a [Color] from the first matching [Theme] in the tree if that [Theme] has a color item with the specified [param name] and [param theme_type].  
         *  See [method Control.get_theme_color] for more details.  
         */
        get_theme_color(name: StringName, theme_type?: StringName /* = '' */): Color
        
        /** Returns a constant from the first matching [Theme] in the tree if that [Theme] has a constant item with the specified [param name] and [param theme_type].  
         *  See [method Control.get_theme_color] for more details.  
         */
        get_theme_constant(name: StringName, theme_type?: StringName /* = '' */): int64
        
        /** Returns `true` if there is a local override for a theme icon with the specified [param name] in this [Control] node.  
         *  See [method add_theme_icon_override].  
         */
        has_theme_icon_override(name: StringName): boolean
        
        /** Returns `true` if there is a local override for a theme [StyleBox] with the specified [param name] in this [Control] node.  
         *  See [method add_theme_stylebox_override].  
         */
        has_theme_stylebox_override(name: StringName): boolean
        
        /** Returns `true` if there is a local override for a theme [Font] with the specified [param name] in this [Control] node.  
         *  See [method add_theme_font_override].  
         */
        has_theme_font_override(name: StringName): boolean
        
        /** Returns `true` if there is a local override for a theme font size with the specified [param name] in this [Control] node.  
         *  See [method add_theme_font_size_override].  
         */
        has_theme_font_size_override(name: StringName): boolean
        
        /** Returns `true` if there is a local override for a theme [Color] with the specified [param name] in this [Control] node.  
         *  See [method add_theme_color_override].  
         */
        has_theme_color_override(name: StringName): boolean
        
        /** Returns `true` if there is a local override for a theme constant with the specified [param name] in this [Control] node.  
         *  See [method add_theme_constant_override].  
         */
        has_theme_constant_override(name: StringName): boolean
        
        /** Returns `true` if there is a matching [Theme] in the tree that has an icon item with the specified [param name] and [param theme_type].  
         *  See [method Control.get_theme_color] for details.  
         */
        has_theme_icon(name: StringName, theme_type?: StringName /* = '' */): boolean
        
        /** Returns `true` if there is a matching [Theme] in the tree that has a stylebox item with the specified [param name] and [param theme_type].  
         *  See [method Control.get_theme_color] for details.  
         */
        has_theme_stylebox(name: StringName, theme_type?: StringName /* = '' */): boolean
        
        /** Returns `true` if there is a matching [Theme] in the tree that has a font item with the specified [param name] and [param theme_type].  
         *  See [method Control.get_theme_color] for details.  
         */
        has_theme_font(name: StringName, theme_type?: StringName /* = '' */): boolean
        
        /** Returns `true` if there is a matching [Theme] in the tree that has a font size item with the specified [param name] and [param theme_type].  
         *  See [method Control.get_theme_color] for details.  
         */
        has_theme_font_size(name: StringName, theme_type?: StringName /* = '' */): boolean
        
        /** Returns `true` if there is a matching [Theme] in the tree that has a color item with the specified [param name] and [param theme_type].  
         *  See [method Control.get_theme_color] for details.  
         */
        has_theme_color(name: StringName, theme_type?: StringName /* = '' */): boolean
        
        /** Returns `true` if there is a matching [Theme] in the tree that has a constant item with the specified [param name] and [param theme_type].  
         *  See [method Control.get_theme_color] for details.  
         */
        has_theme_constant(name: StringName, theme_type?: StringName /* = '' */): boolean
        
        /** Returns the default base scale value from the first matching [Theme] in the tree if that [Theme] has a valid [member Theme.default_base_scale] value.  
         *  See [method Control.get_theme_color] for details.  
         */
        get_theme_default_base_scale(): float64
        
        /** Returns the default font from the first matching [Theme] in the tree if that [Theme] has a valid [member Theme.default_font] value.  
         *  See [method Control.get_theme_color] for details.  
         */
        get_theme_default_font(): null | Font
        
        /** Returns the default font size value from the first matching [Theme] in the tree if that [Theme] has a valid [member Theme.default_font_size] value.  
         *  See [method Control.get_theme_color] for details.  
         */
        get_theme_default_font_size(): int64
        
        /** Returns the ID of the window. */
        get_window_id(): int64
        
        /** Returns the focused window. */
        static get_focused_window(): null | Window
        
        /** Sets layout direction and text writing direction. Right-to-left layouts are necessary for certain languages (e.g. Arabic and Hebrew). */
        set_layout_direction(direction: Window.LayoutDirection): void
        
        /** Returns layout direction and text writing direction. */
        get_layout_direction(): Window.LayoutDirection
        
        /** Returns `true` if the layout is right-to-left. */
        is_layout_rtl(): boolean
        
        /** Enables font oversampling. This makes fonts look better when they are scaled up. */
        set_use_font_oversampling(enable: boolean): void
        
        /** Returns `true` if font oversampling is enabled. See [method set_use_font_oversampling]. */
        is_using_font_oversampling(): boolean
        
        /** Shows the [Window] and makes it transient (see [member transient]). If [param rect] is provided, it will be set as the [Window]'s size. Fails if called on the main window.  
         *  If [member ProjectSettings.display/window/subwindows/embed_subwindows] is `true` (single-window mode), [param rect]'s coordinates are global and relative to the main window's top-left corner (excluding window decorations). If [param rect]'s position coordinates are negative, the window will be located outside the main window and may not be visible as a result.  
         *  If [member ProjectSettings.display/window/subwindows/embed_subwindows] is `false` (multi-window mode), [param rect]'s coordinates are global and relative to the top-left corner of the leftmost screen. If [param rect]'s position coordinates are negative, the window will be placed at the top-left corner of the screen.  
         *      
         *  **Note:** [param rect] must be in global coordinates if specified.  
         */
        popup(rect?: Rect2i /* = new Rect2i(0, 0, 0, 0) */): void
        
        /** Popups the [Window] with a position shifted by parent [Window]'s position. If the [Window] is embedded, has the same effect as [method popup]. */
        popup_on_parent(parent_rect: Rect2i): void
        
        /** Popups the [Window] at the center of the current screen, with optionally given minimum size. If the [Window] is embedded, it will be centered in the parent [Viewport] instead.  
         *      
         *  **Note:** Calling it with the default value of [param minsize] is equivalent to calling it with [member size].  
         */
        popup_centered(minsize?: Vector2i /* = Vector2i.ZERO */): void
        
        /** If [Window] is embedded, popups the [Window] centered inside its embedder and sets its size as a [param ratio] of embedder's size.  
         *  If [Window] is a native window, popups the [Window] centered inside the screen of its parent [Window] and sets its size as a [param ratio] of the screen size.  
         */
        popup_centered_ratio(ratio?: float64 /* = 0.8 */): void
        
        /** Popups the [Window] centered inside its parent [Window]. [param fallback_ratio] determines the maximum size of the [Window], in relation to its parent.  
         *      
         *  **Note:** Calling it with the default value of [param minsize] is equivalent to calling it with [member size].  
         */
        popup_centered_clamped(minsize?: Vector2i /* = Vector2i.ZERO */, fallback_ratio?: float64 /* = 0.75 */): void
        
        /** Attempts to parent this dialog to the last exclusive window relative to [param from_node], and then calls [method Window.popup] on it. The dialog must have no current parent, otherwise the method fails.  
         *  See also [method set_unparent_when_invisible] and [method Node.get_last_exclusive_window].  
         */
        popup_exclusive(from_node: Node, rect?: Rect2i /* = new Rect2i(0, 0, 0, 0) */): void
        
        /** Attempts to parent this dialog to the last exclusive window relative to [param from_node], and then calls [method Window.popup_on_parent] on it. The dialog must have no current parent, otherwise the method fails.  
         *  See also [method set_unparent_when_invisible] and [method Node.get_last_exclusive_window].  
         */
        popup_exclusive_on_parent(from_node: Node, parent_rect: Rect2i): void
        
        /** Attempts to parent this dialog to the last exclusive window relative to [param from_node], and then calls [method Window.popup_centered] on it. The dialog must have no current parent, otherwise the method fails.  
         *  See also [method set_unparent_when_invisible] and [method Node.get_last_exclusive_window].  
         */
        popup_exclusive_centered(from_node: Node, minsize?: Vector2i /* = Vector2i.ZERO */): void
        
        /** Attempts to parent this dialog to the last exclusive window relative to [param from_node], and then calls [method Window.popup_centered_ratio] on it. The dialog must have no current parent, otherwise the method fails.  
         *  See also [method set_unparent_when_invisible] and [method Node.get_last_exclusive_window].  
         */
        popup_exclusive_centered_ratio(from_node: Node, ratio?: float64 /* = 0.8 */): void
        
        /** Attempts to parent this dialog to the last exclusive window relative to [param from_node], and then calls [method Window.popup_centered_clamped] on it. The dialog must have no current parent, otherwise the method fails.  
         *  See also [method set_unparent_when_invisible] and [method Node.get_last_exclusive_window].  
         */
        popup_exclusive_centered_clamped(from_node: Node, minsize?: Vector2i /* = Vector2i.ZERO */, fallback_ratio?: float64 /* = 0.75 */): void
        
        /** Set's the window's current mode.  
         *      
         *  **Note:** Fullscreen mode is not exclusive full screen on Windows and Linux.  
         *      
         *  **Note:** This method only works with native windows, i.e. the main window and [Window]-derived nodes when [member Viewport.gui_embed_subwindows] is disabled in the main viewport.  
         */
        get mode(): int64
        set mode(value: int64)
        
        /** The window's title. If the [Window] is native, title styles set in [Theme] will have no effect. */
        get title(): string
        set title(value: string)
        
        /** Specifies the initial type of position for the [Window]. */
        get initial_position(): int64
        set initial_position(value: int64)
        
        /** The window's position in pixels.  
         *  If [member ProjectSettings.display/window/subwindows/embed_subwindows] is `false`, the position is in absolute screen coordinates. This typically applies to editor plugins. If the setting is `true`, the window's position is in the coordinates of its parent [Viewport].  
         *      
         *  **Note:** This property only works if [member initial_position] is set to [constant WINDOW_INITIAL_POSITION_ABSOLUTE].  
         */
        get position(): Vector2i
        set position(value: Vector2i)
        
        /** The window's size in pixels. See also [member content_scale_size], which doesn't set the window's physical size but affects how scaling works relative to the current [member content_scale_mode]. */
        get size(): Vector2i
        set size(value: Vector2i)
        
        /** The screen the window is currently on. */
        get current_screen(): int64
        set current_screen(value: int64)
        
        /** If set, defines the window's custom decoration area which will receive mouse input, even if normal input to the window is blocked (such as when it has an exclusive child opened). See also [signal nonclient_window_input]. */
        get nonclient_area(): Rect2i
        set nonclient_area(value: Rect2i)
        
        /** Sets a polygonal region of the window which accepts mouse events. Mouse events outside the region will be passed through.  
         *  Passing an empty array will disable passthrough support (all mouse events will be intercepted by the window, which is the default behavior).  
         *    
         *      
         *  **Note:** This property is ignored if [member mouse_passthrough] is set to `true`.  
         *      
         *  **Note:** On Windows, the portion of a window that lies outside the region is not drawn, while on Linux (X11) and macOS it is.  
         *      
         *  **Note:** This property is implemented on Linux (X11), macOS and Windows.  
         */
        get mouse_passthrough_polygon(): PackedVector2Array
        set mouse_passthrough_polygon(value: PackedVector2Array | Vector2[])
        
        /** If `true`, the window is visible. */
        get visible(): boolean
        set visible(value: boolean)
        
        /** If `true`, the window's size will automatically update when a child node is added or removed, ignoring [member min_size] if the new size is bigger.  
         *  If `false`, you need to call [method child_controls_changed] manually.  
         */
        get wrap_controls(): boolean
        set wrap_controls(value: boolean)
        
        /** If `true`, the [Window] is transient, i.e. it's considered a child of another [Window]. The transient window will be destroyed with its transient parent and will return focus to their parent when closed. The transient window is displayed on top of a non-exclusive full-screen parent window. Transient windows can't enter full-screen mode.  
         *  Note that behavior might be different depending on the platform.  
         */
        get transient(): boolean
        set transient(value: boolean)
        
        /** If `true`, and the [Window] is [member transient], this window will (at the time of becoming visible) become transient to the currently focused window instead of the immediate parent window in the hierarchy. Note that the transient parent is assigned at the time this window becomes visible, so changing it afterwards has no effect until re-shown. */
        get transient_to_focused(): boolean
        set transient_to_focused(value: boolean)
        
        /** If `true`, the [Window] will be in exclusive mode. Exclusive windows are always on top of their parent and will block all input going to the parent [Window].  
         *  Needs [member transient] enabled to work.  
         */
        get exclusive(): boolean
        set exclusive(value: boolean)
        
        /** If `true`, the window can't be resized. */
        get unresizable(): boolean
        set unresizable(value: boolean)
        
        /** If `true`, the window will have no borders. */
        get borderless(): boolean
        set borderless(value: boolean)
        
        /** If `true`, the window will be on top of all other windows. Does not work if [member transient] is enabled. */
        get always_on_top(): boolean
        set always_on_top(value: boolean)
        
        /** If `true`, the [Window]'s background can be transparent. This is best used with embedded windows.  
         *      
         *  **Note:** Transparency support is implemented on Linux, macOS and Windows, but availability might vary depending on GPU driver, display manager, and compositor capabilities.  
         *      
         *  **Note:** This property has no effect if [member ProjectSettings.display/window/per_pixel_transparency/allowed] is set to `false`.  
         */
        get transparent(): boolean
        set transparent(value: boolean)
        
        /** If `true`, the [Window] can't be focused nor interacted with. It can still be visible. */
        get unfocusable(): boolean
        set unfocusable(value: boolean)
        
        /** If `true`, the [Window] will be considered a popup. Popups are sub-windows that don't show as separate windows in system's window manager's window list and will send close request when anything is clicked outside of them (unless [member exclusive] is enabled). */
        get popup_window(): boolean
        set popup_window(value: boolean)
        
        /** If `true`, the [Window] contents is expanded to the full size of the window, window title bar is transparent.  
         *      
         *  **Note:** This property is implemented only on macOS.  
         *      
         *  **Note:** This property only works with native windows.  
         */
        get extend_to_title(): boolean
        set extend_to_title(value: boolean)
        
        /** If `true`, all mouse events will be passed to the underlying window of the same application. See also [member mouse_passthrough_polygon].  
         *      
         *  **Note:** This property is implemented on Linux (X11), macOS and Windows.  
         *      
         *  **Note:** This property only works with native windows.  
         */
        get mouse_passthrough(): boolean
        set mouse_passthrough(value: boolean)
        
        /** If `true`, the [Window] will override the OS window style to display sharp corners.  
         *      
         *  **Note:** This property is implemented only on Windows (11).  
         *      
         *  **Note:** This property only works with native windows.  
         */
        get sharp_corners(): boolean
        set sharp_corners(value: boolean)
        
        /** If `true`, the [Window] is excluded from screenshots taken by [method DisplayServer.screen_get_image], [method DisplayServer.screen_get_image_rect], and [method DisplayServer.screen_get_pixel].  
         *      
         *  **Note:** This property is implemented on macOS and Windows.  
         *      
         *  **Note:** Enabling this setting will prevent standard screenshot methods from capturing a window image, but does **NOT** guarantee that other apps won't be able to capture an image. It should not be used as a DRM or security measure.  
         */
        get exclude_from_capture(): boolean
        set exclude_from_capture(value: boolean)
        
        /** If `true`, the [Window] will signal to the window manager that it is supposed to be an implementation-defined "popup" (usually a floating, borderless, untileable and immovable child window). */
        get popup_wm_hint(): boolean
        set popup_wm_hint(value: boolean)
        
        /** If `true`, the [Window]'s minimize button is disabled.  
         *      
         *  **Note:** If both minimize and maximize buttons are disabled, buttons are fully hidden, and only close button is visible.  
         *      
         *  **Note:** This property is implemented only on macOS and Windows.  
         */
        get minimize_disabled(): boolean
        set minimize_disabled(value: boolean)
        
        /** If `true`, the [Window]'s maximize button is disabled.  
         *      
         *  **Note:** If both minimize and maximize buttons are disabled, buttons are fully hidden, and only close button is visible.  
         *      
         *  **Note:** This property is implemented only on macOS and Windows.  
         */
        get maximize_disabled(): boolean
        set maximize_disabled(value: boolean)
        
        /** If `true`, native window will be used regardless of parent viewport and project settings. */
        get force_native(): boolean
        set force_native(value: boolean)
        
        /** If non-zero, the [Window] can't be resized to be smaller than this size.  
         *      
         *  **Note:** This property will be ignored in favor of [method get_contents_minimum_size] if [member wrap_controls] is enabled and if its size is bigger.  
         */
        get min_size(): Vector2i
        set min_size(value: Vector2i)
        
        /** If non-zero, the [Window] can't be resized to be bigger than this size.  
         *      
         *  **Note:** This property will be ignored if the value is lower than [member min_size].  
         */
        get max_size(): Vector2i
        set max_size(value: Vector2i)
        
        /** If `true`, the [Window] width is expanded to keep the title bar text fully visible. */
        get keep_title_visible(): boolean
        set keep_title_visible(value: boolean)
        
        /** The content's base size in "virtual" pixels. Not to be confused with [member size], which sets the actual window's physical size in pixels. If set to a value greater than `0` and [member content_scale_mode] is set to a value other than [constant CONTENT_SCALE_MODE_DISABLED], the [Window]'s content will be scaled when the window is resized to a different size. Higher values will make the content appear  *smaller* , as it will be able to fit more of the project in view. On the root [Window], this is set to match [member ProjectSettings.display/window/size/viewport_width] and [member ProjectSettings.display/window/size/viewport_height] by default.  
         *  For example, when using [constant CONTENT_SCALE_MODE_CANVAS_ITEMS] and [member content_scale_size] set to `Vector2i(1280, 720)`, using a window size of `2560×1440` will make 2D elements appear at double their original size, as the content is scaled by a factor of `2.0` (`2560.0 / 1280.0 = 2.0`, `1440.0 / 720.0 = 2.0`).  
         *  See [url=https://docs.godotengine.org/en/4.6/tutorials/rendering/multiple_resolutions.html#base-size]the Base size section of the Multiple resolutions documentation[/url] for details.  
         */
        get content_scale_size(): Vector2i
        set content_scale_size(value: Vector2i)
        
        /** Specifies how the content is scaled when the [Window] is resized. */
        get content_scale_mode(): int64
        set content_scale_mode(value: int64)
        
        /** Specifies how the content's aspect behaves when the [Window] is resized. The base aspect is determined by [member content_scale_size]. */
        get content_scale_aspect(): int64
        set content_scale_aspect(value: int64)
        
        /** The policy to use to determine the final scale factor for 2D elements. This affects how [member content_scale_factor] is applied, in addition to the automatic scale factor determined by [member content_scale_size]. */
        get content_scale_stretch(): int64
        set content_scale_stretch(value: int64)
        
        /** Specifies the base scale of [Window]'s content when its [member size] is equal to [member content_scale_size]. See also [method Viewport.get_stretch_transform]. */
        get content_scale_factor(): float64
        set content_scale_factor(value: float64)
        
        /** Toggles if any text should automatically change to its translated version depending on the current locale. */
        get auto_translate(): boolean
        set auto_translate(value: boolean)
        
        /** The human-readable node name that is reported to assistive apps. */
        get accessibility_name(): string
        set accessibility_name(value: string)
        
        /** The human-readable node description that is reported to assistive apps. */
        get accessibility_description(): string
        set accessibility_description(value: string)
        
        /** The [Theme] resource this node and all its [Control] and [Window] children use. If a child node has its own [Theme] resource set, theme items are merged with child's definitions having higher priority.  
         *      
         *  **Note:** [Window] styles will have no effect unless the window is embedded.  
         */
        get theme(): null | Theme
        set theme(value: null | Theme)
        
        /** The name of a theme type variation used by this [Window] to look up its own theme items. See [member Control.theme_type_variation] for more details. */
        get theme_type_variation(): string
        set theme_type_variation(value: string)
        
        /** Emitted when the [Window] is currently focused and receives any input, passing the received event as an argument. The event's position, if present, is in the embedder's coordinate system. */
        readonly window_input: Signal<(event: InputEvent) => void>
        
        /** Emitted when the mouse event is received by the custom decoration area defined by [member nonclient_area], and normal input to the window is blocked (such as when it has an exclusive child opened). [param event]'s position is in the embedder's coordinate system. */
        readonly nonclient_window_input: Signal<(event: InputEvent) => void>
        
        /** Emitted when files are dragged from the OS file manager and dropped in the game window. The argument is a list of file paths.  
         *    
         *      
         *  **Note:** This signal only works with native windows, i.e. the main window and [Window]-derived nodes when [member Viewport.gui_embed_subwindows] is disabled in the main viewport.  
         */
        readonly files_dropped: Signal<(files: PackedStringArray) => void>
        
        /** Emitted when the mouse cursor enters the [Window]'s visible area, that is not occluded behind other [Control]s or windows, provided its [member Viewport.gui_disable_input] is `false` and regardless if it's currently focused or not. */
        readonly mouse_entered: Signal<() => void>
        
        /** Emitted when the mouse cursor leaves the [Window]'s visible area, that is not occluded behind other [Control]s or windows, provided its [member Viewport.gui_disable_input] is `false` and regardless if it's currently focused or not. */
        readonly mouse_exited: Signal<() => void>
        
        /** Emitted when the [Window] gains focus. */
        readonly focus_entered: Signal<() => void>
        
        /** Emitted when the [Window] loses its focus. */
        readonly focus_exited: Signal<() => void>
        
        /** Emitted when the [Window]'s close button is pressed or when [member popup_window] is enabled and user clicks outside the window.  
         *  This signal can be used to handle window closing, e.g. by connecting it to [method hide].  
         */
        readonly close_requested: Signal<() => void>
        
        /** Emitted when a go back request is sent (e.g. pressing the "Back" button on Android), right after [constant Node.NOTIFICATION_WM_GO_BACK_REQUEST]. */
        readonly go_back_requested: Signal<() => void>
        
        /** Emitted when [Window] is made visible or disappears. */
        readonly visibility_changed: Signal<() => void>
        
        /** Emitted right after [method popup] call, before the [Window] appears or does anything. */
        readonly about_to_popup: Signal<() => void>
        
        /** Emitted when the [constant NOTIFICATION_THEME_CHANGED] notification is sent. */
        readonly theme_changed: Signal<() => void>
        
        /** Emitted when the [Window]'s DPI changes as a result of OS-level changes (e.g. moving the window from a Retina display to a lower resolution one).  
         *      
         *  **Note:** Only implemented on macOS and Linux (Wayland).  
         */
        readonly dpi_changed: Signal<() => void>
        
        /** Emitted when window title bar decorations are changed, e.g. macOS window enter/exit full screen mode, or extend-to-title flag is changed. */
        readonly titlebar_changed: Signal<() => void>
        
        /** Emitted when window title bar text is changed. */
        readonly title_changed: Signal<() => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapWindow;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapWindow;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapWorld2D extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapWorld2D extends __NameMapResource {
    }
    /** A resource that holds all components of a 2D world, such as a canvas and a physics space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_world2d.html  
     */
    class World2D extends Resource {
        constructor(identifier?: any)
        /** The [RID] of this world's canvas resource. Used by the [RenderingServer] for 2D drawing. */
        get canvas(): RID
        
        /** The [RID] of this world's navigation map. Used by the [NavigationServer2D]. */
        get navigation_map(): RID
        
        /** The [RID] of this world's physics space resource. Used by the [PhysicsServer2D] for 2D physics, treating it as both a space and an area. */
        get space(): RID
        
        /** Direct access to the world's physics 2D space state. Used for querying current and potential collisions. When using multi-threaded physics, access is limited to [method Node._physics_process] in the main thread. */
        get direct_space_state(): null | PhysicsDirectSpaceState2D
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapWorld2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapWorld2D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapWorld3D extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapWorld3D extends __NameMapResource {
    }
    /** A resource that holds all components of a 3D world, such as a visual scenario and a physics space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_world3d.html  
     */
    class World3D extends Resource {
        constructor(identifier?: any)
        /** The World3D's [Environment]. */
        get environment(): null | Environment
        set environment(value: null | Environment)
        
        /** The World3D's fallback environment will be used if [member environment] fails or is missing. */
        get fallback_environment(): null | Environment
        set fallback_environment(value: null | Environment)
        
        /** The default [CameraAttributes] resource to use if none set on the [Camera3D]. */
        get camera_attributes(): null | CameraAttributesPractical | CameraAttributesPhysical
        set camera_attributes(value: null | CameraAttributesPractical | CameraAttributesPhysical)
        
        /** The World3D's physics space. */
        get space(): RID
        
        /** The [RID] of this world's navigation map. Used by the [NavigationServer3D]. */
        get navigation_map(): RID
        
        /** The World3D's visual scenario. */
        get scenario(): RID
        
        /** Direct access to the world's physics 3D space state. Used for querying current and potential collisions. When using multi-threaded physics, access is limited to [method Node._physics_process] in the main thread. */
        get direct_space_state(): null | PhysicsDirectSpaceState3D
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapWorld3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapWorld3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapWorldBoundaryShape2D extends __RPCMapShape2D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapWorldBoundaryShape2D extends __NameMapShape2D {
    }
    /** A 2D world boundary (half-plane) shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_worldboundaryshape2d.html  
     */
    class WorldBoundaryShape2D extends Shape2D {
        constructor(identifier?: any)
        /** The line's normal, typically a unit vector. Its direction indicates the non-colliding half-plane. Can be of any length but zero. Defaults to [constant Vector2.UP]. */
        get normal(): Vector2
        set normal(value: Vector2)
        
        /** The distance from the origin to the line, expressed in terms of [member normal] (according to its direction and magnitude). Actual absolute distance from the origin to the line can be calculated as `abs(distance) / normal.length()`.  
         *  In the scalar equation of the line `ax + by = d`, this is `d`, while the `(a, b)` coordinates are represented by the [member normal] property.  
         */
        get distance(): float64
        set distance(value: float64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapWorldBoundaryShape2D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapWorldBoundaryShape2D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapWorldBoundaryShape3D extends __RPCMapShape3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapWorldBoundaryShape3D extends __NameMapShape3D {
    }
    /** A 3D world boundary (half-space) shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_worldboundaryshape3d.html  
     */
    class WorldBoundaryShape3D extends Shape3D {
        constructor(identifier?: any)
        /** The [Plane] used by the [WorldBoundaryShape3D] for collision. */
        get plane(): Plane
        set plane(value: Plane)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapWorldBoundaryShape3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapWorldBoundaryShape3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapWorldEnvironment extends __RPCMapNode {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapWorldEnvironment extends __NameMapNode {
    }
    /** Default environment properties for the entire scene (post-processing effects, lighting and background settings).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_worldenvironment.html  
     */
    class WorldEnvironment<Map extends NodePathMap = any> extends Node<Map> {
        constructor(identifier?: any)
        /** The [Environment] resource used by this [WorldEnvironment], defining the default properties. */
        get environment(): null | Environment
        set environment(value: null | Environment)
        
        /** The default [CameraAttributes] resource to use if none set on the [Camera3D]. */
        get camera_attributes(): null | CameraAttributesPractical | CameraAttributesPhysical
        set camera_attributes(value: null | CameraAttributesPractical | CameraAttributesPhysical)
        
        /** The default [Compositor] resource to use if none set on the [Camera3D]. */
        get compositor(): null | Compositor
        set compositor(value: null | Compositor)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapWorldEnvironment;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapWorldEnvironment;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapX509Certificate extends __RPCMapResource {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapX509Certificate extends __NameMapResource {
    }
    /** An X509 certificate (e.g. for TLS).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_x509certificate.html  
     */
    class X509Certificate extends Resource {
        constructor(identifier?: any)
        /** Saves a certificate to the given [param path] (should be a "*.crt" file). */
        save(path: string): Error
        
        /** Loads a certificate from [param path] ("*.crt" file). */
        load(path: string): Error
        
        /** Returns a string representation of the certificate, or an empty string if the certificate is invalid. */
        save_to_string(): string
        
        /** Loads a certificate from the given [param string]. */
        load_from_string(string_: string): Error
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapX509Certificate;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapX509Certificate;
    }
    namespace XMLParser {
        enum NodeType {
            /** There's no node (no file or buffer opened). */
            NODE_NONE = 0,
            
            /** An element node type, also known as a tag, e.g. `<title>`. */
            NODE_ELEMENT = 1,
            
            /** An end of element node type, e.g. `</title>`. */
            NODE_ELEMENT_END = 2,
            
            /** A text node type, i.e. text that is not inside an element. This includes whitespace. */
            NODE_TEXT = 3,
            
            /** A comment node type, e.g. `<!--A comment-->`. */
            NODE_COMMENT = 4,
            
            /** A node type for CDATA (Character Data) sections, e.g. `<![CDATA[CDATA section]]>`. */
            NODE_CDATA = 5,
            
            /** An unknown node type. */
            NODE_UNKNOWN = 6,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXMLParser extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXMLParser extends __NameMapRefCounted {
    }
    /** Provides a low-level interface for creating parsers for XML files.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xmlparser.html  
     */
    class XMLParser extends RefCounted {
        constructor(identifier?: any)
        /** Parses the next node in the file. This method returns an error code. */
        read(): Error
        
        /** Returns the type of the current node. Compare with [enum NodeType] constants. */
        get_node_type(): XMLParser.NodeType
        
        /** Returns the name of a node. This method will raise an error if the currently parsed node is a text node.  
         *      
         *  **Note:** The content of a [constant NODE_CDATA] node and the comment string of a [constant NODE_COMMENT] node are also considered names.  
         */
        get_node_name(): string
        
        /** Returns the contents of a text node. This method will raise an error if the current parsed node is of any other type. */
        get_node_data(): string
        
        /** Returns the byte offset of the currently parsed node since the beginning of the file or buffer. This is usually equivalent to the number of characters before the read position. */
        get_node_offset(): int64
        
        /** Returns the number of attributes in the currently parsed element.  
         *      
         *  **Note:** If this method is used while the currently parsed node is not [constant NODE_ELEMENT] or [constant NODE_ELEMENT_END], this count will not be updated and will still reflect the last element.  
         */
        get_attribute_count(): int64
        
        /** Returns the name of an attribute of the currently parsed element, specified by the [param idx] index. */
        get_attribute_name(idx: int64): string
        
        /** Returns the value of an attribute of the currently parsed element, specified by the [param idx] index. */
        get_attribute_value(idx: int64): string
        
        /** Returns `true` if the currently parsed element has an attribute with the [param name]. */
        has_attribute(name: string): boolean
        
        /** Returns the value of an attribute of the currently parsed element, specified by its [param name]. This method will raise an error if the element has no such attribute. */
        get_named_attribute_value(name: string): string
        
        /** Returns the value of an attribute of the currently parsed element, specified by its [param name]. This method will return an empty string if the element has no such attribute. */
        get_named_attribute_value_safe(name: string): string
        
        /** Returns `true` if the currently parsed element is empty, e.g. `<element />`. */
        is_empty(): boolean
        
        /** Returns the current line in the parsed file, counting from 0. */
        get_current_line(): int64
        
        /** Skips the current section. If the currently parsed node contains more inner nodes, they will be ignored and the cursor will go to the closing of the current element. */
        skip_section(): void
        
        /** Moves the buffer cursor to a certain offset (since the beginning) and reads the next node there. This method returns an error code. */
        seek(position: int64): Error
        
        /** Opens an XML [param file] for parsing. This method returns an error code. */
        open(file: string): Error
        
        /** Opens an XML raw [param buffer] for parsing. This method returns an error code. */
        open_buffer(buffer: PackedByteArray | byte[] | ArrayBuffer): Error
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXMLParser;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXMLParser;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXRAnchor3D extends __RPCMapXRNode3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXRAnchor3D extends __NameMapXRNode3D {
    }
    /** An anchor point in AR space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xranchor3d.html  
     */
    class XRAnchor3D<Map extends NodePathMap = any> extends XRNode3D<Map> {
        constructor(identifier?: any)
        /** Returns the estimated size of the plane that was detected. Say when the anchor relates to a table in the real world, this is the estimated size of the surface of that table. */
        get_size(): Vector3
        
        /** Returns a plane aligned with our anchor; handy for intersection testing. */
        get_plane(): Plane
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXRAnchor3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXRAnchor3D;
    }
    namespace XRBodyModifier3D {
        enum BodyUpdate {
            /** The skeleton's upper body joints are updated. */
            BODY_UPDATE_UPPER_BODY = 1,
            
            /** The skeleton's lower body joints are updated. */
            BODY_UPDATE_LOWER_BODY = 2,
            
            /** The skeleton's hand joints are updated. */
            BODY_UPDATE_HANDS = 4,
        }
        enum BoneUpdate {
            /** The skeleton's bones are fully updated (both position and rotation) to match the tracked bones. */
            BONE_UPDATE_FULL = 0,
            
            /** The skeleton's bones are only rotated to align with the tracked bones, preserving bone length. */
            BONE_UPDATE_ROTATION_ONLY = 1,
            
            /** Represents the size of the [enum BoneUpdate] enum. */
            BONE_UPDATE_MAX = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXRBodyModifier3D extends __RPCMapSkeletonModifier3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXRBodyModifier3D extends __NameMapSkeletonModifier3D {
    }
    /** A node for driving body meshes from [XRBodyTracker] data.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xrbodymodifier3d.html  
     */
    class XRBodyModifier3D<Map extends NodePathMap = any> extends SkeletonModifier3D<Map> {
        constructor(identifier?: any)
        /** The name of the [XRBodyTracker] registered with [XRServer] to obtain the body tracking data from. */
        get body_tracker(): string
        set body_tracker(value: string)
        
        /** Specifies the body parts to update. */
        get body_update(): int64
        set body_update(value: int64)
        
        /** Specifies the type of updates to perform on the bones. */
        get bone_update(): int64
        set bone_update(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXRBodyModifier3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXRBodyModifier3D;
    }
    namespace XRBodyTracker {
        enum BodyFlags {
            /** Upper body tracking supported. */
            BODY_FLAG_UPPER_BODY_SUPPORTED = 1,
            
            /** Lower body tracking supported. */
            BODY_FLAG_LOWER_BODY_SUPPORTED = 2,
            
            /** Hand tracking supported. */
            BODY_FLAG_HANDS_SUPPORTED = 4,
        }
        enum Joint {
            /** Root joint. */
            JOINT_ROOT = 0,
            
            /** Hips joint. */
            JOINT_HIPS = 1,
            
            /** Spine joint. */
            JOINT_SPINE = 2,
            
            /** Chest joint. */
            JOINT_CHEST = 3,
            
            /** Upper chest joint. */
            JOINT_UPPER_CHEST = 4,
            
            /** Neck joint. */
            JOINT_NECK = 5,
            
            /** Head joint. */
            JOINT_HEAD = 6,
            
            /** Head tip joint. */
            JOINT_HEAD_TIP = 7,
            
            /** Left shoulder joint. */
            JOINT_LEFT_SHOULDER = 8,
            
            /** Left upper arm joint. */
            JOINT_LEFT_UPPER_ARM = 9,
            
            /** Left lower arm joint. */
            JOINT_LEFT_LOWER_ARM = 10,
            
            /** Right shoulder joint. */
            JOINT_RIGHT_SHOULDER = 11,
            
            /** Right upper arm joint. */
            JOINT_RIGHT_UPPER_ARM = 12,
            
            /** Right lower arm joint. */
            JOINT_RIGHT_LOWER_ARM = 13,
            
            /** Left upper leg joint. */
            JOINT_LEFT_UPPER_LEG = 14,
            
            /** Left lower leg joint. */
            JOINT_LEFT_LOWER_LEG = 15,
            
            /** Left foot joint. */
            JOINT_LEFT_FOOT = 16,
            
            /** Left toes joint. */
            JOINT_LEFT_TOES = 17,
            
            /** Right upper leg joint. */
            JOINT_RIGHT_UPPER_LEG = 18,
            
            /** Right lower leg joint. */
            JOINT_RIGHT_LOWER_LEG = 19,
            
            /** Right foot joint. */
            JOINT_RIGHT_FOOT = 20,
            
            /** Right toes joint. */
            JOINT_RIGHT_TOES = 21,
            
            /** Left hand joint. */
            JOINT_LEFT_HAND = 22,
            
            /** Left palm joint. */
            JOINT_LEFT_PALM = 23,
            
            /** Left wrist joint. */
            JOINT_LEFT_WRIST = 24,
            
            /** Left thumb metacarpal joint. */
            JOINT_LEFT_THUMB_METACARPAL = 25,
            
            /** Left thumb phalanx proximal joint. */
            JOINT_LEFT_THUMB_PHALANX_PROXIMAL = 26,
            
            /** Left thumb phalanx distal joint. */
            JOINT_LEFT_THUMB_PHALANX_DISTAL = 27,
            
            /** Left thumb tip joint. */
            JOINT_LEFT_THUMB_TIP = 28,
            
            /** Left index finger metacarpal joint. */
            JOINT_LEFT_INDEX_FINGER_METACARPAL = 29,
            
            /** Left index finger phalanx proximal joint. */
            JOINT_LEFT_INDEX_FINGER_PHALANX_PROXIMAL = 30,
            
            /** Left index finger phalanx intermediate joint. */
            JOINT_LEFT_INDEX_FINGER_PHALANX_INTERMEDIATE = 31,
            
            /** Left index finger phalanx distal joint. */
            JOINT_LEFT_INDEX_FINGER_PHALANX_DISTAL = 32,
            
            /** Left index finger tip joint. */
            JOINT_LEFT_INDEX_FINGER_TIP = 33,
            
            /** Left middle finger metacarpal joint. */
            JOINT_LEFT_MIDDLE_FINGER_METACARPAL = 34,
            
            /** Left middle finger phalanx proximal joint. */
            JOINT_LEFT_MIDDLE_FINGER_PHALANX_PROXIMAL = 35,
            
            /** Left middle finger phalanx intermediate joint. */
            JOINT_LEFT_MIDDLE_FINGER_PHALANX_INTERMEDIATE = 36,
            
            /** Left middle finger phalanx distal joint. */
            JOINT_LEFT_MIDDLE_FINGER_PHALANX_DISTAL = 37,
            
            /** Left middle finger tip joint. */
            JOINT_LEFT_MIDDLE_FINGER_TIP = 38,
            
            /** Left ring finger metacarpal joint. */
            JOINT_LEFT_RING_FINGER_METACARPAL = 39,
            
            /** Left ring finger phalanx proximal joint. */
            JOINT_LEFT_RING_FINGER_PHALANX_PROXIMAL = 40,
            
            /** Left ring finger phalanx intermediate joint. */
            JOINT_LEFT_RING_FINGER_PHALANX_INTERMEDIATE = 41,
            
            /** Left ring finger phalanx distal joint. */
            JOINT_LEFT_RING_FINGER_PHALANX_DISTAL = 42,
            
            /** Left ring finger tip joint. */
            JOINT_LEFT_RING_FINGER_TIP = 43,
            
            /** Left pinky finger metacarpal joint. */
            JOINT_LEFT_PINKY_FINGER_METACARPAL = 44,
            
            /** Left pinky finger phalanx proximal joint. */
            JOINT_LEFT_PINKY_FINGER_PHALANX_PROXIMAL = 45,
            
            /** Left pinky finger phalanx intermediate joint. */
            JOINT_LEFT_PINKY_FINGER_PHALANX_INTERMEDIATE = 46,
            
            /** Left pinky finger phalanx distal joint. */
            JOINT_LEFT_PINKY_FINGER_PHALANX_DISTAL = 47,
            
            /** Left pinky finger tip joint. */
            JOINT_LEFT_PINKY_FINGER_TIP = 48,
            
            /** Right hand joint. */
            JOINT_RIGHT_HAND = 49,
            
            /** Right palm joint. */
            JOINT_RIGHT_PALM = 50,
            
            /** Right wrist joint. */
            JOINT_RIGHT_WRIST = 51,
            
            /** Right thumb metacarpal joint. */
            JOINT_RIGHT_THUMB_METACARPAL = 52,
            
            /** Right thumb phalanx proximal joint. */
            JOINT_RIGHT_THUMB_PHALANX_PROXIMAL = 53,
            
            /** Right thumb phalanx distal joint. */
            JOINT_RIGHT_THUMB_PHALANX_DISTAL = 54,
            
            /** Right thumb tip joint. */
            JOINT_RIGHT_THUMB_TIP = 55,
            
            /** Right index finger metacarpal joint. */
            JOINT_RIGHT_INDEX_FINGER_METACARPAL = 56,
            
            /** Right index finger phalanx proximal joint. */
            JOINT_RIGHT_INDEX_FINGER_PHALANX_PROXIMAL = 57,
            
            /** Right index finger phalanx intermediate joint. */
            JOINT_RIGHT_INDEX_FINGER_PHALANX_INTERMEDIATE = 58,
            
            /** Right index finger phalanx distal joint. */
            JOINT_RIGHT_INDEX_FINGER_PHALANX_DISTAL = 59,
            
            /** Right index finger tip joint. */
            JOINT_RIGHT_INDEX_FINGER_TIP = 60,
            
            /** Right middle finger metacarpal joint. */
            JOINT_RIGHT_MIDDLE_FINGER_METACARPAL = 61,
            
            /** Right middle finger phalanx proximal joint. */
            JOINT_RIGHT_MIDDLE_FINGER_PHALANX_PROXIMAL = 62,
            
            /** Right middle finger phalanx intermediate joint. */
            JOINT_RIGHT_MIDDLE_FINGER_PHALANX_INTERMEDIATE = 63,
            
            /** Right middle finger phalanx distal joint. */
            JOINT_RIGHT_MIDDLE_FINGER_PHALANX_DISTAL = 64,
            
            /** Right middle finger tip joint. */
            JOINT_RIGHT_MIDDLE_FINGER_TIP = 65,
            
            /** Right ring finger metacarpal joint. */
            JOINT_RIGHT_RING_FINGER_METACARPAL = 66,
            
            /** Right ring finger phalanx proximal joint. */
            JOINT_RIGHT_RING_FINGER_PHALANX_PROXIMAL = 67,
            
            /** Right ring finger phalanx intermediate joint. */
            JOINT_RIGHT_RING_FINGER_PHALANX_INTERMEDIATE = 68,
            
            /** Right ring finger phalanx distal joint. */
            JOINT_RIGHT_RING_FINGER_PHALANX_DISTAL = 69,
            
            /** Right ring finger tip joint. */
            JOINT_RIGHT_RING_FINGER_TIP = 70,
            
            /** Right pinky finger metacarpal joint. */
            JOINT_RIGHT_PINKY_FINGER_METACARPAL = 71,
            
            /** Right pinky finger phalanx proximal joint. */
            JOINT_RIGHT_PINKY_FINGER_PHALANX_PROXIMAL = 72,
            
            /** Right pinky finger phalanx intermediate joint. */
            JOINT_RIGHT_PINKY_FINGER_PHALANX_INTERMEDIATE = 73,
            
            /** Right pinky finger phalanx distal joint. */
            JOINT_RIGHT_PINKY_FINGER_PHALANX_DISTAL = 74,
            
            /** Right pinky finger tip joint. */
            JOINT_RIGHT_PINKY_FINGER_TIP = 75,
            
            /** Lower chest joint. */
            JOINT_LOWER_CHEST = 76,
            
            /** Left scapula joint. */
            JOINT_LEFT_SCAPULA = 77,
            
            /** Left wrist twist joint. */
            JOINT_LEFT_WRIST_TWIST = 78,
            
            /** Right scapula joint. */
            JOINT_RIGHT_SCAPULA = 79,
            
            /** Right wrist twist joint. */
            JOINT_RIGHT_WRIST_TWIST = 80,
            
            /** Left foot twist joint. */
            JOINT_LEFT_FOOT_TWIST = 81,
            
            /** Left heel joint. */
            JOINT_LEFT_HEEL = 82,
            
            /** Left middle foot joint. */
            JOINT_LEFT_MIDDLE_FOOT = 83,
            
            /** Right foot twist joint. */
            JOINT_RIGHT_FOOT_TWIST = 84,
            
            /** Right heel joint. */
            JOINT_RIGHT_HEEL = 85,
            
            /** Right middle foot joint. */
            JOINT_RIGHT_MIDDLE_FOOT = 86,
            
            /** Represents the size of the [enum Joint] enum. */
            JOINT_MAX = 87,
        }
        enum JointFlags {
            /** The joint's orientation data is valid. */
            JOINT_FLAG_ORIENTATION_VALID = 1,
            
            /** The joint's orientation is actively tracked. May not be set if tracking has been temporarily lost. */
            JOINT_FLAG_ORIENTATION_TRACKED = 2,
            
            /** The joint's position data is valid. */
            JOINT_FLAG_POSITION_VALID = 4,
            
            /** The joint's position is actively tracked. May not be set if tracking has been temporarily lost. */
            JOINT_FLAG_POSITION_TRACKED = 8,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXRBodyTracker extends __RPCMapXRPositionalTracker {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXRBodyTracker extends __NameMapXRPositionalTracker {
    }
    /** A tracked body in XR.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xrbodytracker.html  
     */
    class XRBodyTracker extends XRPositionalTracker {
        constructor(identifier?: any)
        /** Sets flags about the validity of the tracking data for the given body joint. */
        set_joint_flags(joint: XRBodyTracker.Joint, flags: XRBodyTracker.JointFlags): void
        
        /** Returns flags about the validity of the tracking data for the given body joint. */
        get_joint_flags(joint: XRBodyTracker.Joint): XRBodyTracker.JointFlags
        
        /** Sets the transform for the given body joint. */
        set_joint_transform(joint: XRBodyTracker.Joint, transform: Transform3D): void
        
        /** Returns the transform for the given body joint. */
        get_joint_transform(joint: XRBodyTracker.Joint): Transform3D
        
        /** If `true`, the body tracking data is valid. */
        get has_tracking_data(): boolean
        set has_tracking_data(value: boolean)
        
        /** The type of body tracking data captured. */
        get body_flags(): int64
        set body_flags(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXRBodyTracker;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXRBodyTracker;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXRCamera3D extends __RPCMapCamera3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXRCamera3D extends __NameMapCamera3D {
    }
    /** A camera node with a few overrules for AR/VR applied, such as location tracking.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xrcamera3d.html  
     */
    class XRCamera3D<Map extends NodePathMap = any> extends Camera3D<Map> {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXRCamera3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXRCamera3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXRController3D extends __RPCMapXRNode3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXRController3D extends __NameMapXRNode3D {
    }
    /** A 3D node representing a spatially-tracked controller.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xrcontroller3d.html  
     */
    class XRController3D<Map extends NodePathMap = any> extends XRNode3D<Map> {
        constructor(identifier?: any)
        /** Returns `true` if the button with the given [param name] is pressed.  
         *      
         *  **Note:** The current [XRInterface] defines the [param name] for each input. In the case of OpenXR, these are the names of actions in the current action set.  
         */
        is_button_pressed(name: StringName): boolean
        
        /** Returns a [Variant] for the input with the given [param name]. This works for any input type, the variant will be typed according to the actions configuration.  
         *      
         *  **Note:** The current [XRInterface] defines the [param name] for each input. In the case of OpenXR, these are the names of actions in the current action set.  
         */
        get_input(name: StringName): any
        
        /** Returns a numeric value for the input with the given [param name]. This is used for triggers and grip sensors.  
         *      
         *  **Note:** The current [XRInterface] defines the [param name] for each input. In the case of OpenXR, these are the names of actions in the current action set.  
         */
        get_float(name: StringName): float64
        
        /** Returns a [Vector2] for the input with the given [param name]. This is used for thumbsticks and thumbpads found on many controllers.  
         *      
         *  **Note:** The current [XRInterface] defines the [param name] for each input. In the case of OpenXR, these are the names of actions in the current action set.  
         */
        get_vector2(name: StringName): Vector2
        
        /** Returns the hand holding this controller, if known. */
        get_tracker_hand(): XRPositionalTracker.TrackerHand
        
        /** Emitted when a button on this controller is pressed. */
        readonly button_pressed: Signal<(name: string) => void>
        
        /** Emitted when a button on this controller is released. */
        readonly button_released: Signal<(name: string) => void>
        
        /** Emitted when a trigger or similar input on this controller changes value. */
        readonly input_float_changed: Signal<(name: string, value: float64) => void>
        
        /** Emitted when a thumbstick or thumbpad on this controller is moved. */
        readonly input_vector2_changed: Signal<(name: string, value: Vector2) => void>
        
        /** Emitted when the interaction profile on this controller is changed. */
        readonly profile_changed: Signal<(role: string) => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXRController3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXRController3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXRControllerTracker extends __RPCMapXRPositionalTracker {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXRControllerTracker extends __NameMapXRPositionalTracker {
    }
    /** A tracked controller.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xrcontrollertracker.html  
     */
    class XRControllerTracker extends XRPositionalTracker {
        constructor(identifier?: any)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXRControllerTracker;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXRControllerTracker;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXRFaceModifier3D extends __RPCMapNode3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXRFaceModifier3D extends __NameMapNode3D {
    }
    /** A node for driving standard face meshes from [XRFaceTracker] weights.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xrfacemodifier3d.html  
     */
    class XRFaceModifier3D<Map extends NodePathMap = any> extends Node3D<Map> {
        constructor(identifier?: any)
        /** The [XRFaceTracker] path. */
        get face_tracker(): string
        set face_tracker(value: string)
        
        /** The [NodePath] of the face [MeshInstance3D]. */
        get target(): NodePath
        set target(value: NodePath | string)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXRFaceModifier3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXRFaceModifier3D;
    }
    namespace XRFaceTracker {
        enum BlendShapeEntry {
            /** Right eye looks outwards. */
            FT_EYE_LOOK_OUT_RIGHT = 0,
            
            /** Right eye looks inwards. */
            FT_EYE_LOOK_IN_RIGHT = 1,
            
            /** Right eye looks upwards. */
            FT_EYE_LOOK_UP_RIGHT = 2,
            
            /** Right eye looks downwards. */
            FT_EYE_LOOK_DOWN_RIGHT = 3,
            
            /** Left eye looks outwards. */
            FT_EYE_LOOK_OUT_LEFT = 4,
            
            /** Left eye looks inwards. */
            FT_EYE_LOOK_IN_LEFT = 5,
            
            /** Left eye looks upwards. */
            FT_EYE_LOOK_UP_LEFT = 6,
            
            /** Left eye looks downwards. */
            FT_EYE_LOOK_DOWN_LEFT = 7,
            
            /** Closes the right eyelid. */
            FT_EYE_CLOSED_RIGHT = 8,
            
            /** Closes the left eyelid. */
            FT_EYE_CLOSED_LEFT = 9,
            
            /** Squeezes the right eye socket muscles. */
            FT_EYE_SQUINT_RIGHT = 10,
            
            /** Squeezes the left eye socket muscles. */
            FT_EYE_SQUINT_LEFT = 11,
            
            /** Right eyelid widens beyond relaxed. */
            FT_EYE_WIDE_RIGHT = 12,
            
            /** Left eyelid widens beyond relaxed. */
            FT_EYE_WIDE_LEFT = 13,
            
            /** Dilates the right eye pupil. */
            FT_EYE_DILATION_RIGHT = 14,
            
            /** Dilates the left eye pupil. */
            FT_EYE_DILATION_LEFT = 15,
            
            /** Constricts the right eye pupil. */
            FT_EYE_CONSTRICT_RIGHT = 16,
            
            /** Constricts the left eye pupil. */
            FT_EYE_CONSTRICT_LEFT = 17,
            
            /** Right eyebrow pinches in. */
            FT_BROW_PINCH_RIGHT = 18,
            
            /** Left eyebrow pinches in. */
            FT_BROW_PINCH_LEFT = 19,
            
            /** Outer right eyebrow pulls down. */
            FT_BROW_LOWERER_RIGHT = 20,
            
            /** Outer left eyebrow pulls down. */
            FT_BROW_LOWERER_LEFT = 21,
            
            /** Inner right eyebrow pulls up. */
            FT_BROW_INNER_UP_RIGHT = 22,
            
            /** Inner left eyebrow pulls up. */
            FT_BROW_INNER_UP_LEFT = 23,
            
            /** Outer right eyebrow pulls up. */
            FT_BROW_OUTER_UP_RIGHT = 24,
            
            /** Outer left eyebrow pulls up. */
            FT_BROW_OUTER_UP_LEFT = 25,
            
            /** Right side face sneers. */
            FT_NOSE_SNEER_RIGHT = 26,
            
            /** Left side face sneers. */
            FT_NOSE_SNEER_LEFT = 27,
            
            /** Right side nose canal dilates. */
            FT_NASAL_DILATION_RIGHT = 28,
            
            /** Left side nose canal dilates. */
            FT_NASAL_DILATION_LEFT = 29,
            
            /** Right side nose canal constricts. */
            FT_NASAL_CONSTRICT_RIGHT = 30,
            
            /** Left side nose canal constricts. */
            FT_NASAL_CONSTRICT_LEFT = 31,
            
            /** Raises the right side cheek. */
            FT_CHEEK_SQUINT_RIGHT = 32,
            
            /** Raises the left side cheek. */
            FT_CHEEK_SQUINT_LEFT = 33,
            
            /** Puffs the right side cheek. */
            FT_CHEEK_PUFF_RIGHT = 34,
            
            /** Puffs the left side cheek. */
            FT_CHEEK_PUFF_LEFT = 35,
            
            /** Sucks in the right side cheek. */
            FT_CHEEK_SUCK_RIGHT = 36,
            
            /** Sucks in the left side cheek. */
            FT_CHEEK_SUCK_LEFT = 37,
            
            /** Opens jawbone. */
            FT_JAW_OPEN = 38,
            
            /** Closes the mouth. */
            FT_MOUTH_CLOSED = 39,
            
            /** Pushes jawbone right. */
            FT_JAW_RIGHT = 40,
            
            /** Pushes jawbone left. */
            FT_JAW_LEFT = 41,
            
            /** Pushes jawbone forward. */
            FT_JAW_FORWARD = 42,
            
            /** Pushes jawbone backward. */
            FT_JAW_BACKWARD = 43,
            
            /** Flexes jaw muscles. */
            FT_JAW_CLENCH = 44,
            
            /** Raises the jawbone. */
            FT_JAW_MANDIBLE_RAISE = 45,
            
            /** Upper right lip part tucks in the mouth. */
            FT_LIP_SUCK_UPPER_RIGHT = 46,
            
            /** Upper left lip part tucks in the mouth. */
            FT_LIP_SUCK_UPPER_LEFT = 47,
            
            /** Lower right lip part tucks in the mouth. */
            FT_LIP_SUCK_LOWER_RIGHT = 48,
            
            /** Lower left lip part tucks in the mouth. */
            FT_LIP_SUCK_LOWER_LEFT = 49,
            
            /** Right lip corner folds into the mouth. */
            FT_LIP_SUCK_CORNER_RIGHT = 50,
            
            /** Left lip corner folds into the mouth. */
            FT_LIP_SUCK_CORNER_LEFT = 51,
            
            /** Upper right lip part pushes into a funnel. */
            FT_LIP_FUNNEL_UPPER_RIGHT = 52,
            
            /** Upper left lip part pushes into a funnel. */
            FT_LIP_FUNNEL_UPPER_LEFT = 53,
            
            /** Lower right lip part pushes into a funnel. */
            FT_LIP_FUNNEL_LOWER_RIGHT = 54,
            
            /** Lower left lip part pushes into a funnel. */
            FT_LIP_FUNNEL_LOWER_LEFT = 55,
            
            /** Upper right lip part pushes outwards. */
            FT_LIP_PUCKER_UPPER_RIGHT = 56,
            
            /** Upper left lip part pushes outwards. */
            FT_LIP_PUCKER_UPPER_LEFT = 57,
            
            /** Lower right lip part pushes outwards. */
            FT_LIP_PUCKER_LOWER_RIGHT = 58,
            
            /** Lower left lip part pushes outwards. */
            FT_LIP_PUCKER_LOWER_LEFT = 59,
            
            /** Upper right part of the lip pulls up. */
            FT_MOUTH_UPPER_UP_RIGHT = 60,
            
            /** Upper left part of the lip pulls up. */
            FT_MOUTH_UPPER_UP_LEFT = 61,
            
            /** Lower right part of the lip pulls up. */
            FT_MOUTH_LOWER_DOWN_RIGHT = 62,
            
            /** Lower left part of the lip pulls up. */
            FT_MOUTH_LOWER_DOWN_LEFT = 63,
            
            /** Upper right lip part pushes in the cheek. */
            FT_MOUTH_UPPER_DEEPEN_RIGHT = 64,
            
            /** Upper left lip part pushes in the cheek. */
            FT_MOUTH_UPPER_DEEPEN_LEFT = 65,
            
            /** Moves upper lip right. */
            FT_MOUTH_UPPER_RIGHT = 66,
            
            /** Moves upper lip left. */
            FT_MOUTH_UPPER_LEFT = 67,
            
            /** Moves lower lip right. */
            FT_MOUTH_LOWER_RIGHT = 68,
            
            /** Moves lower lip left. */
            FT_MOUTH_LOWER_LEFT = 69,
            
            /** Right lip corner pulls diagonally up and out. */
            FT_MOUTH_CORNER_PULL_RIGHT = 70,
            
            /** Left lip corner pulls diagonally up and out. */
            FT_MOUTH_CORNER_PULL_LEFT = 71,
            
            /** Right corner lip slants up. */
            FT_MOUTH_CORNER_SLANT_RIGHT = 72,
            
            /** Left corner lip slants up. */
            FT_MOUTH_CORNER_SLANT_LEFT = 73,
            
            /** Right corner lip pulls down. */
            FT_MOUTH_FROWN_RIGHT = 74,
            
            /** Left corner lip pulls down. */
            FT_MOUTH_FROWN_LEFT = 75,
            
            /** Mouth corner lip pulls out and down. */
            FT_MOUTH_STRETCH_RIGHT = 76,
            
            /** Mouth corner lip pulls out and down. */
            FT_MOUTH_STRETCH_LEFT = 77,
            
            /** Right lip corner is pushed backwards. */
            FT_MOUTH_DIMPLE_RIGHT = 78,
            
            /** Left lip corner is pushed backwards. */
            FT_MOUTH_DIMPLE_LEFT = 79,
            
            /** Raises and slightly pushes out the upper mouth. */
            FT_MOUTH_RAISER_UPPER = 80,
            
            /** Raises and slightly pushes out the lower mouth. */
            FT_MOUTH_RAISER_LOWER = 81,
            
            /** Right side lips press and flatten together vertically. */
            FT_MOUTH_PRESS_RIGHT = 82,
            
            /** Left side lips press and flatten together vertically. */
            FT_MOUTH_PRESS_LEFT = 83,
            
            /** Right side lips squeeze together horizontally. */
            FT_MOUTH_TIGHTENER_RIGHT = 84,
            
            /** Left side lips squeeze together horizontally. */
            FT_MOUTH_TIGHTENER_LEFT = 85,
            
            /** Tongue visibly sticks out of the mouth. */
            FT_TONGUE_OUT = 86,
            
            /** Tongue points upwards. */
            FT_TONGUE_UP = 87,
            
            /** Tongue points downwards. */
            FT_TONGUE_DOWN = 88,
            
            /** Tongue points right. */
            FT_TONGUE_RIGHT = 89,
            
            /** Tongue points left. */
            FT_TONGUE_LEFT = 90,
            
            /** Sides of the tongue funnel, creating a roll. */
            FT_TONGUE_ROLL = 91,
            
            /** Tongue arches up then down inside the mouth. */
            FT_TONGUE_BLEND_DOWN = 92,
            
            /** Tongue arches down then up inside the mouth. */
            FT_TONGUE_CURL_UP = 93,
            
            /** Tongue squishes together and thickens. */
            FT_TONGUE_SQUISH = 94,
            
            /** Tongue flattens and thins out. */
            FT_TONGUE_FLAT = 95,
            
            /** Tongue tip rotates clockwise, with the rest following gradually. */
            FT_TONGUE_TWIST_RIGHT = 96,
            
            /** Tongue tip rotates counter-clockwise, with the rest following gradually. */
            FT_TONGUE_TWIST_LEFT = 97,
            
            /** Inner mouth throat closes. */
            FT_SOFT_PALATE_CLOSE = 98,
            
            /** The Adam's apple visibly swallows. */
            FT_THROAT_SWALLOW = 99,
            
            /** Right side neck visibly flexes. */
            FT_NECK_FLEX_RIGHT = 100,
            
            /** Left side neck visibly flexes. */
            FT_NECK_FLEX_LEFT = 101,
            
            /** Closes both eye lids. */
            FT_EYE_CLOSED = 102,
            
            /** Widens both eye lids. */
            FT_EYE_WIDE = 103,
            
            /** Squints both eye lids. */
            FT_EYE_SQUINT = 104,
            
            /** Dilates both pupils. */
            FT_EYE_DILATION = 105,
            
            /** Constricts both pupils. */
            FT_EYE_CONSTRICT = 106,
            
            /** Pulls the right eyebrow down and in. */
            FT_BROW_DOWN_RIGHT = 107,
            
            /** Pulls the left eyebrow down and in. */
            FT_BROW_DOWN_LEFT = 108,
            
            /** Pulls both eyebrows down and in. */
            FT_BROW_DOWN = 109,
            
            /** Right brow appears worried. */
            FT_BROW_UP_RIGHT = 110,
            
            /** Left brow appears worried. */
            FT_BROW_UP_LEFT = 111,
            
            /** Both brows appear worried. */
            FT_BROW_UP = 112,
            
            /** Entire face sneers. */
            FT_NOSE_SNEER = 113,
            
            /** Both nose canals dilate. */
            FT_NASAL_DILATION = 114,
            
            /** Both nose canals constrict. */
            FT_NASAL_CONSTRICT = 115,
            
            /** Puffs both cheeks. */
            FT_CHEEK_PUFF = 116,
            
            /** Sucks in both cheeks. */
            FT_CHEEK_SUCK = 117,
            
            /** Raises both cheeks. */
            FT_CHEEK_SQUINT = 118,
            
            /** Tucks in the upper lips. */
            FT_LIP_SUCK_UPPER = 119,
            
            /** Tucks in the lower lips. */
            FT_LIP_SUCK_LOWER = 120,
            
            /** Tucks in both lips. */
            FT_LIP_SUCK = 121,
            
            /** Funnels in the upper lips. */
            FT_LIP_FUNNEL_UPPER = 122,
            
            /** Funnels in the lower lips. */
            FT_LIP_FUNNEL_LOWER = 123,
            
            /** Funnels in both lips. */
            FT_LIP_FUNNEL = 124,
            
            /** Upper lip part pushes outwards. */
            FT_LIP_PUCKER_UPPER = 125,
            
            /** Lower lip part pushes outwards. */
            FT_LIP_PUCKER_LOWER = 126,
            
            /** Lips push outwards. */
            FT_LIP_PUCKER = 127,
            
            /** Raises the upper lips. */
            FT_MOUTH_UPPER_UP = 128,
            
            /** Lowers the lower lips. */
            FT_MOUTH_LOWER_DOWN = 129,
            
            /** Mouth opens, revealing teeth. */
            FT_MOUTH_OPEN = 130,
            
            /** Moves mouth right. */
            FT_MOUTH_RIGHT = 131,
            
            /** Moves mouth left. */
            FT_MOUTH_LEFT = 132,
            
            /** Right side of the mouth smiles. */
            FT_MOUTH_SMILE_RIGHT = 133,
            
            /** Left side of the mouth smiles. */
            FT_MOUTH_SMILE_LEFT = 134,
            
            /** Mouth expresses a smile. */
            FT_MOUTH_SMILE = 135,
            
            /** Right side of the mouth expresses sadness. */
            FT_MOUTH_SAD_RIGHT = 136,
            
            /** Left side of the mouth expresses sadness. */
            FT_MOUTH_SAD_LEFT = 137,
            
            /** Mouth expresses sadness. */
            FT_MOUTH_SAD = 138,
            
            /** Mouth stretches. */
            FT_MOUTH_STRETCH = 139,
            
            /** Lip corners dimple. */
            FT_MOUTH_DIMPLE = 140,
            
            /** Mouth tightens. */
            FT_MOUTH_TIGHTENER = 141,
            
            /** Mouth presses together. */
            FT_MOUTH_PRESS = 142,
            
            /** Represents the size of the [enum BlendShapeEntry] enum. */
            FT_MAX = 143,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXRFaceTracker extends __RPCMapXRTracker {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXRFaceTracker extends __NameMapXRTracker {
    }
    /** A tracked face.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xrfacetracker.html  
     */
    class XRFaceTracker extends XRTracker {
        constructor(identifier?: any)
        /** Returns the requested face blend shape weight. */
        get_blend_shape(blend_shape: XRFaceTracker.BlendShapeEntry): float64
        
        /** Sets a face blend shape weight. */
        set_blend_shape(blend_shape: XRFaceTracker.BlendShapeEntry, weight: float64): void
        
        /** The array of face blend shape weights with indices corresponding to the [enum BlendShapeEntry] enum. */
        get blend_shapes(): PackedFloat32Array
        set blend_shapes(value: PackedFloat32Array | float32[])
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXRFaceTracker;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXRFaceTracker;
    }
    namespace XRHandModifier3D {
        enum BoneUpdate {
            /** The skeleton's bones are fully updated (both position and rotation) to match the tracked bones. */
            BONE_UPDATE_FULL = 0,
            
            /** The skeleton's bones are only rotated to align with the tracked bones, preserving bone length. */
            BONE_UPDATE_ROTATION_ONLY = 1,
            
            /** Represents the size of the [enum BoneUpdate] enum. */
            BONE_UPDATE_MAX = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXRHandModifier3D extends __RPCMapSkeletonModifier3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXRHandModifier3D extends __NameMapSkeletonModifier3D {
    }
    /** A node for driving hand meshes from [XRHandTracker] data.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xrhandmodifier3d.html  
     */
    class XRHandModifier3D<Map extends NodePathMap = any> extends SkeletonModifier3D<Map> {
        constructor(identifier?: any)
        /** The name of the [XRHandTracker] registered with [XRServer] to obtain the hand tracking data from. */
        get hand_tracker(): string
        set hand_tracker(value: string)
        
        /** Specifies the type of updates to perform on the bones. */
        get bone_update(): int64
        set bone_update(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXRHandModifier3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXRHandModifier3D;
    }
    namespace XRHandTracker {
        enum HandTrackingSource {
            /** The source of hand tracking data is unknown. */
            HAND_TRACKING_SOURCE_UNKNOWN = 0,
            
            /** The source of hand tracking data is unobstructed, meaning that an accurate method of hand tracking is used. These include optical hand tracking, data gloves, etc. */
            HAND_TRACKING_SOURCE_UNOBSTRUCTED = 1,
            
            /** The source of hand tracking data is a controller, meaning that joint positions are inferred from controller inputs. */
            HAND_TRACKING_SOURCE_CONTROLLER = 2,
            
            /** No hand tracking data is tracked, this either means the hand is obscured, the controller is turned off, or tracking is not supported for the current input type. */
            HAND_TRACKING_SOURCE_NOT_TRACKED = 3,
            
            /** Represents the size of the [enum HandTrackingSource] enum. */
            HAND_TRACKING_SOURCE_MAX = 4,
        }
        enum HandJoint {
            /** Palm joint. */
            HAND_JOINT_PALM = 0,
            
            /** Wrist joint. */
            HAND_JOINT_WRIST = 1,
            
            /** Thumb metacarpal joint. */
            HAND_JOINT_THUMB_METACARPAL = 2,
            
            /** Thumb phalanx proximal joint. */
            HAND_JOINT_THUMB_PHALANX_PROXIMAL = 3,
            
            /** Thumb phalanx distal joint. */
            HAND_JOINT_THUMB_PHALANX_DISTAL = 4,
            
            /** Thumb tip joint. */
            HAND_JOINT_THUMB_TIP = 5,
            
            /** Index finger metacarpal joint. */
            HAND_JOINT_INDEX_FINGER_METACARPAL = 6,
            
            /** Index finger phalanx proximal joint. */
            HAND_JOINT_INDEX_FINGER_PHALANX_PROXIMAL = 7,
            
            /** Index finger phalanx intermediate joint. */
            HAND_JOINT_INDEX_FINGER_PHALANX_INTERMEDIATE = 8,
            
            /** Index finger phalanx distal joint. */
            HAND_JOINT_INDEX_FINGER_PHALANX_DISTAL = 9,
            
            /** Index finger tip joint. */
            HAND_JOINT_INDEX_FINGER_TIP = 10,
            
            /** Middle finger metacarpal joint. */
            HAND_JOINT_MIDDLE_FINGER_METACARPAL = 11,
            
            /** Middle finger phalanx proximal joint. */
            HAND_JOINT_MIDDLE_FINGER_PHALANX_PROXIMAL = 12,
            
            /** Middle finger phalanx intermediate joint. */
            HAND_JOINT_MIDDLE_FINGER_PHALANX_INTERMEDIATE = 13,
            
            /** Middle finger phalanx distal joint. */
            HAND_JOINT_MIDDLE_FINGER_PHALANX_DISTAL = 14,
            
            /** Middle finger tip joint. */
            HAND_JOINT_MIDDLE_FINGER_TIP = 15,
            
            /** Ring finger metacarpal joint. */
            HAND_JOINT_RING_FINGER_METACARPAL = 16,
            
            /** Ring finger phalanx proximal joint. */
            HAND_JOINT_RING_FINGER_PHALANX_PROXIMAL = 17,
            
            /** Ring finger phalanx intermediate joint. */
            HAND_JOINT_RING_FINGER_PHALANX_INTERMEDIATE = 18,
            
            /** Ring finger phalanx distal joint. */
            HAND_JOINT_RING_FINGER_PHALANX_DISTAL = 19,
            
            /** Ring finger tip joint. */
            HAND_JOINT_RING_FINGER_TIP = 20,
            
            /** Pinky finger metacarpal joint. */
            HAND_JOINT_PINKY_FINGER_METACARPAL = 21,
            
            /** Pinky finger phalanx proximal joint. */
            HAND_JOINT_PINKY_FINGER_PHALANX_PROXIMAL = 22,
            
            /** Pinky finger phalanx intermediate joint. */
            HAND_JOINT_PINKY_FINGER_PHALANX_INTERMEDIATE = 23,
            
            /** Pinky finger phalanx distal joint. */
            HAND_JOINT_PINKY_FINGER_PHALANX_DISTAL = 24,
            
            /** Pinky finger tip joint. */
            HAND_JOINT_PINKY_FINGER_TIP = 25,
            
            /** Represents the size of the [enum HandJoint] enum. */
            HAND_JOINT_MAX = 26,
        }
        enum HandJointFlags {
            /** The hand joint's orientation data is valid. */
            HAND_JOINT_FLAG_ORIENTATION_VALID = 1,
            
            /** The hand joint's orientation is actively tracked. May not be set if tracking has been temporarily lost. */
            HAND_JOINT_FLAG_ORIENTATION_TRACKED = 2,
            
            /** The hand joint's position data is valid. */
            HAND_JOINT_FLAG_POSITION_VALID = 4,
            
            /** The hand joint's position is actively tracked. May not be set if tracking has been temporarily lost. */
            HAND_JOINT_FLAG_POSITION_TRACKED = 8,
            
            /** The hand joint's linear velocity data is valid. */
            HAND_JOINT_FLAG_LINEAR_VELOCITY_VALID = 16,
            
            /** The hand joint's angular velocity data is valid. */
            HAND_JOINT_FLAG_ANGULAR_VELOCITY_VALID = 32,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXRHandTracker extends __RPCMapXRPositionalTracker {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXRHandTracker extends __NameMapXRPositionalTracker {
    }
    /** A tracked hand in XR.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xrhandtracker.html  
     */
    class XRHandTracker extends XRPositionalTracker {
        constructor(identifier?: any)
        /** Sets flags about the validity of the tracking data for the given hand joint. */
        set_hand_joint_flags(joint: XRHandTracker.HandJoint, flags: XRHandTracker.HandJointFlags): void
        
        /** Returns flags about the validity of the tracking data for the given hand joint. */
        get_hand_joint_flags(joint: XRHandTracker.HandJoint): XRHandTracker.HandJointFlags
        
        /** Sets the transform for the given hand joint. */
        set_hand_joint_transform(joint: XRHandTracker.HandJoint, transform: Transform3D): void
        
        /** Returns the transform for the given hand joint. */
        get_hand_joint_transform(joint: XRHandTracker.HandJoint): Transform3D
        
        /** Sets the radius of the given hand joint. */
        set_hand_joint_radius(joint: XRHandTracker.HandJoint, radius: float64): void
        
        /** Returns the radius of the given hand joint. */
        get_hand_joint_radius(joint: XRHandTracker.HandJoint): float64
        
        /** Sets the linear velocity for the given hand joint. */
        set_hand_joint_linear_velocity(joint: XRHandTracker.HandJoint, linear_velocity: Vector3): void
        
        /** Returns the linear velocity for the given hand joint. */
        get_hand_joint_linear_velocity(joint: XRHandTracker.HandJoint): Vector3
        
        /** Sets the angular velocity for the given hand joint. */
        set_hand_joint_angular_velocity(joint: XRHandTracker.HandJoint, angular_velocity: Vector3): void
        
        /** Returns the angular velocity for the given hand joint. */
        get_hand_joint_angular_velocity(joint: XRHandTracker.HandJoint): Vector3
        
        /** If `true`, the hand tracking data is valid. */
        get has_tracking_data(): boolean
        set has_tracking_data(value: boolean)
        
        /** The source of the hand tracking data. */
        get hand_tracking_source(): int64
        set hand_tracking_source(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXRHandTracker;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXRHandTracker;
    }
    namespace XRInterface {
        enum Capabilities {
            /** No XR capabilities. */
            XR_NONE = 0,
            
            /** This interface can work with normal rendering output (non-HMD based AR). */
            XR_MONO = 1,
            
            /** This interface supports stereoscopic rendering. */
            XR_STEREO = 2,
            
            /** This interface supports quad rendering (not yet supported by Godot). */
            XR_QUAD = 4,
            
            /** This interface supports VR. */
            XR_VR = 8,
            
            /** This interface supports AR (video background and real world tracking). */
            XR_AR = 16,
            
            /** This interface outputs to an external device. If the main viewport is used, the on screen output is an unmodified buffer of either the left or right eye (stretched if the viewport size is not changed to the same aspect ratio of [method get_render_target_size]). Using a separate viewport node frees up the main viewport for other purposes. */
            XR_EXTERNAL = 32,
        }
        enum TrackingStatus {
            /** Tracking is behaving as expected. */
            XR_NORMAL_TRACKING = 0,
            
            /** Tracking is hindered by excessive motion (the player is moving faster than tracking can keep up). */
            XR_EXCESSIVE_MOTION = 1,
            
            /** Tracking is hindered by insufficient features, it's too dark (for camera-based tracking), player is blocked, etc. */
            XR_INSUFFICIENT_FEATURES = 2,
            
            /** We don't know the status of the tracking or this interface does not provide feedback. */
            XR_UNKNOWN_TRACKING = 3,
            
            /** Tracking is not functional (camera not plugged in or obscured, lighthouses turned off, etc.). */
            XR_NOT_TRACKING = 4,
        }
        enum PlayAreaMode {
            /** Play area mode not set or not available. */
            XR_PLAY_AREA_UNKNOWN = 0,
            
            /** Play area only supports orientation tracking, no positional tracking, area will center around player. */
            XR_PLAY_AREA_3DOF = 1,
            
            /** Player is in seated position, limited positional tracking, fixed guardian around player. */
            XR_PLAY_AREA_SITTING = 2,
            
            /** Player is free to move around, full positional tracking. */
            XR_PLAY_AREA_ROOMSCALE = 3,
            
            /** Same as [constant XR_PLAY_AREA_ROOMSCALE] but origin point is fixed to the center of the physical space. In this mode, system-level recentering may be disabled, requiring the use of [method XRServer.center_on_hmd]. */
            XR_PLAY_AREA_STAGE = 4,
            
            /** Custom play area set by a GDExtension. */
            XR_PLAY_AREA_CUSTOM = 2147483647,
        }
        enum EnvironmentBlendMode {
            /** Opaque blend mode. This is typically used for VR devices. */
            XR_ENV_BLEND_MODE_OPAQUE = 0,
            
            /** Additive blend mode. This is typically used for AR devices or VR devices with passthrough. */
            XR_ENV_BLEND_MODE_ADDITIVE = 1,
            
            /** Alpha blend mode. This is typically used for AR or VR devices with passthrough capabilities. The alpha channel controls how much of the passthrough is visible. Alpha of 0.0 means the passthrough is visible and this pixel works in ADDITIVE mode. Alpha of 1.0 means that the passthrough is not visible and this pixel works in OPAQUE mode. */
            XR_ENV_BLEND_MODE_ALPHA_BLEND = 2,
        }
        enum VRSTextureFormat {
            /** The texture format is the same as returned by [method XRVRS.make_vrs_texture]. */
            XR_VRS_TEXTURE_FORMAT_UNIFIED = 0,
            
            /** The texture format is the same as expected by the Vulkan `VK_KHR_fragment_shading_rate` extension. */
            XR_VRS_TEXTURE_FORMAT_FRAGMENT_SHADING_RATE = 1,
            
            /** The texture format is the same as expected by the Vulkan `VK_EXT_fragment_density_map` extension. */
            XR_VRS_TEXTURE_FORMAT_FRAGMENT_DENSITY_MAP = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXRInterface extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXRInterface extends __NameMapRefCounted {
    }
    /** Base class for an XR interface implementation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xrinterface.html  
     */
    class XRInterface extends RefCounted {
        constructor(identifier?: any)
        /** Returns the name of this interface (`"OpenXR"`, `"OpenVR"`, `"OpenHMD"`, `"ARKit"`, etc.). */
        get_name(): StringName
        
        /** Returns a combination of [enum Capabilities] flags providing information about the capabilities of this interface. */
        get_capabilities(): int64
        
        /** Returns `true` if this interface has been initialized. */
        is_initialized(): boolean
        
        /** Call this to initialize this interface. The first interface that is initialized is identified as the primary interface and it will be used for rendering output.  
         *  After initializing the interface you want to use you then need to enable the AR/VR mode of a viewport and rendering should commence.  
         *      
         *  **Note:** You must enable the XR mode on the main viewport for any device that uses the main output of Godot, such as for mobile VR.  
         *  If you do this for a platform that handles its own output (such as OpenVR) Godot will show just one eye without distortion on screen. Alternatively, you can add a separate viewport node to your scene and enable AR/VR on that viewport. It will be used to output to the HMD, leaving you free to do anything you like in the main window, such as using a separate camera as a spectator camera or rendering something completely different.  
         *  While currently not used, you can activate additional interfaces. You may wish to do this if you want to track controllers from other platforms. However, at this point in time only one interface can render to an HMD.  
         */
        initialize(): boolean
        
        /** Turns the interface off. */
        uninitialize(): void
        
        /** Returns a [Dictionary] with extra system info. Interfaces are expected to return `XRRuntimeName` and `XRRuntimeVersion` providing info about the used XR runtime. Additional entries may be provided specific to an interface.  
         *      
         *  **Note:**This information may only be available after [method initialize] was successfully called.  
         */
        get_system_info(): GDictionary
        
        /** If supported, returns the status of our tracking. This will allow you to provide feedback to the user whether there are issues with positional tracking. */
        get_tracking_status(): XRInterface.TrackingStatus
        
        /** Returns the resolution at which we should render our intermediate results before things like lens distortion are applied by the VR platform. */
        get_render_target_size(): Vector2
        
        /** Returns the number of views that need to be rendered for this device. 1 for Monoscopic, 2 for Stereoscopic. */
        get_view_count(): int64
        
        /** Triggers a haptic pulse on a device associated with this interface.  
         *  [param action_name] is the name of the action for this pulse.  
         *  [param tracker_name] is optional and can be used to direct the pulse to a specific device provided that device is bound to this haptic.  
         *  [param frequency] is the frequency of the pulse, set to `0.0` to have the system use a default frequency.  
         *  [param amplitude] is the amplitude of the pulse between `0.0` and `1.0`.  
         *  [param duration_sec] is the duration of the pulse in seconds.  
         *  [param delay_sec] is a delay in seconds before the pulse is given.  
         */
        trigger_haptic_pulse(action_name: string, tracker_name: StringName, frequency: float64, amplitude: float64, duration_sec: float64, delay_sec: float64): void
        
        /** Call this to find out if a given play area mode is supported by this interface. */
        supports_play_area_mode(mode: XRInterface.PlayAreaMode): boolean
        
        /** Returns an array of vectors that represent the physical play area mapped to the virtual space around the [XROrigin3D] point. The points form a convex polygon that can be used to react to or visualize the play area. This returns an empty array if this feature is not supported or if the information is not yet available. */
        get_play_area(): PackedVector3Array
        
        /** If this is an AR interface that requires displaying a camera feed as the background, this method returns the feed ID in the [CameraServer] for this interface. */
        get_camera_feed_id(): int64
        
        /** Returns `true` if this interface supports passthrough. */
        is_passthrough_supported(): boolean
        
        /** Returns `true` if passthrough is enabled. */
        is_passthrough_enabled(): boolean
        
        /** Starts passthrough, will return `false` if passthrough couldn't be started.  
         *      
         *  **Note:** The viewport used for XR must have a transparent background, otherwise passthrough may not properly render.  
         */
        start_passthrough(): boolean
        
        /** Stops passthrough. */
        stop_passthrough(): void
        
        /** Returns the transform for a view/eye.  
         *  [param view] is the view/eye index.  
         *  [param cam_transform] is the transform that maps device coordinates to scene coordinates, typically the [member Node3D.global_transform] of the current XROrigin3D.  
         */
        get_transform_for_view(view: int64, cam_transform: Transform3D): Transform3D
        
        /** Returns the projection matrix for a view/eye. */
        get_projection_for_view(view: int64, aspect: float64, near: float64, far: float64): Projection
        
        /** Returns the an array of supported environment blend modes, see [enum XRInterface.EnvironmentBlendMode]. */
        get_supported_environment_blend_modes(): GArray
        
        /** `true` if this is the primary interface. */
        get interface_is_primary(): boolean
        set interface_is_primary(value: boolean)
        
        /** The play area mode for this interface. */
        get xr_play_area_mode(): int64
        set xr_play_area_mode(value: int64)
        
        /** Specify how XR should blend in the environment. This is specific to certain AR and passthrough devices where camera images are blended in by the XR compositor. */
        get environment_blend_mode(): int64
        set environment_blend_mode(value: int64)
        
        /** On an AR interface, `true` if anchor detection is enabled. */
        get ar_is_anchor_detection_enabled(): boolean
        set ar_is_anchor_detection_enabled(value: boolean)
        
        /** Emitted when the play area is changed. This can be a result of the player resetting the boundary or entering a new play area, the player changing the play area mode, the world scale changing or the player resetting their headset orientation. */
        readonly play_area_changed: Signal<(mode: int64) => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXRInterface;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXRInterface;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXRInterfaceExtension extends __RPCMapXRInterface {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXRInterfaceExtension extends __NameMapXRInterface {
    }
    /** Base class for XR interface extensions (plugins).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xrinterfaceextension.html  
     */
    class XRInterfaceExtension extends XRInterface {
        constructor(identifier?: any)
        /** Returns the name of this interface. */
        /* gdvirtual */ _get_name(): StringName
        
        /** Returns the capabilities of this interface. */
        /* gdvirtual */ _get_capabilities(): int64
        
        /** Returns `true` if this interface has been initialized. */
        /* gdvirtual */ _is_initialized(): boolean
        
        /** Initializes the interface, returns `true` on success. */
        /* gdvirtual */ _initialize(): boolean
        
        /** Uninitialize the interface. */
        /* gdvirtual */ _uninitialize(): void
        
        /** Returns a [Dictionary] with system information related to this interface. */
        /* gdvirtual */ _get_system_info(): GDictionary
        
        /** Returns `true` if this interface supports this play area mode. */
        /* gdvirtual */ _supports_play_area_mode(mode: XRInterface.PlayAreaMode): boolean
        
        /** Returns the play area mode that sets up our play area. */
        /* gdvirtual */ _get_play_area_mode(): XRInterface.PlayAreaMode
        
        /** Set the play area mode for this interface. */
        /* gdvirtual */ _set_play_area_mode(mode: XRInterface.PlayAreaMode): boolean
        
        /** Returns a [PackedVector3Array] that represents the play areas boundaries (if applicable). */
        /* gdvirtual */ _get_play_area(): PackedVector3Array
        
        /** Returns the size of our render target for this interface, this overrides the size of the [Viewport] marked as the xr viewport. */
        /* gdvirtual */ _get_render_target_size(): Vector2
        
        /** Returns the number of views this interface requires, 1 for mono, 2 for stereoscopic. */
        /* gdvirtual */ _get_view_count(): int64
        
        /** Returns the [Transform3D] that positions the [XRCamera3D] in the world. */
        /* gdvirtual */ _get_camera_transform(): Transform3D
        
        /** Returns a [Transform3D] for a given view. */
        /* gdvirtual */ _get_transform_for_view(view: int64, cam_transform: Transform3D): Transform3D
        
        /** Returns the projection matrix for the given view as a [PackedFloat64Array]. */
        /* gdvirtual */ _get_projection_for_view(view: int64, aspect: float64, z_near: float64, z_far: float64): PackedFloat64Array
        /* gdvirtual */ _get_vrs_texture(): RID
        
        /** Returns the format of the texture returned by [method _get_vrs_texture]. */
        /* gdvirtual */ _get_vrs_texture_format(): XRInterface.VRSTextureFormat
        
        /** Called if this [XRInterfaceExtension] is active before our physics and game process is called. Most XR interfaces will update its [XRPositionalTracker]s at this point in time. */
        /* gdvirtual */ _process(): void
        
        /** Called if this [XRInterfaceExtension] is active before rendering starts. Most XR interfaces will sync tracking at this point in time. */
        /* gdvirtual */ _pre_render(): void
        
        /** Called if this is our primary [XRInterfaceExtension] before we start processing a [Viewport] for every active XR [Viewport], returns `true` if that viewport should be rendered. An XR interface may return `false` if the user has taken off their headset and we can pause rendering. */
        /* gdvirtual */ _pre_draw_viewport(render_target: RID): boolean
        
        /** Called after the XR [Viewport] draw logic has completed. */
        /* gdvirtual */ _post_draw_viewport(render_target: RID, screen_rect: Rect2): void
        
        /** Called if interface is active and queues have been submitted. */
        /* gdvirtual */ _end_frame(): void
        
        /** Returns a [PackedStringArray] with tracker names configured by this interface. Note that user configuration can override this list. */
        /* gdvirtual */ _get_suggested_tracker_names(): PackedStringArray
        
        /** Returns a [PackedStringArray] with pose names configured by this interface. Note that user configuration can override this list. */
        /* gdvirtual */ _get_suggested_pose_names(tracker_name: StringName): PackedStringArray
        
        /** Returns the current status of our tracking. */
        /* gdvirtual */ _get_tracking_status(): XRInterface.TrackingStatus
        
        /** Triggers a haptic pulse to be emitted on the specified tracker. */
        /* gdvirtual */ _trigger_haptic_pulse(action_name: string, tracker_name: StringName, frequency: float64, amplitude: float64, duration_sec: float64, delay_sec: float64): void
        
        /** Return `true` if anchor detection is enabled for this interface. */
        /* gdvirtual */ _get_anchor_detection_is_enabled(): boolean
        
        /** Enables anchor detection on this interface if supported. */
        /* gdvirtual */ _set_anchor_detection_is_enabled(enabled: boolean): void
        
        /** Returns the camera feed ID for the [CameraFeed] registered with the [CameraServer] that should be presented as the background on an AR capable device (if applicable). */
        /* gdvirtual */ _get_camera_feed_id(): int64
        
        /** Return color texture into which to render (if applicable). */
        /* gdvirtual */ _get_color_texture(): RID
        
        /** Return depth texture into which to render (if applicable). */
        /* gdvirtual */ _get_depth_texture(): RID
        
        /** Return velocity texture into which to render (if applicable). */
        /* gdvirtual */ _get_velocity_texture(): RID
        get_color_texture(): RID
        get_depth_texture(): RID
        get_velocity_texture(): RID
        
        /** Blits our render results to screen optionally applying lens distortion. This can only be called while processing `_commit_views`. */
        add_blit(render_target: RID, src_rect: Rect2, dst_rect: Rect2i, use_layer: boolean, layer: int64, apply_lens_distortion: boolean, eye_center: Vector2, k1: float64, k2: float64, upscale: float64, aspect_ratio: float64): void
        
        /** Returns a valid [RID] for a texture to which we should render the current frame if supported by the interface. */
        get_render_target_texture(render_target: RID): RID
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXRInterfaceExtension;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXRInterfaceExtension;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXRNode3D extends __RPCMapNode3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXRNode3D extends __NameMapNode3D {
    }
    /** A 3D node that has its position automatically updated by the [XRServer].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xrnode3d.html  
     */
    class XRNode3D<Map extends NodePathMap = any> extends Node3D<Map> {
        constructor(identifier?: any)
        /** Returns `true` if the [member tracker] has been registered and the [member pose] is being tracked. */
        get_is_active(): boolean
        
        /** Returns `true` if the [member tracker] has current tracking data for the [member pose] being tracked. */
        get_has_tracking_data(): boolean
        
        /** Returns the [XRPose] containing the current state of the pose being tracked. This gives access to additional properties of this pose. */
        get_pose(): null | XRPose
        
        /** Triggers a haptic pulse on a device associated with this interface.  
         *  [param action_name] is the name of the action for this pulse.  
         *  [param frequency] is the frequency of the pulse, set to `0.0` to have the system use a default frequency.  
         *  [param amplitude] is the amplitude of the pulse between `0.0` and `1.0`.  
         *  [param duration_sec] is the duration of the pulse in seconds.  
         *  [param delay_sec] is a delay in seconds before the pulse is given.  
         */
        trigger_haptic_pulse(action_name: string, frequency: float64, amplitude: float64, duration_sec: float64, delay_sec: float64): void
        
        /** The name of the tracker we're bound to. Which trackers are available is not known during design time.  
         *  Godot defines a number of standard trackers such as `left_hand` and `right_hand` but others may be configured within a given [XRInterface].  
         */
        get tracker(): string
        set tracker(value: string)
        
        /** The name of the pose we're bound to. Which poses a tracker supports is not known during design time.  
         *  Godot defines number of standard pose names such as `aim` and `grip` but other may be configured within a given [XRInterface].  
         */
        get pose(): string
        set pose(value: string)
        
        /** Enables showing the node when tracking starts, and hiding the node when tracking is lost. */
        get show_when_tracked(): boolean
        set show_when_tracked(value: boolean)
        
        /** Emitted when the [member tracker] starts or stops receiving updated tracking data for the [member pose] being tracked. The [param tracking] argument indicates whether the tracker is getting updated tracking data. */
        readonly tracking_changed: Signal<(tracking: boolean) => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXRNode3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXRNode3D;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXROrigin3D extends __RPCMapNode3D {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXROrigin3D extends __NameMapNode3D {
    }
    /** The origin point in AR/VR.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xrorigin3d.html  
     */
    class XROrigin3D<Map extends NodePathMap = any> extends Node3D<Map> {
        constructor(identifier?: any)
        /** The scale of the game world compared to the real world. This is the same as [member XRServer.world_scale]. By default, most AR/VR platforms assume that 1 game unit corresponds to 1 real world meter. */
        get world_scale(): float64
        set world_scale(value: float64)
        
        /** If `true`, this origin node is currently being used by the [XRServer]. Only one origin point can be used at a time. */
        get current(): boolean
        set current(value: boolean)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXROrigin3D;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXROrigin3D;
    }
    namespace XRPose {
        enum TrackingConfidence {
            /** No tracking information is available for this pose. */
            XR_TRACKING_CONFIDENCE_NONE = 0,
            
            /** Tracking information may be inaccurate or estimated. For example, with inside out tracking this would indicate a controller may be (partially) obscured. */
            XR_TRACKING_CONFIDENCE_LOW = 1,
            
            /** Tracking information is considered accurate and up to date. */
            XR_TRACKING_CONFIDENCE_HIGH = 2,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXRPose extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXRPose extends __NameMapRefCounted {
    }
    /** This object contains all data related to a pose on a tracked object.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xrpose.html  
     */
    class XRPose extends RefCounted {
        constructor(identifier?: any)
        set_name(name: StringName): void
        get_name(): StringName
        
        /** Returns the [member transform] with world scale and our reference frame applied. This is the transform used to position [XRNode3D] objects. */
        get_adjusted_transform(): Transform3D
        
        /** If `true` our tracking data is up to date. If `false` we're no longer receiving new tracking data and our state is whatever that last valid state was. */
        get has_tracking_data(): boolean
        set has_tracking_data(value: boolean)
        
        /** The transform containing the original and transform as reported by the XR runtime. */
        get transform(): string
        set transform(value: string)
        
        /** The linear velocity of this pose. */
        get linear_velocity(): string
        set linear_velocity(value: string)
        
        /** The angular velocity for this pose. */
        get angular_velocity(): string
        set angular_velocity(value: string)
        
        /** The tracking confidence for this pose, provides insight on how accurate the spatial positioning of this record is. */
        get tracking_confidence(): int64
        set tracking_confidence(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXRPose;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXRPose;
    }
    namespace XRPositionalTracker {
        enum TrackerHand {
            /** The hand this tracker is held in is unknown or not applicable. */
            TRACKER_HAND_UNKNOWN = 0,
            
            /** This tracker is the left hand controller. */
            TRACKER_HAND_LEFT = 1,
            
            /** This tracker is the right hand controller. */
            TRACKER_HAND_RIGHT = 2,
            
            /** Represents the size of the [enum TrackerHand] enum. */
            TRACKER_HAND_MAX = 3,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXRPositionalTracker extends __RPCMapXRTracker {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXRPositionalTracker extends __NameMapXRTracker {
    }
    /** A tracked object.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xrpositionaltracker.html  
     */
    class XRPositionalTracker extends XRTracker {
        constructor(identifier?: any)
        /** Returns `true` if the tracker is available and is currently tracking the bound [param name] pose. */
        has_pose(name: StringName): boolean
        
        /** Returns the current [XRPose] state object for the bound [param name] pose. */
        get_pose(name: StringName): null | XRPose
        
        /** Marks this pose as invalid, we don't clear the last reported state but it allows users to decide if trackers need to be hidden if we lose tracking or just remain at their last known position. */
        invalidate_pose(name: StringName): void
        
        /** Sets the transform, linear velocity, angular velocity and tracking confidence for the given pose. This method is called by an [XRInterface] implementation and should not be used directly. */
        set_pose(name: StringName, transform: Transform3D, linear_velocity: Vector3, angular_velocity: Vector3, tracking_confidence: XRPose.TrackingConfidence): void
        
        /** Returns an input for this tracker. It can return a boolean, float or [Vector2] value depending on whether the input is a button, trigger or thumbstick/thumbpad. */
        get_input(name: StringName): any
        
        /** Changes the value for the given input. This method is called by an [XRInterface] implementation and should not be used directly. */
        set_input(name: StringName, value: any): void
        
        /** The profile associated with this tracker, interface dependent but will indicate the type of controller being tracked. */
        get profile(): string
        set profile(value: string)
        
        /** Defines which hand this tracker relates to. */
        get hand(): int64
        set hand(value: int64)
        
        /** Emitted when the state of a pose tracked by this tracker changes. */
        readonly pose_changed: Signal<(pose: XRPose) => void>
        
        /** Emitted when a pose tracked by this tracker stops getting updated tracking data. */
        readonly pose_lost_tracking: Signal<(pose: XRPose) => void>
        
        /** Emitted when a button on this tracker is pressed. Note that many XR runtimes allow other inputs to be mapped to buttons. */
        readonly button_pressed: Signal<(name: string) => void>
        
        /** Emitted when a button on this tracker is released. */
        readonly button_released: Signal<(name: string) => void>
        
        /** Emitted when a trigger or similar input on this tracker changes value. */
        readonly input_float_changed: Signal<(name: string, value: float64) => void>
        
        /** Emitted when a thumbstick or thumbpad on this tracker moves. */
        readonly input_vector2_changed: Signal<(name: string, vector: Vector2) => void>
        
        /** Emitted when the profile of our tracker changes. */
        readonly profile_changed: Signal<(role: string) => void>
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXRPositionalTracker;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXRPositionalTracker;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXRTracker extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXRTracker extends __NameMapRefCounted {
    }
    /** A tracked object.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xrtracker.html  
     */
    class XRTracker extends RefCounted {
        constructor(identifier?: any)
        get_tracker_name(): StringName
        set_tracker_name(name: StringName): void
        
        /** The type of tracker. */
        get type(): int64
        set type(value: int64)
        
        /** The description of this tracker. */
        get description(): string
        set description(value: string)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXRTracker;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXRTracker;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapXRVRS extends __RPCMapObject {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapXRVRS extends __NameMapObject {
    }
    /** Helper class for XR interfaces that generates VRS images.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_xrvrs.html  
     */
    class XRVRS extends Object {
        constructor(identifier?: any)
        /** Generates the VRS texture based on a render [param target_size] adjusted by our VRS tile size. For each eyes focal point passed in [param eye_foci] a layer is created. Focal point should be in NDC.  
         *  The result will be cached, requesting a VRS texture with unchanged parameters and settings will return the cached RID.  
         */
        make_vrs_texture(target_size: Vector2, eye_foci: PackedVector2Array | Vector2[]): RID
        
        /** The minimum radius around the focal point where full quality is guaranteed if VRS is used as a percentage of screen size. */
        get vrs_min_radius(): float64
        set vrs_min_radius(value: float64)
        
        /** The strength used to calculate the VRS density map. The greater this value, the more noticeable VRS is. */
        get vrs_strength(): float64
        set vrs_strength(value: float64)
        
        /** The render region that the VRS texture will be scaled to when generated. */
        get vrs_render_region(): Rect2i
        set vrs_render_region(value: Rect2i)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapXRVRS;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapXRVRS;
    }
    namespace ZIPPacker {
        enum ZipAppend {
            /** Create a new zip archive at the given path. */
            APPEND_CREATE = 0,
            
            /** Append a new zip archive to the end of the already existing file at the given path. */
            APPEND_CREATEAFTER = 1,
            
            /** Add new files to the existing zip archive at the given path. */
            APPEND_ADDINZIP = 2,
        }
        enum CompressionLevel {
            /** Start a file with the default Deflate compression level (`6`). This is a good compromise between speed and file size. */
            COMPRESSION_DEFAULT = -1,
            
            /** Start a file with no compression. This is also known as the "Store" compression mode and is the fastest method of packing files inside a ZIP archive. Consider using this mode for files that are already compressed (such as JPEG, PNG, MP3, or Ogg Vorbis files). */
            COMPRESSION_NONE = 0,
            
            /** Start a file with the fastest Deflate compression level (`1`). This is fast to compress, but results in larger file sizes than [constant COMPRESSION_DEFAULT]. Decompression speed is generally unaffected by the chosen compression level. */
            COMPRESSION_FAST = 1,
            
            /** Start a file with the best Deflate compression level (`9`). This is slow to compress, but results in smaller file sizes than [constant COMPRESSION_DEFAULT]. Decompression speed is generally unaffected by the chosen compression level. */
            COMPRESSION_BEST = 9,
        }
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapZIPPacker extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapZIPPacker extends __NameMapRefCounted {
    }
    /** Allows the creation of ZIP files.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_zippacker.html  
     */
    class ZIPPacker extends RefCounted {
        constructor(identifier?: any)
        /** Opens a zip file for writing at the given path using the specified write mode.  
         *  This must be called before everything else.  
         */
        open(path: string, append?: ZIPPacker.ZipAppend /* = 0 */): Error
        
        /** Starts writing to a file within the archive. Only one file can be written at the same time.  
         *  Must be called after [method open].  
         */
        start_file(path: string): Error
        
        /** Write the given [param data] to the file.  
         *  Needs to be called after [method start_file].  
         */
        write_file(data: PackedByteArray | byte[] | ArrayBuffer): Error
        
        /** Stops writing to a file within the archive.  
         *  It will fail if there is no open file.  
         */
        close_file(): Error
        
        /** Closes the underlying resources used by this instance. */
        close(): Error
        
        /** The compression level used when [method start_file] is called. Use [enum ZIPPacker.CompressionLevel] as a reference. */
        get compression_level(): int64
        set compression_level(value: int64)
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapZIPPacker;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapZIPPacker;
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __RPCMapZIPReader extends __RPCMapRefCounted {
    }
    /** @deprecated Internal use. Does not exist at runtime. */
    interface __NameMapZIPReader extends __NameMapRefCounted {
    }
    /** Allows reading the content of a ZIP file.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_zipreader.html  
     */
    class ZIPReader extends RefCounted {
        constructor(identifier?: any)
        /** Opens the zip archive at the given [param path] and reads its file index. */
        open(path: string): Error
        
        /** Closes the underlying resources used by this instance. */
        close(): Error
        
        /** Returns the list of names of all files in the loaded archive.  
         *  Must be called after [method open].  
         */
        get_files(): PackedStringArray
        
        /** Loads the whole content of a file in the loaded zip archive into memory and returns it.  
         *  Must be called after [method open].  
         */
        read_file(path: string, case_sensitive?: boolean /* = true */): PackedByteArray
        
        /** Returns `true` if the file exists in the loaded zip archive.  
         *  Must be called after [method open].  
         */
        file_exists(path: string, case_sensitive?: boolean /* = true */): boolean
        
        /** Returns the compression level of the file in the loaded zip archive. Returns `-1` if the file doesn't exist or any other error occurs. Must be called after [method open]. */
        get_compression_level(path: string, case_sensitive?: boolean /* = true */): int64
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotRPCMap: __RPCMapZIPReader;
        /** @deprecated Internal use. Does not exist at runtime. */
        __godotNameMap: __NameMapZIPReader;
    }
    namespace Vector2 {
        enum Axis {
            /** Enumerated value for the X axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_X = 0,
            
            /** Enumerated value for the Y axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Y = 1,
        }
    }
    /** A 2D vector using floating-point coordinates.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_vector2.html  
     */
    class Vector2 {
        /** Zero vector, a vector with all components set to `0`. */
        static readonly ZERO: Readonly<Vector2>
        
        /** One vector, a vector with all components set to `1`. */
        static readonly ONE: Readonly<Vector2>
        
        /** Infinity vector, a vector with all components set to [constant @GDScript.INF]. */
        static readonly INF: Readonly<Vector2>
        
        /** Left unit vector. Represents the direction of left. */
        static readonly LEFT: Readonly<Vector2>
        
        /** Right unit vector. Represents the direction of right. */
        static readonly RIGHT: Readonly<Vector2>
        
        /** Up unit vector. Y is down in 2D, so this vector points -Y. */
        static readonly UP: Readonly<Vector2>
        
        /** Down unit vector. Y is down in 2D, so this vector points +Y. */
        static readonly DOWN: Readonly<Vector2>
        constructor()
        constructor(from: Vector2)
        constructor(from: Vector2i)
        constructor(x: float64, y: float64)
        
        /** Returns this vector's angle with respect to the positive X axis, or `(1, 0)` vector, in radians.  
         *  For example, `Vector2.RIGHT.angle()` will return zero, `Vector2.DOWN.angle()` will return `PI / 2` (a quarter turn, or 90 degrees), and `Vector2(1, -1).angle()` will return `-PI / 4` (a negative eighth turn, or -45 degrees).  
         *  This is equivalent to calling [method @GlobalScope.atan2] with [member y] and [member x].  
         *  [url=https://raw.githubusercontent.com/godotengine/godot-docs/master/img/vector2_angle.png]Illustration of the returned angle.[/url]  
         */
        angle(): float64
        
        /** Returns the signed angle to the given vector, in radians. The result ranges from `-PI` to `PI` (inclusive).  
         *  [url=https://raw.githubusercontent.com/godotengine/godot-docs/master/img/vector2_angle_to.png]Illustration of the returned angle.[/url]  
         */
        angle_to(to: Vector2): float64
        
        /** Returns the signed angle between the X axis and the line from this vector to point [param to], in radians. The result ranges from `-PI` to `PI` (inclusive).  
         *  `a.angle_to_point(b)` is equivalent to `(b - a).angle()`. See also [method angle].  
         *  [url=https://raw.githubusercontent.com/godotengine/godot-docs/master/img/vector2_angle_to_point.png]Illustration of the returned angle.[/url]  
         */
        angle_to_point(to: Vector2): float64
        
        /** Returns the normalized vector pointing from this vector to [param to].  
         *  `a.direction_to(b)` is equivalent to `(b - a).normalized()`. See also [method normalized].  
         */
        direction_to(to: Vector2): Vector2
        
        /** Returns the distance between this vector and [param to]. */
        distance_to(to: Vector2): float64
        
        /** Returns the squared distance between this vector and [param to].  
         *  This method runs faster than [method distance_to], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        distance_squared_to(to: Vector2): float64
        
        /** Returns the length (magnitude) of this vector. */
        length(): float64
        
        /** Returns the squared length (squared magnitude) of this vector.  
         *  This method runs faster than [method length], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        length_squared(): float64
        
        /** Returns the vector with a maximum length by limiting its length to [param length]. If the vector is non-finite, the result is undefined. */
        limit_length(length?: float64 /* = 1 */): Vector2
        
        /** Returns the result of scaling the vector to unit length. Equivalent to `v / v.length()`. Returns `(0, 0)` if `v.length() == 0`. See also [method is_normalized].  
         *      
         *  **Note:** This function may return incorrect values if the input vector length is near zero.  
         */
        normalized(): Vector2
        
        /** Returns `true` if the vector is normalized, i.e. its length is approximately equal to 1. */
        is_normalized(): boolean
        
        /** Returns `true` if this vector and [param to] are approximately equal, by running [method @GlobalScope.is_equal_approx] on each component. */
        is_equal_approx(to: Vector2): boolean
        
        /** Returns `true` if this vector's values are approximately zero, by running [method @GlobalScope.is_zero_approx] on each component.  
         *  This method is faster than using [method is_equal_approx] with one value as a zero vector.  
         */
        is_zero_approx(): boolean
        
        /** Returns `true` if this vector is finite, by calling [method @GlobalScope.is_finite] on each component. */
        is_finite(): boolean
        
        /** Returns a vector composed of the [method @GlobalScope.fposmod] of this vector's components and [param mod]. */
        posmod(mod: float64): Vector2
        
        /** Returns a vector composed of the [method @GlobalScope.fposmod] of this vector's components and [param modv]'s components. */
        posmodv(modv: Vector2): Vector2
        
        /** Returns a new vector resulting from projecting this vector onto the given vector [param b]. The resulting new vector is parallel to [param b]. See also [method slide].  
         *      
         *  **Note:** If the vector [param b] is a zero vector, the components of the resulting new vector will be [constant @GDScript.NAN].  
         */
        project(b: Vector2): Vector2
        
        /** Returns the result of the linear interpolation between this vector and [param to] by amount [param weight]. [param weight] is on the range of `0.0` to `1.0`, representing the amount of interpolation. */
        lerp(to: Vector2, weight: float64): Vector2
        
        /** Returns the result of spherical linear interpolation between this vector and [param to], by amount [param weight]. [param weight] is on the range of 0.0 to 1.0, representing the amount of interpolation.  
         *  This method also handles interpolating the lengths if the input vectors have different lengths. For the special case of one or both input vectors having zero length, this method behaves like [method lerp].  
         */
        slerp(to: Vector2, weight: float64): Vector2
        
        /** Performs a cubic interpolation between this vector and [param b] using [param pre_a] and [param post_b] as handles, and returns the result at position [param weight]. [param weight] is on the range of 0.0 to 1.0, representing the amount of interpolation. */
        cubic_interpolate(b: Vector2, pre_a: Vector2, post_b: Vector2, weight: float64): Vector2
        
        /** Performs a cubic interpolation between this vector and [param b] using [param pre_a] and [param post_b] as handles, and returns the result at position [param weight]. [param weight] is on the range of 0.0 to 1.0, representing the amount of interpolation.  
         *  It can perform smoother interpolation than [method cubic_interpolate] by the time values.  
         */
        cubic_interpolate_in_time(b: Vector2, pre_a: Vector2, post_b: Vector2, weight: float64, b_t: float64, pre_a_t: float64, post_b_t: float64): Vector2
        
        /** Returns the point at the given [param t] on the [url=https://en.wikipedia.org/wiki/B%C3%A9zier_curve]Bézier curve[/url] defined by this vector and the given [param control_1], [param control_2], and [param end] points. */
        bezier_interpolate(control_1: Vector2, control_2: Vector2, end: Vector2, t: float64): Vector2
        
        /** Returns the derivative at the given [param t] on the [url=https://en.wikipedia.org/wiki/B%C3%A9zier_curve]Bézier curve[/url] defined by this vector and the given [param control_1], [param control_2], and [param end] points. */
        bezier_derivative(control_1: Vector2, control_2: Vector2, end: Vector2, t: float64): Vector2
        
        /** Returns the axis of the vector's highest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_X]. */
        max_axis_index(): int64
        
        /** Returns the axis of the vector's lowest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_Y]. */
        min_axis_index(): int64
        
        /** Returns a new vector moved toward [param to] by the fixed [param delta] amount. Will not go past the final value. */
        move_toward(to: Vector2, delta: float64): Vector2
        
        /** Returns the result of rotating this vector by [param angle] (in radians). See also [method @GlobalScope.deg_to_rad]. */
        rotated(angle: float64): Vector2
        
        /** Returns a perpendicular vector rotated 90 degrees counter-clockwise compared to the original, with the same length. */
        orthogonal(): Vector2
        
        /** Returns a new vector with all components rounded down (towards negative infinity). */
        floor(): Vector2
        
        /** Returns a new vector with all components rounded up (towards positive infinity). */
        ceil(): Vector2
        
        /** Returns a new vector with all components rounded to the nearest integer, with halfway cases rounded away from zero. */
        round(): Vector2
        
        /** Returns this vector's aspect ratio, which is [member x] divided by [member y]. */
        aspect(): float64
        
        /** Returns the dot product of this vector and [param with]. This can be used to compare the angle between two vectors. For example, this can be used to determine whether an enemy is facing the player.  
         *  The dot product will be `0` for a right angle (90 degrees), greater than 0 for angles narrower than 90 degrees and lower than 0 for angles wider than 90 degrees.  
         *  When using unit (normalized) vectors, the result will always be between `-1.0` (180 degree angle) when the vectors are facing opposite directions, and `1.0` (0 degree angle) when the vectors are aligned.  
         *      
         *  **Note:** `a.dot(b)` is equivalent to `b.dot(a)`.  
         */
        dot(with_: Vector2): float64
        
        /** Returns a new vector resulting from sliding this vector along a line with normal [param n]. The resulting new vector is perpendicular to [param n], and is equivalent to this vector minus its projection on [param n]. See also [method project].  
         *      
         *  **Note:** The vector [param n] must be normalized. See also [method normalized].  
         */
        slide(n: Vector2): Vector2
        
        /** Returns the vector "bounced off" from a line defined by the given normal [param n] perpendicular to the line.  
         *      
         *  **Note:** [method bounce] performs the operation that most engines and frameworks call [code skip-lint]reflect()`.  
         */
        bounce(n: Vector2): Vector2
        
        /** Returns the result of reflecting the vector from a line defined by the given direction vector [param line].  
         *      
         *  **Note:** [method reflect] differs from what other engines and frameworks call [code skip-lint]reflect()`. In other engines, [code skip-lint]reflect()` takes a normal direction which is a direction perpendicular to the line. In Godot, you specify the direction of the line directly. See also [method bounce] which does what most engines call [code skip-lint]reflect()`.  
         */
        reflect(line: Vector2): Vector2
        
        /** Returns the 2D analog of the cross product for this vector and [param with].  
         *  This is the signed area of the parallelogram formed by the two vectors. If the second vector is clockwise from the first vector, then the cross product is the positive area. If counter-clockwise, the cross product is the negative area. If the two vectors are parallel this returns zero, making it useful for testing if two vectors are parallel.  
         *      
         *  **Note:** Cross product is not defined in 2D mathematically. This method embeds the 2D vectors in the XY plane of 3D space and uses their cross product's Z component as the analog.  
         */
        cross(with_: Vector2): float64
        
        /** Returns a new vector with all components in absolute values (i.e. positive). */
        abs(): Vector2
        
        /** Returns a new vector with each component set to `1.0` if it's positive, `-1.0` if it's negative, and `0.0` if it's zero. The result is identical to calling [method @GlobalScope.sign] on each component. */
        sign(): Vector2
        
        /** Returns a new vector with all components clamped between the components of [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clamp(min: Vector2, max: Vector2): Vector2
        
        /** Returns a new vector with all components clamped between [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clampf(min: float64, max: float64): Vector2
        
        /** Returns a new vector with each component snapped to the nearest multiple of the corresponding component in [param step]. This can also be used to round the components to an arbitrary number of decimals. */
        snapped(step: Vector2): Vector2
        
        /** Returns a new vector with each component snapped to the nearest multiple of [param step]. This can also be used to round the components to an arbitrary number of decimals. */
        snappedf(step: float64): Vector2
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector2(minf(x, with.x), minf(y, with.y))`. */
        min(with_: Vector2): Vector2
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector2(minf(x, with), minf(y, with))`. */
        minf(with_: float64): Vector2
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector2(maxf(x, with.x), maxf(y, with.y))`. */
        max(with_: Vector2): Vector2
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector2(maxf(x, with), maxf(y, with))`. */
        maxf(with_: float64): Vector2
        
        /** Creates a [Vector2] rotated to the given [param angle] in radians. This is equivalent to doing `Vector2(cos(angle), sin(angle))` or `Vector2.RIGHT.rotated(angle)`.  
         *    
         *      
         *  **Note:** The length of the returned [Vector2] is  *approximately*  `1.0`, but is is not guaranteed to be exactly `1.0` due to floating-point precision issues. Call [method normalized] on the returned [Vector2] if you require a unit vector.  
         */
        static from_angle(angle: float64): Vector2
        static ADD(left: Vector2, right: Vector2): Vector2
        static SUBTRACT(left: Vector2, right: Vector2): Vector2
        static MULTIPLY(left: float64, right: Vector2): Vector2
        static MULTIPLY(left: Vector2, right: Vector2): Vector2
        static MULTIPLY(left: Vector2, right: float64): Vector2
        static DIVIDE(left: Vector2, right: Vector2): Vector2
        static DIVIDE(left: Vector2, right: float64): Vector2
        static NEGATE(left: Vector2): Vector2
        static EQUAL(left: Vector2, right: Vector2): boolean
        static NOT_EQUAL(left: Vector2, right: Vector2): boolean
        static LESS(left: Vector2, right: Vector2): boolean
        static LESS_EQUAL(left: Vector2, right: Vector2): boolean
        static GREATER(left: Vector2, right: Vector2): boolean
        static GREATER_EQUAL(left: Vector2, right: Vector2): boolean
        get x(): float64
        set x(value: float64)
        get y(): float64
        set y(value: float64)
    }
    namespace Vector2i {
        enum Axis {
            /** Enumerated value for the X axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_X = 0,
            
            /** Enumerated value for the Y axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Y = 1,
        }
    }
    /** A 2D vector using integer coordinates.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_vector2i.html  
     */
    class Vector2i {
        /** Zero vector, a vector with all components set to `0`. */
        static readonly ZERO: Readonly<Vector2i>
        
        /** One vector, a vector with all components set to `1`. */
        static readonly ONE: Readonly<Vector2i>
        
        /** Min vector, a vector with all components equal to `INT32_MIN`. Can be used as a negative integer equivalent of [constant Vector2.INF]. */
        static readonly MIN: Readonly<Vector2i>
        
        /** Max vector, a vector with all components equal to `INT32_MAX`. Can be used as an integer equivalent of [constant Vector2.INF]. */
        static readonly MAX: Readonly<Vector2i>
        
        /** Left unit vector. Represents the direction of left. */
        static readonly LEFT: Readonly<Vector2i>
        
        /** Right unit vector. Represents the direction of right. */
        static readonly RIGHT: Readonly<Vector2i>
        
        /** Up unit vector. Y is down in 2D, so this vector points -Y. */
        static readonly UP: Readonly<Vector2i>
        
        /** Down unit vector. Y is down in 2D, so this vector points +Y. */
        static readonly DOWN: Readonly<Vector2i>
        constructor()
        constructor(from: Vector2i)
        constructor(from: Vector2)
        constructor(x: int64, y: int64)
        
        /** Returns the aspect ratio of this vector, the ratio of [member x] to [member y]. */
        aspect(): float64
        
        /** Returns the axis of the vector's highest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_X]. */
        max_axis_index(): int64
        
        /** Returns the axis of the vector's lowest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_Y]. */
        min_axis_index(): int64
        
        /** Returns the distance between this vector and [param to]. */
        distance_to(to: Vector2i): float64
        
        /** Returns the squared distance between this vector and [param to].  
         *  This method runs faster than [method distance_to], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        distance_squared_to(to: Vector2i): int64
        
        /** Returns the length (magnitude) of this vector. */
        length(): float64
        
        /** Returns the squared length (squared magnitude) of this vector.  
         *  This method runs faster than [method length], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        length_squared(): int64
        
        /** Returns a new vector with each component set to `1` if it's positive, `-1` if it's negative, and `0` if it's zero. The result is identical to calling [method @GlobalScope.sign] on each component. */
        sign(): Vector2i
        
        /** Returns a new vector with all components in absolute values (i.e. positive). */
        abs(): Vector2i
        
        /** Returns a new vector with all components clamped between the components of [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clamp(min: Vector2i, max: Vector2i): Vector2i
        
        /** Returns a new vector with all components clamped between [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clampi(min: int64, max: int64): Vector2i
        
        /** Returns a new vector with each component snapped to the closest multiple of the corresponding component in [param step]. */
        snapped(step: Vector2i): Vector2i
        
        /** Returns a new vector with each component snapped to the closest multiple of [param step]. */
        snappedi(step: int64): Vector2i
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector2i(mini(x, with.x), mini(y, with.y))`. */
        min(with_: Vector2i): Vector2i
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector2i(mini(x, with), mini(y, with))`. */
        mini(with_: int64): Vector2i
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector2i(maxi(x, with.x), maxi(y, with.y))`. */
        max(with_: Vector2i): Vector2i
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector2i(maxi(x, with), maxi(y, with))`. */
        maxi(with_: int64): Vector2i
        static ADD(left: Vector2i, right: Vector2i): Vector2i
        static SUBTRACT(left: Vector2i, right: Vector2i): Vector2i
        static MULTIPLY(left: float64, right: Vector2i): Vector2i
        static MULTIPLY(left: Vector2i, right: Vector2i): Vector2i
        static MULTIPLY(left: Vector2i, right: float64): Vector2i
        static DIVIDE(left: Vector2i, right: Vector2i): Vector2i
        static DIVIDE(left: Vector2i, right: float64): Vector2i
        static NEGATE(left: Vector2i): Vector2i
        static EQUAL(left: Vector2i, right: Vector2i): boolean
        static NOT_EQUAL(left: Vector2i, right: Vector2i): boolean
        static LESS(left: Vector2i, right: Vector2i): boolean
        static LESS_EQUAL(left: Vector2i, right: Vector2i): boolean
        static GREATER(left: Vector2i, right: Vector2i): boolean
        static GREATER_EQUAL(left: Vector2i, right: Vector2i): boolean
        get x(): int64
        set x(value: int64)
        get y(): int64
        set y(value: int64)
    }
    /** A 2D axis-aligned bounding box using floating-point coordinates.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_rect2.html  
     */
    class Rect2 {
        constructor()
        constructor(from: Rect2)
        constructor(from: Rect2i)
        constructor(position: Vector2, size: Vector2)
        constructor(x: float64, y: float64, width: float64, height: float64)
        
        /** Returns the center point of the rectangle. This is the same as `position + (size / 2.0)`. */
        get_center(): Vector2
        
        /** Returns the rectangle's area. This is equivalent to `size.x * size.y`. See also [method has_area]. */
        get_area(): float64
        
        /** Returns `true` if this rectangle has positive width and height. See also [method get_area]. */
        has_area(): boolean
        
        /** Returns `true` if the rectangle contains the given [param point]. By convention, points on the right and bottom edges are **not** included.  
         *      
         *  **Note:** This method is not reliable for [Rect2] with a  *negative*  [member size]. Use [method abs] first to get a valid rectangle.  
         */
        has_point(point: Vector2): boolean
        
        /** Returns `true` if this rectangle and [param rect] are approximately equal, by calling [method Vector2.is_equal_approx] on the [member position] and the [member size]. */
        is_equal_approx(rect: Rect2): boolean
        
        /** Returns `true` if this rectangle's values are finite, by calling [method Vector2.is_finite] on the [member position] and the [member size]. */
        is_finite(): boolean
        
        /** Returns `true` if this rectangle overlaps with the [param b] rectangle. The edges of both rectangles are excluded, unless [param include_borders] is `true`. */
        intersects(b: Rect2, include_borders?: boolean /* = false */): boolean
        
        /** Returns `true` if this rectangle  *completely*  encloses the [param b] rectangle. */
        encloses(b: Rect2): boolean
        
        /** Returns the intersection between this rectangle and [param b]. If the rectangles do not intersect, returns an empty [Rect2].  
         *    
         *      
         *  **Note:** If you only need to know whether two rectangles are overlapping, use [method intersects], instead.  
         */
        intersection(b: Rect2): Rect2
        
        /** Returns a [Rect2] that encloses both this rectangle and [param b] around the edges. See also [method encloses]. */
        merge(b: Rect2): Rect2
        
        /** Returns a copy of this rectangle expanded to align the edges with the given [param to] point, if necessary.  
         *    
         */
        expand(to: Vector2): Rect2
        
        /** Returns the vertex's position of this rect that's the farthest in the given direction. This point is commonly known as the support point in collision detection algorithms. */
        get_support(direction: Vector2): Vector2
        
        /** Returns a copy of this rectangle extended on all sides by the given [param amount]. A negative [param amount] shrinks the rectangle instead. See also [method grow_individual] and [method grow_side].  
         *    
         */
        grow(amount: float64): Rect2
        
        /** Returns a copy of this rectangle with its [param side] extended by the given [param amount] (see [enum Side] constants). A negative [param amount] shrinks the rectangle, instead. See also [method grow] and [method grow_individual]. */
        grow_side(side: int64, amount: float64): Rect2
        
        /** Returns a copy of this rectangle with its [param left], [param top], [param right], and [param bottom] sides extended by the given amounts. Negative values shrink the sides, instead. See also [method grow] and [method grow_side]. */
        grow_individual(left: float64, top: float64, right: float64, bottom: float64): Rect2
        
        /** Returns a [Rect2] equivalent to this rectangle, with its width and height modified to be non-negative values, and with its [member position] being the top-left corner of the rectangle.  
         *    
         *      
         *  **Note:** It's recommended to use this method when [member size] is negative, as most other methods in Godot assume that the [member position] is the top-left corner, and the [member end] is the bottom-right corner.  
         */
        abs(): Rect2
        get position(): Vector2
        set position(value: Vector2)
        get size(): Vector2
        set size(value: Vector2)
        get end(): Vector2
        set end(value: Vector2)
    }
    /** A 2D axis-aligned bounding box using integer coordinates.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_rect2i.html  
     */
    class Rect2i {
        constructor()
        constructor(from: Rect2i)
        constructor(from: Rect2)
        constructor(position: Vector2i, size: Vector2i)
        constructor(x: int64, y: int64, width: int64, height: int64)
        
        /** Returns the center point of the rectangle. This is the same as `position + (size / 2)`.  
         *      
         *  **Note:** If the [member size] is odd, the result will be rounded towards [member position].  
         */
        get_center(): Vector2i
        
        /** Returns the rectangle's area. This is equivalent to `size.x * size.y`. See also [method has_area]. */
        get_area(): int64
        
        /** Returns `true` if this rectangle has positive width and height. See also [method get_area]. */
        has_area(): boolean
        
        /** Returns `true` if the rectangle contains the given [param point]. By convention, points on the right and bottom edges are **not** included.  
         *      
         *  **Note:** This method is not reliable for [Rect2i] with a  *negative*  [member size]. Use [method abs] first to get a valid rectangle.  
         */
        has_point(point: Vector2i): boolean
        
        /** Returns `true` if this rectangle overlaps with the [param b] rectangle. The edges of both rectangles are excluded. */
        intersects(b: Rect2i): boolean
        
        /** Returns `true` if this [Rect2i] completely encloses another one. */
        encloses(b: Rect2i): boolean
        
        /** Returns the intersection between this rectangle and [param b]. If the rectangles do not intersect, returns an empty [Rect2i].  
         *    
         *      
         *  **Note:** If you only need to know whether two rectangles are overlapping, use [method intersects], instead.  
         */
        intersection(b: Rect2i): Rect2i
        
        /** Returns a [Rect2i] that encloses both this rectangle and [param b] around the edges. See also [method encloses]. */
        merge(b: Rect2i): Rect2i
        
        /** Returns a copy of this rectangle expanded to align the edges with the given [param to] point, if necessary.  
         *    
         */
        expand(to: Vector2i): Rect2i
        
        /** Returns a copy of this rectangle extended on all sides by the given [param amount]. A negative [param amount] shrinks the rectangle instead. See also [method grow_individual] and [method grow_side].  
         *    
         */
        grow(amount: int64): Rect2i
        
        /** Returns a copy of this rectangle with its [param side] extended by the given [param amount] (see [enum Side] constants). A negative [param amount] shrinks the rectangle, instead. See also [method grow] and [method grow_individual]. */
        grow_side(side: int64, amount: int64): Rect2i
        
        /** Returns a copy of this rectangle with its [param left], [param top], [param right], and [param bottom] sides extended by the given amounts. Negative values shrink the sides, instead. See also [method grow] and [method grow_side]. */
        grow_individual(left: int64, top: int64, right: int64, bottom: int64): Rect2i
        
        /** Returns a [Rect2i] equivalent to this rectangle, with its width and height modified to be non-negative values, and with its [member position] being the top-left corner of the rectangle.  
         *    
         *      
         *  **Note:** It's recommended to use this method when [member size] is negative, as most other methods in Godot assume that the [member position] is the top-left corner, and the [member end] is the bottom-right corner.  
         */
        abs(): Rect2i
        get position(): Vector2i
        set position(value: Vector2i)
        get size(): Vector2i
        set size(value: Vector2i)
        get end(): Vector2i
        set end(value: Vector2i)
    }
    namespace Vector3 {
        enum Axis {
            /** Enumerated value for the X axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_X = 0,
            
            /** Enumerated value for the Y axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Y = 1,
            
            /** Enumerated value for the Z axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Z = 2,
        }
    }
    /** A 3D vector using floating-point coordinates.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_vector3.html  
     */
    class Vector3 {
        /** Zero vector, a vector with all components set to `0`. */
        static readonly ZERO: Readonly<Vector3>
        
        /** One vector, a vector with all components set to `1`. */
        static readonly ONE: Readonly<Vector3>
        
        /** Infinity vector, a vector with all components set to [constant @GDScript.INF]. */
        static readonly INF: Readonly<Vector3>
        
        /** Left unit vector. Represents the local direction of left, and the global direction of west. */
        static readonly LEFT: Readonly<Vector3>
        
        /** Right unit vector. Represents the local direction of right, and the global direction of east. */
        static readonly RIGHT: Readonly<Vector3>
        
        /** Up unit vector. */
        static readonly UP: Readonly<Vector3>
        
        /** Down unit vector. */
        static readonly DOWN: Readonly<Vector3>
        
        /** Forward unit vector. Represents the local direction of forward, and the global direction of north. Keep in mind that the forward direction for lights, cameras, etc is different from 3D assets like characters, which face towards the camera by convention. Use [constant Vector3.MODEL_FRONT] and similar constants when working in 3D asset space. */
        static readonly FORWARD: Readonly<Vector3>
        
        /** Back unit vector. Represents the local direction of back, and the global direction of south. */
        static readonly BACK: Readonly<Vector3>
        
        /** Unit vector pointing towards the left side of imported 3D assets. */
        static readonly MODEL_LEFT: Readonly<Vector3>
        
        /** Unit vector pointing towards the right side of imported 3D assets. */
        static readonly MODEL_RIGHT: Readonly<Vector3>
        
        /** Unit vector pointing towards the top side (up) of imported 3D assets. */
        static readonly MODEL_TOP: Readonly<Vector3>
        
        /** Unit vector pointing towards the bottom side (down) of imported 3D assets. */
        static readonly MODEL_BOTTOM: Readonly<Vector3>
        
        /** Unit vector pointing towards the front side (facing forward) of imported 3D assets. */
        static readonly MODEL_FRONT: Readonly<Vector3>
        
        /** Unit vector pointing towards the rear side (back) of imported 3D assets. */
        static readonly MODEL_REAR: Readonly<Vector3>
        constructor()
        constructor(from: Vector3)
        constructor(from: Vector3i)
        constructor(x: float64, y: float64, z: float64)
        
        /** Returns the axis of the vector's lowest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_Z]. */
        min_axis_index(): int64
        
        /** Returns the axis of the vector's highest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_X]. */
        max_axis_index(): int64
        
        /** Returns the unsigned minimum angle to the given vector, in radians. */
        angle_to(to: Vector3): float64
        
        /** Returns the signed angle to the given vector, in radians. The sign of the angle is positive in a counter-clockwise direction and negative in a clockwise direction when viewed from the side specified by the [param axis]. */
        signed_angle_to(to: Vector3, axis: Vector3): float64
        
        /** Returns the normalized vector pointing from this vector to [param to]. This is equivalent to using `(b - a).normalized()`. */
        direction_to(to: Vector3): Vector3
        
        /** Returns the distance between this vector and [param to]. */
        distance_to(to: Vector3): float64
        
        /** Returns the squared distance between this vector and [param to].  
         *  This method runs faster than [method distance_to], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        distance_squared_to(to: Vector3): float64
        
        /** Returns the length (magnitude) of this vector. */
        length(): float64
        
        /** Returns the squared length (squared magnitude) of this vector.  
         *  This method runs faster than [method length], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        length_squared(): float64
        
        /** Returns the vector with a maximum length by limiting its length to [param length]. If the vector is non-finite, the result is undefined. */
        limit_length(length?: float64 /* = 1 */): Vector3
        
        /** Returns the result of scaling the vector to unit length. Equivalent to `v / v.length()`. Returns `(0, 0, 0)` if `v.length() == 0`. See also [method is_normalized].  
         *      
         *  **Note:** This function may return incorrect values if the input vector length is near zero.  
         */
        normalized(): Vector3
        
        /** Returns `true` if the vector is normalized, i.e. its length is approximately equal to 1. */
        is_normalized(): boolean
        
        /** Returns `true` if this vector and [param to] are approximately equal, by running [method @GlobalScope.is_equal_approx] on each component. */
        is_equal_approx(to: Vector3): boolean
        
        /** Returns `true` if this vector's values are approximately zero, by running [method @GlobalScope.is_zero_approx] on each component.  
         *  This method is faster than using [method is_equal_approx] with one value as a zero vector.  
         */
        is_zero_approx(): boolean
        
        /** Returns `true` if this vector is finite, by calling [method @GlobalScope.is_finite] on each component. */
        is_finite(): boolean
        
        /** Returns the inverse of the vector. This is the same as `Vector3(1.0 / v.x, 1.0 / v.y, 1.0 / v.z)`. */
        inverse(): Vector3
        
        /** Returns a new vector with all components clamped between the components of [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clamp(min: Vector3, max: Vector3): Vector3
        
        /** Returns a new vector with all components clamped between [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clampf(min: float64, max: float64): Vector3
        
        /** Returns a new vector with each component snapped to the nearest multiple of the corresponding component in [param step]. This can also be used to round the components to an arbitrary number of decimals. */
        snapped(step: Vector3): Vector3
        
        /** Returns a new vector with each component snapped to the nearest multiple of [param step]. This can also be used to round the components to an arbitrary number of decimals. */
        snappedf(step: float64): Vector3
        
        /** Returns the result of rotating this vector around a given axis by [param angle] (in radians). The axis must be a normalized vector. See also [method @GlobalScope.deg_to_rad]. */
        rotated(axis: Vector3, angle: float64): Vector3
        
        /** Returns the result of the linear interpolation between this vector and [param to] by amount [param weight]. [param weight] is on the range of `0.0` to `1.0`, representing the amount of interpolation. */
        lerp(to: Vector3, weight: float64): Vector3
        
        /** Returns the result of spherical linear interpolation between this vector and [param to], by amount [param weight]. [param weight] is on the range of 0.0 to 1.0, representing the amount of interpolation.  
         *  This method also handles interpolating the lengths if the input vectors have different lengths. For the special case of one or both input vectors having zero length, this method behaves like [method lerp].  
         */
        slerp(to: Vector3, weight: float64): Vector3
        
        /** Performs a cubic interpolation between this vector and [param b] using [param pre_a] and [param post_b] as handles, and returns the result at position [param weight]. [param weight] is on the range of 0.0 to 1.0, representing the amount of interpolation. */
        cubic_interpolate(b: Vector3, pre_a: Vector3, post_b: Vector3, weight: float64): Vector3
        
        /** Performs a cubic interpolation between this vector and [param b] using [param pre_a] and [param post_b] as handles, and returns the result at position [param weight]. [param weight] is on the range of 0.0 to 1.0, representing the amount of interpolation.  
         *  It can perform smoother interpolation than [method cubic_interpolate] by the time values.  
         */
        cubic_interpolate_in_time(b: Vector3, pre_a: Vector3, post_b: Vector3, weight: float64, b_t: float64, pre_a_t: float64, post_b_t: float64): Vector3
        
        /** Returns the point at the given [param t] on the [url=https://en.wikipedia.org/wiki/B%C3%A9zier_curve]Bézier curve[/url] defined by this vector and the given [param control_1], [param control_2], and [param end] points. */
        bezier_interpolate(control_1: Vector3, control_2: Vector3, end: Vector3, t: float64): Vector3
        
        /** Returns the derivative at the given [param t] on the [url=https://en.wikipedia.org/wiki/B%C3%A9zier_curve]Bézier curve[/url] defined by this vector and the given [param control_1], [param control_2], and [param end] points. */
        bezier_derivative(control_1: Vector3, control_2: Vector3, end: Vector3, t: float64): Vector3
        
        /** Returns a new vector moved toward [param to] by the fixed [param delta] amount. Will not go past the final value. */
        move_toward(to: Vector3, delta: float64): Vector3
        
        /** Returns the dot product of this vector and [param with]. This can be used to compare the angle between two vectors. For example, this can be used to determine whether an enemy is facing the player.  
         *  The dot product will be `0` for a right angle (90 degrees), greater than 0 for angles narrower than 90 degrees and lower than 0 for angles wider than 90 degrees.  
         *  When using unit (normalized) vectors, the result will always be between `-1.0` (180 degree angle) when the vectors are facing opposite directions, and `1.0` (0 degree angle) when the vectors are aligned.  
         *      
         *  **Note:** `a.dot(b)` is equivalent to `b.dot(a)`.  
         */
        dot(with_: Vector3): float64
        
        /** Returns the cross product of this vector and [param with].  
         *  This returns a vector perpendicular to both this and [param with], which would be the normal vector of the plane defined by the two vectors. As there are two such vectors, in opposite directions, this method returns the vector defined by a right-handed coordinate system. If the two vectors are parallel this returns an empty vector, making it useful for testing if two vectors are parallel.  
         */
        cross(with_: Vector3): Vector3
        
        /** Returns the outer product with [param with]. */
        outer(with_: Vector3): Basis
        
        /** Returns a new vector with all components in absolute values (i.e. positive). */
        abs(): Vector3
        
        /** Returns a new vector with all components rounded down (towards negative infinity). */
        floor(): Vector3
        
        /** Returns a new vector with all components rounded up (towards positive infinity). */
        ceil(): Vector3
        
        /** Returns a new vector with all components rounded to the nearest integer, with halfway cases rounded away from zero. */
        round(): Vector3
        
        /** Returns a vector composed of the [method @GlobalScope.fposmod] of this vector's components and [param mod]. */
        posmod(mod: float64): Vector3
        
        /** Returns a vector composed of the [method @GlobalScope.fposmod] of this vector's components and [param modv]'s components. */
        posmodv(modv: Vector3): Vector3
        
        /** Returns a new vector resulting from projecting this vector onto the given vector [param b]. The resulting new vector is parallel to [param b]. See also [method slide].  
         *      
         *  **Note:** If the vector [param b] is a zero vector, the components of the resulting new vector will be [constant @GDScript.NAN].  
         */
        project(b: Vector3): Vector3
        
        /** Returns a new vector resulting from sliding this vector along a plane with normal [param n]. The resulting new vector is perpendicular to [param n], and is equivalent to this vector minus its projection on [param n]. See also [method project].  
         *      
         *  **Note:** The vector [param n] must be normalized. See also [method normalized].  
         */
        slide(n: Vector3): Vector3
        
        /** Returns the vector "bounced off" from a plane defined by the given normal [param n].  
         *      
         *  **Note:** [method bounce] performs the operation that most engines and frameworks call [code skip-lint]reflect()`.  
         */
        bounce(n: Vector3): Vector3
        
        /** Returns the result of reflecting the vector through a plane defined by the given normal vector [param n].  
         *      
         *  **Note:** [method reflect] differs from what other engines and frameworks call [code skip-lint]reflect()`. In other engines, [code skip-lint]reflect()` returns the result of the vector reflected by the given plane. The reflection thus passes through the given normal. While in Godot the reflection passes through the plane and can be thought of as bouncing off the normal. See also [method bounce] which does what most engines call [code skip-lint]reflect()`.  
         */
        reflect(n: Vector3): Vector3
        
        /** Returns a new vector with each component set to `1.0` if it's positive, `-1.0` if it's negative, and `0.0` if it's zero. The result is identical to calling [method @GlobalScope.sign] on each component. */
        sign(): Vector3
        
        /** Returns the octahedral-encoded (oct32) form of this [Vector3] as a [Vector2]. Since a [Vector2] occupies 1/3 less memory compared to [Vector3], this form of compression can be used to pass greater amounts of [method normalized] [Vector3]s without increasing storage or memory requirements. See also [method octahedron_decode].  
         *      
         *  **Note:** [method octahedron_encode] can only be used for [method normalized] vectors. [method octahedron_encode] does  *not*  check whether this [Vector3] is normalized, and will return a value that does not decompress to the original value if the [Vector3] is not normalized.  
         *      
         *  **Note:** Octahedral compression is  *lossy* , although visual differences are rarely perceptible in real world scenarios.  
         */
        octahedron_encode(): Vector2
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector3(minf(x, with.x), minf(y, with.y), minf(z, with.z))`. */
        min(with_: Vector3): Vector3
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector3(minf(x, with), minf(y, with), minf(z, with))`. */
        minf(with_: float64): Vector3
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector3(maxf(x, with.x), maxf(y, with.y), maxf(z, with.z))`. */
        max(with_: Vector3): Vector3
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector3(maxf(x, with), maxf(y, with), maxf(z, with))`. */
        maxf(with_: float64): Vector3
        
        /** Returns the [Vector3] from an octahedral-compressed form created using [method octahedron_encode] (stored as a [Vector2]). */
        static octahedron_decode(uv: Vector2): Vector3
        static ADD(left: Vector3, right: Vector3): Vector3
        static SUBTRACT(left: Vector3, right: Vector3): Vector3
        static MULTIPLY(left: float64, right: Vector3): Vector3
        static MULTIPLY(left: Vector3, right: Vector3): Vector3
        static MULTIPLY(left: Vector3, right: float64): Vector3
        static DIVIDE(left: Vector3, right: Vector3): Vector3
        static DIVIDE(left: Vector3, right: float64): Vector3
        static NEGATE(left: Vector3): Vector3
        static EQUAL(left: Vector3, right: Vector3): boolean
        static NOT_EQUAL(left: Vector3, right: Vector3): boolean
        static LESS(left: Vector3, right: Vector3): boolean
        static LESS_EQUAL(left: Vector3, right: Vector3): boolean
        static GREATER(left: Vector3, right: Vector3): boolean
        static GREATER_EQUAL(left: Vector3, right: Vector3): boolean
        get x(): float64
        set x(value: float64)
        get y(): float64
        set y(value: float64)
        get z(): float64
        set z(value: float64)
    }
    namespace Vector3i {
        enum Axis {
            /** Enumerated value for the X axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_X = 0,
            
            /** Enumerated value for the Y axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Y = 1,
            
            /** Enumerated value for the Z axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Z = 2,
        }
    }
    /** A 3D vector using integer coordinates.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_vector3i.html  
     */
    class Vector3i {
        /** Zero vector, a vector with all components set to `0`. */
        static readonly ZERO: Readonly<Vector3i>
        
        /** One vector, a vector with all components set to `1`. */
        static readonly ONE: Readonly<Vector3i>
        
        /** Min vector, a vector with all components equal to `INT32_MIN`. Can be used as a negative integer equivalent of [constant Vector3.INF]. */
        static readonly MIN: Readonly<Vector3i>
        
        /** Max vector, a vector with all components equal to `INT32_MAX`. Can be used as an integer equivalent of [constant Vector3.INF]. */
        static readonly MAX: Readonly<Vector3i>
        
        /** Left unit vector. Represents the local direction of left, and the global direction of west. */
        static readonly LEFT: Readonly<Vector3i>
        
        /** Right unit vector. Represents the local direction of right, and the global direction of east. */
        static readonly RIGHT: Readonly<Vector3i>
        
        /** Up unit vector. */
        static readonly UP: Readonly<Vector3i>
        
        /** Down unit vector. */
        static readonly DOWN: Readonly<Vector3i>
        
        /** Forward unit vector. Represents the local direction of forward, and the global direction of north. */
        static readonly FORWARD: Readonly<Vector3i>
        
        /** Back unit vector. Represents the local direction of back, and the global direction of south. */
        static readonly BACK: Readonly<Vector3i>
        constructor()
        constructor(from: Vector3i)
        constructor(from: Vector3)
        constructor(x: int64, y: int64, z: int64)
        
        /** Returns the axis of the vector's lowest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_Z]. */
        min_axis_index(): int64
        
        /** Returns the axis of the vector's highest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_X]. */
        max_axis_index(): int64
        
        /** Returns the distance between this vector and [param to]. */
        distance_to(to: Vector3i): float64
        
        /** Returns the squared distance between this vector and [param to].  
         *  This method runs faster than [method distance_to], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        distance_squared_to(to: Vector3i): int64
        
        /** Returns the length (magnitude) of this vector. */
        length(): float64
        
        /** Returns the squared length (squared magnitude) of this vector.  
         *  This method runs faster than [method length], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        length_squared(): int64
        
        /** Returns a new vector with each component set to `1` if it's positive, `-1` if it's negative, and `0` if it's zero. The result is identical to calling [method @GlobalScope.sign] on each component. */
        sign(): Vector3i
        
        /** Returns a new vector with all components in absolute values (i.e. positive). */
        abs(): Vector3i
        
        /** Returns a new vector with all components clamped between the components of [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clamp(min: Vector3i, max: Vector3i): Vector3i
        
        /** Returns a new vector with all components clamped between [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clampi(min: int64, max: int64): Vector3i
        
        /** Returns a new vector with each component snapped to the closest multiple of the corresponding component in [param step]. */
        snapped(step: Vector3i): Vector3i
        
        /** Returns a new vector with each component snapped to the closest multiple of [param step]. */
        snappedi(step: int64): Vector3i
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector3i(mini(x, with.x), mini(y, with.y), mini(z, with.z))`. */
        min(with_: Vector3i): Vector3i
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector3i(mini(x, with), mini(y, with), mini(z, with))`. */
        mini(with_: int64): Vector3i
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector3i(maxi(x, with.x), maxi(y, with.y), maxi(z, with.z))`. */
        max(with_: Vector3i): Vector3i
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector3i(maxi(x, with), maxi(y, with), maxi(z, with))`. */
        maxi(with_: int64): Vector3i
        static ADD(left: Vector3i, right: Vector3i): Vector3i
        static SUBTRACT(left: Vector3i, right: Vector3i): Vector3i
        static MULTIPLY(left: float64, right: Vector3i): Vector3i
        static MULTIPLY(left: Vector3i, right: Vector3i): Vector3i
        static MULTIPLY(left: Vector3i, right: float64): Vector3i
        static DIVIDE(left: Vector3i, right: Vector3i): Vector3i
        static DIVIDE(left: Vector3i, right: float64): Vector3i
        static NEGATE(left: Vector3i): Vector3i
        static EQUAL(left: Vector3i, right: Vector3i): boolean
        static NOT_EQUAL(left: Vector3i, right: Vector3i): boolean
        static LESS(left: Vector3i, right: Vector3i): boolean
        static LESS_EQUAL(left: Vector3i, right: Vector3i): boolean
        static GREATER(left: Vector3i, right: Vector3i): boolean
        static GREATER_EQUAL(left: Vector3i, right: Vector3i): boolean
        get x(): int64
        set x(value: int64)
        get y(): int64
        set y(value: int64)
        get z(): int64
        set z(value: int64)
    }
    /** A 2×3 matrix representing a 2D transformation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_transform2d.html  
     */
    class Transform2D {
        /** The identity [Transform2D]. This is a transform with no translation, no rotation, and a scale of [constant Vector2.ONE]. This also means that:  
         *  - The [member x] points right ([constant Vector2.RIGHT]);  
         *  - The [member y] points down ([constant Vector2.DOWN]).  
         *    
         *  If a [Vector2], a [Rect2], a [PackedVector2Array], or another [Transform2D] is transformed (multiplied) by this constant, no transformation occurs.  
         *      
         *  **Note:** In GDScript, this constant is equivalent to creating a [constructor Transform2D] without any arguments. It can be used to make your code clearer, and for consistency with C#.  
         */
        static readonly IDENTITY: Readonly<Transform2D>
        
        /** When any transform is multiplied by [constant FLIP_X], it negates all components of the [member x] axis (the X column).  
         *  When [constant FLIP_X] is multiplied by any transform, it negates the [member Vector2.x] component of all axes (the X row).  
         */
        static readonly FLIP_X: Readonly<Transform2D>
        
        /** When any transform is multiplied by [constant FLIP_Y], it negates all components of the [member y] axis (the Y column).  
         *  When [constant FLIP_Y] is multiplied by any transform, it negates the [member Vector2.y] component of all axes (the Y row).  
         */
        static readonly FLIP_Y: Readonly<Transform2D>
        constructor()
        constructor(from: Transform2D)
        constructor(rotation: float64, position: Vector2)
        constructor(rotation: float64, scale: Vector2, skew: float64, position: Vector2)
        constructor(x_axis: Vector2, y_axis: Vector2, origin: Vector2)
        
        /** Returns the [url=https://en.wikipedia.org/wiki/Invertible_matrix]inverted version of this transform[/url].  
         *      
         *  **Note:** For this method to return correctly, the transform's basis needs to be  *orthonormal*  (see [method orthonormalized]). That means the basis should only represent a rotation. If it does not, use [method affine_inverse] instead.  
         */
        inverse(): Transform2D
        
        /** Returns the inverted version of this transform. Unlike [method inverse], this method works with almost any basis, including non-uniform ones, but is slower.  
         *      
         *  **Note:** For this method to return correctly, the transform's basis needs to have a determinant that is not exactly `0.0` (see [method determinant]).  
         */
        affine_inverse(): Transform2D
        
        /** Returns this transform's rotation (in radians). This is equivalent to [member x]'s angle (see [method Vector2.angle]). */
        get_rotation(): float64
        
        /** Returns this transform's translation. Equivalent to [member origin]. */
        get_origin(): Vector2
        
        /** Returns the length of both [member x] and [member y], as a [Vector2]. If this transform's basis is not skewed, this value is the scaling factor. It is not affected by rotation.  
         *    
         *      
         *  **Note:** If the value returned by [method determinant] is negative, the scale is also negative.  
         */
        get_scale(): Vector2
        
        /** Returns this transform's skew (in radians). */
        get_skew(): float64
        
        /** Returns a copy of this transform with its basis orthonormalized. An orthonormal basis is both  *orthogonal*  (the axes are perpendicular to each other) and  *normalized*  (the axes have a length of `1.0`), which also means it can only represent a rotation. */
        orthonormalized(): Transform2D
        
        /** Returns a copy of this transform rotated by the given [param angle] (in radians).  
         *  If [param angle] is positive, the transform is rotated clockwise.  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding rotation transform `R` from the left, i.e., `R * X`.  
         *  This can be seen as transforming with respect to the global/parent frame.  
         */
        rotated(angle: float64): Transform2D
        
        /** Returns a copy of the transform rotated by the given [param angle] (in radians).  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding rotation transform `R` from the right, i.e., `X * R`.  
         *  This can be seen as transforming with respect to the local frame.  
         */
        rotated_local(angle: float64): Transform2D
        
        /** Returns a copy of the transform scaled by the given [param scale] factor.  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding scaling transform `S` from the left, i.e., `S * X`.  
         *  This can be seen as transforming with respect to the global/parent frame.  
         */
        scaled(scale: Vector2): Transform2D
        
        /** Returns a copy of the transform scaled by the given [param scale] factor.  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding scaling transform `S` from the right, i.e., `X * S`.  
         *  This can be seen as transforming with respect to the local frame.  
         */
        scaled_local(scale: Vector2): Transform2D
        
        /** Returns a copy of the transform translated by the given [param offset].  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding translation transform `T` from the left, i.e., `T * X`.  
         *  This can be seen as transforming with respect to the global/parent frame.  
         */
        translated(offset: Vector2): Transform2D
        
        /** Returns a copy of the transform translated by the given [param offset].  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding translation transform `T` from the right, i.e., `X * T`.  
         *  This can be seen as transforming with respect to the local frame.  
         */
        translated_local(offset: Vector2): Transform2D
        
        /** Returns the [url=https://en.wikipedia.org/wiki/Determinant]determinant[/url] of this transform basis's matrix. For advanced math, this number can be used to determine a few attributes:  
         *  - If the determinant is exactly `0.0`, the basis is not invertible (see [method inverse]).  
         *  - If the determinant is a negative number, the basis represents a negative scale.  
         *      
         *  **Note:** If the basis's scale is the same for every axis, its determinant is always that scale by the power of 2.  
         */
        determinant(): float64
        
        /** Returns a copy of the [param v] vector, transformed (multiplied) by the transform basis's matrix. Unlike the multiplication operator (`*`), this method ignores the [member origin]. */
        basis_xform(v: Vector2): Vector2
        
        /** Returns a copy of the [param v] vector, transformed (multiplied) by the inverse transform basis's matrix (see [method inverse]). This method ignores the [member origin].  
         *      
         *  **Note:** This method assumes that this transform's basis is  *orthonormal*  (see [method orthonormalized]). If the basis is not orthonormal, `transform.affine_inverse().basis_xform(vector)` should be used instead (see [method affine_inverse]).  
         */
        basis_xform_inv(v: Vector2): Vector2
        
        /** Returns the result of the linear interpolation between this transform and [param xform] by the given [param weight].  
         *  The [param weight] should be between `0.0` and `1.0` (inclusive). Values outside this range are allowed and can be used to perform  *extrapolation*  instead.  
         */
        interpolate_with(xform: Transform2D, weight: float64): Transform2D
        
        /** Returns `true` if this transform's basis is conformal. A conformal basis is both  *orthogonal*  (the axes are perpendicular to each other) and  *uniform*  (the axes share the same length). This method can be especially useful during physics calculations. */
        is_conformal(): boolean
        
        /** Returns `true` if this transform and [param xform] are approximately equal, by running [method @GlobalScope.is_equal_approx] on each component. */
        is_equal_approx(xform: Transform2D): boolean
        
        /** Returns `true` if this transform is finite, by calling [method @GlobalScope.is_finite] on each component. */
        is_finite(): boolean
        
        /** Returns a copy of the transform rotated such that the rotated X-axis points towards the [param target] position, in global space. */
        looking_at(target?: Vector2 /* = Vector2.ZERO */): Transform2D
        static MULTIPLY(left: Transform2D, right: Transform2D): Transform2D
        static MULTIPLY(left: Transform2D, right: float64): Transform2D
        static MULTIPLY(left: Transform2D, right: Vector2): Vector2
        static MULTIPLY(left: Vector2, right: Transform2D): Vector2
        static MULTIPLY(left: Transform2D, right: Rect2): Rect2
        static MULTIPLY(left: Rect2, right: Transform2D): Rect2
        static MULTIPLY(left: Transform2D, right: PackedVector2Array | Vector2[]): PackedVector2Array
        static MULTIPLY(left: PackedVector2Array | Vector2[], right: Transform2D): PackedVector2Array
        static EQUAL(left: Transform2D, right: Transform2D): boolean
        static NOT_EQUAL(left: Transform2D, right: Transform2D): boolean
        get x(): Vector2
        set x(value: Vector2)
        get y(): Vector2
        set y(value: Vector2)
        get origin(): Vector2
        set origin(value: Vector2)
    }
    namespace Vector4 {
        enum Axis {
            /** Enumerated value for the X axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_X = 0,
            
            /** Enumerated value for the Y axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Y = 1,
            
            /** Enumerated value for the Z axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Z = 2,
            
            /** Enumerated value for the W axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_W = 3,
        }
    }
    /** A 4D vector using floating-point coordinates.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_vector4.html  
     */
    class Vector4 {
        /** Zero vector, a vector with all components set to `0`. */
        static readonly ZERO: Readonly<Vector4>
        
        /** One vector, a vector with all components set to `1`. */
        static readonly ONE: Readonly<Vector4>
        
        /** Infinity vector, a vector with all components set to [constant @GDScript.INF]. */
        static readonly INF: Readonly<Vector4>
        constructor()
        constructor(from: Vector4)
        constructor(from: Vector4i)
        constructor(x: float64, y: float64, z: float64, w: float64)
        
        /** Returns the axis of the vector's lowest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_W]. */
        min_axis_index(): int64
        
        /** Returns the axis of the vector's highest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_X]. */
        max_axis_index(): int64
        
        /** Returns the length (magnitude) of this vector. */
        length(): float64
        
        /** Returns the squared length (squared magnitude) of this vector.  
         *  This method runs faster than [method length], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        length_squared(): float64
        
        /** Returns a new vector with all components in absolute values (i.e. positive). */
        abs(): Vector4
        
        /** Returns a new vector with each component set to `1.0` if it's positive, `-1.0` if it's negative, and `0.0` if it's zero. The result is identical to calling [method @GlobalScope.sign] on each component. */
        sign(): Vector4
        
        /** Returns a new vector with all components rounded down (towards negative infinity). */
        floor(): Vector4
        
        /** Returns a new vector with all components rounded up (towards positive infinity). */
        ceil(): Vector4
        
        /** Returns a new vector with all components rounded to the nearest integer, with halfway cases rounded away from zero. */
        round(): Vector4
        
        /** Returns the result of the linear interpolation between this vector and [param to] by amount [param weight]. [param weight] is on the range of `0.0` to `1.0`, representing the amount of interpolation. */
        lerp(to: Vector4, weight: float64): Vector4
        
        /** Performs a cubic interpolation between this vector and [param b] using [param pre_a] and [param post_b] as handles, and returns the result at position [param weight]. [param weight] is on the range of 0.0 to 1.0, representing the amount of interpolation. */
        cubic_interpolate(b: Vector4, pre_a: Vector4, post_b: Vector4, weight: float64): Vector4
        
        /** Performs a cubic interpolation between this vector and [param b] using [param pre_a] and [param post_b] as handles, and returns the result at position [param weight]. [param weight] is on the range of 0.0 to 1.0, representing the amount of interpolation.  
         *  It can perform smoother interpolation than [method cubic_interpolate] by the time values.  
         */
        cubic_interpolate_in_time(b: Vector4, pre_a: Vector4, post_b: Vector4, weight: float64, b_t: float64, pre_a_t: float64, post_b_t: float64): Vector4
        
        /** Returns a vector composed of the [method @GlobalScope.fposmod] of this vector's components and [param mod]. */
        posmod(mod: float64): Vector4
        
        /** Returns a vector composed of the [method @GlobalScope.fposmod] of this vector's components and [param modv]'s components. */
        posmodv(modv: Vector4): Vector4
        
        /** Returns a new vector with each component snapped to the nearest multiple of the corresponding component in [param step]. This can also be used to round the components to an arbitrary number of decimals. */
        snapped(step: Vector4): Vector4
        
        /** Returns a new vector with each component snapped to the nearest multiple of [param step]. This can also be used to round the components to an arbitrary number of decimals. */
        snappedf(step: float64): Vector4
        
        /** Returns a new vector with all components clamped between the components of [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clamp(min: Vector4, max: Vector4): Vector4
        
        /** Returns a new vector with all components clamped between [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clampf(min: float64, max: float64): Vector4
        
        /** Returns the result of scaling the vector to unit length. Equivalent to `v / v.length()`. Returns `(0, 0, 0, 0)` if `v.length() == 0`. See also [method is_normalized].  
         *      
         *  **Note:** This function may return incorrect values if the input vector length is near zero.  
         */
        normalized(): Vector4
        
        /** Returns `true` if the vector is normalized, i.e. its length is approximately equal to 1. */
        is_normalized(): boolean
        
        /** Returns the normalized vector pointing from this vector to [param to]. This is equivalent to using `(b - a).normalized()`. */
        direction_to(to: Vector4): Vector4
        
        /** Returns the distance between this vector and [param to]. */
        distance_to(to: Vector4): float64
        
        /** Returns the squared distance between this vector and [param to].  
         *  This method runs faster than [method distance_to], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        distance_squared_to(to: Vector4): float64
        
        /** Returns the dot product of this vector and [param with]. */
        dot(with_: Vector4): float64
        
        /** Returns the inverse of the vector. This is the same as `Vector4(1.0 / v.x, 1.0 / v.y, 1.0 / v.z, 1.0 / v.w)`. */
        inverse(): Vector4
        
        /** Returns `true` if this vector and [param to] are approximately equal, by running [method @GlobalScope.is_equal_approx] on each component. */
        is_equal_approx(to: Vector4): boolean
        
        /** Returns `true` if this vector's values are approximately zero, by running [method @GlobalScope.is_zero_approx] on each component.  
         *  This method is faster than using [method is_equal_approx] with one value as a zero vector.  
         */
        is_zero_approx(): boolean
        
        /** Returns `true` if this vector is finite, by calling [method @GlobalScope.is_finite] on each component. */
        is_finite(): boolean
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector4(minf(x, with.x), minf(y, with.y), minf(z, with.z), minf(w, with.w))`. */
        min(with_: Vector4): Vector4
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector4(minf(x, with), minf(y, with), minf(z, with), minf(w, with))`. */
        minf(with_: float64): Vector4
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector4(maxf(x, with.x), maxf(y, with.y), maxf(z, with.z), maxf(w, with.w))`. */
        max(with_: Vector4): Vector4
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector4(maxf(x, with), maxf(y, with), maxf(z, with), maxf(w, with))`. */
        maxf(with_: float64): Vector4
        static ADD(left: Vector4, right: Vector4): Vector4
        static SUBTRACT(left: Vector4, right: Vector4): Vector4
        static MULTIPLY(left: float64, right: Vector4): Vector4
        static MULTIPLY(left: Vector4, right: Vector4): Vector4
        static MULTIPLY(left: Vector4, right: float64): Vector4
        static DIVIDE(left: Vector4, right: Vector4): Vector4
        static DIVIDE(left: Vector4, right: float64): Vector4
        static NEGATE(left: Vector4): Vector4
        static EQUAL(left: Vector4, right: Vector4): boolean
        static NOT_EQUAL(left: Vector4, right: Vector4): boolean
        static LESS(left: Vector4, right: Vector4): boolean
        static LESS_EQUAL(left: Vector4, right: Vector4): boolean
        static GREATER(left: Vector4, right: Vector4): boolean
        static GREATER_EQUAL(left: Vector4, right: Vector4): boolean
        get x(): float64
        set x(value: float64)
        get y(): float64
        set y(value: float64)
        get z(): float64
        set z(value: float64)
        get w(): float64
        set w(value: float64)
    }
    namespace Vector4i {
        enum Axis {
            /** Enumerated value for the X axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_X = 0,
            
            /** Enumerated value for the Y axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Y = 1,
            
            /** Enumerated value for the Z axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Z = 2,
            
            /** Enumerated value for the W axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_W = 3,
        }
    }
    /** A 4D vector using integer coordinates.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_vector4i.html  
     */
    class Vector4i {
        /** Zero vector, a vector with all components set to `0`. */
        static readonly ZERO: Readonly<Vector4i>
        
        /** One vector, a vector with all components set to `1`. */
        static readonly ONE: Readonly<Vector4i>
        
        /** Min vector, a vector with all components equal to `INT32_MIN`. Can be used as a negative integer equivalent of [constant Vector4.INF]. */
        static readonly MIN: Readonly<Vector4i>
        
        /** Max vector, a vector with all components equal to `INT32_MAX`. Can be used as an integer equivalent of [constant Vector4.INF]. */
        static readonly MAX: Readonly<Vector4i>
        constructor()
        constructor(from: Vector4i)
        constructor(from: Vector4)
        constructor(x: int64, y: int64, z: int64, w: int64)
        
        /** Returns the axis of the vector's lowest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_W]. */
        min_axis_index(): int64
        
        /** Returns the axis of the vector's highest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_X]. */
        max_axis_index(): int64
        
        /** Returns the length (magnitude) of this vector. */
        length(): float64
        
        /** Returns the squared length (squared magnitude) of this vector.  
         *  This method runs faster than [method length], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        length_squared(): int64
        
        /** Returns a new vector with each component set to `1` if it's positive, `-1` if it's negative, and `0` if it's zero. The result is identical to calling [method @GlobalScope.sign] on each component. */
        sign(): Vector4i
        
        /** Returns a new vector with all components in absolute values (i.e. positive). */
        abs(): Vector4i
        
        /** Returns a new vector with all components clamped between the components of [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clamp(min: Vector4i, max: Vector4i): Vector4i
        
        /** Returns a new vector with all components clamped between [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clampi(min: int64, max: int64): Vector4i
        
        /** Returns a new vector with each component snapped to the closest multiple of the corresponding component in [param step]. */
        snapped(step: Vector4i): Vector4i
        
        /** Returns a new vector with each component snapped to the closest multiple of [param step]. */
        snappedi(step: int64): Vector4i
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector4i(mini(x, with.x), mini(y, with.y), mini(z, with.z), mini(w, with.w))`. */
        min(with_: Vector4i): Vector4i
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector4i(mini(x, with), mini(y, with), mini(z, with), mini(w, with))`. */
        mini(with_: int64): Vector4i
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector4i(maxi(x, with.x), maxi(y, with.y), maxi(z, with.z), maxi(w, with.w))`. */
        max(with_: Vector4i): Vector4i
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector4i(maxi(x, with), maxi(y, with), maxi(z, with), maxi(w, with))`. */
        maxi(with_: int64): Vector4i
        
        /** Returns the distance between this vector and [param to]. */
        distance_to(to: Vector4i): float64
        
        /** Returns the squared distance between this vector and [param to].  
         *  This method runs faster than [method distance_to], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        distance_squared_to(to: Vector4i): int64
        static ADD(left: Vector4i, right: Vector4i): Vector4i
        static SUBTRACT(left: Vector4i, right: Vector4i): Vector4i
        static MULTIPLY(left: float64, right: Vector4i): Vector4i
        static MULTIPLY(left: Vector4i, right: Vector4i): Vector4i
        static MULTIPLY(left: Vector4i, right: float64): Vector4i
        static DIVIDE(left: Vector4i, right: Vector4i): Vector4i
        static DIVIDE(left: Vector4i, right: float64): Vector4i
        static NEGATE(left: Vector4i): Vector4i
        static EQUAL(left: Vector4i, right: Vector4i): boolean
        static NOT_EQUAL(left: Vector4i, right: Vector4i): boolean
        static LESS(left: Vector4i, right: Vector4i): boolean
        static LESS_EQUAL(left: Vector4i, right: Vector4i): boolean
        static GREATER(left: Vector4i, right: Vector4i): boolean
        static GREATER_EQUAL(left: Vector4i, right: Vector4i): boolean
        get x(): int64
        set x(value: int64)
        get y(): int64
        set y(value: int64)
        get z(): int64
        set z(value: int64)
        get w(): int64
        set w(value: int64)
    }
    /** A plane in Hessian normal form.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_plane.html  
     */
    class Plane {
        /** A plane that extends in the Y and Z axes (normal vector points +X). */
        static readonly PLANE_YZ: Readonly<Plane>
        
        /** A plane that extends in the X and Z axes (normal vector points +Y). */
        static readonly PLANE_XZ: Readonly<Plane>
        
        /** A plane that extends in the X and Y axes (normal vector points +Z). */
        static readonly PLANE_XY: Readonly<Plane>
        constructor()
        constructor(from: Plane)
        constructor(normal: Vector3)
        constructor(normal: Vector3, d: float64)
        constructor(normal: Vector3, point: Vector3)
        constructor(point1: Vector3, point2: Vector3, point3: Vector3)
        constructor(a: float64, b: float64, c: float64, d: float64)
        
        /** Returns a copy of the plane, with normalized [member normal] (so it's a unit vector). Returns `Plane(0, 0, 0, 0)` if [member normal] can't be normalized (it has zero length). */
        normalized(): Plane
        
        /** Returns the center of the plane. */
        get_center(): Vector3
        
        /** Returns `true` if this plane and [param to_plane] are approximately equal, by running [method @GlobalScope.is_equal_approx] on each component. */
        is_equal_approx(to_plane: Plane): boolean
        
        /** Returns `true` if this plane is finite, by calling [method @GlobalScope.is_finite] on each component. */
        is_finite(): boolean
        
        /** Returns `true` if [param point] is located above the plane. */
        is_point_over(point: Vector3): boolean
        
        /** Returns the shortest distance from the plane to the position [param point]. If the point is above the plane, the distance will be positive. If below, the distance will be negative. */
        distance_to(point: Vector3): float64
        
        /** Returns `true` if [param point] is inside the plane. Comparison uses a custom minimum [param tolerance] threshold. */
        has_point(point: Vector3, tolerance?: float64 /* = 0.00001 */): boolean
        
        /** Returns the orthogonal projection of [param point] into a point in the plane. */
        project(point: Vector3): Vector3
        
        /** Returns the intersection point of the three planes [param b], [param c] and this plane. If no intersection is found, `null` is returned. */
        intersect_3(b: Plane, c: Plane): any
        
        /** Returns the intersection point of a ray consisting of the position [param from] and the direction normal [param dir] with this plane. If no intersection is found, `null` is returned. */
        intersects_ray(from: Vector3, dir: Vector3): any
        
        /** Returns the intersection point of a segment from position [param from] to position [param to] with this plane. If no intersection is found, `null` is returned. */
        intersects_segment(from: Vector3, to: Vector3): any
        static NEGATE(left: Plane): Plane
        static EQUAL(left: Plane, right: Plane): boolean
        static NOT_EQUAL(left: Plane, right: Plane): boolean
        get x(): float64
        set x(value: float64)
        get y(): float64
        set y(value: float64)
        get z(): float64
        set z(value: float64)
        get d(): float64
        set d(value: float64)
        get normal(): Vector3
        set normal(value: Vector3)
    }
    /** A unit quaternion used for representing 3D rotations.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_quaternion.html  
     */
    class Quaternion {
        /** The identity quaternion, representing no rotation. This has the same rotation as [constant Basis.IDENTITY].  
         *  If a [Vector3] is rotated (multiplied) by this quaternion, it does not change.  
         *      
         *  **Note:** In GDScript, this constant is equivalent to creating a [constructor Quaternion] without any arguments. It can be used to make your code clearer, and for consistency with C#.  
         */
        static readonly IDENTITY: Readonly<Quaternion>
        constructor()
        constructor(from: Quaternion)
        constructor(from: Basis)
        constructor(axis: Vector3, angle: float64)
        constructor(arc_from: Vector3, arc_to: Vector3)
        constructor(x: float64, y: float64, z: float64, w: float64)
        
        /** Returns this quaternion's length, also called magnitude. */
        length(): float64
        
        /** Returns this quaternion's length, squared.  
         *      
         *  **Note:** This method is faster than [method length], so prefer it if you only need to compare quaternion lengths.  
         */
        length_squared(): float64
        
        /** Returns a copy of this quaternion, normalized so that its length is `1.0`. See also [method is_normalized]. */
        normalized(): Quaternion
        
        /** Returns `true` if this quaternion is normalized. See also [method normalized]. */
        is_normalized(): boolean
        
        /** Returns `true` if this quaternion and [param to] are approximately equal, by calling [method @GlobalScope.is_equal_approx] on each component. */
        is_equal_approx(to: Quaternion): boolean
        
        /** Returns `true` if this quaternion is finite, by calling [method @GlobalScope.is_finite] on each component. */
        is_finite(): boolean
        
        /** Returns the inverse version of this quaternion, inverting the sign of every component except [member w]. */
        inverse(): Quaternion
        
        /** Returns the logarithm of this quaternion. Multiplies this quaternion's rotation axis by its rotation angle, and stores the result in the returned quaternion's vector part ([member x], [member y], and [member z]). The returned quaternion's real part ([member w]) is always `0.0`. */
        log(): Quaternion
        
        /** Returns the exponential of this quaternion. The rotation axis of the result is the normalized rotation axis of this quaternion, the angle of the result is the length of the vector part of this quaternion. */
        exp(): Quaternion
        
        /** Returns the angle between this quaternion and [param to]. This is the magnitude of the angle you would need to rotate by to get from one to the other.  
         *      
         *  **Note:** The magnitude of the floating-point error for this method is abnormally high, so methods such as `is_zero_approx` will not work reliably.  
         */
        angle_to(to: Quaternion): float64
        
        /** Returns the dot product between this quaternion and [param with].  
         *  This is equivalent to `(quat.x * with.x) + (quat.y * with.y) + (quat.z * with.z) + (quat.w * with.w)`.  
         */
        dot(with_: Quaternion): float64
        
        /** Performs a spherical-linear interpolation with the [param to] quaternion, given a [param weight] and returns the result. Both this quaternion and [param to] must be normalized. */
        slerp(to: Quaternion, weight: float64): Quaternion
        
        /** Performs a spherical-linear interpolation with the [param to] quaternion, given a [param weight] and returns the result. Unlike [method slerp], this method does not check if the rotation path is smaller than 90 degrees. Both this quaternion and [param to] must be normalized. */
        slerpni(to: Quaternion, weight: float64): Quaternion
        
        /** Performs a spherical cubic interpolation between quaternions [param pre_a], this vector, [param b], and [param post_b], by the given amount [param weight]. */
        spherical_cubic_interpolate(b: Quaternion, pre_a: Quaternion, post_b: Quaternion, weight: float64): Quaternion
        
        /** Performs a spherical cubic interpolation between quaternions [param pre_a], this vector, [param b], and [param post_b], by the given amount [param weight].  
         *  It can perform smoother interpolation than [method spherical_cubic_interpolate] by the time values.  
         */
        spherical_cubic_interpolate_in_time(b: Quaternion, pre_a: Quaternion, post_b: Quaternion, weight: float64, b_t: float64, pre_a_t: float64, post_b_t: float64): Quaternion
        
        /** Returns this quaternion's rotation as a [Vector3] of [url=https://en.wikipedia.org/wiki/Euler_angles]Euler angles[/url], in radians.  
         *  The order of each consecutive rotation can be changed with [param order] (see [enum EulerOrder] constants). By default, the YXZ convention is used ([constant EULER_ORDER_YXZ]): Z (roll) is calculated first, then X (pitch), and lastly Y (yaw). When using the opposite method [method from_euler], this order is reversed.  
         */
        get_euler(order?: int64 /* = 2 */): Vector3
        
        /** Constructs a new [Quaternion] from the given [Vector3] of [url=https://en.wikipedia.org/wiki/Euler_angles]Euler angles[/url], in radians. This method always uses the YXZ convention ([constant EULER_ORDER_YXZ]). */
        static from_euler(euler: Vector3): Quaternion
        
        /** Returns the rotation axis of the rotation represented by this quaternion. */
        get_axis(): Vector3
        
        /** Returns the angle of the rotation represented by this quaternion.  
         *      
         *  **Note:** The quaternion must be normalized.  
         */
        get_angle(): float64
        static ADD(left: Quaternion, right: Quaternion): Quaternion
        static SUBTRACT(left: Quaternion, right: Quaternion): Quaternion
        static MULTIPLY(left: Quaternion, right: Quaternion): Quaternion
        static MULTIPLY(left: Quaternion, right: float64): Quaternion
        static MULTIPLY(left: float64, right: Quaternion): Quaternion
        static MULTIPLY(left: Vector3, right: Quaternion): Vector3
        static MULTIPLY(left: Quaternion, right: Vector3): Vector3
        static DIVIDE(left: Quaternion, right: float64): Quaternion
        static NEGATE(left: Quaternion): Quaternion
        static EQUAL(left: Quaternion, right: Quaternion): boolean
        static NOT_EQUAL(left: Quaternion, right: Quaternion): boolean
        get x(): float64
        set x(value: float64)
        get y(): float64
        set y(value: float64)
        get z(): float64
        set z(value: float64)
        get w(): float64
        set w(value: float64)
    }
    /** A 3D axis-aligned bounding box.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_aabb.html  
     */
    class AABB {
        constructor()
        constructor(from: AABB)
        constructor(position: Vector3, size: Vector3)
        
        /** Returns an [AABB] equivalent to this bounding box, with its width, height, and depth modified to be non-negative values.  
         *    
         *      
         *  **Note:** It's recommended to use this method when [member size] is negative, as most other methods in Godot assume that the [member size]'s components are greater than `0`.  
         */
        abs(): AABB
        
        /** Returns the center point of the bounding box. This is the same as `position + (size / 2.0)`. */
        get_center(): Vector3
        
        /** Returns the bounding box's volume. This is equivalent to `size.x * size.y * size.z`. See also [method has_volume]. */
        get_volume(): float64
        
        /** Returns `true` if this bounding box's width, height, and depth are all positive. See also [method get_volume]. */
        has_volume(): boolean
        
        /** Returns `true` if this bounding box has a surface or a length, that is, at least one component of [member size] is greater than `0`. Otherwise, returns `false`. */
        has_surface(): boolean
        
        /** Returns `true` if the bounding box contains the given [param point]. By convention, points exactly on the right, top, and front sides are **not** included.  
         *      
         *  **Note:** This method is not reliable for [AABB] with a  *negative*  [member size]. Use [method abs] first to get a valid bounding box.  
         */
        has_point(point: Vector3): boolean
        
        /** Returns `true` if this bounding box and [param aabb] are approximately equal, by calling [method Vector3.is_equal_approx] on the [member position] and the [member size]. */
        is_equal_approx(aabb: AABB): boolean
        
        /** Returns `true` if this bounding box's values are finite, by calling [method Vector3.is_finite] on the [member position] and the [member size]. */
        is_finite(): boolean
        
        /** Returns `true` if this bounding box overlaps with the box [param with]. The edges of both boxes are  *always*  excluded. */
        intersects(with_: AABB): boolean
        
        /** Returns `true` if this bounding box  *completely*  encloses the [param with] box. The edges of both boxes are included.  
         *    
         */
        encloses(with_: AABB): boolean
        
        /** Returns `true` if this bounding box is on both sides of the given [param plane]. */
        intersects_plane(plane: Plane): boolean
        
        /** Returns the intersection between this bounding box and [param with]. If the boxes do not intersect, returns an empty [AABB]. If the boxes intersect at the edge, returns a flat [AABB] with no volume (see [method has_surface] and [method has_volume]).  
         *    
         *      
         *  **Note:** If you only need to know whether two bounding boxes are intersecting, use [method intersects], instead.  
         */
        intersection(with_: AABB): AABB
        
        /** Returns an [AABB] that encloses both this bounding box and [param with] around the edges. See also [method encloses]. */
        merge(with_: AABB): AABB
        
        /** Returns a copy of this bounding box expanded to align the edges with the given [param to_point], if necessary.  
         *    
         */
        expand(to_point: Vector3): AABB
        
        /** Returns a copy of this bounding box extended on all sides by the given amount [param by]. A negative amount shrinks the box instead.  
         *    
         */
        grow(by: float64): AABB
        
        /** Returns the vertex's position of this bounding box that's the farthest in the given direction. This point is commonly known as the support point in collision detection algorithms. */
        get_support(direction: Vector3): Vector3
        
        /** Returns the longest normalized axis of this bounding box's [member size], as a [Vector3] ([constant Vector3.RIGHT], [constant Vector3.UP], or [constant Vector3.BACK]).  
         *    
         *  See also [method get_longest_axis_index] and [method get_longest_axis_size].  
         */
        get_longest_axis(): Vector3
        
        /** Returns the index to the longest axis of this bounding box's [member size] (see [constant Vector3.AXIS_X], [constant Vector3.AXIS_Y], and [constant Vector3.AXIS_Z]).  
         *  For an example, see [method get_longest_axis].  
         */
        get_longest_axis_index(): int64
        
        /** Returns the longest dimension of this bounding box's [member size].  
         *  For an example, see [method get_longest_axis].  
         */
        get_longest_axis_size(): float64
        
        /** Returns the shortest normalized axis of this bounding box's [member size], as a [Vector3] ([constant Vector3.RIGHT], [constant Vector3.UP], or [constant Vector3.BACK]).  
         *    
         *  See also [method get_shortest_axis_index] and [method get_shortest_axis_size].  
         */
        get_shortest_axis(): Vector3
        
        /** Returns the index to the shortest axis of this bounding box's [member size] (see [constant Vector3.AXIS_X], [constant Vector3.AXIS_Y], and [constant Vector3.AXIS_Z]).  
         *  For an example, see [method get_shortest_axis].  
         */
        get_shortest_axis_index(): int64
        
        /** Returns the shortest dimension of this bounding box's [member size].  
         *  For an example, see [method get_shortest_axis].  
         */
        get_shortest_axis_size(): float64
        
        /** Returns the position of one of the 8 vertices that compose this bounding box. With an [param idx] of `0` this is the same as [member position], and an [param idx] of `7` is the same as [member end]. */
        get_endpoint(idx: int64): Vector3
        
        /** Returns the first point where this bounding box and the given segment intersect, as a [Vector3]. If no intersection occurs, returns `null`.  
         *  The segment begins at [param from] and ends at [param to].  
         */
        intersects_segment(from: Vector3, to: Vector3): any
        
        /** Returns the first point where this bounding box and the given ray intersect, as a [Vector3]. If no intersection occurs, returns `null`.  
         *  The ray begin at [param from], faces [param dir] and extends towards infinity.  
         */
        intersects_ray(from: Vector3, dir: Vector3): any
        static EQUAL(left: AABB, right: AABB): boolean
        static NOT_EQUAL(left: AABB, right: AABB): boolean
        get position(): Vector3
        set position(value: Vector3)
        get size(): Vector3
        set size(value: Vector3)
        get end(): Vector3
        set end(value: Vector3)
    }
    /** A 3×3 matrix for representing 3D rotation and scale.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_basis.html  
     */
    class Basis {
        /** The identity [Basis]. This is an orthonormal basis with no rotation, no shear, and a scale of [constant Vector3.ONE]. This also means that:  
         *  - The [member x] points right ([constant Vector3.RIGHT]);  
         *  - The [member y] points up ([constant Vector3.UP]);  
         *  - The [member z] points back ([constant Vector3.BACK]).  
         *    
         *  If a [Vector3] or another [Basis] is transformed (multiplied) by this constant, no transformation occurs.  
         *      
         *  **Note:** In GDScript, this constant is equivalent to creating a [constructor Basis] without any arguments. It can be used to make your code clearer, and for consistency with C#.  
         */
        static readonly IDENTITY: Readonly<Basis>
        
        /** When any basis is multiplied by [constant FLIP_X], it negates all components of the [member x] axis (the X column).  
         *  When [constant FLIP_X] is multiplied by any basis, it negates the [member Vector3.x] component of all axes (the X row).  
         */
        static readonly FLIP_X: Readonly<Basis>
        
        /** When any basis is multiplied by [constant FLIP_Y], it negates all components of the [member y] axis (the Y column).  
         *  When [constant FLIP_Y] is multiplied by any basis, it negates the [member Vector3.y] component of all axes (the Y row).  
         */
        static readonly FLIP_Y: Readonly<Basis>
        
        /** When any basis is multiplied by [constant FLIP_Z], it negates all components of the [member z] axis (the Z column).  
         *  When [constant FLIP_Z] is multiplied by any basis, it negates the [member Vector3.z] component of all axes (the Z row).  
         */
        static readonly FLIP_Z: Readonly<Basis>
        constructor()
        constructor(from: Basis)
        constructor(from: Quaternion)
        constructor(axis: Vector3, angle: float64)
        constructor(x_axis: Vector3, y_axis: Vector3, z_axis: Vector3)
        
        /** Returns the [url=https://en.wikipedia.org/wiki/Invertible_matrix]inverse of this basis's matrix[/url]. */
        inverse(): Basis
        
        /** Returns the transposed version of this basis. This turns the basis matrix's columns into rows, and its rows into columns.  
         *    
         */
        transposed(): Basis
        
        /** Returns the orthonormalized version of this basis. An orthonormal basis is both  *orthogonal*  (the axes are perpendicular to each other) and  *normalized*  (the axes have a length of `1.0`), which also means it can only represent a rotation.  
         *  It is often useful to call this method to avoid rounding errors on a rotating basis:  
         *    
         */
        orthonormalized(): Basis
        
        /** Returns the [url=https://en.wikipedia.org/wiki/Determinant]determinant[/url] of this basis's matrix. For advanced math, this number can be used to determine a few attributes:  
         *  - If the determinant is exactly `0.0`, the basis is not invertible (see [method inverse]).  
         *  - If the determinant is a negative number, the basis represents a negative scale.  
         *      
         *  **Note:** If the basis's scale is the same for every axis, its determinant is always that scale by the power of 3.  
         */
        determinant(): float64
        
        /** Returns a copy of this basis rotated around the given [param axis] by the given [param angle] (in radians).  
         *  The [param axis] must be a normalized vector (see [method Vector3.normalized]). If [param angle] is positive, the basis is rotated counter-clockwise around the axis.  
         *    
         */
        rotated(axis: Vector3, angle: float64): Basis
        
        /** Returns this basis with each axis's components scaled by the given [param scale]'s components.  
         *  The basis matrix's rows are multiplied by [param scale]'s components. This operation is a global scale (relative to the parent).  
         *    
         */
        scaled(scale: Vector3): Basis
        
        /** Returns this basis with each axis scaled by the corresponding component in the given [param scale].  
         *  The basis matrix's columns are multiplied by [param scale]'s components. This operation is a local scale (relative to self).  
         *    
         */
        scaled_local(scale: Vector3): Basis
        
        /** Returns the length of each axis of this basis, as a [Vector3]. If the basis is not sheared, this value is the scaling factor. It is not affected by rotation.  
         *    
         *      
         *  **Note:** If the value returned by [method determinant] is negative, the scale is also negative.  
         */
        get_scale(): Vector3
        
        /** Returns this basis's rotation as a [Vector3] of [url=https://en.wikipedia.org/wiki/Euler_angles]Euler angles[/url], in radians. For the returned value:  
         *  - The [member Vector3.x] contains the angle around the [member x] axis (pitch);  
         *  - The [member Vector3.y] contains the angle around the [member y] axis (yaw);  
         *  - The [member Vector3.z] contains the angle around the [member z] axis (roll).  
         *  The order of each consecutive rotation can be changed with [param order] (see [enum EulerOrder] constants). By default, the YXZ convention is used ([constant EULER_ORDER_YXZ]): Z (roll) is calculated first, then X (pitch), and lastly Y (yaw). When using the opposite method [method from_euler], this order is reversed.  
         *      
         *  **Note:** For this method to return correctly, the basis needs to be  *orthonormal*  (see [method orthonormalized]).  
         *      
         *  **Note:** Euler angles are much more intuitive but are not suitable for 3D math. Because of this, consider using the [method get_rotation_quaternion] method instead, which returns a [Quaternion].  
         *      
         *  **Note:** In the Inspector dock, a basis's rotation is often displayed in Euler angles (in degrees), as is the case with the [member Node3D.rotation] property.  
         */
        get_euler(order?: int64 /* = 2 */): Vector3
        
        /** Returns the transposed dot product between [param with] and the [member x] axis (see [method transposed]).  
         *  This is equivalent to `basis.x.dot(vector)`.  
         */
        tdotx(with_: Vector3): float64
        
        /** Returns the transposed dot product between [param with] and the [member y] axis (see [method transposed]).  
         *  This is equivalent to `basis.y.dot(vector)`.  
         */
        tdoty(with_: Vector3): float64
        
        /** Returns the transposed dot product between [param with] and the [member z] axis (see [method transposed]).  
         *  This is equivalent to `basis.z.dot(vector)`.  
         */
        tdotz(with_: Vector3): float64
        
        /** Performs a spherical-linear interpolation with the [param to] basis, given a [param weight]. Both this basis and [param to] should represent a rotation.  
         *  **Example:** Smoothly rotate a [Node3D] to the target basis over time, with a [Tween]:  
         *    
         */
        slerp(to: Basis, weight: float64): Basis
        
        /** Returns `true` if this basis is conformal. A conformal basis is both  *orthogonal*  (the axes are perpendicular to each other) and  *uniform*  (the axes share the same length). This method can be especially useful during physics calculations. */
        is_conformal(): boolean
        
        /** Returns `true` if this basis and [param b] are approximately equal, by calling [method @GlobalScope.is_equal_approx] on all vector components. */
        is_equal_approx(b: Basis): boolean
        
        /** Returns `true` if this basis is finite, by calling [method @GlobalScope.is_finite] on all vector components. */
        is_finite(): boolean
        
        /** Returns this basis's rotation as a [Quaternion].  
         *      
         *  **Note:** Quaternions are much more suitable for 3D math but are less intuitive. For user interfaces, consider using the [method get_euler] method, which returns Euler angles.  
         */
        get_rotation_quaternion(): Quaternion
        
        /** Creates a new [Basis] with a rotation such that the forward axis (-Z) points towards the [param target] position.  
         *  By default, the -Z axis (camera forward) is treated as forward (implies +X is right). If [param use_model_front] is `true`, the +Z axis (asset front) is treated as forward (implies +X is left) and points toward the [param target] position.  
         *  The up axis (+Y) points as close to the [param up] vector as possible while staying perpendicular to the forward axis. The returned basis is orthonormalized (see [method orthonormalized]).  
         *  The [param target] and the [param up] cannot be [constant Vector3.ZERO], and shouldn't be colinear to avoid unintended rotation around local Z axis.  
         */
        static looking_at(target: Vector3, up?: Vector3 /* = Vector3.ZERO */, use_model_front?: boolean /* = false */): Basis
        
        /** Constructs a new [Basis] that only represents scale, with no rotation or shear, from the given [param scale] vector.  
         *    
         *      
         *  **Note:** In linear algebra, the matrix of this basis is also known as a [url=https://en.wikipedia.org/wiki/Diagonal_matrix]diagonal matrix[/url].  
         */
        static from_scale(scale: Vector3): Basis
        
        /** Constructs a new [Basis] that only represents rotation from the given [Vector3] of [url=https://en.wikipedia.org/wiki/Euler_angles]Euler angles[/url], in radians.  
         *  - The [member Vector3.x] should contain the angle around the [member x] axis (pitch);  
         *  - The [member Vector3.y] should contain the angle around the [member y] axis (yaw);  
         *  - The [member Vector3.z] should contain the angle around the [member z] axis (roll).  
         *    
         *  The order of each consecutive rotation can be changed with [param order] (see [enum EulerOrder] constants). By default, the YXZ convention is used ([constant EULER_ORDER_YXZ]): the basis rotates first around the Y axis (yaw), then X (pitch), and lastly Z (roll). When using the opposite method [method get_euler], this order is reversed.  
         */
        static from_euler(euler: Vector3, order?: int64 /* = 2 */): Basis
        static MULTIPLY(left: Basis, right: Basis): Basis
        static MULTIPLY(left: Basis, right: float64): Basis
        static MULTIPLY(left: Basis, right: Vector3): Vector3
        static MULTIPLY(left: Vector3, right: Basis): Vector3
        static EQUAL(left: Basis, right: Basis): boolean
        static NOT_EQUAL(left: Basis, right: Basis): boolean
        get x(): Vector3
        set x(value: Vector3)
        get y(): Vector3
        set y(value: Vector3)
        get z(): Vector3
        set z(value: Vector3)
    }
    /** A 3×4 matrix representing a 3D transformation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_transform3d.html  
     */
    class Transform3D {
        /** The identity [Transform3D]. This is a transform with no translation, no rotation, and a scale of [constant Vector3.ONE]. Its [member basis] is equal to [constant Basis.IDENTITY]. This also means that:  
         *  - Its [member Basis.x] points right ([constant Vector3.RIGHT]);  
         *  - Its [member Basis.y] points up ([constant Vector3.UP]);  
         *  - Its [member Basis.z] points back ([constant Vector3.BACK]).  
         *    
         *  If a [Vector3], an [AABB], a [Plane], a [PackedVector3Array], or another [Transform3D] is transformed (multiplied) by this constant, no transformation occurs.  
         *      
         *  **Note:** In GDScript, this constant is equivalent to creating a [constructor Transform3D] without any arguments. It can be used to make your code clearer, and for consistency with C#.  
         */
        static readonly IDENTITY: Readonly<Transform3D>
        
        /** [Transform3D] with mirroring applied perpendicular to the YZ plane. Its [member basis] is equal to [constant Basis.FLIP_X]. */
        static readonly FLIP_X: Readonly<Transform3D>
        
        /** [Transform3D] with mirroring applied perpendicular to the XZ plane. Its [member basis] is equal to [constant Basis.FLIP_Y]. */
        static readonly FLIP_Y: Readonly<Transform3D>
        
        /** [Transform3D] with mirroring applied perpendicular to the XY plane. Its [member basis] is equal to [constant Basis.FLIP_Z]. */
        static readonly FLIP_Z: Readonly<Transform3D>
        constructor()
        constructor(from: Transform3D)
        constructor(basis: Basis, origin: Vector3)
        constructor(x_axis: Vector3, y_axis: Vector3, z_axis: Vector3, origin: Vector3)
        constructor(from: Projection)
        
        /** Returns the [url=https://en.wikipedia.org/wiki/Invertible_matrix]inverted version of this transform[/url]. See also [method Basis.inverse].  
         *      
         *  **Note:** For this method to return correctly, the transform's [member basis] needs to be  *orthonormal*  (see [method orthonormalized]). That means the basis should only represent a rotation. If it does not, use [method affine_inverse] instead.  
         */
        inverse(): Transform3D
        
        /** Returns the inverted version of this transform. Unlike [method inverse], this method works with almost any [member basis], including non-uniform ones, but is slower. See also [method Basis.inverse].  
         *      
         *  **Note:** For this method to return correctly, the transform's [member basis] needs to have a determinant that is not exactly `0.0` (see [method Basis.determinant]).  
         */
        affine_inverse(): Transform3D
        
        /** Returns a copy of this transform with its [member basis] orthonormalized. An orthonormal basis is both  *orthogonal*  (the axes are perpendicular to each other) and  *normalized*  (the axes have a length of `1.0`), which also means it can only represent a rotation. See also [method Basis.orthonormalized]. */
        orthonormalized(): Transform3D
        
        /** Returns a copy of this transform rotated around the given [param axis] by the given [param angle] (in radians).  
         *  The [param axis] must be a normalized vector (see [method Vector3.normalized]). If [param angle] is positive, the basis is rotated counter-clockwise around the axis.  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding rotation transform `R` from the left, i.e., `R * X`.  
         *  This can be seen as transforming with respect to the global/parent frame.  
         */
        rotated(axis: Vector3, angle: float64): Transform3D
        
        /** Returns a copy of this transform rotated around the given [param axis] by the given [param angle] (in radians).  
         *  The [param axis] must be a normalized vector in the transform's local coordinate system. For example, to rotate around the local X-axis, use [constant Vector3.RIGHT].  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding rotation transform `R` from the right, i.e., `X * R`.  
         *  This can be seen as transforming with respect to the local frame.  
         */
        rotated_local(axis: Vector3, angle: float64): Transform3D
        
        /** Returns a copy of this transform scaled by the given [param scale] factor.  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding scaling transform `S` from the left, i.e., `S * X`.  
         *  This can be seen as transforming with respect to the global/parent frame.  
         */
        scaled(scale: Vector3): Transform3D
        
        /** Returns a copy of this transform scaled by the given [param scale] factor.  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding scaling transform `S` from the right, i.e., `X * S`.  
         *  This can be seen as transforming with respect to the local frame.  
         */
        scaled_local(scale: Vector3): Transform3D
        
        /** Returns a copy of this transform translated by the given [param offset].  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding translation transform `T` from the left, i.e., `T * X`.  
         *  This can be seen as transforming with respect to the global/parent frame.  
         */
        translated(offset: Vector3): Transform3D
        
        /** Returns a copy of this transform translated by the given [param offset].  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding translation transform `T` from the right, i.e., `X * T`.  
         *  This can be seen as transforming with respect to the local frame.  
         */
        translated_local(offset: Vector3): Transform3D
        
        /** Returns a copy of this transform rotated so that the forward axis (-Z) points towards the [param target] position.  
         *  The up axis (+Y) points as close to the [param up] vector as possible while staying perpendicular to the forward axis. The resulting transform is orthonormalized. The existing rotation, scale, and skew information from the original transform is discarded. The [param target] and [param up] vectors cannot be zero, cannot be parallel to each other, and are defined in global/parent space.  
         *  If [param use_model_front] is `true`, the +Z axis (asset front) is treated as forward (implies +X is left) and points toward the [param target] position. By default, the -Z axis (camera forward) is treated as forward (implies +X is right).  
         */
        looking_at(target: Vector3, up?: Vector3 /* = Vector3.ZERO */, use_model_front?: boolean /* = false */): Transform3D
        
        /** Returns the result of the linear interpolation between this transform and [param xform] by the given [param weight].  
         *  The [param weight] should be between `0.0` and `1.0` (inclusive). Values outside this range are allowed and can be used to perform  *extrapolation*  instead.  
         */
        interpolate_with(xform: Transform3D, weight: float64): Transform3D
        
        /** Returns `true` if this transform and [param xform] are approximately equal, by running [method @GlobalScope.is_equal_approx] on each component. */
        is_equal_approx(xform: Transform3D): boolean
        
        /** Returns `true` if this transform is finite, by calling [method @GlobalScope.is_finite] on each component. */
        is_finite(): boolean
        static MULTIPLY(left: Transform3D, right: Transform3D): Transform3D
        static MULTIPLY(left: Transform3D, right: float64): Transform3D
        static MULTIPLY(left: Transform3D, right: Vector3): Vector3
        static MULTIPLY(left: Vector3, right: Transform3D): Vector3
        static MULTIPLY(left: Transform3D, right: AABB): AABB
        static MULTIPLY(left: AABB, right: Transform3D): AABB
        static MULTIPLY(left: Transform3D, right: Plane): Plane
        static MULTIPLY(left: Plane, right: Transform3D): Plane
        static MULTIPLY(left: Transform3D, right: PackedVector3Array | Vector3[]): PackedVector3Array
        static MULTIPLY(left: PackedVector3Array | Vector3[], right: Transform3D): PackedVector3Array
        static EQUAL(left: Transform3D, right: Transform3D): boolean
        static NOT_EQUAL(left: Transform3D, right: Transform3D): boolean
        get basis(): Basis
        set basis(value: Basis)
        get origin(): Vector3
        set origin(value: Vector3)
    }
    namespace Projection {
        enum Planes {
            /** The index value of the projection's near clipping plane. */
            PLANE_NEAR = 0,
            
            /** The index value of the projection's far clipping plane. */
            PLANE_FAR = 1,
            
            /** The index value of the projection's left clipping plane. */
            PLANE_LEFT = 2,
            
            /** The index value of the projection's top clipping plane. */
            PLANE_TOP = 3,
            
            /** The index value of the projection's right clipping plane. */
            PLANE_RIGHT = 4,
            
            /** The index value of the projection bottom clipping plane. */
            PLANE_BOTTOM = 5,
        }
    }
    /** A 4×4 matrix for 3D projective transformations.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_projection.html  
     */
    class Projection {
        /** A [Projection] with no transformation defined. When applied to other data structures, no transformation is performed. */
        static readonly IDENTITY: Readonly<Projection>
        
        /** A [Projection] with all values initialized to 0. When applied to other data structures, they will be zeroed. */
        static readonly ZERO: Readonly<Projection>
        constructor()
        constructor(from: Projection)
        constructor(from: Transform3D)
        constructor(x_axis: Vector4, y_axis: Vector4, z_axis: Vector4, w_axis: Vector4)
        
        /** Creates a new [Projection] that projects positions from a depth range of `-1` to `1` to one that ranges from `0` to `1`, and flips the projected positions vertically, according to [param flip_y]. */
        static create_depth_correction(flip_y: boolean): Projection
        
        /** Creates a new [Projection] that projects positions into the given [Rect2]. */
        static create_light_atlas_rect(rect: Rect2): Projection
        
        /** Creates a new [Projection] that projects positions using a perspective projection with the given Y-axis field of view (in degrees), X:Y aspect ratio, and clipping planes.  
         *  [param flip_fov] determines whether the projection's field of view is flipped over its diagonal.  
         */
        static create_perspective(fovy: float64, aspect: float64, z_near: float64, z_far: float64, flip_fov?: boolean /* = false */): Projection
        
        /** Creates a new [Projection] that projects positions using a perspective projection with the given Y-axis field of view (in degrees), X:Y aspect ratio, and clipping distances. The projection is adjusted for a head-mounted display with the given distance between eyes and distance to a point that can be focused on.  
         *  [param eye] creates the projection for the left eye when set to 1, or the right eye when set to 2.  
         *  [param flip_fov] determines whether the projection's field of view is flipped over its diagonal.  
         */
        static create_perspective_hmd(fovy: float64, aspect: float64, z_near: float64, z_far: float64, flip_fov: boolean, eye: int64, intraocular_dist: float64, convergence_dist: float64): Projection
        
        /** Creates a new [Projection] for projecting positions onto a head-mounted display with the given X:Y aspect ratio, distance between eyes, display width, distance to lens, oversampling factor, and depth clipping planes.  
         *  [param eye] creates the projection for the left eye when set to 1, or the right eye when set to 2.  
         */
        static create_for_hmd(eye: int64, aspect: float64, intraocular_dist: float64, display_width: float64, display_to_lens: float64, oversample: float64, z_near: float64, z_far: float64): Projection
        
        /** Creates a new [Projection] that projects positions using an orthogonal projection with the given clipping planes. */
        static create_orthogonal(left: float64, right: float64, bottom: float64, top: float64, z_near: float64, z_far: float64): Projection
        
        /** Creates a new [Projection] that projects positions using an orthogonal projection with the given size, X:Y aspect ratio, and clipping planes.  
         *  [param flip_fov] determines whether the projection's field of view is flipped over its diagonal.  
         */
        static create_orthogonal_aspect(size: float64, aspect: float64, z_near: float64, z_far: float64, flip_fov?: boolean /* = false */): Projection
        
        /** Creates a new [Projection] that projects positions in a frustum with the given clipping planes. */
        static create_frustum(left: float64, right: float64, bottom: float64, top: float64, z_near: float64, z_far: float64): Projection
        
        /** Creates a new [Projection] that projects positions in a frustum with the given size, X:Y aspect ratio, offset, and clipping planes.  
         *  [param flip_fov] determines whether the projection's field of view is flipped over its diagonal.  
         */
        static create_frustum_aspect(size: float64, aspect: float64, offset: Vector2, z_near: float64, z_far: float64, flip_fov?: boolean /* = false */): Projection
        
        /** Creates a new [Projection] that scales a given projection to fit around a given [AABB] in projection space. */
        static create_fit_aabb(aabb: AABB): Projection
        
        /** Returns a scalar value that is the signed factor by which areas are scaled by this matrix. If the sign is negative, the matrix flips the orientation of the area.  
         *  The determinant can be used to calculate the invertibility of a matrix or solve linear systems of equations involving the matrix, among other applications.  
         */
        determinant(): float64
        
        /** Returns a [Projection] with the near clipping distance adjusted to be [param new_znear].  
         *      
         *  **Note:** The original [Projection] must be a perspective projection.  
         */
        perspective_znear_adjusted(new_znear: float64): Projection
        
        /** Returns the clipping plane of this [Projection] whose index is given by [param plane].  
         *  [param plane] should be equal to one of [constant PLANE_NEAR], [constant PLANE_FAR], [constant PLANE_LEFT], [constant PLANE_TOP], [constant PLANE_RIGHT], or [constant PLANE_BOTTOM].  
         */
        get_projection_plane(plane: int64): Plane
        
        /** Returns a copy of this [Projection] with the signs of the values of the Y column flipped. */
        flipped_y(): Projection
        
        /** Returns a [Projection] with the X and Y values from the given [Vector2] added to the first and second values of the final column respectively. */
        jitter_offseted(offset: Vector2): Projection
        
        /** Returns the vertical field of view of the projection (in degrees) associated with the given horizontal field of view (in degrees) and aspect ratio.  
         *      
         *  **Note:** Unlike most methods of [Projection], [param aspect] is expected to be 1 divided by the X:Y aspect ratio.  
         */
        static get_fovy(fovx: float64, aspect: float64): float64
        
        /** Returns the distance for this [Projection] beyond which positions are clipped. */
        get_z_far(): float64
        
        /** Returns the distance for this [Projection] before which positions are clipped. */
        get_z_near(): float64
        
        /** Returns the X:Y aspect ratio of this [Projection]'s viewport. */
        get_aspect(): float64
        
        /** Returns the horizontal field of view of the projection (in degrees). */
        get_fov(): float64
        
        /** Returns `true` if this [Projection] performs an orthogonal projection. */
        is_orthogonal(): boolean
        
        /** Returns the dimensions of the viewport plane that this [Projection] projects positions onto, divided by two. */
        get_viewport_half_extents(): Vector2
        
        /** Returns the dimensions of the far clipping plane of the projection, divided by two. */
        get_far_plane_half_extents(): Vector2
        
        /** Returns a [Projection] that performs the inverse of this [Projection]'s projective transformation. */
        inverse(): Projection
        
        /** Returns [param for_pixel_width] divided by the viewport's width measured in meters on the near plane, after this [Projection] is applied. */
        get_pixels_per_meter(for_pixel_width: int64): int64
        
        /** Returns the factor by which the visible level of detail is scaled by this [Projection]. */
        get_lod_multiplier(): float64
        static MULTIPLY(left: Projection, right: Projection): Projection
        static MULTIPLY(left: Projection, right: Vector4): Vector4
        static MULTIPLY(left: Vector4, right: Projection): Vector4
        static EQUAL(left: Projection, right: Projection): boolean
        static NOT_EQUAL(left: Projection, right: Projection): boolean
        get x(): Vector4
        set x(value: Vector4)
        get y(): Vector4
        set y(value: Vector4)
        get z(): Vector4
        set z(value: Vector4)
        get w(): Vector4
        set w(value: Vector4)
    }
    /** A color represented in RGBA format.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.6/classes/class_color.html  
     */
    class Color {
        /** Alice blue color. */
        static readonly ALICE_BLUE: Readonly<Color>
        
        /** Antique white color. */
        static readonly ANTIQUE_WHITE: Readonly<Color>
        
        /** Aqua color. */
        static readonly AQUA: Readonly<Color>
        
        /** Aquamarine color. */
        static readonly AQUAMARINE: Readonly<Color>
        
        /** Azure color. */
        static readonly AZURE: Readonly<Color>
        
        /** Beige color. */
        static readonly BEIGE: Readonly<Color>
        
        /** Bisque color. */
        static readonly BISQUE: Readonly<Color>
        
        /** Black color. In GDScript, this is the default value of any color. */
        static readonly BLACK: Readonly<Color>
        
        /** Blanched almond color. */
        static readonly BLANCHED_ALMOND: Readonly<Color>
        
        /** Blue color. */
        static readonly BLUE: Readonly<Color>
        
        /** Blue violet color. */
        static readonly BLUE_VIOLET: Readonly<Color>
        
        /** Brown color. */
        static readonly BROWN: Readonly<Color>
        
        /** Burlywood color. */
        static readonly BURLYWOOD: Readonly<Color>
        
        /** Cadet blue color. */
        static readonly CADET_BLUE: Readonly<Color>
        
        /** Chartreuse color. */
        static readonly CHARTREUSE: Readonly<Color>
        
        /** Chocolate color. */
        static readonly CHOCOLATE: Readonly<Color>
        
        /** Coral color. */
        static readonly CORAL: Readonly<Color>
        
        /** Cornflower blue color. */
        static readonly CORNFLOWER_BLUE: Readonly<Color>
        
        /** Cornsilk color. */
        static readonly CORNSILK: Readonly<Color>
        
        /** Crimson color. */
        static readonly CRIMSON: Readonly<Color>
        
        /** Cyan color. */
        static readonly CYAN: Readonly<Color>
        
        /** Dark blue color. */
        static readonly DARK_BLUE: Readonly<Color>
        
        /** Dark cyan color. */
        static readonly DARK_CYAN: Readonly<Color>
        
        /** Dark goldenrod color. */
        static readonly DARK_GOLDENROD: Readonly<Color>
        
        /** Dark gray color. */
        static readonly DARK_GRAY: Readonly<Color>
        
        /** Dark green color. */
        static readonly DARK_GREEN: Readonly<Color>
        
        /** Dark khaki color. */
        static readonly DARK_KHAKI: Readonly<Color>
        
        /** Dark magenta color. */
        static readonly DARK_MAGENTA: Readonly<Color>
        
        /** Dark olive green color. */
        static readonly DARK_OLIVE_GREEN: Readonly<Color>
        
        /** Dark orange color. */
        static readonly DARK_ORANGE: Readonly<Color>
        
        /** Dark orchid color. */
        static readonly DARK_ORCHID: Readonly<Color>
        
        /** Dark red color. */
        static readonly DARK_RED: Readonly<Color>
        
        /** Dark salmon color. */
        static readonly DARK_SALMON: Readonly<Color>
        
        /** Dark sea green color. */
        static readonly DARK_SEA_GREEN: Readonly<Color>
        
        /** Dark slate blue color. */
        static readonly DARK_SLATE_BLUE: Readonly<Color>
        
        /** Dark slate gray color. */
        static readonly DARK_SLATE_GRAY: Readonly<Color>
        
        /** Dark turquoise color. */
        static readonly DARK_TURQUOISE: Readonly<Color>
        
        /** Dark violet color. */
        static readonly DARK_VIOLET: Readonly<Color>
        
        /** Deep pink color. */
        static readonly DEEP_PINK: Readonly<Color>
        
        /** Deep sky blue color. */
        static readonly DEEP_SKY_BLUE: Readonly<Color>
        
        /** Dim gray color. */
        static readonly DIM_GRAY: Readonly<Color>
        
        /** Dodger blue color. */
        static readonly DODGER_BLUE: Readonly<Color>
        
        /** Firebrick color. */
        static readonly FIREBRICK: Readonly<Color>
        
        /** Floral white color. */
        static readonly FLORAL_WHITE: Readonly<Color>
        
        /** Forest green color. */
        static readonly FOREST_GREEN: Readonly<Color>
        
        /** Fuchsia color. */
        static readonly FUCHSIA: Readonly<Color>
        
        /** Gainsboro color. */
        static readonly GAINSBORO: Readonly<Color>
        
        /** Ghost white color. */
        static readonly GHOST_WHITE: Readonly<Color>
        
        /** Gold color. */
        static readonly GOLD: Readonly<Color>
        
        /** Goldenrod color. */
        static readonly GOLDENROD: Readonly<Color>
        
        /** Gray color. */
        static readonly GRAY: Readonly<Color>
        
        /** Green color. */
        static readonly GREEN: Readonly<Color>
        
        /** Green yellow color. */
        static readonly GREEN_YELLOW: Readonly<Color>
        
        /** Honeydew color. */
        static readonly HONEYDEW: Readonly<Color>
        
        /** Hot pink color. */
        static readonly HOT_PINK: Readonly<Color>
        
        /** Indian red color. */
        static readonly INDIAN_RED: Readonly<Color>
        
        /** Indigo color. */
        static readonly INDIGO: Readonly<Color>
        
        /** Ivory color. */
        static readonly IVORY: Readonly<Color>
        
        /** Khaki color. */
        static readonly KHAKI: Readonly<Color>
        
        /** Lavender color. */
        static readonly LAVENDER: Readonly<Color>
        
        /** Lavender blush color. */
        static readonly LAVENDER_BLUSH: Readonly<Color>
        
        /** Lawn green color. */
        static readonly LAWN_GREEN: Readonly<Color>
        
        /** Lemon chiffon color. */
        static readonly LEMON_CHIFFON: Readonly<Color>
        
        /** Light blue color. */
        static readonly LIGHT_BLUE: Readonly<Color>
        
        /** Light coral color. */
        static readonly LIGHT_CORAL: Readonly<Color>
        
        /** Light cyan color. */
        static readonly LIGHT_CYAN: Readonly<Color>
        
        /** Light goldenrod color. */
        static readonly LIGHT_GOLDENROD: Readonly<Color>
        
        /** Light gray color. */
        static readonly LIGHT_GRAY: Readonly<Color>
        
        /** Light green color. */
        static readonly LIGHT_GREEN: Readonly<Color>
        
        /** Light pink color. */
        static readonly LIGHT_PINK: Readonly<Color>
        
        /** Light salmon color. */
        static readonly LIGHT_SALMON: Readonly<Color>
        
        /** Light sea green color. */
        static readonly LIGHT_SEA_GREEN: Readonly<Color>
        
        /** Light sky blue color. */
        static readonly LIGHT_SKY_BLUE: Readonly<Color>
        
        /** Light slate gray color. */
        static readonly LIGHT_SLATE_GRAY: Readonly<Color>
        
        /** Light steel blue color. */
        static readonly LIGHT_STEEL_BLUE: Readonly<Color>
        
        /** Light yellow color. */
        static readonly LIGHT_YELLOW: Readonly<Color>
        
        /** Lime color. */
        static readonly LIME: Readonly<Color>
        
        /** Lime green color. */
        static readonly LIME_GREEN: Readonly<Color>
        
        /** Linen color. */
        static readonly LINEN: Readonly<Color>
        
        /** Magenta color. */
        static readonly MAGENTA: Readonly<Color>
        
        /** Maroon color. */
        static readonly MAROON: Readonly<Color>
        
        /** Medium aquamarine color. */
        static readonly MEDIUM_AQUAMARINE: Readonly<Color>
        
        /** Medium blue color. */
        static readonly MEDIUM_BLUE: Readonly<Color>
        
        /** Medium orchid color. */
        static readonly MEDIUM_ORCHID: Readonly<Color>
        
        /** Medium purple color. */
        static readonly MEDIUM_PURPLE: Readonly<Color>
        
        /** Medium sea green color. */
        static readonly MEDIUM_SEA_GREEN: Readonly<Color>
        
        /** Medium slate blue color. */
        static readonly MEDIUM_SLATE_BLUE: Readonly<Color>
        
        /** Medium spring green color. */
        static readonly MEDIUM_SPRING_GREEN: Readonly<Color>
        
        /** Medium turquoise color. */
        static readonly MEDIUM_TURQUOISE: Readonly<Color>
        
        /** Medium violet red color. */
        static readonly MEDIUM_VIOLET_RED: Readonly<Color>
        
        /** Midnight blue color. */
        static readonly MIDNIGHT_BLUE: Readonly<Color>
        
        /** Mint cream color. */
        static readonly MINT_CREAM: Readonly<Color>
        
        /** Misty rose color. */
        static readonly MISTY_ROSE: Readonly<Color>
        
        /** Moccasin color. */
        static readonly MOCCASIN: Readonly<Color>
        
        /** Navajo white color. */
        static readonly NAVAJO_WHITE: Readonly<Color>
        
        /** Navy blue color. */
        static readonly NAVY_BLUE: Readonly<Color>
        
        /** Old lace color. */
        static readonly OLD_LACE: Readonly<Color>
        
        /** Olive color. */
        static readonly OLIVE: Readonly<Color>
        
        /** Olive drab color. */
        static readonly OLIVE_DRAB: Readonly<Color>
        
        /** Orange color. */
        static readonly ORANGE: Readonly<Color>
        
        /** Orange red color. */
        static readonly ORANGE_RED: Readonly<Color>
        
        /** Orchid color. */
        static readonly ORCHID: Readonly<Color>
        
        /** Pale goldenrod color. */
        static readonly PALE_GOLDENROD: Readonly<Color>
        
        /** Pale green color. */
        static readonly PALE_GREEN: Readonly<Color>
        
        /** Pale turquoise color. */
        static readonly PALE_TURQUOISE: Readonly<Color>
        
        /** Pale violet red color. */
        static readonly PALE_VIOLET_RED: Readonly<Color>
        
        /** Papaya whip color. */
        static readonly PAPAYA_WHIP: Readonly<Color>
        
        /** Peach puff color. */
        static readonly PEACH_PUFF: Readonly<Color>
        
        /** Peru color. */
        static readonly PERU: Readonly<Color>
        
        /** Pink color. */
        static readonly PINK: Readonly<Color>
        
        /** Plum color. */
        static readonly PLUM: Readonly<Color>
        
        /** Powder blue color. */
        static readonly POWDER_BLUE: Readonly<Color>
        
        /** Purple color. */
        static readonly PURPLE: Readonly<Color>
        
        /** Rebecca purple color. */
        static readonly REBECCA_PURPLE: Readonly<Color>
        
        /** Red color. */
        static readonly RED: Readonly<Color>
        
        /** Rosy brown color. */
        static readonly ROSY_BROWN: Readonly<Color>
        
        /** Royal blue color. */
        static readonly ROYAL_BLUE: Readonly<Color>
        
        /** Saddle brown color. */
        static readonly SADDLE_BROWN: Readonly<Color>
        
        /** Salmon color. */
        static readonly SALMON: Readonly<Color>
        
        /** Sandy brown color. */
        static readonly SANDY_BROWN: Readonly<Color>
        
        /** Sea green color. */
        static readonly SEA_GREEN: Readonly<Color>
        
        /** Seashell color. */
        static readonly SEASHELL: Readonly<Color>
        
        /** Sienna color. */
        static readonly SIENNA: Readonly<Color>
        
        /** Silver color. */
        static readonly SILVER: Readonly<Color>
        
        /** Sky blue color. */
        static readonly SKY_BLUE: Readonly<Color>
        
        /** Slate blue color. */
        static readonly SLATE_BLUE: Readonly<Color>
        
        /** Slate gray color. */
        static readonly SLATE_GRAY: Readonly<Color>
        
        /** Snow color. */
        static readonly SNOW: Readonly<Color>
        
        /** Spring green color. */
        static readonly SPRING_GREEN: Readonly<Color>
        
        /** Steel blue color. */
        static readonly STEEL_BLUE: Readonly<Color>
        
        /** Tan color. */
        static readonly TAN: Readonly<Color>
        
        /** Teal color. */
        static readonly TEAL: Readonly<Color>
        
        /** Thistle color. */
        static readonly THISTLE: Readonly<Color>
        
        /** Tomato color. */
        static readonly TOMATO: Readonly<Color>
        
        /** Transparent color (white with zero alpha). */
        static readonly TRANSPARENT: Readonly<Color>
        
        /** Turquoise color. */
        static readonly TURQUOISE: Readonly<Color>
        
        /** Violet color. */
        static readonly VIOLET: Readonly<Color>
        
        /** Web gray color. */
        static readonly WEB_GRAY: Readonly<Color>
        
        /** Web green color. */
        static readonly WEB_GREEN: Readonly<Color>
        
        /** Web maroon color. */
        static readonly WEB_MAROON: Readonly<Color>
        
        /** Web purple color. */
        static readonly WEB_PURPLE: Readonly<Color>
        
        /** Wheat color. */
        static readonly WHEAT: Readonly<Color>
        
        /** White color. */
        static readonly WHITE: Readonly<Color>
        
        /** White smoke color. */
        static readonly WHITE_SMOKE: Readonly<Color>
        
        /** Yellow color. */
        static readonly YELLOW: Readonly<Color>
        
        /** Yellow green color. */
        static readonly YELLOW_GREEN: Readonly<Color>
        constructor()
        constructor(from: Color)
        constructor(from: Color, alpha: float64)
        constructor(r: float64, g: float64, b: float64)
        constructor(r: float64, g: float64, b: float64, a: float64)
        constructor(code: string)
        constructor(code: string, alpha: float64)
        
        /** Returns the color converted to a 32-bit integer in ARGB format (each component is 8 bits). ARGB is more compatible with DirectX.  
         *    
         */
        to_argb32(): int64
        
        /** Returns the color converted to a 32-bit integer in ABGR format (each component is 8 bits). ABGR is the reversed version of the default RGBA format.  
         *    
         */
        to_abgr32(): int64
        
        /** Returns the color converted to a 32-bit integer in RGBA format (each component is 8 bits). RGBA is Godot's default format. This method is the inverse of [method hex].  
         *    
         */
        to_rgba32(): int64
        
        /** Returns the color converted to a 64-bit integer in ARGB format (each component is 16 bits). ARGB is more compatible with DirectX.  
         *    
         */
        to_argb64(): int64
        
        /** Returns the color converted to a 64-bit integer in ABGR format (each component is 16 bits). ABGR is the reversed version of the default RGBA format.  
         *    
         */
        to_abgr64(): int64
        
        /** Returns the color converted to a 64-bit integer in RGBA format (each component is 16 bits). RGBA is Godot's default format. This method is the inverse of [method hex64].  
         *    
         */
        to_rgba64(): int64
        
        /** Returns the color converted to an HTML hexadecimal color [String] in RGBA format, without the hash (`#`) prefix.  
         *  Setting [param with_alpha] to `false`, excludes alpha from the hexadecimal string, using RGB format instead of RGBA format.  
         *    
         */
        to_html(with_alpha?: boolean /* = true */): string
        
        /** Returns a new color with all components clamped between the components of [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clamp(min?: Color /* = new Color(0, 0, 0, 0) */, max?: Color /* = new Color(1, 1, 1, 1) */): Color
        
        /** Returns the color with its [member r], [member g], and [member b] components inverted (`(1 - r, 1 - g, 1 - b, a)`).  
         *    
         */
        inverted(): Color
        
        /** Returns the linear interpolation between this color's components and [param to]'s components. The interpolation factor [param weight] should be between 0.0 and 1.0 (inclusive). See also [method @GlobalScope.lerp].  
         *    
         */
        lerp(to: Color, weight: float64): Color
        
        /** Returns a new color resulting from making this color lighter by the specified [param amount], which should be a ratio from 0.0 to 1.0. See also [method darkened].  
         *    
         */
        lightened(amount: float64): Color
        
        /** Returns a new color resulting from making this color darker by the specified [param amount] (ratio from 0.0 to 1.0). See also [method lightened].  
         *    
         */
        darkened(amount: float64): Color
        
        /** Returns a new color resulting from overlaying this color over the given color. In a painting program, you can imagine it as the [param over] color painted over this color (including alpha).  
         *    
         */
        blend(over: Color): Color
        
        /** Returns the light intensity of the color, as a value between 0.0 and 1.0 (inclusive). This is useful when determining light or dark color. Colors with a luminance smaller than 0.5 can be generally considered dark.  
         *      
         *  **Note:** [method get_luminance] relies on the color using linear encoding to return an accurate relative luminance value. If the color uses the default nonlinear sRGB encoding, use [method srgb_to_linear] to convert it to linear encoding first.  
         */
        get_luminance(): float64
        
        /** Returns a copy of the color that uses linear encoding. This method requires the original color to be encoded using the [url=https://en.wikipedia.org/wiki/SRGB]nonlinear sRGB transfer function[/url]. See also [method linear_to_srgb] which performs the opposite operation.  
         *      
         *  **Note:** The color's alpha channel ([member a]) is not affected. The alpha channel is always stored with linear encoding, regardless of the color space of the other color channels.  
         */
        srgb_to_linear(): Color
        
        /** Returns a copy of the color that is encoded using the [url=https://en.wikipedia.org/wiki/SRGB]nonlinear sRGB transfer function[/url]. This method requires the original color to use linear encoding. See also [method srgb_to_linear] which performs the opposite operation.  
         *      
         *  **Note:** The color's alpha channel ([member a]) is not affected. The alpha channel is always stored with linear encoding, regardless of the color space of the other color channels.  
         */
        linear_to_srgb(): Color
        
        /** Returns `true` if this color and [param to] are approximately equal, by running [method @GlobalScope.is_equal_approx] on each component. */
        is_equal_approx(to: Color): boolean
        
        /** Returns the [Color] associated with the provided [param hex] integer in 32-bit RGBA format (8 bits per channel). This method is the inverse of [method to_rgba32].  
         *  In GDScript and C#, the [int] is best visualized with hexadecimal notation (`"0x"` prefix, making it `"0xRRGGBBAA"`).  
         *    
         *  If you want to use hex notation in a constant expression, use the equivalent constructor instead (i.e. `Color(0xRRGGBBAA)`).  
         */
        static hex(hex: int64): Color
        
        /** Returns the [Color] associated with the provided [param hex] integer in 64-bit RGBA format (16 bits per channel). This method is the inverse of [method to_rgba64].  
         *  In GDScript and C#, the [int] is best visualized with hexadecimal notation (`"0x"` prefix, making it `"0xRRRRGGGGBBBBAAAA"`).  
         */
        static hex64(hex: int64): Color
        
        /** Returns a new color from [param rgba], an HTML hexadecimal color string. [param rgba] is not case-sensitive, and may be prefixed by a hash sign (`#`).  
         *  [param rgba] must be a valid three-digit or six-digit hexadecimal color string, and may contain an alpha channel value. If [param rgba] does not contain an alpha channel value, an alpha channel value of 1.0 is applied. If [param rgba] is invalid, returns an empty color.  
         *    
         */
        static html(rgba: string): Color
        
        /** Returns `true` if [param color] is a valid HTML hexadecimal color string. The string must be a hexadecimal value (case-insensitive) of either 3, 4, 6 or 8 digits, and may be prefixed by a hash sign (`#`). This method is identical to [method String.is_valid_html_color].  
         *    
         */
        static html_is_valid(color: string): boolean
        
        /** Creates a [Color] from the given string, which can be either an HTML color code or a named color (case-insensitive). Returns [param default] if the color cannot be inferred from the string.  
         *  If you want to create a color from String in a constant expression, use the equivalent constructor instead (i.e. `Color("color string")`).  
         */
        static from_string(str: string, default_: Color): Color
        
        /** Constructs a color from an [url=https://en.wikipedia.org/wiki/HSL_and_HSV]HSV profile[/url]. The hue ([param h]), saturation ([param s]), and value ([param v]) are typically between 0.0 and 1.0.  
         *    
         */
        static from_hsv(h: float64, s: float64, v: float64, alpha?: float64 /* = 1 */): Color
        
        /** Constructs a color from an [url=https://bottosson.github.io/posts/colorpicker/]OK HSL profile[/url]. The hue ([param h]), saturation ([param s]), and lightness ([param l]) are typically between 0.0 and 1.0.  
         *    
         */
        static from_ok_hsl(h: float64, s: float64, l: float64, alpha?: float64 /* = 1 */): Color
        
        /** Decodes a [Color] from an RGBE9995 format integer. See [constant Image.FORMAT_RGBE9995]. */
        static from_rgbe9995(rgbe: int64): Color
        
        /** Returns a [Color] constructed from red ([param r8]), green ([param g8]), blue ([param b8]), and optionally alpha ([param a8]) integer channels, each divided by `255.0` for their final value.  
         *    
         *      
         *  **Note:** Due to the lower precision of [method from_rgba8] compared to the standard [Color] constructor, a color created with [method from_rgba8] will generally not be equal to the same color created with the standard [Color] constructor. Use [method is_equal_approx] for comparisons to avoid issues with floating-point precision error.  
         */
        static from_rgba8(r8: int64, g8: int64, b8: int64, a8?: int64 /* = 255 */): Color
        static ADD(left: Color, right: Color): Color
        static SUBTRACT(left: Color, right: Color): Color
        static MULTIPLY(left: Color, right: Color): Color
        static MULTIPLY(left: Color, right: float64): Color
        static MULTIPLY(left: float64, right: Color): Color
        static DIVIDE(left: Color, right: Color): Color
        static DIVIDE(left: Color, right: float64): Color
        static NEGATE(left: Color): Color
        static EQUAL(left: Color, right: Color): boolean
        static NOT_EQUAL(left: Color, right: Color): boolean
        get r(): float64
        set r(value: float64)
        get g(): float64
        set g(value: float64)
        get b(): float64
        set b(value: float64)
        get a(): float64
        set a(value: float64)
        get r8(): int64
        set r8(value: int64)
        get g8(): int64
        set g8(value: int64)
        get b8(): int64
        set b8(value: int64)
        get a8(): int64
        set a8(value: int64)
        get h(): float64
        set h(value: float64)
        get s(): float64
        set s(value: float64)
        get v(): float64
        set v(value: float64)
        get ok_hsl_h(): float64
        set ok_hsl_h(value: float64)
        get ok_hsl_s(): float64
        set ok_hsl_s(value: float64)
        get ok_hsl_l(): float64
        set ok_hsl_l(value: float64)
    }
}
