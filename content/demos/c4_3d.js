( function() {
	var canvas = document.getElementById( "demo_c4_3d" ).getElementsByTagName( "canvas" )[0];
	var gl = canvas.getContext( "experimental-webgl" );

	// Populate vertex buffer
	var vertices = [
		-0.5,  0.5, 1.0, 0.0, 0.0, 0.0, 0.0,
		 0.5,  0.5, 0.0, 1.0, 0.0, 1.0, 0.0,
		 0.5, -0.5, 0.0, 0.0, 1.0, 1.0, 1.0,
		-0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0
	];
	var vbo = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vbo );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	// Populate element buffer
	var elements = [
		0, 1, 2,
		2, 3, 0
	];
	var ebo = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, ebo );
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( elements ), gl.STATIC_DRAW );

	// Load shaders
	var vertexShader = gl.createShader( gl.VERTEX_SHADER );
	gl.shaderSource( vertexShader, "attribute vec2 position; attribute vec2 texcoord; varying vec2 Texcoord; uniform mat4 model; uniform mat4 view; uniform mat4 proj; void main() { Texcoord = texcoord; gl_Position = proj * view * model * vec4( position, 0.0, 1.0 ); }" );
	gl.compileShader( vertexShader );

	var fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );
	gl.shaderSource( fragmentShader, "precision mediump float; varying vec2 Texcoord; uniform sampler2D texKitten; uniform sampler2D texPuppy; void main() { gl_FragColor = mix( texture2D( texKitten, Texcoord ), texture2D( texPuppy, Texcoord ), 0.5 ); }" );
	gl.compileShader( fragmentShader );

	var shaderProgram = gl.createProgram();
	gl.attachShader( shaderProgram, vertexShader );
	gl.attachShader( shaderProgram, fragmentShader );
	gl.linkProgram( shaderProgram );
	gl.useProgram( shaderProgram );

	var posAttrib = gl.getAttribLocation( shaderProgram, "position" );
	gl.enableVertexAttribArray( posAttrib );
	gl.vertexAttribPointer( posAttrib, 2, gl.FLOAT, gl.FALSE, 7*4, 0 );

	var texAttrib = gl.getAttribLocation( shaderProgram, "texcoord" );
	gl.enableVertexAttribArray( texAttrib );
	gl.vertexAttribPointer( texAttrib, 2, gl.FLOAT, gl.FALSE, 7*4, 5*4 );

	// Load textures
	var texKitten = gl.createTexture();
	var imageKitten = new Image();
	imageKitten.onload = function() {
		gl.activeTexture( gl.TEXTURE0 );
		gl.bindTexture( gl.TEXTURE_2D, texKitten );

		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageKitten );

		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
	};
	imageKitten.src = "/content/code/sample.png";
	gl.uniform1i( gl.getUniformLocation( shaderProgram, "texKitten" ), 0 );

	var texPuppy = gl.createTexture();
	var imagePuppy = new Image();
	imagePuppy.onload = function() {
		gl.activeTexture( gl.TEXTURE1 );
		gl.bindTexture( gl.TEXTURE_2D, texPuppy );

		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagePuppy );

		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
	};
	imagePuppy.src = "/content/code/sample2.png";
	gl.uniform1i( gl.getUniformLocation( shaderProgram, "texPuppy" ), 1 );

	// Set up view
	gl.uniformMatrix4fv( gl.getUniformLocation( shaderProgram, "view" ), false, mat4.lookAt( [ 1.2, 1.2, 1.2 ], [ 0, 0, 0 ], [ 0, 0, 1 ] ) );
	gl.uniformMatrix4fv( gl.getUniformLocation( shaderProgram, "proj" ), false, mat4.perspective( 45, 4/3, 1, 10 ) );

	// Draw
	var uniModel = gl.getUniformLocation( shaderProgram, "model" );

	registerAnimatedCanvas( canvas, function( time )
	{
		gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
		gl.clear( gl.COLOR_BUFFER_BIT );

		var mat = mat4.create();
		mat4.identity( mat );
		mat4.rotateZ( mat, time * Math.PI );
		gl.uniformMatrix4fv( uniModel, false, mat );

		gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );
	} );
} )();