/// <reference types="node" />
declare module "ipfs-http-client" {
  import PeerId from "peer-id"
  import CID from "cids"
  import Multiaddr from "multiaddr"
  import Block from "ipld-block"
  import BigNumber from "bignumber.js"
  import { ReadStream } from "fs"
  
  export type KeyGenAlgos = "rsa" | "ed25519" | string
  export type Chmods = "0o755" | 'a+x' | 'g-w' | number
  export type PinTypes = "indirect" | "direct" | "recursive"
  export type CborParsers = "dag-cbor" | "cbor" | string
  export type DagFormats = "dag-pb" | "dag-cbor" | "cbor" | "protobuf" | string
  export type HashAlogs = "sha2-256" | "sha3-512" | string
  export type FileTypes = "file" | "directory" | string
  export type Bases = "base64" | "base32" | "base58btc"
  export type FileStream = Iterable<FileContent|FileObject> | AsyncIterable<FileContent|FileObject> | ReadableStream<FileContent|FileObject>
  export type FileContent = Uint8Array | Blob | String | Iterable<Uint8Array> | Iterable<number> | AsyncIterable<Uint8Array> | ReadableStream<Uint8Array>
  export type UnixTime = Date | { secs: number, nsecs?: number } | number[]

  export interface FileObject {
    /** The path you want to the file to be accessible at from the root CID _after_ it has been added */
    path: string
    /** The contents of the file (see below for definition) */
    content: FileContent
    /** File mode to store the entry with (see https://en.wikipedia.org/wiki/File_system_permissions#Numeric_notation) */
    mode: number | string
    /** The modification time of the entry (see below for definition) */
    mtime: UnixTime
    /** Filesize */
    size: number
  }

  export interface TimeoutOptions {
    /** A timeout in ms */
    timeout?: number
    /** Can be used to cancel any long running requests started as a result of this call */
    signal?: AbortController
  }
  
  export interface PeerInfo {
    id: string
    addrs: Multiaddr[]
  }
  
  export interface SwarmPeer {
    /** MultiAddress of Peer */
    addr: Multiaddr
    /** Peer String */
    peer: string
    /** Inbound or outbound connection */
    direction: number
    /**  The type of stream muxer the peer is usng */
    muxer: string
    /** Only if verbose: true was passed */
    latency?: string
    /** Only if verbose: true, a list of currently open streams */
    streams?: string[]
    // If an error occurs trying to create an individual object, it will have the properties:
    /** the error that occurred */
    error?: Error
    /** the raw data for the peer */
    rawPeerInfo?: any
  }
  
  /** A Date object, an object with `{ secs, nsecs }` properties where secs is the number of seconds since (positive) or before (negative) the Unix Epoch began and nsecs is the number of nanoseconds since the last full second, or the output of `process.hrtime()` */
  export interface Mtime {
    secs: number,
    nsecs: number
  }
  
  export interface FileStatResponse {
    /** is a string with the hash */
    cid: CID
    /** is an integer with the file size in Bytes */
    size: number
    /** is an integer with the size of the DAGNodes making up the file in Bytes */
    cumulativeSize: number
    /** is a string that can be either directory or file */
    type: FileTypes
    /** if type is directory, this is the number of files in the directory. If it is file it is the number of blocks that make up the file */
    blocks: number
    /** is a boolean to indicate if locality information is present */
    withLocality: boolean
    /** is a boolean to indicate if the queried dag is fully present locally */
    local?: boolean
    /** is an integer indicating the cumulative size of the data present locally */
    sizeLocal?: number
  }
  
  export interface AddObject {
    path: string,
    content: FileContent
  }
  
  export interface ResolveDnsOptions {
    /** (boolean, default true): resolve until result is not a domain name */
    recursive?: boolean
  }
  
