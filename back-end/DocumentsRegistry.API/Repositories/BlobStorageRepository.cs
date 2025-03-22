using Azure.Storage.Blobs;
using DocumentsRegistry.API.Options;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DocumentsRegistry.API.Repositories;

public class BlobStorageRepository : IBlobStorageRepository
{
    private readonly BlobStorageOptions _options;

    public BlobStorageRepository(IOptions<BlobStorageOptions> options)
    {
        _options = options.Value;
    }

    public async Task UploadToBlobContainerAsync(IFormFile file)
    {
        var serviceClient = new BlobServiceClient(_options.ConnectionString);
        var containerClient = serviceClient.GetBlobContainerClient(_options.ContainerName);
        var blobClient = containerClient.GetBlobClient(file.FileName);
        using var stream = file.OpenReadStream();
        await blobClient.UploadAsync(stream);
    }

    public async Task<FileStreamResult> GetFileStreamAsync(string fileName)
    {
        var serviceClient = new BlobServiceClient(_options.ConnectionString);
        var containerClient = serviceClient.GetBlobContainerClient(_options.ContainerName);
        var blobClient = containerClient.GetBlobClient(fileName);
        var blobContent = await blobClient.DownloadContentAsync();
        var stream = blobContent.Value.Content.ToStream();
        return new FileStreamResult(stream, GetContentType(fileName))
        {
            FileDownloadName = fileName,
        };
    }

    private string GetContentType(string fileName)
    {
        var ext = Path.GetExtension(fileName).ToLower();
        return ext switch
        {
            ".pdf" => "application/pdf",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".doc" => "application/msword",
            _ => "application/octet-stream", // Default for unknown types
        };
    }
}
