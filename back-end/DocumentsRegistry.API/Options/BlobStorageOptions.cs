namespace DocumentsRegistry.API.Options;

public class BlobStorageOptions
{
#pragma warning disable CS8618
    public string ConnectionString { get; set; }
    public string ContainerName { get; set; }
    public string StorageAccountUrl { get; set; }
#pragma warning restore CS8618
}