  export interface FilesWriteOptions extends TimeoutOptions {
    /** An offset to start writing to file at */
    offset?: string
    /** Optionally limit how many bytes are read from the stream */
    length?: number
    /** Create the MFS path if it does not exist */
    create?: boolean
    /** Create intermediate MFS paths if they do not exist */
    parents?: boolean
    /** Truncate the file at the MFS path if it would have been larger than the passed `content` */
    truncate?: boolean
    /** If true, DAG leaves will contain raw file data and not be wrapped in a protobuf */
    rawLeaves?: boolean
    /** An integer that represents the file mode */
    mode?: number
    mtime?: Mtime
    /** If true the changes will be immediately flushed to disk */
    flush?: boolean
    /** The hash algorithm to use for any updated entries - DEFAULT `sha2-256` */
    hashAlg?: HashAlogs
    /** The CID version to use for any updated entries */
    cidVersion?: number
  }
  
  export interface FileStatOptions extends TimeoutOptions {
    /** If true, return only the CID */
    hash?: boolean,
    /** If true, return only the size */
    size?: boolean,
    /** If true, compute the amount of the DAG that is local and if possible the total size */
    withLocal?: boolean,
  }
  
  export interface FilesCpOptions {
    /** If true, create intermediate directories */
    parents?: boolean
    /**	The hash algorithm to use for any updated entries - DEFAULT `sha2-256` */
    hashAlg?: HashAlogs
    /** If true the changes will be immediately flushed to disk */
    flush?: boolean
  }
  
  export interface FilesMkdirOptions extends TimeoutOptions {
    /** If true, create intermediate directories */
    parents?: boolean
    /** An integer that represents the file mode */
    mode?: number

    mtime?: Mtime
    /** The hash algorithm to use for any updated entries */
    hashAlg?: HashAlogs
    /** If true the changes will be immediately flushed to disk */
    flush?: boolean
    /** The CID version to use for any updated entries */
    cidVersion?: number
  }

  export interface FilesMvOptions extends TimeoutOptions {
    /** If true, create intermediate directories */
    parents?: boolean
    /** The hash algorithm to use for any updated entries */
    hashAlg?: HashAlogs
    /** If true the changes will be immediately flushed to disk */
    flush?: boolean
    /** The CID version to use for any updated entries */
    cidVersion?: number
  }
  
  
  export interface RmOptions extends TimeoutOptions {
    offset?: number
    length?: number
  }

  export interface FilesRmOptions extends TimeoutOptions {
    /** If true all paths under the specifed path(s) will be removed */
    recursive?: boolean
    /** The hash algorithm to use for any updated entries */
    hashAlg?: HashAlogs
    /** If true the changes will be immediately flushed to disk */
    flush?: boolean
    /** The CID version to use for any updated entries */
    cidVersion?: number
  }
  
  
  export interface CatOptions extends TimeoutOptions {
    /** An offset to start reading the file from */
    offset?: number
    /** An optional max length to read from the file */
    length?: number
  }
  
  export interface TouchOptions extends TimeoutOptions {
    /** Either a Date object, an object with { sec, nsecs } properties or the output of process.hrtime() */
    mtime?: Mtime,
    /** If true the changes will be immediately flushed to disk */
    flush?: boolean
    /** The hash algorithm to use for any updated entries */
    hashAlg?: HashAlogs
    /** The CID version to use for any updated entries */
    cidVersion?: number
  }
  
  export interface ChmodOptions extends TimeoutOptions {
    /** If `true` mode will be applied to the entire tree under `path` */
    recursive?: boolean
    /** If true the changes will be immediately flushed to disk */
    flush?: boolean
    /** The hash algorithm to use for any updated entries */
    hashAlg?: string
    /** The CID version to use for any updated entries */
    cidVersion?: number
  }
  
  export interface ResolveOptions extends TimeoutOptions {
    /** Resolve until result is an IPFS name */
    recursive?: boolean
    /** Multibase codec name the CID in the resolved path will be encoded with */
    cidBase?: string
  }
  
  export interface FilesReadOptions extends TimeoutOptions {
    /** An offset to start reading the file from */
    offset?: number,
    /** An optional max length to read from the file */
    length?: number
  }
  
  export interface IpfsVersion {
    version: string,
    commit: string,
    repo: string,
    system: string,
    golang: string
  }
  
  export interface LsResponse {
    name: string,
    path: string
    size: number,
    cid: CID,
    type: FileTypes,
    depth: number
  }
  
