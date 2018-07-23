// @flow

// Errors list:
/*
* https://adactivesas.github.io/adsum-client-api/docs/ref-struct-Reference.html constructor -> value -> default
* https://adactivesas.github.io/adsum-client-api/docs/ref-model-File.html context property -> is both readOnly and has default value. Correct?
* https://adactivesas.github.io/adsum-client-api/docs/ref-model-Tag.html toJSON -> updated_at -> should be null instead of numll
* */

export type FileContextsType =
    | 'DEFAULT'
    | 'TEXTURE'
    | 'TEXTURE_MODEL'
    | 'MEDIA'
    | 'MEDIA_FILE'
    | 'MEDIA_PREVIEW'
    | 'MAP'
    | 'PICTO'
    | 'CATEGORY'
    | 'SITE'
    | 'POI'
    | 'TEXTURE_LOW'
    | 'TEXTURE_OCCLUSION'
    | 'TEXTURE_HELPER';

export type PoiTypesType =
    | 'EXHIBITOR'
    | 'PERSON'
    | 'PRODUCT'
    | 'ROOM'
    | 'SERVICE'
    | 'STORE';

export type MediaTypesType =
    | 'IMAGE'
    | 'PDF'
    | 'TEXT'
    | 'URL'
    | 'VIDEO'
    | 'MOVIE';

export type MetadataType = { [string]: string };

export type AbstractEntityType = {
    // Properties
    +id: ?number | ?Symbol
};

export type OrderedCollectionType<T: AbstractEntityType> = {|
    // Properties
    classOf: string,
    size: number,
    values: Array<ReferenceType>,

    // Methods
    constructor: (classOf: ?string, values: ?Iterable<T | number | ReferenceType>) => OrderedCollectionType,
    add: (value: T | ReferenceType | number | Symbol, position: ?number) => OrderedCollectionType,
    at: (index: ?number) => ReferenceType,
    clear: () => void,
    has: (value: T | number | Symbol | ReferenceType) => boolean,
    indexOf: (value: T | number | Symbol | ReferenceType) => number,
    remove: (value: T | number | Symbol | ReferenceType) => OrderedCollectionType,
    removeAt: (index: number) => OrderedCollectionType,
    set: (values: Iterable<T | ReferenceType | number | Symbol>) => OrderedCollectionType,
    forEach: (callback: (entity: ReferenceType) => void) => OrderedCollectionType
|};

export type CollectionType = OrderedCollectionType;

export type ReferenceType = {|
    // Properties
    classOf: ?string,
    value: ?number | ?Symbol,

    // Methods
    constructor: (classOf: ?string, value: ?number | ?AbstractEntityType) => ReferenceType,
    is: (value: ?ReferenceType | ?AbstractEntityType | ?number | ?Symbol) => boolean,
    set: (value: ?ReferenceType | ?AbstractEntityType | ?number | ?Symbol) => ReferenceType
|};

export type TagJsonType = {
    categories: Array<number | Symbol>,
    client_id: ?string,
    created_at: ?string,
    id: ?number | ?Symbol,
    medias: Array<number | Symbol>,
    metadata: MetadataType,
    name: ?string,
    playlists: Array<number | Symbol>,
    pois: Array<number, Symbol>,
    signature: ?string,
    site: ?number | ?Symbol,
    updated_at: ?string,
    version: ?number
};
export type TagType = {
    ...AbstractEntityType,
    // Properties
    categories: CollectionType<CategoryType>,
    client_id: ?string,
    created_at: ?Date,

    +medias: CollectionType<MediaType>, // To implement
    metadata: Map<string, string>,
    name: ?string,
    playlists: CollectionType<PlaylistType>, // To implement
    pois: CollectionType<PoiType>,
    signature: ?string,
    site: ReferenceType,
    +updatedAt: ?Date,
    +version: ?number,

    // Methods
    constructor: (json: ?TagJsonType) => TagType,
    toJSON: () => TagJsonType,
    fromJSON: (json: TagJsonType) => TagType,
    clone: () => TagType
};

