package com.onfido.qa.websdk.sdk;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class RawSerializer extends StdSerializer<Raw> {

    public RawSerializer() {
        this(null);
    }

    public RawSerializer(Class<Raw> t) {
        super(t);
    }

    @Override
    public void serialize(
            Raw value, JsonGenerator jgen, SerializerProvider provider)
            throws IOException {

        jgen.writeRawValue(value.data);
    }
}