  export interface FilesLsResponse {
    /** which is the file's name */
    name: string
    /** which is the object's type (directory or file) */
    type: FileTypes
    /** the size of the file in bytes */
    size: number
    /** the hash of the file (A CID instance) */
    cid: CID
    /** the UnixFS mode as a Number */
    mode: number
    /** an objects with numeric secs and nsecs properties */
    mtime: Mtime
  }
  
  export interface AddOptions extends TimeoutOptions {
    /** chunking algorithm used to build ipfs DAGs - DEFAULT: `size-262144`*/
    chunker?: string,
    /** the CID version to use when storing the data - DEFAULT: `0` */
    cidVersion?: number,
    /**  allows to create directories with an unlimited number of entries currently size of unixfs directories is limited by the maximum block size. Note that this is an experimental feature. */
    enableShardingExperiment?: boolean,
    /** multihash hashing algorithm to use - DEFAULT `sha2-256` **/
    hashAlg?: string,
    /** If true, will not add blocks to the blockstore */
    onlyHash?: boolean,
    /** pin this object when adding */
    pin?: boolean,
    /** a function that will be called with the byte length of chunks as a file is added to ipfs */
    progress?: Function,
    /** if true, DAG leaves will contain raw file data and not be wrapped in a protobuf */
    rawLeaves?: boolean,
    /** (boolean, default false): for when a Path is passed, this option can be enabled to add recursively all the files. */
    recursive?: boolean,
    /** if true will use the trickle DAG format for DAG generation */
    trickle?: boolean,
    /** Adds a wrapping node around the content */
    wrapWithDirectory?: boolean
  }

  export interface AddAllOptions extends AddOptions {
    /** allows to create directories with an unlimited number of entries currently size of unixfs directories is limited by the maximum block size. Note that this is an experimental feature */
    enableShardingExperiment?: boolean
    /** Directories with more than this number of files will be created as HAMT-sharded directories - DEFAULT `1000` */
    shardSplitThreshold?: number

  }
  
  export interface AddResponse {
    path: string,
    cid: CID,
    size: number
    mtime: Mtime
    mode: number
  }
  
  export interface PingResponse {
    success: boolean,
    time: number,
    text: string
  }
  
  export interface PinLsResponse {
    /** pin type (`recursive`, `direct` or `indirect`) */
    type: PinTypes
    /** CID of the pinned node */
    cid: CID
  }
  
  export interface GetResponse {
    /** each path corresponds to the name of a file, and content is an async iterable with the file contents. */
    path: string
    content: AsyncIterable<Uint8Array>
    mode: number
    mtime: Mtime
  }
  
  export interface MyPeerInfo {
    /** the Peer Id */
    id: string
    /** the public key of the peer as a base64 encoded string */
    publicKey: string
    /** A list of multiaddrs this node is listening on */
    addresses: Multiaddr[]
    /** The agent version */
    agentVersion: string
    /** The supported protocol version */
    protocolVersion: string
    /** The supported protocols */
    protocols: string[]
  }
  
  
  export interface PutBlockOptions extends TimeoutOptions {
    /** A CID to store the block under */
    cid?: CID
    /** The codec to use to create the CID */
    format?: DagFormats
    /** The hashing algorithm to use to create the CID */
    mhtype?: HashAlogs
    mhlen?: number
    /** The version to use to create the CID */
    version?: number
    /** If true, pin added blocks recursively */
    pin?: boolean
  }
  
  export interface RmBlockOptions extends TimeoutOptions {
    /** Ignores nonexistent blocks */
    force?: boolean
    /** Write minimal output */
    quiet?: boolean
  }
  
  export interface RmBlockResponse {
    cid: CID,
    error?: Error
  }
  
  export interface BootstrapResponse {
    /** array with all the added addresses */
    Peers: Multiaddr[]
  }
  
  export interface ApplyProfileOptions extends TimeoutOptions {
    dryRun?: boolean
  }
  
  export interface DagPutOptions extends TimeoutOptions {
    /** The IPLD format multicodec */
    format?: CborParsers
    /** The hash algorithm to be used over the serialized DAG node */
    hashAlg?: HashAlogs
    /** The IPLD format multicodec */
    cid?: CID
    /** Pin this node when adding to the blockstore */
    pin?: boolean
  }
  
