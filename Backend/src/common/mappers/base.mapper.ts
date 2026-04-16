export abstract class BaseMapper<Entity, ResponseDto> {

  abstract toResponse(entity: Entity): ResponseDto;

 
  toResponseArray(entities: Entity[]): ResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }

  
  protected mapId(id: string | null | undefined): string {
    return id ? id.toString() : '';
  }
}
