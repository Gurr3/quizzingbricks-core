# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: base.proto

from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import descriptor_pb2
# @@protoc_insertion_point(imports)




DESCRIPTOR = _descriptor.FileDescriptor(
  name='base.proto',
  package='',
  serialized_pb='\n\nbase.proto\"/\n\x08RpcError\x12\x0f\n\x07message\x18\x01 \x02(\t\x12\x12\n\nerror_code\x18\x02 \x01(\x05')




_RPCERROR = _descriptor.Descriptor(
  name='RpcError',
  full_name='RpcError',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='message', full_name='RpcError.message', index=0,
      number=1, type=9, cpp_type=9, label=2,
      has_default_value=False, default_value=unicode("", "utf-8"),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='error_code', full_name='RpcError.error_code', index=1,
      number=2, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  extension_ranges=[],
  serialized_start=14,
  serialized_end=61,
)

DESCRIPTOR.message_types_by_name['RpcError'] = _RPCERROR

class RpcError(_message.Message):
  __metaclass__ = _reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _RPCERROR

  # @@protoc_insertion_point(class_scope:RpcError)


# @@protoc_insertion_point(module_scope)