  export interface DagTreeOptions extends TimeoutOptions {
    /** Path */
    path?: string
    /** 	If set to true, it will follow the links and continuously run tree on them, returning all the paths in the graph */
    recursive?: boolean
  }
  
  export interface DagGetOptions extends TimeoutOptions {
    /** Path */
    path?: string
    /** If set to true, it will avoid resolving through different objects */
    localResolve?: boolean
  }
  
  export interface DagResolveOptions extends TimeoutOptions {
    /** If ipfsPath is a CID, you may pass a path here */
    path?: string
  }
  
  /** The last CID encountered during the traversal and the path to the end of the IPFS path inside the node referenced by the CID */
  export interface DagResolveResponse {
    cid: CID,
    remainderPath: string
  }
  
  export interface DhtPeersResponse {
    /** is a String the peer's ID */
    id: String,
    /** an array of Multiaddr - addresses for the peer. */
    addrs: Multiaddr[]
  }
  
  export interface DhtFindProvsOptions extends TimeoutOptions {
    numProviders?: number
  }
  
  export interface DhtProvideOptions extends TimeoutOptions {
    recursive?: boolean
  }
  
  export type DhtProvideResponses = {
    id: string
    addrs: Multiaddr[]
  }
  
  export interface DhtProvideResponse {
    [index: string]: any
    extra: string,
    id: string,
    responses: DhtProvideResponses[],
    type: number
  }
  
  export interface KeyResponse {
    id: string,
    name: string
  }
  
  export interface KeyRenameResponse {
    id: string,
    was: string,
    now: string,
    overwrite: boolean
  }
  
  export interface KeyGenOptions extends TimeoutOptions {
    /** The key type, one of `rsa` or `ed25519` */
    type?: KeyGenAlgos
    /** The key size in bits */
    size?: number
  }
  
  export interface NameResponse {
    name: string
    value: string
  }
  
  export interface NamePublishOptions extends TimeoutOptions {
    /** Resolve given path before publishing */
    resolve?: boolean
    /** Time duration of the record */
    lifetime?: string | "24h"
    /** Time duration this record should be cached */
    ttl?: string
    /** Name of the key to be used */
    key?: string | "self"
    /** When offline, save the IPNS record to the the local datastore without broadcasting to the network instead of simply failing. */
    allowOffline?: boolean
  }
  
  export interface NameResolveOptions extends TimeoutOptions {
    /** Resolve until the result is not an IPNS name */
    recursive?: boolean
    /** Do not use cached entries */
    nocache?: boolean
  }
  
  export interface ObjectNewOptions extends TimeoutOptions {
    /** If defined, must be a string unixfs-dir and if that is passed, the created node will be an empty unixfs style directory */
    template?: string
    /** Resolve until the result is not an IPNS name */
    recursive?: boolean
    /** Do not use cached entries */
    nocache?: boolean
  }
  
  export interface ObjectPutOptions extends TimeoutOptions {
    /** The encoding of the Uint8Array (json, yml, etc), if passed a Uint8Array */
    enc?: "json" | "yaml" | string
  }
  
  export interface DagLinkObject {
    name: string,
    size: number,
    cid: CID
  }
  export interface ObjectStatResponse {
    Hash: string,
    NumLinks: number,
    BlockSize: number,
    LinksSize: number,
    DataSize: number,
    CumulativeSize: number
  }
  
  export interface PubSubHandlerObject {
    from: String,
    seqno: Uint8Array,
    data: Uint8Array,
    topicIDs: Array<string>
  }
  
  export type Refs = (ipfsPath: CID | string, options?: RefsOptions) => AsyncIterable<RefsResponse>
  
  export interface RefsResponse {
    ref: string,
    err: Error | null
  }
  
  export interface RefsOptions extends TimeoutOptions {
    recursive?: boolean
    unique?: boolean
    edges?: boolean
    format?: string
    maxDepth?: number
  }
  
  export interface RepoGcResponse {
    ref: string,
    err: Error | null
  }
  
  export interface RepoGcOptions extends TimeoutOptions {
    /** Write minimal output */
    quiet?: boolean
  }
  
  export interface RepoStatOptions extends TimeoutOptions {
    /** Return storage numbers in `MiB` */
    human?: boolean
  }
  
