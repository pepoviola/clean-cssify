var through = require( 'through' );
var path = require( 'path' );
var CleanCSS = require( 'clean-css' );

module.exports = function( filePath, opts ) {
	'use strict';
	// Holds data written to the wrapper through stream.
	var data = '';

	/**
	* Module creation entry point. Aggregates all data from the incoming through stream
	* (which will represent the contents of a file) then processes the result to replace
	* local image references that meet maximum size requirements with data URIs.
	*/
	if( filePath !== undefined && [ '.css' ].indexOf( path.extname( filePath ) ) === -1 )
		return through();
	else
		return through( write, end );

	/**
	* Implementation of through interface.
	*/
	function write( buf ) {
		data += buf;
	};

	/**
	* Implementation of through interface.
	*/
	function end() {
		try {
			this.queue( new CleanCSS( opts ).minify( data ).styles );
		} catch( err ) {
			this.emit( 'error', new Error( err ) );
		}

		this.queue( null );
	}
};