export type FileJsonType = {
    content_hash: ?string,
    context: string,
    file_type: ?string,
    id: ?number | ?Symbol,
    metadata: MetadataType,
    name: ?string,
    reference: ?string,
    site: ?number | ?Symbol,
    uri: ?string
};
export type FileType = {|
    ...AbstractEntityType,
    // Properties
    +content_hash: ?string,
    context: FileContextsType,
    file_type: ?string,
    metadata: Map<string, string>,
    name: ?string,
    reference: ?string,
    site: ReferenceType,
    uri: ?string,

    // Methods
    constructor: (json: ?FileJsonType) => File,
    toJSON: () => FileJsonType,
    fromJSON: (json: FileJsonType) => File,
    clone: () => FileType
|};

export type CategoryJsonType = {
    children: Array<{ id: number | Symbol, position: number }>,
    client_id: ?string,
    color: ?string,
    created_at: ?string,
    id: ?number | ?string,
    logo: ?number | ?string,
    metadata: MetadataType,
    name: ?string,
    parameters: Array<string>,
    parents: Array<number | Symbol>,
    pois: Array<number | Symbol>,
    rank: number,
    signature: ?string,
    site: ?number | ?Symbol,
    tags: Array<number, Symbol>,
    type: ?string,
    updated_at: ?string,
    version: ?number
};
export type CategoryType = {|
    ...AbstractEntityType,
    // Properties
    children: OrderedCollectionType<CategoryType>,
    client_id: ?string,
    color: ?string,
    +createdAt: ?Date,
    logo: ReferenceType,
    metadata: Map<string, string>,
    name: ?string,
    parameters: Set<string>,
    parents: CollectionType<CategoryType>,
    pois: CollectionType<PoiType>,
    rank: number,
    signature: ?string,
    site: ReferenceType,
    tags: CollectionType<TagType>,
    type: ?string,
    +updated_at: ?Date,
    +version: ?number,

    // Methods
    constructor: (json: ?CategoryJsonType) => CategoryType,
    fromJSON: (json: CategoryJsonType) => CategoryType,
    toJSON: () => CategoryJsonType,
    clone: () => CategoryType
|};

export type PoiJsonType = {
    categories: Array<number | Symbol>,
    children: Array<{ id: number | Symbol, position: number }>,
    client_id: ?string,
    created_at: ?string,
    custom_objects: Array<number | Symbol>,
    description: ?string,
    logos: Array<{ id: number | Symbol, position: number }>,
    medias: Array<{ id: number | Symbol, position: number }>,
    metadata: MetadataType,
    name: ?string,
    new: boolean,
    parents: Array<number | Symbol>,
    pictures: Array<{ id: number | Symbol, position: number }>,
    places: Array<number | Symbol>,
    signature: ?string,
    site: ?number | Symbol,
    tags: Array<number | Symbol>,
    type: ?string,
    updated_at: ?string,
    version: ?number
};
export type PoiType = {
    // Properties
    categories: CategoryType<CategoryType>,
    children: OrderedCollectionType<PoiType>,
    client_id: ?string,
    +created_at: ?Date,
    custom_objects: CollectionType<CustomObjectType>, // TO BE IMPLEMENTED,
    description: ?string,
    logos: OrderedCollectionType<FileType>,
    medias: OrderedCollectionType<MediaType>, // TO BE IMPLEMENTED
    metadata: Map<string, string>,
    name: ?string,
    new: boolean,
    parents: CollectionType<PoiType>,
    pictures: OrderedCollectionType<FileType>,
    places: CollectionType<Place>, // TO BE IMPLEMENTED,
    signature: ?string,
    site: ReferenceType,
    tags: CollectionType<Tag>,
    +type: PoiTypesType,
    updated_at: ?Date,
    version: ?number,

    // Methods
    toJSON: () => PoiJsonType,
    fromJSON: (json: PoiJsonType) => PoiType,
    clone: () => PoiType
};