  export interface RepoStatReturn {
    numObjects: BigNumber,
    repoSize: BigNumber,
    repoPath: string
    version: string
    storageMax: BigNumber
  }
  
  export interface BitswapStatResponse {
    provideBufLen: number
    wantlist: CID[]
    peers: string[]
    blocksReceived: BigNumber
    dataReceived: BigNumber
    blocksSent: BigNumber
    dataSent: BigNumber
    dupBlksReceived: BigNumber
    dupDataReceived: BigNumber
  }
  
  export interface PinAllSource {
    cid: CID, path: String,
    recursive: Boolean,
    comments: String
  }
  
  export interface PinLsOptions extends TimeoutOptions {
    /** Filter by this type of pin ("recursive", "direct" or "indirect") */
    type?: PinTypes
    /** CIDs or IPFS paths to search for in the pinset */
    paths?: CID | CID[] | string | string[]
  } 

  export interface PinAddOptions extends TimeoutOptions {
    /** Recursively pin all links contained by the object */
    recursive?: boolean
  }

  export interface SwarmPeersOptions extends TimeoutOptions {
    /** If true, return connection direction information */
    direction?: boolean
    /** If true, return information about open muxed streams */
    streams?: boolean
    /** If true, return all extra information */
    verbose?: boolean
    /** If true, return latency information */
    latency?: boolean
  }

  export interface PingOptions extends TimeoutOptions {
    /** The number of ping messages to send - DEFAULT `10` */
    count?: number
  }

  export interface BlockStatResponse {
    cid: CID
    size: number
  }
  
  export interface IpfsHttpApiInstance {
    /** Import a file or data into IPFS. */
    add(data: Buffer | AddObject | AddObject[] | AsyncIterable<any> | ReadStream | ReadStream[], options?: AddOptions): Promise<AddResponse>
    /** Import multiple files and data into IPFS. */
    addAll(source: FileStream, options?: AddAllOptions): AsyncIterable<FileObject>
    /** Fetch a file or an entire directory tree from IPFS that is addressed by a valid IPFS Path. */
    get(cid: CID | string, options?: TimeoutOptions): AsyncIterable<GetResponse>
    /** Returns a file addressed by a valid IPFS Path. */
    cat(cid: string | CID, options?: CatOptions): AsyncIterable<Uint8Array>
    /** Lists a directory from IPFS that is addressed by a valid IPFS Path. */
    ls: (cid: string | CID, options?: TimeoutOptions) => AsyncIterable<LsResponse>
    /** Stops the IPFS node and in case of talking with an IPFS Daemon, it stops the process. */
    stop(): Promise<void>
    /** Send echo request packets to IPFS hosts */
    ping(peer: string, options?: PingOptions): AsyncIterable<PingResponse>
    /** Resolve the value of names to IPFS */
    resolve(name: string, options?: ResolveOptions): Promise<string>
    /** Resolve DNS links */
    dns(domain: string, options?: ResolveDnsOptions): Promise<string>
    /** Returns the implementation version */
    version(options?: TimeoutOptions): Promise<IpfsVersion>
    /** Returns the identity of the Peer */
    id(options?: TimeoutOptions): Promise<MyPeerInfo>
  
    refs: Refs | {
      local: Refs
    }
  
    pin: {
      /** Adds an IPFS object to the pinset and also stores it to the IPFS repo. pinset is the set of hashes currently pinned (not gc'able) */
      add(cid: CID | string, options?: PinAddOptions): Promise<CID>
      /** Unpin this block from your repo */
      rm(cid: CID | string, options?: PinAddOptions): Promise<CID>
      /** List all the objects pinned to local storage */
      ls(options?: PinLsOptions): AsyncIterable<PinLsResponse>
      /** Adds multiple IPFS objects to the pinset and also stores it to the IPFS repo. pinset is the set of hashes currently pinned (not gc'able) */
      addAll(source: CID | CID[] | string | string[] | AsyncIterable<PinAllSource>, options?: TimeoutOptions): AsyncIterable<CID>
      /** Unpin one or more blocks from your repo */
      rmAll(source: CID | CID[] | string | string[] | AsyncIterable<PinAllSource>, options?: TimeoutOptions): AsyncIterable<CID>
    }
  
