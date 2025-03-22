using Microsoft.AspNetCore.Mvc;

namespace DocumentsRegistry.API.Repositories;

public interface IBlobStorageRepository
{
    Task UploadToBlobContainerAsync(IFormFile file);
    Task<FileStreamResult> GetFileStreamAsync(string fileName);
}
