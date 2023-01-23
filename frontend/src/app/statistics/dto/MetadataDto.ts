import { Metadata } from "../entity/metadata";

export interface MetadataDto {
  uuid: string;
  labels: string;
}

export function fromMetadata(metadata: Metadata): MetadataDto {
  return {
    uuid: metadata.uuid,
    labels: metadata.labels.join(";"),
  };
}

export function fromMetadataDto(metadataDto: MetadataDto): Metadata {
  return {
    uuid: metadataDto.uuid,
    labels: metadataDto.labels.split(";"),
  };
}