    swarm: {
      /** List of known addresses of each peer connected. */
      addrs(options?: TimeoutOptions): Promise<PeerInfo[]>
      /** Local addresses this node is listening on. */
      localAddrs(options?: TimeoutOptions): Promise<Multiaddr[]>
      /** Open a connection to a given address. */
      connect(multiaddr: string | Multiaddr, options?: TimeoutOptions): Promise<void>
      /** Close a connection on a given address. */
      disconnect(multiaddr: string | Multiaddr, options?: TimeoutOptions): Promise<void>
      /** List out the peers that we have connections with. */
      peers(options?: SwarmPeersOptions): Promise<SwarmPeer[]>
    }
  
    /**
     * ### MUTABLE FILE API
     * The Mutable File System (MFS) is a virtual file system on top of IPFS that exposes a Unix like API over a virtual directory. It enables users to write and read from paths without having to worry about updating the graph. It enables things like ipfs-blob-store to exist.
     */
    files: {
      /** Copy files from one location to another */
      cp(from: string | string[], to: string | string[], options?: FilesCpOptions): Promise<void>
      /** Flush a given path's data to the disk */
      flush(paths: string | CID | CID[], options?: TimeoutOptions): Promise<void>
      /** Remove a file or directory. */
      rm(...paths: (string | CID | FilesRmOptions)[]): Promise<void>
      /** List directories in the local mutable namespace */
      ls(paths: string | CID | CID[], options?: TimeoutOptions): AsyncIterable<FilesLsResponse>
      /** Make a directory in your MFS */
      mkdir(paths: string | CID, options?: FilesMkdirOptions): Promise<void>
      /** Move files from one location to another */
      mv(paths: string | CID, options?: FilesMvOptions): Promise<void>
      /** Read a file */
      read(paths: string | CID, options?: FilesReadOptions): AsyncIterable<Uint8Array>
      /** Get file or directory statistics */
      stat(paths: string | CID, options?: FileStatOptions): Promise<FileStatResponse>
      /** Write to an MFS path */
      write(
        /** The MFS path where you will write to */
        paths: string | CID,
        /** The content to write to the path */
        content: string | Buffer | Blob | Uint8Array | AsyncIterable<Uint8Array>,
        options?: FilesWriteOptions
      ): Promise<void>
      /** Update the mtime of a file or directory */
      touch(path: string, options?: TouchOptions): Promise<void>
      /** Change mode for files and directories */
      chmod(
        path: string | CID,
        mode: Chmods,
        options?: ChmodOptions
      ): Promise<void>
    }
  
    block: {
      /** Get a raw IPFS block. */
      get(cid: string | CID | Uint8Array, options?: TimeoutOptions): Promise<Block>
      /** Stores input as an IPFS block. */
      put(block: Block | Uint8Array, options?: PutBlockOptions): Promise<Block>
      /** Remove one or more IPFS block(s). */
      rm(cids: CID | CID[], options?: RmBlockOptions): Promise<RmBlockResponse>
      /** Print information of a raw IPFS block. */
      stat(cids: CID | CID[], options?: TimeoutOptions): Promise<BlockStatResponse>
    }
    
    /**
     * Manipulates the bootstrap list, which contains the addresses of the bootstrap nodes. These are the trusted peers from which to learn about other peers in the network.
     * Warning: your node requires bootstrappers to join the network and find other peers.
     * If you edit this list, you may find you have reduced or no connectivity. If this is the case, please reset your node's bootstrapper list with ipfs.bootstrap.reset().
     */
    bootstrap: {
      /** Add a peer address to the bootstrap list */
      add(addr: Multiaddr, options?: TimeoutOptions ): Promise<BootstrapResponse>
      /** Remove a peer address from the bootstrap list */
      rm(addr: Multiaddr, options?: TimeoutOptions ): Promise<BootstrapResponse>
      /** List all peer addresses in the bootstrap list */
      list(options?: TimeoutOptions ): Promise<BootstrapResponse>
      /** Reset the bootstrap list to contain only the default bootstrap nodes */
      reset(options?: TimeoutOptions ): Promise<BootstrapResponse>
      /** Remove all peer addresses from the bootstrap list */
      clear(options?: TimeoutOptions ): Promise<BootstrapResponse>
    }
  
