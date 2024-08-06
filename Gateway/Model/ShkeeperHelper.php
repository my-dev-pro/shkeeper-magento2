<?php

namespace Shkeeper\Gateway\Model;

use Magento\Checkout\Model\ConfigProviderInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;
use Magento\Store\Model\StoreManagerInterface;

class ShkeeperHelper implements ConfigProviderInterface
{
    protected const string XML_PATH_SHKEEPER_API_KEY = 'payment/shkeeper/shkeeper_api_key';
    protected const string XML_PATH_SHKEEPER_API_URL = 'payment/shkeeper/shkeeper_api_url';
    protected const string XML_PATH_SHKEEPER_INSTRUCTIONS = 'payment/shkeeper/instruction';
    protected const string SHKEEPER_CODE = 'shkeeper';

    /**
     * @var StoreManagerInterface
     */
    protected StoreManagerInterface $_storeManager;
    /**
     * @var ScopeConfigInterface
     */
    protected ScopeConfigInterface $_scopeConfig;

    /**
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(
        ScopeConfigInterface $scopeConfig,
    ) {
        $this->_scopeConfig = $scopeConfig;
    }

    public function getCode(): string
    {
        return self::SHKEEPER_CODE;
    }

    public function getApiKey(): string
    {
        return $this->_scopeConfig->getValue(self::XML_PATH_SHKEEPER_API_KEY, ScopeInterface::SCOPE_STORE);
    }

    public function getApiURL(): string
    {
        return $this->_scopeConfig->getValue(self::XML_PATH_SHKEEPER_API_URL, ScopeInterface::SCOPE_STORE);
    }

    public function getInstructions(): string
    {
        return $this->_scopeConfig->getValue(self::XML_PATH_SHKEEPER_INSTRUCTIONS, ScopeInterface::SCOPE_STORE);
    }

    public function getConfig(): array
    {
        return [
            'payment' => [
                $this->getCode() => [
                    'apiKey' => $this->getApiKey(),
                    'apiUrl' => $this->getApiURL(),
                    'instructions' => $this->getInstructions(),
                ]
            ]
        ];
    }
}