    config: {
      /** Returns the currently being used config. If the daemon is off, it returns the stored config. */
      get(key: string, options?: TimeoutOptions): Promise<Object>
      /** Returns the full config been used. If the daemon is off, it returns the stored config. */
      getAll(options?: TimeoutOptions): Promise<Object>
      /** Adds or replaces a config value. */
      set(key: string, value?: any, options?: TimeoutOptions): Promise<Object>
      /** Adds or replaces a config file */
      replace(config: Object, options?: TimeoutOptions): Promise<void>
      profiles: {
        /** List available config profiles */
        list(options?: TimeoutOptions): Promise<Array<any>>
        /** Apply a config profile */
        apply(name: string, options?: ApplyProfileOptions): Promise<Object>
      }
    }
  
    /** The dag API comes to replace the object API, it supports the creation and manipulation of dag-pb object, as well as other IPLD formats (i.e dag-cbor, ethereum-block, git, etc) */
    dag: {
      /** Store an IPLD format node */
      put(obj: Object | any, options?: DagPutOptions): Promise<CID>
      /** Retrieve an IPLD format node */
      get(cid: CID, options?: DagGetOptions): Promise<Object>
      /** Enumerate all the entries in a graph */
      dagTree(cid: CID, options?: DagTreeOptions): Promise<Array<Object>>
      /** Returns the CID and remaining path of the node at the end of the passed IPFS path */
      resolve(cid: string | CID, options?: DagResolveOptions): Promise<DagResolveResponse>
    }
  
    dht: {
      /** Find the multiaddresses associated with a Peer ID */
      findPeer(peerId: CID | PeerId, options?: TimeoutOptions): Promise<DhtPeersResponse>
      /** Find peers that can provide a specific value, given a CID. */
      findProvs(cid: CID, options?: DhtFindProvsOptions): AsyncIterable<DhtPeersResponse>
      /** Given a key, query the routing system for its best value. */
      get(key: string | Uint8Array, options?: TimeoutOptions): Promise<Uint8Array>
      /** Write a key/value pair to the routing system. */
      put(key: Uint8Array, value: Uint8Array, options?: TimeoutOptions): AsyncIterable<DhtProvideResponse>
      /** Announce to the network that you are providing given values. */
      provide(cid: CID | CID[], options?: DhtProvideOptions): AsyncIterable<DhtProvideResponse>
      /** Find the closest Peer IDs to a given Peer ID by querying the DHT. */
      query(peerId: PeerId | CID, options?: TimeoutOptions): AsyncIterable<DhtProvideResponse>
    }
  
    key: {
      /** Remove a key */
      rm(name: string, options?: KeyGenOptions): Promise<KeyResponse>
      /** Generate a new key */
      gen(name: string, options?: KeyGenOptions): Promise<KeyResponse>
      /** List all the keys */
      list(name: string, options?: TimeoutOptions): Promise<KeyResponse[]>
      /** Rename a key */
      rename(oldName: string, newName: string, options?: TimeoutOptions): Promise<KeyRenameResponse>
      /** Export a key in a PEM encoded password protected PKCS #8 */
      export(name: string, password: string, options?: TimeoutOptions): Promise<string>
      /** Import a PEM encoded password protected PKCS #8 key */
      import(name: string, pem: string, password: string, options?: TimeoutOptions): Promise<KeyResponse>
    }
  
    name: {
      /** Resolve an IPNS name. */
      resolve(name: string, options?: NameResolveOptions): AsyncIterable<string>
      /** Publish an IPNS name with a given value. */
      publish(value: CID, options?: NamePublishOptions): Promise<NameResponse>
  
      pubsub: {
        /** Show current name subscriptions */
        subs(options?: TimeoutOptions): Promise<string[]>
        /** Query the state of IPNS pubsub */
        state(options?: TimeoutOptions): Promise<{ enabled: boolean }>
        /** Cancel a name subscription */
        cancel(name: string, options?: TimeoutOptions): Promise<{ canceled: boolean }>
      }
    }
  
    object: {
      /** Create a new MerkleDAG node, using a specific layout. Caveat: So far, only UnixFS object layouts are supported. */
      ["new"](options?: ObjectNewOptions): Promise<CID>
      /** Store a MerkleDAG node. */
      put(obj: { Data: Uint8Array | Buffer; Links: any[] } | Uint8Array | any, options?: ObjectPutOptions): Promise<CID>
      /** Fetch a MerkleDAG node */
      get(cid: CID, options?: TimeoutOptions): Promise<any>
      /** Returns the Data field of an object */
      data(cid: CID, options?: TimeoutOptions): Promise<Uint8Array>
      /** Returns the Links field of an object */
      links(cid: CID, options?: TimeoutOptions): Promise<string[]>
      /** Returns stats about an Object */
      stat(cid: CID, options?: TimeoutOptions): Promise<ObjectStatResponse>
      patch: {
        /** Add a Link to an existing MerkleDAG Object */
        addLink(cid: CID, link: DagLinkObject, options?: TimeoutOptions): Promise<CID>
        /** Remove a Link from an existing MerkleDAG Object */
        rmLink(cid: CID, link: DagLinkObject, options?: TimeoutOptions): Promise<CID>
        /** Append Data to the Data field of an existing node */
        appendData(cid: CID, data: Uint8Array, options?: TimeoutOptions): Promise<CID>
        /** Overwrite the Data field of a DAGNode with new Data */
        setData(cid: CID, data: Uint8Array, options?: TimeoutOptions): Promise<CID>
      }
    }
  
    pubsub: {
      /** Subscribe to a pubsub topic. */
      subscribe(topic: string, handler: (msg: PubSubHandlerObject) => void, options?: TimeoutOptions): Promise<void>
      /** Unsubscribes from a pubsub topic. */
      unsubscribe(topic: string, handler: (msg: PubSubHandlerObject) => void, options?: TimeoutOptions): Promise<void>
      /** Publish a data message to a pubsub topic. */
      publish(topic: string, data: string | Uint8Array, options?: TimeoutOptions): Promise<void>
      /** Returns the list of subscriptions the peer is subscribed to. */
      ls(options?: TimeoutOptions): Promise<string[]>
      /** Returns the peers that are subscribed to one topic. */
      peers(topic: string, options?: TimeoutOptions): Promise<string[]>
    }
  
    repo: {
      /** Perform a garbage collection sweep on the repo. */
      gc(options?: RepoGcOptions): AsyncIterable<RepoGcResponse>
      /** Get stats for the currently used repo. */
      stat(options?: RepoStatOptions): Promise<RepoStatReturn>
      /** Show the repo version. */
      version(options?: TimeoutOptions): Promise<string>
    }
  
    bitswap: {
      /** Returns the wantlist for your node */
      wantlist(options?: TimeoutOptions): Promise<CID[]>
      /** Returns the wantlist for a connected peer */
      wantlistForPeer(peerId: PeerId | CID | Uint8Array | string, options?: TimeoutOptions): Promise<CID[]>
      /** Removes one or more CIDs from the wantlist */
      unwant(cids: CID | CID[], options?: TimeoutOptions): Promise<void>
      /** Show diagnostic information on the bitswap agent. */
      stat(options?: TimeoutOptions): Promise<BitswapStatResponse>
    }
  }

  export type GlobSourceOpts = { recursive?: boolean } 
  export interface IpfsHeaders { authorization: string }
  
  export interface IpfsConnectOptions {
    host?: string
    port?: number
    protocol?: "http" | "https"
    headers?: IpfsHeaders,
    timeout?: number | string
  }
  
  export interface GlobSource {
    path: string
    content: ReadStream
    mode?: any
    mtime?: Mtime
  }
  
  export interface UrlSource {
    path: string
    content: AsyncIterable<Buffer>
  }
  

  export const globSource: (path: string, opt?: GlobSourceOpts ) => AsyncIterable<GlobSource>
  export const urlSource: (url: string) => AsyncIterable<UrlSource>
  export { CID, Multiaddr as multiaddr }
  export const multibase: any
  export const multihash: any
  export const multicodec: any
  export const IpfsHttpClient: (options?: IpfsConnectOptions | string) => IpfsHttpApiInstance
  export default IpfsHttpClient
}